const cards = document.getElementById('cards');
const msg = document.getElementById('msg');

function msgDasu(text) { msg.textContent = text; }
function make(tag, text, cls) { const el = document.createElement(tag); if (text) el.textContent = text; if (cls) el.className = cls; return el; }

function optionList(list, now) {
  const ary = Array.isArray(list) ? list : Object.keys(list || {});
  if (now && !ary.includes(now)) ary.unshift(now);
  return ary;
}

function nextValue(list, now, plus) {
  if (!list.length) return now;
  const pos = Math.max(0, list.indexOf(now));
  return list[(pos + plus + list.length) % list.length];
}

async function airconOkuru(appliance, values) {
  await airconSet(appliance.id, values);
  msgDasu('エアコン設定を送信しました。');
  await main();
}

function airconCard(card, appliance) {
  const air = appliance.aircon || {};
  const setting = appliance.settings || {};
  const range = (air.range || {}).modes || {};
  const mode = setting.mode || setting.operation_mode || 'auto';
  const temp = setting.temp || setting.temperature || '';
  const volume = setting.vol || setting.air_volume || '';
  const dir = setting.dir || setting.air_direction || '';
  card.append(make('p', `現在設定: モード ${mode} / 温度 ${temp} / 風量 ${volume || 'auto'} / 風向 ${dir || 'auto'}`));

  const row = make('div', '', 'row');
  const modeList = optionList(Object.keys(range), mode);
  const volumeList = optionList(((range[mode] || {}).vol || []), volume);
  const dirList = optionList(((range[mode] || {}).dir || []), dir);
  const tempInput = document.createElement('input');
  tempInput.type = 'number'; tempInput.step = '0.5'; tempInput.value = temp;
  const items = [
    ['運転切替', () => airconOkuru(appliance, { operation_mode: nextValue(modeList, mode, 1) })],
    ['風量切替', () => airconOkuru(appliance, { air_volume: nextValue(volumeList, volume, 1) })],
    ['風向切替', () => airconOkuru(appliance, { air_direction: nextValue(dirList, dir, 1) })],
    ['温度−', () => { tempInput.value = Number(tempInput.value || temp || 0) - 1; return airconOkuru(appliance, { temperature: tempInput.value }); }],
    ['温度＋', () => { tempInput.value = Number(tempInput.value || temp || 0) + 1; return airconOkuru(appliance, { temperature: tempInput.value }); }],
    ['温度送信', () => airconOkuru(appliance, { temperature: tempInput.value })],
    ['停止', () => airconOkuru(appliance, { button: 'power-off' })]
  ];
  row.append(tempInput);
  items.forEach(([label, fn]) => { const b = make('button', label); b.addEventListener('click', fn); row.append(b); });
  card.append(row);
}

function signalButtons(card, appliance, signals) {
  const row = make('div', '', 'row');
  signals.forEach((signal) => {
    const b = make('button', signal.name || signal.id);
    b.addEventListener('click', async () => { await signalOkuru(signal.id); msgDasu(`${signal.name || signal.id} を送信しました。`); });
    row.append(b);
  });
  card.append(row);
}

async function main() {
  try {
    const appliances = await appliancesYomu();
    const cache = await cacheSoroeru(appliances);
    cards.textContent = '';
    appliances.forEach((appliance) => {
      const card = make('section', '', 'card');
      card.append(make('h2', appliance.nickname || appliance.id));
      const fresh = make('button', 'この家電の操作を更新');
      fresh.addEventListener('click', async () => { await cacheRefresh(appliance.id); await main(); });
      card.append(fresh);
      if (appliance.type === 'AC' || appliance.aircon) airconCard(card, appliance);
      signalButtons(card, appliance, cache[appliance.id] || []);
      cards.append(card);
    });
    msgDasu(appliances.length ? '' : '家電が見つかりません。設定を確認してください。');
  } catch (e) { msgDasu(e.message); }
}

main();
