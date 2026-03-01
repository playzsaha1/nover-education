// ===== NAV / HUB SWITCHING (unchanged) =====
const navItems = document.querySelectorAll(".nav-item");
const hubTitle = document.getElementById("hubTitle");
const hubSubtitle = document.getElementById("hubSubtitle");
const studentHub = document.getElementById("studentHub");
const hubFrameWrapper = document.getElementById("hubFrameWrapper");
const hubFrame = document.getElementById("hubFrame");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

const hubMeta = {
  student: {
    title: "Student AI",
    subtitle: "General study help, summaries, flashcards, quizzes.",
  },
  medical: {
    title: "Medical Hub",
    subtitle: "Conditions, mechanisms, differentials, and exam-style explanations.",
    path: "hubs/medical.html",
  },
  finance: {
    title: "Finance & Business Hub",
    subtitle: "Investing, business models, cashflow, and case-style breakdowns.",
    path: "hubs/finance.html",
  },
  tech: {
    title: "Tech & Coding Hub",
    subtitle: "Code explanations, debugging, and system design thinking.",
    path: "hubs/tech.html",
  },
  fitness: {
    title: "Fitness & Sports Hub",
    subtitle: "Training logic, programming, and performance science.",
    path: "hubs/fitness.html",
  },
  science: {
    title: "Science Hub",
    subtitle: "Physics, chemistry, biology, and experiment reasoning.",
    path: "hubs/science.html",
  },
  writing: {
    title: "Writing & Creativity Hub",
    subtitle: "Essays, stories, scripts, and structured writing help.",
    path: "hubs/writing.html",
  },
};

navItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    const hub = btn.dataset.hub;

    navItems.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    hubTitle.textContent = hubMeta[hub].title;
    hubSubtitle.textContent = hubMeta[hub].subtitle;

    if (hub === "student") {
      studentHub.classList.add("active");
      hubFrameWrapper.classList.remove("active");
    } else {
      studentHub.classList.remove("active");
      hubFrameWrapper.classList.add("active");
      hubFrame.src = hubMeta[hub].path;
    }
  });
});

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
}

// ===== REAL AI WIRING (NEW) =====

// Calls your Vercel serverless function at /api/chat
async function callAI(message) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");

  return data.text || "No response";
}

function setOutput(el, html) {
  if (!el) return;
  el.innerHTML = html;
}

function setText(el, text) {
  if (!el) return;
  el.textContent = text;
}

function setupStudentAI() {
  // MAIN STUDENT CHAT
  const studentBtn = document.getElementById("studentAskBtn");
  const studentInput = document.getElementById("studentInput");
  const studentOutput = document.getElementById("studentOutput");

  if (studentBtn && studentInput && studentOutput) {
    studentBtn.addEventListener("click", async () => {
      const userText = studentInput.value.trim();
      if (!userText) {
        setOutput(studentOutput, `<p class="muted">Type something first so the AI has context.</p>`);
        return;
      }

      setOutput(studentOutput, `<p class="muted">thinking...</p>`);

      try {
        const reply = await callAI(
          `You are a helpful student tutor. Explain clearly, step-by-step, and keep it friendly.
If the question is vague, ask 1 short clarifying question, then still give your best guess.

Student question:
${userText}`
        );
        setText(studentOutput, reply);
      } catch (e) {
        setOutput(studentOutput, `<p class="muted">Error: ${e.message}</p>`);
      }
    });
  }

  // SUMMARISER
  const summaryBtn = document.getElementById("summaryBtn");
  const summaryInput = document.getElementById("summaryInput");
  const summaryOutput = document.getElementById("summaryOutput");

  if (summaryBtn && summaryInput && summaryOutput) {
    summaryBtn.addEventListener("click", async () => {
      const text = summaryInput.value.trim();
      if (!text) {
        setOutput(summaryOutput, `<p class="muted">Paste some content first.</p>`);
        return;
      }

      setOutput(summaryOutput, `<p class="muted">summarising...</p>`);

      try {
        const reply = await callAI(
          `Summarise this for a student.
Return:
1) 6 dot points max
2) a 1-sentence takeaway

Text:
${text}`
        );
        setText(summaryOutput, reply);
      } catch (e) {
        setOutput(summaryOutput, `<p class="muted">Error: ${e.message}</p>`);
      }
    });
  }

  // FLASHCARDS
  const flashBtn = document.getElementById("flashcardsBtn");
  const flashInput = document.getElementById("flashcardInput");
  const flashOutput = document.getElementById("flashcardOutput");

  if (flashBtn && flashInput && flashOutput) {
    flashBtn.addEventListener("click", async () => {
      const text = flashInput.value.trim();
      if (!text) {
        setOutput(flashOutput, `<p class="muted">Paste some content first.</p>`);
        return;
      }

      setOutput(flashOutput, `<p class="muted">generating flashcards...</p>`);

      try {
        const reply = await callAI(
          `Create 8 flashcards from the content below.
Format exactly like:
Q: ...
A: ...

Content:
${text}`
        );
        setText(flashOutput, reply);
      } catch (e) {
        setOutput(flashOutput, `<p class="muted">Error: ${e.message}</p>`);
      }
    });
  }

  // QUIZ
  const quizBtn = document.getElementById("quizBtn");
  const quizInput = document.getElementById("quizInput");
  const quizOutput = document.getElementById("quizOutput");

  if (quizBtn && quizInput && quizOutput) {
    quizBtn.addEventListener("click", async () => {
      const text = quizInput.value.trim();
      if (!text) {
        setOutput(quizOutput, `<p class="muted">Paste some content first.</p>`);
        return;
      }

      setOutput(quizOutput, `<p class="muted">creating quiz...</p>`);

      try {
        const reply = await callAI(
          `Create a 6-question quiz based on the content below.
Mix: multiple choice + short answer.
At the bottom, include an Answer Key.

Content:
${text}`
        );
        setText(quizOutput, reply);
      } catch (e) {
        setOutput(quizOutput, `<p class="muted">Error: ${e.message}</p>`);
      }
    });
  }
}

// Run after page loads
setupStudentAI();