const quizData = [
  {
    question: "Durante un sismo, ¿cuál es la acción más segura dentro de un aula?",
    answers: [
      "Salir corriendo hacia las escaleras",
      "Mantener la calma, protegerse y esperar la señal de evacuación",
      "Permanecer junto a ventanas para observar",
      "Mover mobiliario mientras ocurre el movimiento"
    ],
    correct: 1,
    success: "Correcto. Priorizaste protección personal y evacuación segura.",
    error: "Respuesta incorrecta. En sismo se aplica protección inmediata y salida ordenada."
  },
  {
    question: "¿Qué medida previene mejor un incendio institucional?",
    answers: [
      "Ocultar cables deteriorados",
      "Sobrecargar tomas para optimizar espacios",
      "Inspeccionar instalaciones eléctricas y eliminar sobrecargas",
      "Cerrar rutas de evacuación para controlar acceso"
    ],
    correct: 2,
    success: "Correcto. El control preventivo de instalaciones reduce riesgos críticos.",
    error: "No es correcto. La prevención inicia con revisión técnica y uso seguro de energía."
  },
  {
    question: "En una evacuación, ¿qué criterio debe mantenerse siempre?",
    answers: [
      "Regresar por objetos personales",
      "Seguir rutas señalizadas y conservar orden del grupo",
      "Esperar en pasillos sin indicaciones",
      "Correr para llegar primero al punto seguro"
    ],
    correct: 1,
    success: "Correcto. Orden y rutas señalizadas disminuyen lesiones y tiempos de salida.",
    error: "Respuesta incorrecta. La evacuación eficaz se basa en orden y rutas establecidas."
  },
  {
    question: "¿Qué fortalece la cultura institucional de prevención?",
    answers: [
      "Depender solo de una brigada",
      "Realizar simulacros, medir resultados y ajustar protocolos",
      "Ignorar señales menores",
      "Activar protocolos solo cuando hay incidentes reales"
    ],
    correct: 1,
    success: "Correcto. La mejora continua se logra con práctica y evaluación sistemática.",
    error: "No es correcto. La cultura preventiva requiere entrenamiento permanente y evaluación."
  }
];

const emergencyItems = [
  { name: "Agua potable", good: true },
  { name: "Linterna", good: true },
  { name: "Botiquín", good: true },
  { name: "Baterías", good: true },
  { name: "Videojuego", good: false },
  { name: "Perfume", good: false },
  { name: "Dulces", good: false },
  { name: "Revistas viejas", good: false }
];

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const itemsEl = document.getElementById("items");
const bagStatus = document.getElementById("bagStatus");
const infoButtons = document.querySelectorAll(".info-toggle");
const quizProgressEl = document.getElementById("quizProgress");
const gameShell = document.querySelector(".game-shell");

let currentQuestion = 0;
let score = 0;
let answered = false;

function setText(element, value) {
  if (!element) {
    return;
  }
  element.textContent = value;
}

function clearFeedbackState() {
  if (!feedbackEl) {
    return;
  }

  feedbackEl.classList.remove("feedback--success", "feedback--error");
}

function updateProgress(isAnswered = false) {
  if (!quizProgressEl) {
    return;
  }

  const total = quizData.length;
  const base = isAnswered ? currentQuestion + 1 : currentQuestion;
  const percent = Math.max(0, Math.min(100, (base / total) * 100));
  quizProgressEl.style.width = `${percent}%`;
}

function renderQuestion() {
  if (!questionEl || !answersEl || !nextBtn) {
    return;
  }

  const q = quizData[currentQuestion];
  answered = false;
  clearFeedbackState();
  setText(questionEl, q.question);
  answersEl.innerHTML = "";
  setText(feedbackEl, "");
  nextBtn.disabled = true;
  nextBtn.textContent = "Siguiente";
  nextBtn.dataset.mode = "next";

  q.answers.forEach((answer, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = answer;
    btn.addEventListener("click", () => checkAnswer(btn, idx));
    answersEl.appendChild(btn);
  });

  updateProgress(false);
}

function pulseResult(type) {
  if (!gameShell) {
    return;
  }

  gameShell.classList.remove("result-correct", "result-wrong");
  gameShell.classList.add(type === "success" ? "result-correct" : "result-wrong");
  window.setTimeout(() => {
    gameShell.classList.remove("result-correct", "result-wrong");
  }, 420);
}

function checkAnswer(button, selectedIdx) {
  if (answered || !answersEl) {
    return;
  }

  const q = quizData[currentQuestion];
  const buttons = answersEl.querySelectorAll("button");
  const correctIdx = q.correct;
  answered = true;

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIdx) {
      btn.classList.add("correct");
    }
  });

  if (selectedIdx === correctIdx) {
    score += 10;
    setText(scoreEl, String(score));
    setText(feedbackEl, q.success);
    feedbackEl?.classList.add("feedback--success");
    pulseResult("success");
  } else {
    button.classList.add("wrong");
    setText(feedbackEl, q.error);
    feedbackEl?.classList.add("feedback--error");
    pulseResult("error");
  }

  nextBtn.disabled = false;
  updateProgress(true);
}

