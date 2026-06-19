const apiKey = document.getElementById('apiKey');
const homeSelect = document.getElementById('homeSelect');
const msg = document.getElementById('msg');

function msgDasu(text) { msg.textContent = text; }

async function homesSet(apiKeyValue, selected) {
  const homes = await homesYomu(apiKeyValue);
  homeSelect.textContent = '';
  homes.forEach((home) => {
    const opt = document.createElement('option');
    opt.value = home.id;
    opt.textContent = home.name || home.id;
    opt.selected = home.id === selected;
    homeSelect.append(opt);
  });
}

document.getElementById('homeYomu').addEventListener('click', async () => {
  try { await homesSet(apiKey.value.trim(), homeSelect.value); msgDasu('家屋一覧を更新しました。'); }
  catch (e) { msgDasu(e.message); }
});

document.getElementById('save').addEventListener('click', async () => {
  await kaku({ apiKey: apiKey.value.trim(), homeId: homeSelect.value });
  msgDasu('設定を保存しました。');
});

document.getElementById('cacheClear').addEventListener('click', async () => {
  await kesu(['signalCache']);
  msgDasu('操作キャッシュを削除しました。');
});

(async () => {
  const data = await yomu(['apiKey', 'homeId']);
  apiKey.value = data.apiKey || '';
  if (data.apiKey) {
    try { await homesSet(data.apiKey, data.homeId); }
    catch (e) { msgDasu(e.message); }
  }
})();
