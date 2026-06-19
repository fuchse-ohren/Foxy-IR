const apiKey = document.getElementById('apiKey');
const msg = document.getElementById('msg');

function msgDasu(text) { msg.textContent = text; }

document.getElementById('save').addEventListener('click', async () => {
  await kaku({ apiKey: apiKey.value.trim() });
  await kesu(['homeId']);
  msgDasu('設定を保存しました。');
});

document.getElementById('cacheClear').addEventListener('click', async () => {
  await kesu(['signalCache']);
  msgDasu('操作キャッシュを削除しました。');
});

(async () => {
  const data = await yomu(['apiKey']);
  apiKey.value = data.apiKey || '';
})();
