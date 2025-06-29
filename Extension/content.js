// Adding a listener, when the request.action is "analyzeText"
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "analyzeText" && request.text) {
    const selection = window.getSelection(); // Get the selection
    const range = selection.getRangeAt(0); // Get the range
    const rect = range.getBoundingClientRect(); // Get the rectangle
    const isDevelopment = true

    //const backend = "https://debatelab-server.onrender.com/api/ai/fact" :
    const backend = "http://localhost:3000/extension/ai/fact"
    // Send a post request to the backend with the text to be analyzed
    const analysis = await fetch("http://localhost:3000/extension/ai/fact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: request.text })  // ✅ proper payload
    })
    .then(res => res.json())
    .catch(err => {
      console.error("API error", err);
      return {
        factCheckedMessage: "Error during analysis.",
        factCheckedStatement: "Please try again.",
        listOfFallacies: [],
        percentage: 0
      };
    });

    injectModal(rect, analysis);
  }
});

function injectModal(rect, analysis) {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div id="debate-modal" style="
      position: fixed;
      top: ${window.scrollY + rect.top - 10}px;
      left: ${window.scrollX + rect.left}px;
      max-width: 350px;
      background: #fefefe;
      border: 1px solid #ccc;
      border-radius: 10px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      z-index: 999999;
      font-family: sans-serif;
      padding: 16px;
      color: #333;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong>DebateLab Analysis</strong>
        <button id="debate-modal-close" style="
          border: none;
          background: none;
          font-size: 18px;
          cursor: pointer;
        ">✕</button>
      </div>

      <p><strong>Fallacies Found:</strong> ${analysis.listOfFallacies.length} (${analysis.percentage}%)</p>
      ${
        analysis.listOfFallacies.length > 0
          ? `<ul style="margin-left: 1em; padding-left: 0.5em;">
              ${analysis.listOfFallacies.map(f => `<li>• ${f}</li>`).join("")}
            </ul>`
          : "<p>No fallacies detected.</p>"
      }

      <p style="margin-top: 12px;"><strong>Fact-Checked Statement:</strong></p>
      <p style="font-size: 0.9em; color: #444;">${analysis.factCheckedStatement}</p>

      <p style="margin-top: 12px;"><strong>Rewritten Message:</strong></p>
      <p style="font-size: 0.9em; color: #444;">${analysis.factCheckedMessage}</p>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("debate-modal-close").onclick = () => {
    modal.remove();
  };
}