async function callAI(prompt) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  return data.output || "No response.";
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
}

// Sidebar + hub switching (unchanged)
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
    subtitle: "General study help, summaries, flashcards, quizzes."
  },
  medical: {
    title: "Medical Hub",
    subtitle: "Educational medical reasoning.",
    path: "hubs/medical.html"
  },
  finance: {
    title: "Finance & Business Hub",
    subtitle: "Business logic and investment reasoning.",
    path: "hubs/finance.html"
  },
  tech: {
    title: "Tech & Coding Hub",
    subtitle: "Code explanations and debugging.",
    path: "hubs/tech.html"
  },
  fitness: {
    title: "Fitness & Sports Hub",
    subtitle: "Training and performance science.",
    path: "hubs/fitness.html"
  },
  science: {
    title: "Science Hub",
    subtitle: "Physics, chemistry, biology reasoning.",
    path: "hubs/science.html"
  },
  writing: {
    title: "Writing & Creativity Hub",
    subtitle: "Essays, stories, scripts.",
    path: "hubs/writing.html"
  }
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
