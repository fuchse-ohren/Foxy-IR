const baseUrl = 'https://api.nature.global/1';

function getBrowser() {
  return typeof browser !== 'undefined' ? browser : chrome;
}

async function yomu(keys) {
  return await getBrowser().storage.sync.get(keys);
}

async function kaku(data) {
  await getBrowser().storage.sync.set(data);
}

async function kesu(keys) {
  await getBrowser().storage.sync.remove(keys);
}

async function apiKeyYomu() {
  const data = await yomu(['apiKey']);
  if (!data.apiKey) {
    throw new Error('APIキーが保存されていません。');
  }
  return data.apiKey;
}

async function remoFetch(path, opt = {}) {
  const apiKey = opt.apiKey || await apiKeyYomu();
  const res = await fetch(`${baseUrl}${path}`, {
    method: opt.method || 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: opt.body
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Nature Remo APIエラー: ${res.status} ${text}`);
  }
  if (res.status === 204) {
    return null;
  }
  return await res.json();
}

async function appliancesYomu() {
  return await remoFetch('/appliances');
}

async function signalsYomu(applianceId) {
  return await remoFetch(`/appliances/${encodeURIComponent(applianceId)}/signals`);
}

async function signalOkuru(signalId) {
  return await remoFetch(`/signals/${encodeURIComponent(signalId)}/send`, {
    method: 'POST',
    body: new URLSearchParams()
  });
}

async function airconSet(applianceId, values) {
  const body = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      body.set(key, value);
    }
  });
  return await remoFetch(`/appliances/${encodeURIComponent(applianceId)}/aircon_settings`, {
    method: 'POST',
    body
  });
}

async function cacheYomu() {
  const data = await yomu(['signalCache']);
  return data.signalCache || {};
}

async function cacheKaku(cache) {
  await kaku({ signalCache: cache });
}

async function cacheSoroeru(appliances) {
  const cache = await cacheYomu();
  const ids = appliances.map((item) => item.id);
  Object.keys(cache).forEach((id) => {
    if (!ids.includes(id)) {
      delete cache[id];
    }
  });
  for (const item of appliances) {
    if (!cache[item.id]) {
      cache[item.id] = await signalsYomu(item.id);
    }
  }
  await cacheKaku(cache);
  return cache;
}

async function cacheRefresh(applianceId) {
  const cache = await cacheYomu();
  cache[applianceId] = await signalsYomu(applianceId);
  await cacheKaku(cache);
  return cache[applianceId];
}
