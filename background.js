const HOSTNAME_DATA_TYPES = {
  cookies: true,
  indexedDB: true,
  localStorage: true,
  serviceWorkers: true,
  formData: true,
};

async function clearCookiesForUrl(pageUrl) {
  const cookies = await browser.cookies.getAll({ url: pageUrl });

  await Promise.all(
    cookies.map((cookie) => {
      const domain = cookie.domain.startsWith(".")
        ? cookie.domain.slice(1)
        : cookie.domain;
      const protocol = cookie.secure ? "https:" : "http:";
      const url = `${protocol}//${domain}${cookie.path}`;

      return browser.cookies.remove({
        url,
        name: cookie.name,
        storeId: cookie.storeId,
      });
    })
  );
}

async function clearPageStorage(tabId) {
  await browser.scripting.executeScript({
    target: { tabId },
    func: async () => {
      localStorage.clear();
      sessionStorage.clear();

      if (indexedDB.databases) {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases
            .filter((db) => db.name)
            .map(
              (db) =>
                new Promise((resolve) => {
                  const request = indexedDB.deleteDatabase(db.name);
                  request.onsuccess = () => resolve();
                  request.onerror = () => resolve();
                  request.onblocked = () => resolve();
                })
            )
        );
      }

      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }

      if (navigator.serviceWorker?.getRegistrations) {
        const registrations =
          await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
      }
    },
  });
}

browser.action.onClicked.addListener(async (tab) => {
  try {
    const url = new URL(tab.url);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Only http/https pages");
    }

    await browser.browsingData.remove(
      { hostnames: [url.hostname] },
      HOSTNAME_DATA_TYPES
    );

    await clearCookiesForUrl(tab.url);
    await clearPageStorage(tab.id);

    await browser.tabs.reload(tab.id, { bypassCache: true });
  } catch (err) {
    browser.notifications.create({
      type: "basic",
      iconUrl: "icons/icon-48.png",
      title: "Fresh Tab",
      message: err.message || "Failed to clear site data",
    });
  }
});
