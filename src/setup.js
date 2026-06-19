const apiKey = document.getElementById('apiKey');
const saveButton = document.getElementById('save');
const msg = document.getElementById('msg');

function msgDasu(text) { msg.textContent = text; }

saveButton.addEventListener('click', async () => {
  await kaku({ apiKey: apiKey.value.trim() });
  await kesu(['homeId']);
  msgDasu('保存しました。アドオンのアイコンから操作できます。');
});
