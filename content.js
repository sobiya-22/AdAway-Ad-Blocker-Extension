function removeAds() {
  const adSelectors = [
    "iframe",
    "[id*='ad']",
    "[class*='ad']",
    "[id*='banner']",
    "[class*='banner']",
    "[id*='sponsor']",
    "[class*='sponsor']",
    "iframe[src*='ads']",
    "[data-ad]",
    "[data-advertisement]",
    "[aria-label='Advertisement']",
    "div[data-testid*='ad']",
    "div[data-testid*='AdSlot']"
  ];

  adSelectors.forEach(selector => {
    const ads = document.querySelectorAll(selector);
    ads.forEach(ad => ad.remove());
  });

  console.log("Ads removed!");
}

// Dynamically observe the DOM for changes and remove ads
function startObserving() {
  if (observer) return; // Avoid duplicate observers

  observer = new MutationObserver(() => removeAds());
  observer.observe(document.body, { childList: true, subtree: true });
}

// Stop observing DOM changes
function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "blocking-status") {
    if (message.isBlockingEnabled) {
      removeAds();
      startObserving();
    } else {
      stopObserving();
    }
  }
});
