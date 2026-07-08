(() => {
  "use strict";

  const stateKey = "date-ask-state-v2";
  const pageOrder = ["ask", "details", "confirm"];
  const pages = {
    ask: document.getElementById("page-ask"),
    details: document.getElementById("page-details"),
    confirm: document.getElementById("page-confirm"),
  };

  // translations must be declared before any synchronous init code can read
  // them (same TDZ trap documented for the old music data tables) — keep
  // this block above the state/init calls further down.
  const translations = {
    en: {
      metaTitle: "Will You Go Out With Me?",
      langAria: "Switch language",
      eggBannerText: "🥚 Secret mode unlocked!",
      ariaSound: "Music and sound settings",
      soundVolumeLabel: "Music volume",
      muteLabel: "Mute",
      unmuteLabel: "Unmute",
      ariaTheme: "Toggle dark mode",
      cornerA: "EXHIBIT A",
      cornerB: "EXHIBIT B",
      cornerC: "EXHIBIT C",
      badgeAsk: "a very important question",
      badgeDetails: "let's make it official",
      badgeConfirm: "confirmation unlocked",
      askTitle: "Would you like to go on a date with me?",
      askLede: "I promise low pressure, high charm, and at least one suspiciously good snack. The \"No\" button has been legally advised not to cooperate.",
      yesLabel: "Yes",
      attemptsLabel: "Attempts to escape:",
      detailsTitle: "Pick the details",
      detailsLede: "You choose the timing and the vibe. I will show up with enthusiasm and excellent intentions.",
      fieldDate: "The date",
      fieldTime: "The time",
      ariaTimePicker: "Pick time with mouse",
      hourLabel: "Hour",
      minuteLabel: "Minute",
      timePickerDone: "Done",
      vibeHeading: "The vibe",
      vibeHelp: "Pick one that sounds delightfully dangerous.",
      vibePizzaTitle: "Pizza Night",
      vibePizzaSub: "Cheesy, cozy, and never complicated.",
      vibeSushiTitle: "Sushi Date",
      vibeSushiSub: "Elegant bites and elite table manners.",
      vibeMovieTitle: "Movie Night",
      vibeMovieSub: "Popcorn, plot twists, and hand-holding potential.",
      vibeCafeTitle: "Cozy Café",
      vibeCafeSub: "Cute drinks, good chats, soft playlist energy.",
      vibeAdventureTitle: "Adventure Day",
      vibeAdventureSub: "A little spontaneous, a little chaotic, a lot fun.",
      vibeIcecreamTitle: "Ice Cream Walk",
      vibeIcecreamSub: "Sweet treats and a stroll with excellent vibes.",
      placeHeading: "The place",
      placeHelp: "Pick a spot on the map (totally optional, just for fun).",
      placeUsual: "Our Usual Spot",
      placeNew: "Somewhere New",
      placeFavcafe: "Her Favorite Café",
      placeDowntown: "Downtown",
      placeWater: "By the Water",
      placeSurprise: "Surprise Me",
      excitementHeading: "How excited are you? (be honest, I'll know)",
      confirmButtonLabel: "It's a date! 💕",
      confirmTitle: "It's official!",
      ticketDate: "Date",
      ticketTime: "Time",
      ticketVibe: "Vibe",
      ticketPlace: "Place",
      ticketExcitement: "Excitement",
      countdownHeading: "Countdown to launch",
      countdownDays: "Days",
      countdownHours: "Hrs",
      countdownMinutes: "Min",
      countdownSeconds: "Sec",
      tinyNote: "Psst — try the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) for a bonus surprise.",
      calendarBtn: "Add to Calendar",
      downloadBtn: "Download Date Card",
      shareBtn: "Share the News",
      resetBtn: "Start Over / Reset",

      reasons: [
        "9 out of 10 dentists recommend saying yes",
        "warning: extremely low commitment, extremely high fun",
        "studies show pizza tastes better on dates",
        "limited time offer — this smile will not last forever",
        "terms & conditions: none, just vibes",
        "the yes button is significantly less tired than the no button",
        "plot twist: there is no wrong answer (yes is more correct though)",
        "side effects of saying yes may include butterflies",
      ],
      noPhrases: [
        "No",
        "Are you sure?",
        "Really sure?",
        "Think again!",
        "Last chance!",
        "Wait, no!",
        "You can't click me!",
        "This is rigged!",
        "I have rights!",
      ],
      noSurrendered: "Okay fine... Yes 😮‍💨",
      excitement: [
        { face: "😐", label: "Politely intrigued" },
        { face: "🙂", label: "Cautiously optimistic" },
        { face: "😄", label: "Genuinely excited" },
        { face: "🤩", label: "Can't stop smiling" },
        { face: "🥳", label: "Already picking outfits" },
      ],
      vibes: {
        pizza: { title: "Pizza Night" },
        sushi: { title: "Sushi Date" },
        movie: { title: "Movie Night" },
        cafe: { title: "Cozy Café" },
        adventure: { title: "Adventure Day" },
        icecream: { title: "Ice Cream Walk" },
      },
      places: {
        usual: "Our Usual Spot",
        new: "Somewhere New",
        favcafe: "Her Favorite Café",
        downtown: "Downtown",
        water: "By the Water",
        surprise: "Surprise Me",
      },
      vibeMysteryFallback: "a very cute mystery",
      dateMysteryFallback: "your chosen day",
      timeMysteryFallback: "your chosen time",
      confirmMessage: (date, time, vibe, place) =>
        `It's official! See you on ${date} at ${time} for ${vibe}${place ? ` at ${place}` : ""}! I'm already excited 🎉💕`,
      icsSummary: (vibe) => `${vibe} — It's a date!`,
      icsDescription: (vibe) => `It's official: ${vibe}. See you there!`,
      cardHeading: "IT'S A DATE!",
      cardFooter: "Generated with love (and a bit of code).",
      shareTitle: "It's a date!",
      copiedLabel: "Copied!",
      copyFailedLabel: "Copy failed",
    },
    fr: {
      metaTitle: "Veux-tu sortir avec moi ?",
      langAria: "Changer de langue",
      eggBannerText: "🥚 Mode secret débloqué !",
      ariaSound: "Réglages musique et son",
      soundVolumeLabel: "Volume de la musique",
      muteLabel: "Muet",
      unmuteLabel: "Réactiver",
      ariaTheme: "Basculer le mode sombre",
      cornerA: "PIÈCE A",
      cornerB: "PIÈCE B",
      cornerC: "PIÈCE C",
      badgeAsk: "une question très importante",
      badgeDetails: "on officialise",
      badgeConfirm: "confirmation débloquée",
      askTitle: "Veux-tu sortir avec moi ?",
      askLede: "Je promets peu de pression, beaucoup de charme, et au moins un encas suspicieusement bon. Le bouton « Non » a reçu l'ordre formel de ne pas coopérer.",
      yesLabel: "Oui",
      attemptsLabel: "Tentatives de fuite :",
      detailsTitle: "Choisis les détails",
      detailsLede: "Tu choisis l'heure et l'ambiance. Je viendrai avec enthousiasme et d'excellentes intentions.",
      fieldDate: "La date",
      fieldTime: "L'heure",
      ariaTimePicker: "Choisir l'heure à la souris",
      hourLabel: "Heure",
      minuteLabel: "Minute",
      timePickerDone: "OK",
      vibeHeading: "L'ambiance",
      vibeHelp: "Choisis celle qui te semble délicieusement dangereuse.",
      vibePizzaTitle: "Soirée Pizza",
      vibePizzaSub: "Fromage, confort, jamais compliqué.",
      vibeSushiTitle: "Sushi Date",
      vibeSushiSub: "Bouchées élégantes et manières de table irréprochables.",
      vibeMovieTitle: "Soirée Ciné",
      vibeMovieSub: "Popcorn, rebondissements, et main dans la main potentiel.",
      vibeCafeTitle: "Café Cosy",
      vibeCafeSub: "Boissons mignonnes, bonnes discussions, ambiance douce.",
      vibeAdventureTitle: "Journée Aventure",
      vibeAdventureSub: "Un peu spontané, un peu chaotique, beaucoup de fun.",
      vibeIcecreamTitle: "Balade Glace",
      vibeIcecreamSub: "Douceurs sucrées et balade dans une excellente ambiance.",
      placeHeading: "L'endroit",
      placeHelp: "Choisis un point sur la carte (totalement facultatif, juste pour le fun).",
      placeUsual: "Notre coin habituel",
      placeNew: "Quelque part de nouveau",
      placeFavcafe: "Son café préféré",
      placeDowntown: "Centre-ville",
      placeWater: "Près de l'eau",
      placeSurprise: "Surprends-moi",
      excitementHeading: "T'es excitée à quel point ? (sois honnête, je le saurai)",
      confirmButtonLabel: "C'est un rendez-vous ! 💕",
      confirmTitle: "C'est officiel !",
      ticketDate: "Date",
      ticketTime: "Heure",
      ticketVibe: "Ambiance",
      ticketPlace: "Lieu",
      ticketExcitement: "Enthousiasme",
      countdownHeading: "Compte à rebours avant le grand jour",
      countdownDays: "Jrs",
      countdownHours: "Hrs",
      countdownMinutes: "Min",
      countdownSeconds: "Sec",
      tinyNote: "Psst — essaie le code Konami (↑ ↑ ↓ ↓ ← → ← → B A) pour une surprise bonus.",
      calendarBtn: "Ajouter au calendrier",
      downloadBtn: "Télécharger la carte",
      shareBtn: "Partager la nouvelle",
      resetBtn: "Recommencer / Réinitialiser",

      reasons: [
        "9 dentistes sur 10 recommandent de dire oui",
        "attention : engagement extrêmement faible, plaisir extrêmement élevé",
        "des études montrent que la pizza a meilleur goût en rendez-vous",
        "offre à durée limitée — ce sourire ne durera pas éternellement",
        "conditions générales : aucune, juste de la bonne ambiance",
        "le bouton oui est nettement moins fatigué que le bouton non",
        "rebondissement : il n'y a pas de mauvaise réponse (oui reste plus correct)",
        "effets secondaires du oui : des papillons dans le ventre",
      ],
      noPhrases: [
        "Non",
        "T'es sûre ?",
        "Vraiment sûre ?",
        "Réfléchis encore !",
        "Dernière chance !",
        "Attends, non !",
        "Tu peux pas me cliquer !",
        "C'est truqué !",
        "J'ai des droits !",
      ],
      noSurrendered: "Bon d'accord... Oui 😮‍💨",
      excitement: [
        { face: "😐", label: "Poliment intriguée" },
        { face: "🙂", label: "Prudemment optimiste" },
        { face: "😄", label: "Vraiment excitée" },
        { face: "🤩", label: "Je n'arrête pas de sourire" },
        { face: "🥳", label: "Je choisis déjà ma tenue" },
      ],
      vibes: {
        pizza: { title: "Soirée Pizza" },
        sushi: { title: "Sushi Date" },
        movie: { title: "Soirée Ciné" },
        cafe: { title: "Café Cosy" },
        adventure: { title: "Journée Aventure" },
        icecream: { title: "Balade Glace" },
      },
      places: {
        usual: "Notre coin habituel",
        new: "Quelque part de nouveau",
        favcafe: "Son café préféré",
        downtown: "Centre-ville",
        water: "Près de l'eau",
        surprise: "Surprends-moi",
      },
      vibeMysteryFallback: "un mystère très mignon",
      dateMysteryFallback: "le jour que tu choisiras",
      timeMysteryFallback: "l'heure que tu choisiras",
      confirmMessage: (date, time, vibe, place) =>
        `C'est officiel ! On se voit le ${date} à ${time} pour ${vibe}${place ? ` à ${place}` : ""} ! Je suis déjà à fond 🎉💕`,
      icsSummary: (vibe) => `${vibe} — C'est un rendez-vous !`,
      icsDescription: (vibe) => `C'est officiel : ${vibe}. À très vite !`,
      cardHeading: "C'EST UN RENDEZ-VOUS !",
      cardFooter: "Généré avec amour (et un peu de code).",
      shareTitle: "C'est un rendez-vous !",
      copiedLabel: "Copié !",
      copyFailedLabel: "Échec de la copie",
    },
  };

  const yesButton = document.getElementById("yesButton");
  const noButton = document.getElementById("noButton");
  const noButtonHome = noButton.parentElement;
  const attemptCount = document.getElementById("attemptCount");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");
  const timePickerBtn = document.getElementById("timePickerBtn");
  const timePickerPanel = document.getElementById("timePickerPanel");
  const hourSlider = document.getElementById("hourSlider");
  const minuteSlider = document.getElementById("minuteSlider");
  const hourValue = document.getElementById("hourValue");
  const minuteValue = document.getElementById("minuteValue");
  const timePickerDone = document.getElementById("timePickerDone");
  const vibeGrid = document.getElementById("vibeGrid");
  const placePins = document.getElementById("placePins");
  const worldMapSvg = document.getElementById("worldMapSvg");
  const meterSlider = document.getElementById("meterSlider");
  const meterFace = document.getElementById("meterFace");
  const meterLabel = document.getElementById("meterLabel");
  const confirmButton = document.getElementById("confirmButton");
  const resetButton = document.getElementById("resetButton");
  const confirmMessage = document.getElementById("confirmMessage");
  const summaryDate = document.getElementById("summaryDate");
  const summaryTime = document.getElementById("summaryTime");
  const summaryVibe = document.getElementById("summaryVibe");
  const summaryPlace = document.getElementById("summaryPlace");
  const placeRow = document.getElementById("placeRow");
  const summaryExcitement = document.getElementById("summaryExcitement");
  const ambientLayer = document.getElementById("ambient-layer");
  const celebrationLayer = document.getElementById("celebration-layer");
  const eggLayer = document.getElementById("egg-layer");
  const eggBanner = document.getElementById("eggBanner");
  const tickerTrack = document.getElementById("tickerTrack");
  const soundToggle = document.getElementById("soundToggle");
  const soundPanel = document.getElementById("soundPanel");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeValue = document.getElementById("volumeValue");
  const muteButton = document.getElementById("muteButton");
  const bgMusic = document.getElementById("bgMusic");
  const themeToggle = document.getElementById("themeToggle");
  const langToggle = document.getElementById("langToggle");
  const calendarButton = document.getElementById("calendarButton");
  const downloadButton = document.getElementById("downloadButton");
  const shareButton = document.getElementById("shareButton");
  const cardCanvas = document.getElementById("cardCanvas");
  const cdDays = document.getElementById("cdDays");
  const cdHours = document.getElementById("cdHours");
  const cdMinutes = document.getElementById("cdMinutes");
  const cdSeconds = document.getElementById("cdSeconds");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = loadState();
  let currentPage = "ask";
  let locale = localStorage.getItem("date-ask-lang") === "fr" ? "fr" : "en";
  let noLimit = state.noLimit ?? randomInt(5, 8);
  let noAttempts = state.noAttempts ?? 0;
  let noIsSurrendered = state.noIsSurrendered ?? false;
  let noFixed = false;
  let lastNoAttemptAt = 0;
  let isDodging = false;
  let countdownTimer = null;
  let muted = localStorage.getItem("date-ask-muted") === "1";
  const storedVolume = localStorage.getItem("date-ask-volume");
  let masterVolume = storedVolume === null ? 35 : clampVolume(Number(storedVolume));
  let audioCtx = null;
  let masterGain = null;

  state.noLimit = noLimit;
  if (!state.date) {
    state.date = todayDateString();
  }
  if (state.excitement === undefined) {
    state.excitement = 2;
  }

  initTheme();
  initSound();
  initMusic();
  hydrateInputs();
  hydrateVibes();
  hydratePlaces();
  loadWorldMap();
  applyLocale();
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

  timePickerBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (timePickerPanel.classList.contains("open")) {
      closeTimePicker();
    } else {
      openTimePicker();
    }
  });

  timePickerPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  hourSlider.addEventListener("input", () => {
    hourValue.textContent = String(hourSlider.value).padStart(2, "0");
    commitPickerTime();
  });

  minuteSlider.addEventListener("input", () => {
    minuteValue.textContent = String(minuteSlider.value).padStart(2, "0");
    commitPickerTime();
  });

  timePickerDone.addEventListener("click", () => {
    // commit whatever the sliders currently show — without this, a visitor
    // who's happy with the default hour/minute and never drags a slider
    // would close the panel with timeInput still empty and no way to
    // ever enable the confirm button.
    commitPickerTime();
    closeTimePicker();
  });

  vibeGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".vibe-card");
    if (!card) return;
    selectVibe(card.dataset.vibe);
    playTone(500, 0.08, "square", 0.07);
  });

  placePins.addEventListener("click", (event) => {
    const pin = event.target.closest(".place-pin");
    if (!pin) return;
    selectPlace(pin.dataset.place);
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

  soundToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    if (soundPanel.classList.contains("open")) {
      closeSoundPanel();
    } else {
      openSoundPanel();
    }
  });

  soundPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    closeSoundPanel();
    closeTimePicker();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSoundPanel();
      closeTimePicker();
    }
  });

  volumeSlider.addEventListener("input", () => {
    masterVolume = clampVolume(Number(volumeSlider.value));
    localStorage.setItem("date-ask-volume", String(masterVolume));
    if (masterVolume > 0 && muted) {
      muted = false;
      localStorage.setItem("date-ask-muted", "0");
      updateMuteButton();
    }
    updateSoundIcon();
    applyVolumeToGraph();
    applyMusicVolume();
  });

  muteButton.addEventListener("click", () => {
    muted = !muted;
    localStorage.setItem("date-ask-muted", muted ? "1" : "0");
    updateMuteButton();
    updateSoundIcon();
    applyVolumeToGraph();
    applyMusicVolume();
    if (!muted) playTone(560, 0.08, "sine", 0.08);
  });

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
    playTone(480, 0.06, "triangle", 0.06);
  });

  langToggle.addEventListener("click", () => {
    locale = locale === "en" ? "fr" : "en";
    localStorage.setItem("date-ask-lang", locale);
    applyLocale();
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

  // ---------- i18n helpers ----------
  function t(key) {
    return translations[locale][key];
  }

  function vibeTitle(slug) {
    const vibes = t("vibes");
    return (vibes && vibes[slug] && vibes[slug].title) || slug;
  }

  function placeName(slug) {
    const places = t("places");
    return (places && places[slug]) || slug;
  }

  function applyLocale() {
    document.documentElement.lang = locale;
    document.title = t("metaTitle");
    langToggle.textContent = locale === "en" ? "FR" : "EN";
    langToggle.setAttribute("aria-label", t("langAria"));
    langToggle.title = t("langAria");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = t(el.dataset.i18n);
      if (typeof value === "string") el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-label]").forEach((el) => {
      const value = t(el.dataset.i18nLabel);
      if (typeof value === "string") {
        el.setAttribute("aria-label", value);
        el.setAttribute("title", value);
      }
    });

    buildTicker();
    updateMuteButton();
    hydrateNoButton();
    hydrateMeter();
    if (currentPage === "confirm") renderSummary();
  }

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
      themeToggle.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-sun"></use></svg>';
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeToggle.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-moon"></use></svg>';
    }
    localStorage.setItem("date-ask-theme", mode);
  }

  function initSound() {
    volumeSlider.value = String(masterVolume);
    updateSoundIcon();
    updateMuteButton();
  }

  function clampVolume(value) {
    if (!Number.isFinite(value)) return 35;
    return Math.min(100, Math.max(0, Math.round(value)));
  }

  function currentVolumeLevel() {
    return muted ? 0 : masterVolume / 100;
  }

  function updateSoundIcon() {
    volumeValue.textContent = `${masterVolume}%`;
    let iconId = "icon-speaker-high";
    if (muted || masterVolume === 0) {
      iconId = "icon-speaker-mute";
    } else if (masterVolume < 50) {
      iconId = "icon-speaker-low";
    }
    soundToggle.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${iconId}"></use></svg>`;
  }

  function updateMuteButton() {
    muteButton.textContent = muted ? t("unmuteLabel") : t("muteLabel");
    muteButton.classList.toggle("is-muted", muted);
  }

  function applyVolumeToGraph() {
    if (masterGain && audioCtx) {
      masterGain.gain.setTargetAtTime(currentVolumeLevel(), audioCtx.currentTime, 0.05);
    }
  }

  function openSoundPanel() {
    soundPanel.classList.add("open");
    soundToggle.setAttribute("aria-expanded", "true");
  }

  function closeSoundPanel() {
    soundPanel.classList.remove("open");
    soundToggle.setAttribute("aria-expanded", "false");
  }

  function openTimePicker() {
    const [h, m] = (timeInput.value || "19:00").split(":").map(Number);
    hourSlider.value = String(Number.isFinite(h) ? h : 19);
    minuteSlider.value = String(Number.isFinite(m) ? m : 0);
    hourValue.textContent = String(hourSlider.value).padStart(2, "0");
    minuteValue.textContent = String(minuteSlider.value).padStart(2, "0");
    timePickerPanel.classList.add("open");
    timePickerBtn.setAttribute("aria-expanded", "true");
  }

  function closeTimePicker() {
    timePickerPanel.classList.remove("open");
    timePickerBtn.setAttribute("aria-expanded", "false");
  }

  function commitPickerTime() {
    const h = String(hourSlider.value).padStart(2, "0");
    const m = String(minuteSlider.value).padStart(2, "0");
    timeInput.value = `${h}:${m}`;
    timeInput.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // ---------- ticker ----------
  function buildTicker() {
    const reasons = t("reasons");
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

  function hydratePlaces() {
    const pins = [...placePins.querySelectorAll(".place-pin")];
    pins.forEach((pin) => {
      const selected = pin.dataset.place === state.place;
      pin.classList.toggle("selected", selected);
      pin.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  // fetched (not inlined in index.html) so the ~380KB path data doesn't
  // bloat the main document — injecting the markup into a real DOM node
  // (rather than an <img>) is what lets styles.css theme it via the
  // .continent class and currentColor/var(--panel) below.
  function loadWorldMap() {
    fetch("world-map.svg")
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error("map fetch failed"))))
      .then((svgMarkup) => {
        worldMapSvg.innerHTML = svgMarkup;
      })
      .catch(() => {});
  }

  function hydrateMeter() {
    const levels = t("excitement");
    const level = levels[state.excitement] || levels[2];
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

  function selectPlace(place) {
    state.place = place;
    hydratePlaces();
    persistState();
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

    if (nextPage !== "ask") {
      parkNoButton();
    }

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
    const vibe = state.vibe ? vibeTitle(state.vibe) : t("vibeMysteryFallback");
    const place = state.place ? placeName(state.place) : "";
    const levels = t("excitement");
    const level = levels[state.excitement] || levels[2];

    summaryDate.textContent = formattedDate;
    summaryTime.textContent = formattedTime;
    summaryVibe.textContent = vibe;
    summaryPlace.textContent = place || "—";
    placeRow.classList.toggle("is-empty", !place);
    summaryExcitement.textContent = `${level.face} ${level.label}`;
    confirmMessage.textContent = t("confirmMessage")(formattedDate, formattedTime, vibe, place);
  }

  function intlLocale() {
    return locale === "fr" ? "fr-FR" : "en-US";
  }

  function formatDate(value) {
    if (!value) return t("dateMysteryFallback");
    const parsed = new Date(`${value}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat(intlLocale(), {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }).format(parsed);
  }

  function formatTime(value) {
    if (!value) return t("timeMysteryFallback");
    const [hour, minute] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return new Intl.DateTimeFormat(intlLocale(), { hour: "numeric", minute: "2-digit" }).format(date);
  }

  // ---------- no button chaos ----------
  function hydrateNoButton() {
    if (noIsSurrendered) {
      surrenderNoButton(true);
    } else {
      const phrases = t("noPhrases");
      attemptCount.textContent = String(noAttempts);
      noButton.textContent = phrases[Math.min(noAttempts, phrases.length - 1)];
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
    const phrases = t("noPhrases");
    attemptCount.textContent = String(noAttempts);
    noButton.textContent = phrases[Math.min(noAttempts, phrases.length - 1)];
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
      // .page slides/scales in with a CSS transform, and a transform on
      // any ancestor makes it the containing block for position:fixed
      // descendants (per spec) — so left/top computed against
      // window.innerWidth/innerHeight would land relative to .page
      // instead of the real viewport. Move the button up to <body> so
      // "fixed" actually means fixed to the screen.
      document.body.appendChild(noButton);
      noButton.style.position = "fixed";
      noButton.style.zIndex = "20";
      noButton.style.margin = "0";
      noButton.style.whiteSpace = "nowrap";
      // the mobile layout forces .btn-secondary to width:100%; override
      // it so the dodging button stays a small pill instead of a bar.
      noButton.style.width = "max-content";
      noButton.style.maxWidth = "calc(100vw - 48px)";
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

    noButton.textContent = t("noSurrendered");
    noButton.classList.add("surrendered", "pulse");
    parkNoButton();
  }

  // undoes the position:fixed "escape" (reparented to <body> so it can
  // dodge the cursor freely) and puts the button back in its normal
  // flow slot. Needed whenever we navigate away from the ask page too —
  // otherwise a mid-dodge button stays stuck on top of later pages,
  // since it no longer lives inside #page-ask once it has escaped.
  function parkNoButton() {
    if (!noFixed) return;
    noButtonHome.appendChild(noButton);
    noButton.style.position = "";
    noButton.style.left = "";
    noButton.style.top = "";
    noButton.style.transform = "";
    noButton.style.width = "";
    noButton.style.maxWidth = "";
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
    const vibe = state.vibe ? vibeTitle(state.vibe) : "Our Date";

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//date-ask//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@date-ask`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${icsEscape(t("icsSummary")(vibe))}`,
      `DESCRIPTION:${icsEscape(t("icsDescription")(vibe))}`,
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
    const levels = t("excitement");
    const level = levels[state.excitement] || levels[2];

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
    ctx.font = "900 44px Arial, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(t("cardHeading"), 50, 72);

    ctx.fillStyle = "#111111";
    ctx.font = "700 32px Arial, sans-serif";
    const formattedDate = formatDate(state.date);
    const formattedTime = formatTime(state.time);
    const vibe = state.vibe ? vibeTitle(state.vibe) : t("vibeMysteryFallback");
    const place = state.place ? placeName(state.place) : "";

    wrapText(ctx, `📅  ${formattedDate}`, 50, 200, w - 100, 40);
    ctx.fillText(`🕒  ${formattedTime}`, 50, 260);
    ctx.fillText(`💖  ${vibe}`, 50, 320);
    if (place) ctx.fillText(`📍  ${place}`, 50, 380);
    ctx.fillText(`${level.face}  ${level.label}`, 50, place ? 440 : 380);

    ctx.font = "italic 22px Arial, sans-serif";
    ctx.fillStyle = "#55504a";
    ctx.fillText(t("cardFooter"), 50, h - 55);

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
        await navigator.share({ title: t("shareTitle"), text });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      flashLabel(shareButton, t("copiedLabel"));
    } catch {
      flashLabel(shareButton, t("copyFailedLabel"));
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
      masterGain = audioCtx.createGain();
      masterGain.gain.value = currentVolumeLevel();
      masterGain.connect(audioCtx.destination);
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
      osc.connect(gain).connect(masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {}
  }

  function playSuccessChime() {
    playTone(660, 0.14, "sine", 0.12);
    window.setTimeout(() => playTone(880, 0.16, "sine", 0.12), 120);
    window.setTimeout(() => playTone(990, 0.22, "sine", 0.12), 260);
  }

  // ---------- background music ----------
  function applyMusicVolume() {
    bgMusic.volume = currentVolumeLevel();
    // .volume is ignored on some mobile browsers (notably iOS Safari),
    // so muted is set too as a fallback that those platforms do honor.
    bgMusic.muted = muted;
  }

  function attemptPlayMusic() {
    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  function initMusic() {
    applyMusicVolume();
    // most browsers block audio until the visitor interacts with the
    // page at least once — try now, then unlock on the first interaction.
    attemptPlayMusic();
    const unlock = () => {
      attemptPlayMusic();
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("touchstart", unlock);
    };
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
  }
})();
