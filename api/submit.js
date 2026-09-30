const RETRY_STATUSES = new Set([404, 429, 500, 502, 503, 504]);

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function cleanError(text) {
  if (!text) return "Submission failed";
  if (text.trim().startsWith("<!DOCTYPE html>") || text.trim().startsWith("<html")) {
    return "Google Apps Script returned an HTML error page. Check SCRIPT_URL and the latest Apps Script deployment.";
  }
  return text.slice(0, 500);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.SCRIPT_URL) {
    return res.status(500).json({ error: "SCRIPT_URL is not configured" });
  }

  try {
    let response;
    let text = "";

    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(process.env.SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: {
          "Content-Type": "application/json"
        }
      });

      text = await response.text();

      if (response.ok || !RETRY_STATUSES.has(response.status)) break;
      await wait(250 * (attempt + 1));
    }

    if (!response.ok) {
      return res.status(502).json({ error: cleanError(text) });
    }

    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ error: "Failed to submit" });
  }
}
