console.log("TWO-MODE SCANNER WITH STRUCTURED DATA LOADED");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== "scanPage") return;

  function runAdaParser() {
    const cards = document.querySelectorAll(".cs-card");
    const counselorResults = [];

    cards.forEach((card) => {
      const details = card.querySelector(".cs-directory-details");
      if (!details) return;

      const lines = details.innerText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length < 2) return;

      const name = lines[0];
      const role = lines[1];

      if (!/counselor/i.test(role)) return;

      counselorResults.push({
        name,
        role,
      });
    });

    return dedupe(counselorResults);
  }

  function runSeminoleParser() {
    const cards = document.querySelectorAll(".ss-directory-ppl-list__card");
    const results = [];

    cards.forEach((card) => {
      const nameEl = card.querySelector(".dir_name");
      const roleEl = card.querySelector(".dir_title");

      if (!nameEl || !roleEl) return;

      const name = nameEl.innerText.trim();
      const role = roleEl.innerText.trim();

      if (!/counselor/i.test(role)) return;

      results.push({
        name,
        role,
      });
    });

    return dedupe(results);
  }

  function runGeneralParser() {
    const pageText = document.body ? document.body.innerText : "";
    const lines = pageText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const results = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (
        /counselor|guidance counselor|school counselor|college counselor|academic counselor/i.test(
          line
        )
      ) {
        const prevLine = lines[i - 1] || "";
        const nextLine = lines[i + 1] || "";

        let name = "";
        if (/^[A-Z][a-z]+ [A-Z][a-z]+$/.test(prevLine)) {
          name = prevLine;
        } else if (/^[A-Z][a-z]+ [A-Z][a-z]+$/.test(nextLine)) {
          name = nextLine;
        }

        results.push({
          name: name || "Unknown Name",
          role: line,
        });
      }
    }

    return dedupe(results);
  }

  function dedupe(arr) {
    const uniqueResults = [];
    const seen = new Set();

    arr.forEach((person) => {
      const key = `${person.name}-${person.role}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(person);
      }
    });

    return uniqueResults;
  }

  let parserUsed = "";
  let results = [];

  const adaResults = runAdaParser();

  if (adaResults.length > 0) {
    parserUsed = "ADA-specific parser";
    results = adaResults;
  } else {
    const seminoleResults = runSeminoleParser();

    if (seminoleResults.length > 0) {
      parserUsed = "Seminole-specific parser";
      results = seminoleResults;
    } else {
      const generalResults = runGeneralParser();
      parserUsed = "General fallback parser";
      results = generalResults;
    }
  }

  const formattedResult =
    results.length > 0
      ? `Parser used: ${parserUsed}\n\n` +
        results
          .map((p) => `Name: ${p.name}\nRole: ${p.role}`)
          .join("\n\n")
      : "No counselors found.";

  sendResponse({
    success: true,
    text: formattedResult,
    counselors: results,
    parserUsed,
    pageTitle: document.title,
  });
});