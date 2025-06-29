
// Creates a context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-argument",
    title: "Analyze with DebateLab",
    contexts: ["selection"]
  });
});

// When the context menu item is clicked...
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // If the menu ID name is 'analyze-argument', AND there is highlighted text
  if (info.menuItemId === "analyze-argument" && info.selectionText) {
    // Send a message with the action 'analyze text'
    chrome.tabs.sendMessage(tab.id, {
      action: "analyzeText",
      text: info.selectionText
    });
  }
});
