export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    // In Vercel, req.body is usually already parsed as JSON
    // but we’ll handle both cases just in case
    let body = req.body;

    if (!body) {
      let raw = "";
      await new Promise((resolve) => {
        req.on("data", (chunk) => (raw += chunk));
        req.on("end", resolve);
      });
      body = raw ? JSON.parse(raw) : {};
    }

    const message = body.message || "";
    if (!message.trim()) {
      return res.status(400).json({ error: "Message is empty" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY env var" });
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      apiKey;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    });

    const data = await geminiRes.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      data?.error?.message ||
      "No response";

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}