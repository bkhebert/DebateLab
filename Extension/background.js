chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-argument",
    title: "Analyze with DebateLab",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyze-argument" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {
      action: "analyzeText",
      text: info.selectionText
    });
  }
});
