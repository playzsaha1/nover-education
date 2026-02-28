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
    subtitle: "Conditions, mechanisms, differentials, and exam‑style explanations.",
    path: "hubs/medical.html",
  },
  finance: {
    title: "Finance & Business Hub",
    subtitle: "Investing, business models, cashflow, and case‑style breakdowns.",
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

// Fake tools for now – just to show behaviour

function fakeRespond(scope) {
  const input = document.getElementById(`${scope}Input`);
  const output = document.getElementById(`${scope}Output`);

  const value = input.value.trim();
  if (!value) {
    output.innerHTML = `<p class="muted">Type something first so the AI has context.</p>`;
    return;
  }

  output.innerHTML = `
    <p><strong>Simulated AI response:</strong></p>
    <p class="muted">In the real version, this would call your backend or an AI API.</p>
    <p>You asked:</p>
    <p>${escapeHtml(value)}</p>
  `;
}

function fakeTool(type) {
  const map = {
    summary: {
      in: "summaryInput",
      out: "summaryOutput",
      label: "Summary",
    },
    flashcards: {
      in: "flashcardInput",
      out: "flashcardOutput",
      label: "Flashcards",
    },
    quiz: {
      in: "quizInput",
      out: "quizOutput",
      label: "Quiz",
    },
  };

  const cfg = map[type];
  const input = document.getElementById(cfg.in);
  const output = document.getElementById(cfg.out);

  const value = input.value.trim();
  if (!value) {
    output.innerHTML = `<p class="muted">Paste some content first.</p>`;
    return;
  }

  output.innerHTML = `
    <p><strong>${cfg.label} preview (simulated):</strong></p>
    <p class="muted">This is a placeholder. Later you can wire this to a real AI backend.</p>
    <p>Source snippet:</p>
    <p>${escapeHtml(value.slice(0, 200))}${value.length > 200 ? "..." : ""}</p>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
