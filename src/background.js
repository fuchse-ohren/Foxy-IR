function getBrowser() {
  return typeof browser !== 'undefined' ? browser : chrome;
}

getBrowser().runtime.onInstalled.addListener(async (info) => {
  if (info.reason === 'install') {
    await getBrowser().tabs.create({ url: getBrowser().runtime.getURL('src/setup.html') });
  }
});
