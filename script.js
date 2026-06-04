(function () {
  "use strict";

  var intro = document.getElementById("intro-screen");
  var enterButton = document.getElementById("enter-button");
  var replayButton = document.getElementById("replay-intro");
  var hero = document.getElementById("hero");
  var copyButton = document.getElementById("copy-briefing");
  var copyStatus = document.getElementById("copy-status");
  var missionAudio = document.getElementById("mission-audio");
  var audioToggle = document.getElementById("audio-toggle");
  var audioToggleText = audioToggle ? audioToggle.querySelector("span") : null;
  var introKey = "operacionGoldraIntroSeen";
  var listPrefix = "operacionGoldraChecklist:";
  var audioKey = "operacionGoldraAudioEnabled";
  var accordionPrefix = "operacionGoldraAccordion:";
  var audioEnabled = storageGet(localStorage, audioKey) !== "false";

  document.documentElement.classList.add("intro-ready");

  function storageGet(storage, key) {
    try {
      return storage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function storageSet(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch (error) {
      return false;
    }
    return true;
  }

  function storageRemove(storage, key) {
    try {
      storage.removeItem(key);
    } catch (error) {
      return false;
    }
    return true;
  }

  var briefingText = [
    "OPERACIÓN GOLDRA – BRIEFING RÁPIDO",
    "",
    "Viernes:",
    "Comando Avanzadilla sale sobre las 17:00, parada en Isla Cristina y compra de suministros.",
    "Comando Extracción recoge al Sujeto raptado.",
    "Comando Primos directos a la base.",
    "Noche: BBQ, Pleno de mis santos cojones y primera noche.",
    "",
    "Sábado:",
    "Paintball a las 11:00.",
    "Comida en mercado.",
    "Tarde en la base.",
    "Noche en Faro caracterizados.",
    "",
    "Domingo:",
    "Cazuela a la lumbre, piscina y despedida parcial.",
    "Los supervivientes activan Operación Albufeira.",
    "",
    "Risto Approved."
  ].join("\n");

  function updateAudioToggle() {
    if (!audioToggle || !audioToggleText) return;
    audioToggleText.textContent = audioEnabled ? "Música: ON" : "Música: OFF";
    audioToggle.setAttribute("aria-pressed", audioEnabled ? "true" : "false");
  }

  function showAudioToggle() {
    if (!audioToggle) return;
    audioToggle.classList.add("visible");
  }

  function hideAudioToggle() {
    if (!audioToggle) return;
    audioToggle.classList.remove("visible");
  }

  function playMissionAudio() {
    if (!missionAudio || !audioEnabled) return;
    var playAttempt = missionAudio.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(function () {
        return false;
      });
    }
  }

  function pauseMissionAudio() {
    if (!missionAudio) return;
    missionAudio.pause();
  }

  function hideIntro(shouldScroll) {
    if (!intro) return;
    intro.classList.add("hidden");
    storageSet(sessionStorage, introKey, "true");
    showAudioToggle();
    if (shouldScroll && hero) {
      window.setTimeout(function () {
        hero.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 180);
    }
  }

  function showIntro() {
    if (!intro) return;
    storageRemove(sessionStorage, introKey);
    intro.classList.remove("hidden");
    hideAudioToggle();
    pauseMissionAudio();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateAudioToggle();

  if (intro && storageGet(sessionStorage, introKey) === "true") {
    intro.classList.add("hidden");
    showAudioToggle();
  }

  if (enterButton) {
    enterButton.addEventListener("click", function () {
      hideIntro(true);
      playMissionAudio();
    });
  }

  if (replayButton) {
    replayButton.addEventListener("click", showIntro);
  }

  if (audioToggle) {
    audioToggle.addEventListener("click", function () {
      audioEnabled = !audioEnabled;
      storageSet(localStorage, audioKey, audioEnabled ? "true" : "false");
      updateAudioToggle();

      if (audioEnabled) {
        playMissionAudio();
      } else {
        pauseMissionAudio();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  function setAccordionOpen(accordion, isOpen, shouldStore) {
    var trigger = accordion.querySelector(".accordion-trigger");
    var content = accordion.querySelector(".accordion-content");
    var state = accordion.querySelector(".accordion-state");
    var key = accordion.dataset.accordion;

    accordion.classList.toggle("open", isOpen);
    if (trigger) {
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (state) {
      state.textContent = isOpen ? "DOSSIER ABIERTO" : "ABRIR DOSSIER";
    }
    if (content) {
      content.style.maxHeight = isOpen ? content.scrollHeight + "px" : "0px";
    }
    if (shouldStore && key) {
      storageSet(localStorage, accordionPrefix + key, isOpen ? "open" : "closed");
    }
  }

  function openAccordionById(id, shouldScroll) {
    var accordion = document.getElementById(id);
    if (!accordion || !accordion.classList.contains("accordion")) return;
    setAccordionOpen(accordion, true, true);
    if (shouldScroll) {
      window.setTimeout(function () {
        accordion.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    }
  }

  document.querySelectorAll(".accordion").forEach(function (accordion) {
    var key = accordion.dataset.accordion;
    var savedState = key ? storageGet(localStorage, accordionPrefix + key) : null;
    var isDefaultOpen = accordion.classList.contains("open");
    var isOpen = savedState ? savedState === "open" : isDefaultOpen;
    var trigger = accordion.querySelector(".accordion-trigger");

    setAccordionOpen(accordion, isOpen, false);

    if (trigger) {
      trigger.addEventListener("click", function () {
        setAccordionOpen(accordion, !accordion.classList.contains("open"), true);
      });
    }
  });

  document.querySelectorAll("[data-open-accordion]").forEach(function (button) {
    button.addEventListener("click", function () {
      openAccordionById(button.dataset.openAccordion, true);
    });
  });

  window.addEventListener("resize", function () {
    document.querySelectorAll(".accordion.open .accordion-content").forEach(function (content) {
      content.style.maxHeight = content.scrollHeight + "px";
    });
  });

  function readChecklist(listName) {
    try {
      return JSON.parse(storageGet(localStorage, listPrefix + listName)) || {};
    } catch (error) {
      return {};
    }
  }

  function writeChecklist(listName, state) {
    storageSet(localStorage, listPrefix + listName, JSON.stringify(state));
  }

  document.querySelectorAll(".checklist").forEach(function (list) {
    var listName = list.dataset.list;
    var state = readChecklist(listName);

    list.querySelectorAll("button[data-item]").forEach(function (button) {
      var item = button.dataset.item;
      if (state[item]) {
        button.classList.add("done");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.setAttribute("aria-pressed", "false");
      }

      button.addEventListener("click", function () {
        state[item] = !state[item];
        button.classList.toggle("done", state[item]);
        button.classList.remove("pulse");
        void button.offsetWidth;
        button.classList.add("pulse");
        button.setAttribute("aria-pressed", state[item] ? "true" : "false");
        writeChecklist(listName, state);
      });
    });
  });

  function copyWithFallback(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    return new Promise(function (resolve, reject) {
      try {
        var copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        copied ? resolve() : reject(new Error("No se pudo copiar"));
      } catch (error) {
        document.body.removeChild(textarea);
        reject(error);
      }
    });
  }

  if (copyButton && copyStatus) {
    copyButton.addEventListener("click", function () {
      copyWithFallback(briefingText)
        .then(function () {
          copyStatus.textContent = "Briefing copiado. Proceda con irresponsabilidad moderada.";
        })
        .catch(function () {
          copyStatus.textContent = "No se pudo copiar automáticamente. Mantenga pulsado y copie manualmente.";
        });
    });
  }
})();
