module.exports = async function (req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { message } = req.body || {};

    // Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is empty" });
    }

    // Read secret API key from Vercel env vars
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY env var" });
    }

    // ✅ Option A model
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Call Gemini
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      }),
    });

    const data = await response.json();

    // Handle Gemini errors
    if (!response.ok) {
      return res.status(500).json({
        error: data?.error?.message || "Gemini API error",
      });
    }

    // Extract text
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "No response";

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};