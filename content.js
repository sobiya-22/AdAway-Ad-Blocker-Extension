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
    "[id*='ad']",
    "[class*='ad']",
    "[id*='banner']",
    "[class*='banner']",
    "[id*='sponsor']",
    "[class*='sponsor']",
    "[data-ad]",
    "[data-advertisement]",
    "[aria-label='Advertisement']",
    "div[class*='ad']",
    "div[data-testid*='ad']",
    "div[data-testid*='AdSlot']",
  ];

  adSelectors.forEach(selector => {
    const ads = document.querySelectorAll(selector);
    ads.forEach(ad => ad.remove());
  });

  console.log("Ads removed!");
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "blocking-status") {
    if (message.isBlockingEnabled) {
      removeAds();

      // Dynamically observe the DOM for new ads
      const observer = new MutationObserver(() => removeAds());
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
});
