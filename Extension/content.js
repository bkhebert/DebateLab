chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "analyzeText" && request.text) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const analysis = await fetch("https://your-backend-url.com/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: request.text })
    })
    .then(res => res.json())
    .catch(err => {
      console.error("API error", err);
      return { result: "Failed to analyze argument." };
    });

    injectModal(rect, analysis.result || "No result returned.");
  }
});

function injectModal(rect, content) {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div id="debate-modal" style="
      position: fixed;
      top: ${window.scrollY + rect.top - 10}px;
      left: ${window.scrollX + rect.left}px;
      max-width: 300px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 999999;
      font-family: sans-serif;
      padding: 12px;
    ">
      <div style="text-align: right;">
        <button id="debate-modal-close" style="border:none; background:none; font-size:16px;">✕</button>
      </div>
      <div>${content}</div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("debate-modal-close").onclick = () => {
    modal.remove();
  };
}
