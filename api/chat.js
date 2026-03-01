module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is empty" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY env var" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data?.error?.message || "Gemini API error",
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "No response";

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};