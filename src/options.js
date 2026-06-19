function msgDasu(text) {
  const msg = document.getElementById("msg");
  msg.textContent = text;
}

document.getElementById("save").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey");
  await kaku({ apiKey: apiKey.value.trim() });
  msgDasu("設定を保存しました。");
});

document.getElementById("cacheClear").addEventListener("click", async () => {
  await kesu(["signalCache"]);
  msgDasu("操作キャッシュを削除しました。");
});

(async () => {
  const apiKey = document.querySelector("#apiKey");
  const data = await yomu(["apiKey"]);
  apiKey.value = data.apiKey || "";
})();
