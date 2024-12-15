let isBlockingEnabled = true; // Default state

// Retrieve the saved state from storage on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("isBlockingEnabled", (data) => {
    if (data.isBlockingEnabled !== undefined) {
      isBlockingEnabled = data.isBlockingEnabled;
    }
  });
});

// Listen for toggle messages and update the state for the current tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggle-blocking") {
    isBlockingEnabled = message.enabled;

    // Save the updated state in storage
    chrome.storage.local.set({ isBlockingEnabled });

    // Update the active tab only
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];

        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ["content.js"]
        }).then(() => {
          chrome.tabs.sendMessage(activeTab.id, {
            type: "blocking-status",
            isBlockingEnabled
          });
        }).catch((error) => console.error("Error injecting script:", error));
      }
    });

    sendResponse({ status: "updated", isBlockingEnabled });
  }
});

// Automatically inject content.js into active tabs on reload
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active && !tab.url.startsWith("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    }).catch((error) => console.error("Error injecting script:", error));

    chrome.tabs.sendMessage(tabId, {
      type: "blocking-status",
      isBlockingEnabled
    }).catch((error) => console.error("Error sending message:", error));
  }
});
