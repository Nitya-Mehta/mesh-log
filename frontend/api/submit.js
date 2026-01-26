export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      process.env.SCRIPT_URL,
      {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const text = await response.text();
    res.status(200).send(text);

  } catch (err) {
    res.status(500).json({ error: "Failed to submit" });
  }
}
