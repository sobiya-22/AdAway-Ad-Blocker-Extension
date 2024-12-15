// Function to update the UI based on blocking status
function updateUI(isBlockingEnabled) {
  document.getElementById("blockad-toggle-btn").innerText = isBlockingEnabled ? "Disable" : "Enable";
  document.getElementById("quest-heading").innerText = isBlockingEnabled
    ? "Ad blocking is enabled!"
    : "Ad blocking is disabled!";
}

// Retrieve the saved blocking state and update the UI when the popup is opened
chrome.storage.local.get("isBlockingEnabled", (data) => {
  const isBlockingEnabled = data.isBlockingEnabled !== undefined ? data.isBlockingEnabled : true; // Default to true
  updateUI(isBlockingEnabled);
});

// Handle toggle button click
document.getElementById("blockad-toggle-btn").addEventListener("click", () => {
  chrome.storage.local.get("isBlockingEnabled", (data) => {
    const currentStatus = data.isBlockingEnabled !== undefined ? data.isBlockingEnabled : true;
    const newStatus = !currentStatus;

    // Update the storage and UI
    chrome.storage.local.set({ isBlockingEnabled: newStatus }, () => {
      updateUI(newStatus);

      // Notify the background script to update the current tab
      chrome.runtime.sendMessage(
        { type: "toggle-blocking", enabled: newStatus },
        (response) => {
          console.log("Blocking status updated:", response);
        }
      );
    });
  });
});
