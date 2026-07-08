(() => {
  "use strict";

  const stateKey = "date-ask-state-v2";
  const pageOrder = ["ask", "details", "confirm"];
  const pages = {
    ask: document.getElementById("page-ask"),
    details: document.getElementById("page-details"),
    confirm: document.getElementById("page-confirm"),
  };

  const yesButton = document.getElementById("yesButton");
  const noButton = document.getElementById("noButton");
  const attemptCount = document.getElementById("attemptCount");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");
  const vibeGrid = document.getElementById("vibeGrid");
  const meterSlider = document.getElementById("meterSlider");
  const meterFace = document.getElementById("meterFace");
  const meterLabel = document.getElementById("meterLabel");
  const confirmButton = document.getElementById("confirmButton");
  const resetButton = document.getElementById("resetButton");
  const confirmMessage = document.getElementById("confirmMessage");
  const summaryDate = document.getElementById("summaryDate");
  const summaryTime = document.getElementById("summaryTime");
  const summaryVibe = document.getElementById("summaryVibe");
  const summaryExcitement = document.getElementById("summaryExcitement");
  const ambientLayer = document.getElementById("ambient-layer");
  const celebrationLayer = document.getElementById("celebration-layer");
  const eggLayer = document.getElementById("egg-layer");
  const eggBanner = document.getElementById("eggBanner");
  const tickerTrack = document.getElementById("tickerTrack");
  const soundToggle = document.getElementById("soundToggle");
  const themeToggle = document.getElementById("themeToggle");
  const calendarButton = document.getElementById("calendarButton");
  const downloadButton = document.getElementById("downloadButton");
  const shareButton = document.getElementById("shareButton");
  const cardCanvas = document.getElementById("cardCanvas");
  const cdDays = document.getElementById("cdDays");
  const cdHours = document.getElementById("cdHours");
  const cdMinutes = document.getElementById("cdMinutes");
  const cdSeconds = document.getElementById("cdSeconds");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reasons = [
    "9 out of 10 dentists recommend saying yes",
    "warning: extremely low commitment, extremely high fun",
    "studies show pizza tastes better on dates",
    "limited time offer — this smile will not last forever",
    "terms & conditions: none, just vibes",
    "the yes button is significantly less tired than the no button",
    "plot twist: there is no wrong answer (yes is more correct though)",
    "side effects of saying yes may include butterflies",
  ];

  const noPhrases = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Last chance!",
    "Wait, no!",
    "You can't click me!",
    "This is rigged!",
    "I have rights!",
  ];

  const excitementLevels = [
    { face: "😐", label: "Politely intrigued" },
    { face: "🙂", label: "Cautiously optimistic" },
    { face: "😄", label: "Genuinely excited" },
    { face: "🤩", label: "Can't stop smiling" },
    { face: "🥳", label: "Already picking outfits" },
  ];

  const state = loadState();
  let currentPage = "ask";
  let noLimit = state.noLimit ?? randomInt(5, 8);
  let noAttempts = state.noAttempts ?? 0;
  let noIsSurrendered = state.noIsSurrendered ?? false;
  let noFixed = false;
  let lastNoAttemptAt = 0;
  let isDodging = false;
  let countdownTimer = null;
  let muted = localStorage.getItem("date-ask-muted") === "1";
  let audioCtx = null;

  state.noLimit = noLimit;
  if (!state.date) {
    state.date = todayDateString();
  }
  if (state.excitement === undefined) {
    state.excitement = 2;
  }

  initTheme();
  initSound();
  buildTicker();
  hydrateInputs();
  hydrateVibes();
  hydrateMeter();
  hydrateNoButton();
  showPage(resolvePageFromHashOrState(), { replaceHash: true, animateCelebration: false });
  startAmbientShapes();
  window.setInterval(refreshDateTimeBounds, 30_000);
  window.setInterval(tickCountdown, 1000);

  if (!prefersReducedMotion) {
    window.setInterval(() => {
      if (Math.random() < 0.7) {
        spawnAmbientShape();
      }
    }, 1600);
  }

  yesButton.addEventListener("click", () => {
    playTone(660, 0.12, "sine", 0.1);
    goTo("details");
  });

  noButton.addEventListener("mouseenter", () => handleNoAttempt("mouse"));
  noButton.addEventListener("pointerdown", (event) => {
    if (noIsSurrendered) return;
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      event.preventDefault();
    }
    handleNoAttempt(event.pointerType || "pointer");
  });
  noButton.addEventListener("click", (event) => {
    if (!noIsSurrendered) {
      event.preventDefault();
      handleNoAttempt("click");
    } else {
      playTone(660, 0.12, "sine", 0.1);
      goTo("details");
    }
  });

  dateInput.addEventListener("change", () => {
    state.date = dateInput.value;
    if (dateInput.value && !isSelectableDate(dateInput.value)) {
      dateInput.value = todayDateString();
      state.date = dateInput.value;
    }
    refreshDateTimeBounds();
    persistState();
    updateConfirmButton();
    playTone(420, 0.06, "square", 0.06);
  });

  timeInput.addEventListener("change", () => {
    state.time = timeInput.value;
    if (!isValidTimeSelection()) {
      timeInput.value = "";
      state.time = "";
    }
    persistState();
    updateConfirmButton();
    playTone(420, 0.06, "square", 0.06);
  });

  vibeGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".vibe-card");
    if (!card) return;
    selectVibe(card.dataset.vibe);
    playTone(500, 0.08, "square", 0.07);
  });

  meterSlider.addEventListener("input", () => {
    state.excitement = Number(meterSlider.value);
    hydrateMeter();
    persistState();
    playTone(360 + Number(meterSlider.value) * 60, 0.05, "sine", 0.05);
  });

  confirmButton.addEventListener("click", () => {
    if (confirmButton.disabled) return;
    playSuccessChime();
    goTo("confirm");
  });

  resetButton.addEventListener("click", () => {
    sessionStorage.removeItem(stateKey);
    window.location.hash = "ask";
    window.location.reload();
  });

  calendarButton.addEventListener("click", () => {
    downloadCalendarInvite();
    playTone(560, 0.08, "square", 0.07);
  });

  downloadButton.addEventListener("click", () => {
    downloadDateCard();
    playTone(560, 0.08, "square", 0.07);
  });

  shareButton.addEventListener("click", () => {
    shareTheNews();
  });

  soundToggle.addEventListener("click", () => {
    muted = !muted;
    localStorage.setItem("date-ask-muted", muted ? "1" : "0");
    updateSoundIcon();
    if (!muted) playTone(560, 0.08, "sine", 0.08);
  });

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
    playTone(480, 0.06, "triangle", 0.06);
  });

  window.addEventListener("hashchange", () => {
    const page = normalizePage(location.hash.replace("#", ""));
    if (page) {
      showPage(page, { replaceHash: false, animateCelebration: page === "confirm" });
    }
  });

  document.addEventListener("pointermove", (event) => {
    state.pointer = { x: event.clientX, y: event.clientY };
  }, { passive: true });

  // ---------- konami code easter egg ----------
  const konamiSeq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let konamiIndex = 0;
  document.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === konamiSeq[konamiIndex]) {
      konamiIndex += 1;
      if (konamiIndex === konamiSeq.length) {
        triggerEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = key === konamiSeq[0] ? 1 : 0;
    }
  });

  // ---------- state helpers ----------
  function loadState() {
    try {
      return JSON.parse(sessionStorage.getItem(stateKey) || "{}") || {};
    } catch {
      return {};
    }
  }

  function persistState() {
    try {
      sessionStorage.setItem(stateKey, JSON.stringify(state));
    } catch {}
  }

  function initTheme() {
    const saved = localStorage.getItem("date-ask-theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }

  function setTheme(mode) {
    if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.textContent = "☀️";
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeToggle.textContent = "🌙";
    }
    localStorage.setItem("date-ask-theme", mode);
  }

  function initSound() {
    updateSoundIcon();
  }

  function updateSoundIcon() {
    soundToggle.textContent = muted ? "🔇" : "🔊";
  }

  // ---------- ticker ----------
  function buildTicker() {
    const items = [...reasons, ...reasons]
      .map((text) => `<span class="ticker-item">${escapeHtml(text)}</span>`)
      .join("");
    tickerTrack.innerHTML = items;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[char]));
  }

  // ---------- inputs ----------
  function hydrateInputs() {
    dateInput.min = todayDateString();
    if (state.date) dateInput.value = state.date;
    if (state.time) timeInput.value = state.time;
    syncTimeBounds();
    if (dateInput.value && !isSelectableDate(dateInput.value)) {
      dateInput.value = todayDateString();
      state.date = dateInput.value;
    }
    if (timeInput.value && !isValidTimeSelection()) {
      timeInput.value = "";
      state.time = "";
    }
    updateConfirmButton();
  }

  function hydrateVibes() {
    const cards = [...vibeGrid.querySelectorAll(".vibe-card")];
    cards.forEach((card) => {
      const selected = card.dataset.vibe === state.vibe;
      card.classList.toggle("selected", selected);
      card.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function hydrateMeter() {
    const level = excitementLevels[state.excitement] || excitementLevels[2];
    meterSlider.value = state.excitement ?? 2;
    meterFace.textContent = level.face;
    meterLabel.textContent = level.label;
  }

  function updateConfirmButton() {
    syncTimeBounds();
    const hasDate = Boolean(dateInput.value) && isSelectableDate(dateInput.value);
    const hasTime = Boolean(timeInput.value) && isValidTimeSelection();
    const hasVibe = Boolean(state.vibe);
    confirmButton.disabled = !(hasDate && hasTime && hasVibe);
  }

  function selectVibe(vibe) {
    state.vibe = vibe;
    hydrateVibes();
    persistState();
    updateConfirmButton();
  }

  // ---------- routing ----------
  function resolvePageFromHashOrState() {
    const hashPage = normalizePage(location.hash.replace("#", ""));
    if (hashPage) return hashPage;
    if (state.confirmed) return "confirm";
    if (state.hasEnteredDetails) return "details";
    return "ask";
  }

  function normalizePage(value) {
    return pageOrder.includes(value) ? value : null;
  }

  function goTo(page) {
    showPage(page, { replaceHash: true, animateCelebration: page === "confirm" });
  }

  function showPage(page, { replaceHash = true, animateCelebration = false } = {}) {
    const nextPage = normalizePage(page) || "ask";
    currentPage = nextPage;
    Object.entries(pages).forEach(([name, section]) => {
      section.classList.toggle("active", name === nextPage);
    });

    if (replaceHash && location.hash !== `#${nextPage}`) {
      history.replaceState(null, "", `#${nextPage}`);
    }

    if (nextPage === "details") {
      state.hasEnteredDetails = true;
      persistState();
      window.setTimeout(() => dateInput.focus(), 120);
    }

    if (nextPage === "confirm") {
      state.confirmed = true;
      persistState();
      renderSummary();
      if (animateCelebration) launchCelebration();
    }
  }

  function renderSummary() {
    const formattedDate = formatDate(state.date);
    const formattedTime = formatTime(state.time);
    const vibe = state.vibe || "a very cute mystery";
    const level = excitementLevels[state.excitement] || excitementLevels[2];

    summaryDate.textContent = formattedDate;
    summaryTime.textContent = formattedTime;
    summaryVibe.textContent = vibe;
    summaryExcitement.textContent = `${level.face} ${level.label}`;
    confirmMessage.textContent = `It's official! See you on ${formattedDate} at ${formattedTime} for ${vibe}! I'm already excited 🎉💕`;
  }

  function formatDate(value) {
    if (!value) return "your chosen day";
    const parsed = new Date(`${value}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }).format(parsed);
  }

  function formatTime(value) {
    if (!value) return "your chosen time";
    const [hour, minute] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
  }

  // ---------- no button chaos ----------
  function hydrateNoButton() {
    if (noIsSurrendered) {
      surrenderNoButton(true);
    } else {
      attemptCount.textContent = String(noAttempts);
      noButton.textContent = noPhrases[Math.min(noAttempts, noPhrases.length - 1)];
      growYesButton();
    }
  }

  function handleNoAttempt(source) {
    if (currentPage !== "ask" || noIsSurrendered || isDodging) return;

    const now = Date.now();
    if (now - lastNoAttemptAt < 320) return;
    lastNoAttemptAt = now;

    noAttempts += 1;
    state.noAttempts = noAttempts;
    attemptCount.textContent = String(noAttempts);
    noButton.textContent = noPhrases[Math.min(noAttempts, noPhrases.length - 1)];
    growYesButton();
    persistState();
    escapeNoButton(source);
    playTone(260 + noAttempts * 12, 0.09, "sawtooth", 0.06);

    if (noAttempts >= noLimit) {
      surrenderNoButton();
    }
  }

  function growYesButton() {
    const size = Math.min(1 + noAttempts * 0.06, 1.7);
    yesButton.style.fontSize = `${size}rem`;
    yesButton.style.padding = `${0.9 + noAttempts * 0.05}rem ${1.5 + noAttempts * 0.1}rem`;
  }

  function escapeNoButton(source) {
    if (!noFixed) {
      noButton.style.position = "fixed";
      noButton.style.zIndex = "20";
      noButton.style.margin = "0";
      noButton.style.whiteSpace = "nowrap";
      noButton.style.transition = "top 260ms cubic-bezier(.2,.9,.22,1), left 260ms cubic-bezier(.2,.9,.22,1), transform 260ms cubic-bezier(.2,.9,.22,1)";
      noFixed = true;
    }

    // re-measure every time: the phrase (and therefore the button's
    // natural width) changes on each attempt, so a stale rect would
    // let the new, wider text overflow past the viewport edge.
    const rect = noButton.getBoundingClientRect();
    const margin = 24;
    const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxY = Math.max(margin, window.innerHeight - rect.height - margin);

    let x = randomBetween(margin, Math.max(margin, maxX));
    let y = randomBetween(margin, Math.max(margin, maxY));

    if (typeof source === "string" && source.includes("mouse")) {
      const pointer = state.pointer || null;
      if (pointer) {
        const distanceX = x - pointer.x;
        const distanceY = y - pointer.y;
        if (Math.abs(distanceX) < 140 && Math.abs(distanceY) < 100) {
          x = clamp(pointer.x + (distanceX >= 0 ? 220 : -220), margin, maxX);
          y = clamp(pointer.y + (distanceY >= 0 ? 160 : -160), margin, maxY);
        }
      }
    }

    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
    noButton.style.transform = `rotate(${randomBetween(-8, 8)}deg)`;

    isDodging = true;
    window.setTimeout(() => {
      isDodging = false;
    }, 300);
  }

  function surrenderNoButton(silent) {
    if (noIsSurrendered && !silent) return;
    noIsSurrendered = true;
    state.noIsSurrendered = true;
    if (!silent) persistState();

    noButton.textContent = "Okay fine... Yes 😮‍💨";
    noButton.classList.add("surrendered", "pulse");
    noButton.style.position = "";
    noButton.style.left = "";
    noButton.style.top = "";
    noButton.style.transform = "";
    noButton.style.width = "";
    noButton.style.height = "";
    noButton.style.zIndex = "";
    noButton.style.margin = "";
    noButton.style.whiteSpace = "";
    noButton.style.transition = "";
    noFixed = false;
  }

  // ---------- math helpers ----------
  function randomBetween(min, max) {
    return Math.round(min + Math.random() * (max - min));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  function todayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function currentTimeString() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function syncTimeBounds() {
    if (dateInput.value === todayDateString()) {
      timeInput.min = currentTimeString();
    } else {
      timeInput.min = "";
    }
  }

  function refreshDateTimeBounds() {
    syncTimeBounds();
    if (dateInput.value === todayDateString() && timeInput.value && timeInput.value < currentTimeString()) {
      timeInput.value = "";
      state.time = "";
    }
    if (dateInput.value && !isSelectableDate(dateInput.value)) {
      dateInput.value = todayDateString();
      state.date = dateInput.value;
    }
    updateConfirmButton();
  }

  function isSelectableDate(value) {
    return Boolean(value) && value >= todayDateString();
  }

  function isValidTimeSelection() {
    if (!timeInput.value) return false;
    if (dateInput.value === todayDateString()) {
      return timeInput.value >= currentTimeString();
    }
    return isSelectableDate(dateInput.value);
  }

  // ---------- countdown ----------
  function tickCountdown() {
    if (currentPage !== "confirm" || !state.date || !state.time) return;
    const target = new Date(`${state.date}T${state.time}:00`);
    if (Number.isNaN(target.getTime())) return;
    const diff = target.getTime() - Date.now();

    if (diff <= 0) {
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMinutes.textContent = "00";
      cdSeconds.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    cdDays.textContent = String(days).padStart(2, "0");
    cdHours.textContent = String(hours).padStart(2, "0");
    cdMinutes.textContent = String(minutes).padStart(2, "0");
    cdSeconds.textContent = String(seconds).padStart(2, "0");
  }

  // ---------- calendar export ----------
  function downloadCalendarInvite() {
    if (!state.date || !state.time) return;
    const start = new Date(`${state.date}T${state.time}:00`);
    if (Number.isNaN(start.getTime())) return;
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const vibe = state.vibe || "Our Date";

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//date-ask//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@date-ask`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${icsEscape(vibe)} — It's a date!`,
      `DESCRIPTION:${icsEscape(`It's official: ${vibe}. See you there!`)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar" });
    triggerDownload(blob, "our-date.ics");
  }

  function toIcsDate(date) {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  function icsEscape(value) {
    return String(value).replace(/([,;])/g, "\\$1");
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  // ---------- date card image ----------
  function downloadDateCard() {
    const ctx = cardCanvas.getContext("2d");
    const w = cardCanvas.width;
    const h = cardCanvas.height;
    const level = excitementLevels[state.excitement] || excitementLevels[2];

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fdf3e4";
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = 10;
    ctx.strokeStyle = "#111111";
    ctx.strokeRect(20, 20, w - 40, h - 40);

    ctx.fillStyle = "#ff3d81";
    ctx.fillRect(20, 20, w - 40, 100);
    ctx.strokeRect(20, 20, w - 40, 100);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 48px Arial, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText("IT'S A DATE!", 50, 72);

    ctx.fillStyle = "#111111";
    ctx.font = "700 32px Arial, sans-serif";
    const formattedDate = formatDate(state.date);
    const formattedTime = formatTime(state.time);
    const vibe = state.vibe || "a very cute mystery";

    wrapText(ctx, `📅  ${formattedDate}`, 50, 210, w - 100, 40);
    ctx.fillText(`🕒  ${formattedTime}`, 50, 300);
    ctx.fillText(`💖  ${vibe}`, 50, 360);
    ctx.fillText(`${level.face}  ${level.label}`, 50, 420);

    ctx.font = "italic 22px Arial, sans-serif";
    ctx.fillStyle = "#55504a";
    ctx.fillText("Generated with love (and a bit of code).", 50, h - 55);

    cardCanvas.toBlob((blob) => {
      if (blob) triggerDownload(blob, "our-date-card.png");
    });
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (ctx.measureText(text).width <= maxWidth) {
      ctx.fillText(text, x, y);
      return;
    }
    ctx.fillText(text, x, y);
  }

  // ---------- share ----------
  async function shareTheNews() {
    const text = confirmMessage.textContent;
    if (navigator.share) {
      try {
        await navigator.share({ title: "It's a date!", text });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      flashLabel(shareButton, "Copied!");
    } catch {
      flashLabel(shareButton, "Copy failed");
    }
  }

  function flashLabel(button, message) {
    const original = button.textContent;
    button.textContent = message;
    window.setTimeout(() => {
      button.textContent = original;
    }, 1600);
  }

  // ---------- ambient shapes ----------
  function startAmbientShapes() {
    if (prefersReducedMotion) return;
    for (let i = 0; i < 8; i += 1) {
      window.setTimeout(spawnAmbientShape, i * 220);
    }
  }

  function spawnAmbientShape() {
    if (prefersReducedMotion) return;
    const kinds = ["circle", "square", "tri"];
    const kind = kinds[randomInt(0, kinds.length - 1)];
    const element = document.createElement("span");
    element.className = `shape ${kind === "square" ? "" : kind}`;
    element.style.setProperty("--x", `${randomInt(2, 96)}vw`);
    element.style.setProperty("--size", `${randomBetween(14, 26)}px`);
    element.style.setProperty("--opacity", (Math.random() * 0.4 + 0.25).toFixed(2));
    element.style.setProperty("--duration", `${randomBetween(11, 19)}s`);
    element.style.setProperty("--drift", `${randomBetween(-70, 70)}px`);
    element.style.setProperty("--spin", `${randomBetween(-160, 160)}deg`);
    element.style.setProperty("--color", pickAccentColor());
    ambientLayer.appendChild(element);
    element.addEventListener("animationend", () => element.remove(), { once: true });
  }

  function pickAccentColor() {
    const palette = ["#ff3d81", "#ffd400", "#2b57ff", "#00d9a5", "#7b5bff"];
    return palette[randomInt(0, palette.length - 1)];
  }

  function launchCelebration() {
    if (prefersReducedMotion) return;
    celebrationLayer.replaceChildren();
    const totalPieces = 46;
    for (let i = 0; i < totalPieces; i += 1) {
      const piece = document.createElement("span");
      const isHeart = i % 6 === 0;
      const isDot = !isHeart && i % 3 === 0;
      piece.className = `confetti${isHeart ? " heart" : isDot ? " dot" : ""}`;
      piece.style.setProperty("--x", `${randomBetween(2, 98)}vw`);
      piece.style.setProperty("--w", `${randomBetween(8, 15)}px`);
      piece.style.setProperty("--h", `${randomBetween(10, 18)}px`);
      piece.style.setProperty("--duration", `${randomBetween(2200, 4200)}ms`);
      piece.style.setProperty("--drift", `${randomBetween(-180, 180)}px`);
      piece.style.setProperty("--spin", `${randomBetween(-780, 780)}deg`);
      piece.style.setProperty("--color", pickAccentColor());
      piece.style.animationDelay = `${randomBetween(0, 420)}ms`;
      celebrationLayer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 5200);
    }
  }

  // ---------- easter egg ----------
  function triggerEasterEgg() {
    eggBanner.classList.add("show");
    playSuccessChime();
    launchEggRain();
    window.setTimeout(() => eggBanner.classList.remove("show"), 2600);
  }

  function launchEggRain() {
    if (prefersReducedMotion) return;
    eggLayer.replaceChildren();
    const emoji = (vibeEmojiFor(state.vibe) || ["🎉", "✨", "💫", "🥳"]);
    const total = 60;
    for (let i = 0; i < total; i += 1) {
      const piece = document.createElement("span");
      piece.textContent = emoji[randomInt(0, emoji.length - 1)];
      piece.style.position = "absolute";
      piece.style.top = "-8vh";
      piece.style.left = `${randomBetween(2, 98)}vw`;
      piece.style.fontSize = `${randomBetween(18, 34)}px`;
      piece.style.filter = "drop-shadow(2px 2px 0 #111)";
      piece.style.animation = `confettiFall ${randomBetween(2400, 4000)}ms cubic-bezier(.15,.75,.2,1) forwards`;
      piece.style.animationDelay = `${randomBetween(0, 500)}ms`;
      piece.style.setProperty("--drift", `${randomBetween(-140, 140)}px`);
      piece.style.setProperty("--spin", `${randomBetween(-400, 400)}deg`);
      eggLayer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 5000);
    }
  }

  function vibeEmojiFor(vibe) {
    const card = [...vibeGrid.querySelectorAll(".vibe-card")].find((el) => el.dataset.vibe === vibe);
    return card ? [card.dataset.emoji, "✨", "🎉"] : null;
  }

  // ---------- sound fx ----------
  function ensureAudioContext() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, duration = 0.12, type = "sine", vol = 0.12) {
    if (muted) return;
    try {
      const ctx = ensureAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {}
  }

  function playSuccessChime() {
    playTone(660, 0.14, "sine", 0.12);
    window.setTimeout(() => playTone(880, 0.16, "sine", 0.12), 120);
    window.setTimeout(() => playTone(990, 0.22, "sine", 0.12), 260);
  }
})();
