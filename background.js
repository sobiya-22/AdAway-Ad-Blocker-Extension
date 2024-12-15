let isBlockingEnabled = true;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggle-blocking") {
    isBlockingEnabled = message.enabled;
    sendResponse({ status: "updated", isBlockingEnabled });

    // Notify all open tabs about the updated blocking status
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about:")) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"],
          }).then(() => {
            chrome.tabs.sendMessage(tab.id, {
              type: "blocking-status",
              isBlockingEnabled,
            });
          }).catch((error) => console.error("Error injecting script:", error));
        }
      });
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && !tab.url.startsWith("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"],
    }).catch((error) => console.error("Error injecting script:", error));
  }
});