function finishQuiz() {
  if (!questionEl || !answersEl || !nextBtn) {
    return;
  }

  const maxScore = quizData.length * 10;
  setText(questionEl, "Simulador completado.");
  answersEl.innerHTML = "";
  setText(feedbackEl, `Puntaje final: ${score} de ${maxScore}.`);
  feedbackEl?.classList.remove("feedback--error");
  feedbackEl?.classList.add("feedback--success");
  nextBtn.disabled = false;
  nextBtn.textContent = "Reiniciar";
  nextBtn.dataset.mode = "restart";
  updateProgress(true);
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  setText(scoreEl, "0");
  renderQuestion();
}

function setupQuiz() {
  if (!nextBtn) {
    return;
  }

  nextBtn.addEventListener("click", () => {
    if (nextBtn.dataset.mode === "restart") {
      resetQuiz();
      return;
    }

    if (!answered) {
      setText(feedbackEl, "Selecciona una opción para continuar.");
      feedbackEl?.classList.remove("feedback--success");
      feedbackEl?.classList.add("feedback--error");
      return;
    }

    currentQuestion += 1;

    if (currentQuestion >= quizData.length) {
      finishQuiz();
      return;
    }

    renderQuestion();
  });

  renderQuestion();
}

function renderItems() {
  if (!itemsEl || !bagStatus) {
    return;
  }

  itemsEl.innerHTML = "";
  bagStatus.textContent = "";

  emergencyItems.forEach((item) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "item";
    el.textContent = item.name;
    el.addEventListener("click", () => {
      el.classList.toggle("selected");
      evaluateBag();
    });
    itemsEl.appendChild(el);
  });
}

function evaluateBag() {
  if (!itemsEl || !bagStatus) {
    return;
  }

  const itemButtons = itemsEl.querySelectorAll(".item");
  let goodSelected = 0;
  let badSelected = 0;

  itemButtons.forEach((btn, index) => {
    if (!btn.classList.contains("selected")) {
      return;
    }

    if (emergencyItems[index].good) {
      goodSelected += 1;
    } else {
      badSelected += 1;
    }
  });

  if (goodSelected === 4 && badSelected === 0) {
    bagStatus.textContent = "Mochila perfecta. Preparación lista para primera respuesta.";
    bagStatus.classList.remove("feedback--error");
    bagStatus.classList.add("feedback--success");
    return;
  }

  bagStatus.textContent = `Correctos: ${goodSelected} | No recomendados: ${badSelected}`;
  bagStatus.classList.remove("feedback--success");
  bagStatus.classList.add("feedback--error");
}

function setupInfoToggles() {
  infoButtons.forEach((button) => {
    const targetId = button.dataset.target;
    const panel = document.getElementById(targetId);

    if (!panel) {
      return;
    }

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const nextExpanded = !expanded;
      button.setAttribute("aria-expanded", String(nextExpanded));
      panel.hidden = !nextExpanded;

      if (button.dataset.openLabel && button.dataset.closeLabel) {
        button.textContent = nextExpanded ? button.dataset.closeLabel : button.dataset.openLabel;
      }
    });
  });
}

function setupKitToggle() {
  const button = document.getElementById("kitToggleBtn");
  const panel = document.getElementById("kit-panel");
  const label = document.getElementById("kitToggleLabel");

  if (!button || !panel || !label) {
    return;
  }

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;

    button.setAttribute("aria-expanded", String(nextExpanded));
    panel.hidden = !nextExpanded;
    label.textContent = nextExpanded ? "Cerrar kit de emergencia" : "Abrir kit de emergencia";
  });
}

function setupAccordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");

  triggers.forEach((trigger) => {
    const panelId = trigger.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;

    if (!panel) {
      return;
    }

    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";

      triggers.forEach((otherTrigger) => {
        const otherId = otherTrigger.getAttribute("aria-controls");
        const otherPanel = otherId ? document.getElementById(otherId) : null;
        otherTrigger.setAttribute("aria-expanded", "false");
        if (otherPanel) {
          otherPanel.hidden = true;
        }
      });

      trigger.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });
}

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const suffix = counter.dataset.suffix || "";

  if (!Number.isFinite(target)) {
    return;
  }

  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(target * progress);
    counter.textContent = `${value.toLocaleString("es-CO")}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
      return;
    }

    counter.textContent = `${target.toLocaleString("es-CO")}${suffix}`;
  }

  requestAnimationFrame(frame);
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-count]");

  if (counters.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const counter = entry.target;
        if (counter.dataset.animated === "true") {
          return;
        }

        counter.dataset.animated = "true";
        animateCounter(counter);
        observer.unobserve(counter);
      });
    },
    {
      threshold: 0.4
    }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupReveal() {
  const revealNodes = document.querySelectorAll(".reveal, .reveal-step");

  if (revealNodes.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

setupInfoToggles();
setupKitToggle();
setupAccordion();
setupCounters();
setupReveal();
setupQuiz();
renderItems();
