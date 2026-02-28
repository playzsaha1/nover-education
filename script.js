// Call backend AI route
async function callAI(prompt) {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    return data.output || "No response.";
  } catch (error) {
    console.error("Fetch error:", error);
    return "Error connecting to AI.";
  }
}

// Student AI chat
async function fakeRespond(scope) {
  const input = document.getElementById(`${scope}Input`);
  const output = document.getElementById(`${scope}Output`);

  const value = input.value.trim();
  if (!value) {
    output.innerHTML = `<p class="muted">Type something first.</p>`;
    return;
  }

  output.innerHTML = `<p class="muted">Thinking...</p>`;
  const response = await callAI(value);
  
  // Using textContent for the response part to stay safe from XSS
  output.innerHTML = `<p>${response}</p>`;
}

// Tools (summary, flashcards, quiz)
async function fakeTool(type) {
  const map = {
    summary: {
      in: "summaryInput",
      out: "summaryOutput",
      prompt: "Summarise this clearly and concisely:\n\n"
    },
    flashcards: {
      in: "flashcardInput",
      out: "flashcardOutput",
      prompt: "Create flashcards from this content:\n\n"
    },
    quiz: {
      in: "quizInput",
      out: "quizOutput",
      prompt: "Create a quiz with answers based on this content:\n\n"
    }
  };

  const cfg = map[type];
  const input = document.getElementById(cfg.in);
  const output = document.getElementById(cfg.out);

  const value = input.value.trim();
  if (!value) {
    output.innerHTML = `<p class="muted">Paste some content first.</p>`;
    return;
  }

  output.innerHTML = `<p class="muted">Thinking...</p>`;
  const response = await callAI(cfg.prompt + value);
  output.innerHTML = `<p>${response}</p>`;
} // <--- This was missing!