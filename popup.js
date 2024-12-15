let isBlockingEnabled = true;

document.getElementById("blockad-toggle-btn").addEventListener("click", () => {
  isBlockingEnabled = !isBlockingEnabled;

  // Update the button text
  document.getElementById("blockad-toggle-btn").innerText = isBlockingEnabled
    ? "Disable"
    : "Enable";

  // Update the heading
  document.getElementById("quest-heading").innerText = isBlockingEnabled
    ? "Ad blocking is enabled!"
    : "Ad blocking is disabled!";

  // Send a message to the background script
  chrome.runtime.sendMessage(
    { type: "toggle-blocking", enabled: isBlockingEnabled },
    (response) => {
      console.log("Blocking status updated:", response);
    }
  );
});
