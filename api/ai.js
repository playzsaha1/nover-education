export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing Gemini API key." });
    }

    // Using gemini-1.5-flash for faster, cheaper responses
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Check if the API returned an error (e.g., 400 Bad Request)
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: "Gemini API Error", 
        details: data.error?.message || "Unknown error" 
      });
    }

    // Safety check: sometimes candidates[0] doesn't exist if blocked
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      return res.status(200).json({ 
        output: "The AI could not generate a response (it may have been filtered)." 
      });
    }

    res.status(200).json({ output });
  } catch (err) {
    res.status(500).json({ error: "Server error.", details: err.message });
  }
}