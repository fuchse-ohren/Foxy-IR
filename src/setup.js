const apiKey = document.getElementById('apiKey');
const homeYomuButton = document.getElementById('homeYomu');
const homeArea = document.getElementById('homeArea');
const homeSelect = document.getElementById('homeSelect');
const saveButton = document.getElementById('save');
const msg = document.getElementById('msg');
let homes = [];

function msgDasu(text) { msg.textContent = text; }

homeYomuButton.addEventListener('click', async () => {
  try {
    msgDasu('家屋一覧を取得しています。');
    homes = await homesYomu(apiKey.value.trim());
    homeSelect.textContent = '';
    homes.forEach((home) => {
      const opt = document.createElement('option');
      opt.value = home.id;
      opt.textContent = home.name || home.id;
      homeSelect.append(opt);
    });
    homeArea.hidden = false;
    msgDasu('家屋を選んで保存してください。');
  } catch (e) { msgDasu(e.message); }
});

saveButton.addEventListener('click', async () => {
  await kaku({ apiKey: apiKey.value.trim(), homeId: homeSelect.value });
  msgDasu('保存しました。アドオンのアイコンから操作できます。');
});
