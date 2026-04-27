let lastResults = [];
let lastParserUsed = "";
let lastPageTitle = "";
document.addEventListener("DOMContentLoaded", () => {
  const scanBtn = document.getElementById("scanBtn");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");
  const result = document.getElementById("result");

  if (!scanBtn || !status || !result) {
    console.error("Popup elements not found");
    return;
  }

  scanBtn.addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });saveBtn.addEventListener("click", async () => {
  if (!lastResults || lastResults.length === 0) {
    status.textContent = "No data to save.";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/counselors/save-scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  counselors: lastResults,
  parserUsed: lastParserUsed,
  pageTitle: lastPageTitle,
}),
    });

    if (res.ok) {
      status.textContent = "Saved successfully!";
    } else {
      status.textContent = "Failed to save.";
    }
  } catch (err) {
    status.textContent = "Error saving data.";
    console.error(err);
  }
});

    const tab = tabs[0];

    if (!tab || !tab.id) {
      status.textContent = "No active tab found.";
      result.textContent = "";
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "scanPage" }, (response) => {
      if (chrome.runtime.lastError) {
        status.textContent = "Could not scan page.";
        result.textContent = chrome.runtime.lastError.message;
        return;
      }

      if (response && response.success) {
  status.textContent = "Page scanned successfully.";
  result.textContent = response.text;

  // Store structured results for saving
  lastResults = response.counselors || [];
  lastParserUsed = response.parserUsed || "";
  lastPageTitle = response.pageTitle || "";
      } else {
        status.textContent = "Could not scan page.";
        result.textContent = "No text was returned.";
      }
    });
  });
});