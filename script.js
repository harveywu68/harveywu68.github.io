const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebarFab = document.querySelector(".sidebar-fab");
const isMobile = () => window.matchMedia("(max-width: 860px)").matches;
const LIFE_TARGET_KEY = "lifeTargetSection";

const toggleSidebar = () => {
  if (isMobile()) {
    document.body.classList.toggle("sidebar-visible-mobile");
    return;
  }
  document.body.classList.toggle("sidebar-hidden");
};

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", toggleSidebar);
}

if (sidebarFab) {
  sidebarFab.addEventListener("click", toggleSidebar);
}

const lifePreviewLinks = [...document.querySelectorAll("[data-life-target]")];
lifePreviewLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("data-life-target");
    if (!targetId) {
      return;
    }
    try {
      sessionStorage.setItem(LIFE_TARGET_KEY, targetId);
    } catch (_error) {
      // Ignore storage errors in strict/private browser modes.
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const navLinks = [...document.querySelectorAll('.side-link[href^="#"]')];
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (isMobile()) {
      document.body.classList.remove("sidebar-visible-mobile");
    }
    const hash = link.getAttribute("href");
    if (!hash || !hash.startsWith("#")) {
      return;
    }

    const targetId = hash.slice(1);
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    if (isLifePage) {
      armInitialLifeTarget(targetId, 1800);
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setActiveById(targetId);
  });
});

const sectionIds = navLinks
  .map((link) => link.getAttribute("href"))
  .filter(Boolean)
  .map((hash) => hash.slice(1));
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter((section) => section !== null);

function setActiveById(id) {
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", active);
  });
}

function scrollToSectionWithOffset(id, behavior = "smooth") {
  const target = document.getElementById(id);
  if (!target) {
    return false;
  }
  const top = target.getBoundingClientRect().top + window.scrollY - 18;
  window.scrollTo({ top, behavior });
  return true;
}

function clearHashFromUrl() {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

let initialLifeTargetId = null;
let initialLifeTargetDeadline = 0;

function armInitialLifeTarget(id, durationMs = 5000) {
  if (!id) {
    return;
  }
  initialLifeTargetId = id;
  initialLifeTargetDeadline = Date.now() + durationMs;
}

function disarmInitialLifeTarget() {
  initialLifeTargetId = null;
  initialLifeTargetDeadline = 0;
}

function syncInitialLifeTarget(behavior = "auto") {
  if (!initialLifeTargetId) {
    return;
  }
  if (Date.now() > initialLifeTargetDeadline) {
    disarmInitialLifeTarget();
    return;
  }
  if (scrollToSectionWithOffset(initialLifeTargetId, behavior)) {
    setActiveById(initialLifeTargetId);
  }
  clearHashFromUrl();
}

const isLifePage = /(^|\/)life\.html$/i.test(window.location.pathname);
if (isLifePage) {
  let pendingTarget = null;
  try {
    pendingTarget = sessionStorage.getItem(LIFE_TARGET_KEY);
    sessionStorage.removeItem(LIFE_TARGET_KEY);
  } catch (_error) {
    pendingTarget = null;
  }

  const hashTarget = window.location.hash ? window.location.hash.slice(1) : null;
  const initialTarget = pendingTarget || hashTarget;
  if (initialTarget) {
    armInitialLifeTarget(initialTarget, 5500);
    // Scroll once after DOM is ready, then keep aligning briefly while images/layout settle.
    requestAnimationFrame(() => {
      syncInitialLifeTarget("auto");
    });
    window.addEventListener("load", () => {
      syncInitialLifeTarget("auto");
      setTimeout(() => syncInitialLifeTarget("auto"), 220);
      setTimeout(() => syncInitialLifeTarget("auto"), 650);
      setTimeout(() => {
        syncInitialLifeTarget("smooth");
        disarmInitialLifeTarget();
      }, 1200);
    });
  }
}

if (window.location.hash) {
  setActiveById(window.location.hash.slice(1));
} else if (sections.length > 0) {
  const firstId = sections[0].getAttribute("id");
  if (firstId) {
    setActiveById(firstId);
  }
}

if (sections.length > 0 && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const id = entry.target.getAttribute("id");
        if (id) {
          setActiveById(id);
        }
      });
    },
    {
      rootMargin: "-35% 0px -50% 0px",
      threshold: 0.01
    }
  );
  sections.forEach((section) => sectionObserver.observe(section));
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const galleryButtons = document.querySelectorAll(".gallery-open");
const galleryImages = [...document.querySelectorAll(".gallery-open img")];
let lightboxOrderedButtons = [];
let lightboxCurrentIndex = -1;
let lightboxEndHintTimer = null;
let touchStartX = null;
let touchStartY = null;

function optimizeGalleryImageLoading() {
  if (galleryImages.length === 0) {
    return;
  }

  const eagerImages = new Set();
  if (isLifePage && initialLifeTargetId) {
    const targetOrder = ["hiking", "photo", "concert"];
    const targetIndex = targetOrder.indexOf(initialLifeTargetId);
    if (targetIndex >= 0) {
      targetOrder.slice(0, targetIndex + 1).forEach((id) => {
        document.querySelectorAll(`#${id} img`).forEach((img) => eagerImages.add(img));
      });
    }
  }

  const eagerCount = eagerImages.size > 0 ? 0 : 3;
  galleryImages.forEach((img, index) => {
    const isEager = eagerImages.has(img) || index < eagerCount;
    img.loading = isEager ? "eager" : "lazy";
    img.decoding = "async";
    if ("fetchPriority" in img) {
      img.fetchPriority = isEager ? "high" : "low";
    }
  });
}

optimizeGalleryImageLoading();

const closeLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxCaption) {
    return;
  }
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  document.body.style.overflow = "";
  lightboxOrderedButtons = [];
  lightboxCurrentIndex = -1;
  const hint = lightbox.querySelector(".lightbox-end-hint");
  if (hint) {
    hint.classList.remove("is-visible");
  }
  if (lightboxEndHintTimer) {
    clearTimeout(lightboxEndHintTimer);
    lightboxEndHintTimer = null;
  }
};

function getLightboxEndHintText() {
  const lang = (document.documentElement.lang || "").toLowerCase();
  if (lang.startsWith("zh")) {
    return "到底啦，看看其他内容吧 🫶 ～";
  }
  return "You've reached the end. Explore more on the page ~";
}

function showLightboxEndHint() {
  if (!lightbox) {
    return;
  }
  const figure = lightbox.querySelector(".lightbox-figure");
  if (!figure) {
    return;
  }
  let hint = figure.querySelector(".lightbox-end-hint");
  if (!hint) {
    hint = document.createElement("div");
    hint.className = "lightbox-end-hint";
    figure.appendChild(hint);
  }
  hint.textContent = getLightboxEndHintText();
  hint.classList.add("is-visible");
  if (lightboxEndHintTimer) {
    clearTimeout(lightboxEndHintTimer);
  }
  lightboxEndHintTimer = setTimeout(() => {
    hint.classList.remove("is-visible");
    lightboxEndHintTimer = null;
  }, 1600);
}

function getButtonVisualOrder(buttons) {
  const positioned = buttons.map((button) => {
    const rect = button.getBoundingClientRect();
    return {
      button,
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  });

  // Treat near-equal tops as same row to preserve left-to-right reading order.
  const rowTolerance = 8;
  positioned.sort((a, b) => {
    const topDiff = a.top - b.top;
    if (Math.abs(topDiff) > rowTolerance) {
      return topDiff;
    }
    return a.left - b.left;
  });

  return positioned.map((item) => item.button);
}

function getGalleryButtonsFrom(button) {
  const container = button.closest(".life-gallery, .concert-gallery");
  if (!container) {
    return [button];
  }
  const buttons = [...container.querySelectorAll(".gallery-open")].filter((item) =>
    item.getAttribute("data-lightbox-src")
  );
  return getButtonVisualOrder(buttons);
}

function renderLightboxFromButton(button) {
  if (!lightbox || !lightboxImage || !lightboxCaption) {
    return;
  }
  const src = button.getAttribute("data-lightbox-src");
  const alt = button.getAttribute("data-lightbox-alt") || "";
  const caption = button.closest(".gallery-card")?.querySelector("figcaption")?.textContent || "";
  if (!src) {
    return;
  }
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = caption;
}

function openLightboxAt(button) {
  lightboxOrderedButtons = getGalleryButtonsFrom(button);
  lightboxCurrentIndex = lightboxOrderedButtons.indexOf(button);
  if (lightboxCurrentIndex < 0) {
    lightboxOrderedButtons = [button];
    lightboxCurrentIndex = 0;
  }
  renderLightboxFromButton(lightboxOrderedButtons[lightboxCurrentIndex]);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function stepLightbox(offset) {
  if (!lightbox.classList.contains("is-open") || lightboxOrderedButtons.length === 0) {
    return;
  }
  const total = lightboxOrderedButtons.length;
  const nextIndex = lightboxCurrentIndex + offset;
  if (nextIndex >= total) {
    showLightboxEndHint();
    return;
  }
  if (nextIndex < 0) {
    return;
  }
  lightboxCurrentIndex = nextIndex;
  renderLightboxFromButton(lightboxOrderedButtons[nextIndex]);
}

if (lightbox && lightboxImage && lightboxCaption) {
  let lightboxPrev = lightbox.querySelector(".lightbox-nav.prev");
  let lightboxNext = lightbox.querySelector(".lightbox-nav.next");
  if (!lightboxPrev || !lightboxNext) {
    lightboxPrev = document.createElement("button");
    lightboxPrev.type = "button";
    lightboxPrev.className = "lightbox-nav prev";
    lightboxPrev.setAttribute("aria-label", "Previous image");
    lightboxPrev.textContent = "‹";

    lightboxNext = document.createElement("button");
    lightboxNext.type = "button";
    lightboxNext.className = "lightbox-nav next";
    lightboxNext.setAttribute("aria-label", "Next image");
    lightboxNext.textContent = "›";

    lightbox.appendChild(lightboxPrev);
    lightbox.appendChild(lightboxNext);
  }

  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openLightboxAt(button);
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }
  lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  lightboxNext.addEventListener("click", () => stepLightbox(1));

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }
    if (event.key === "ArrowLeft") {
      stepLightbox(-1);
      return;
    }
    if (event.key === "ArrowRight") {
      stepLightbox(1);
    }
  });

  lightbox.addEventListener(
    "touchstart",
    (event) => {
      if (!lightbox.classList.contains("is-open")) {
        return;
      }
      const touch = event.touches && event.touches[0];
      if (!touch) {
        return;
      }
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    (event) => {
      if (!lightbox.classList.contains("is-open") || touchStartX === null || touchStartY === null) {
        return;
      }
      const touch = event.changedTouches && event.changedTouches[0];
      if (!touch) {
        touchStartX = null;
        touchStartY = null;
        return;
      }

      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      touchStartX = null;
      touchStartY = null;

      // Horizontal swipe only: avoid triggering on vertical scroll gestures.
      if (absX < 36 || absX < absY * 1.25) {
        return;
      }

      if (deltaX < 0) {
        stepLightbox(1);
      } else {
        stepLightbox(-1);
      }
    },
    { passive: true }
  );
}

const concertGalleries = [...document.querySelectorAll(".concert-gallery")];
const concertGroups = [...document.querySelectorAll(".concert-group")];
const collapsedConcertHeight = 520;
const concertToggleTextMap = {
  en: {
    collapsed: "Show more",
    expanded: "Show less"
  },
  zh: {
    collapsed: "显示更多",
    expanded: "收起"
  }
};

function getConcertToggleText() {
  const lang = (document.documentElement.lang || "").toLowerCase();
  return lang.startsWith("zh") ? concertToggleTextMap.zh : concertToggleTextMap.en;
}

function setConcertToggleState(toggle, expanded) {
  const text = getConcertToggleText();
  toggle.textContent = expanded ? text.expanded : text.collapsed;
  toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
}

function refreshConcertToggleLabels() {
  concertGroups.forEach((group) => {
    const toggle = group.querySelector(".concert-toggle");
    if (!toggle || toggle.hidden) {
      return;
    }
    const expanded = group.classList.contains("is-expanded");
    setConcertToggleState(toggle, expanded);
  });
}

function ensureConcertToggle(group) {
  let toggle = group.querySelector(".concert-toggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "concert-toggle";
    setConcertToggleState(toggle, false);
    toggle.hidden = true;
    group.appendChild(toggle);
    toggle.addEventListener("click", () => {
      const gallery = group.querySelector(".concert-gallery");
      if (gallery) {
        group.style.setProperty("--concert-expanded-height", `${gallery.scrollHeight}px`);
      }
      const expanded = group.classList.toggle("is-expanded");
      setConcertToggleState(toggle, expanded);
    });
  }
  return toggle;
}

function getConcertColumns(gallery) {
  const cssColumns = parseInt(getComputedStyle(gallery).getPropertyValue("--concert-columns"), 10);
  if (Number.isFinite(cssColumns) && cssColumns > 0) {
    return cssColumns;
  }
  return 1;
}

function getEstimatedCardHeight(card, columnWidth) {
  const image = card.querySelector("img");
  if (!image || !image.naturalWidth || !image.naturalHeight) {
    return columnWidth * 1.2;
  }
  const ratio = image.naturalHeight / image.naturalWidth;
  return columnWidth * ratio + 8;
}

function getBestStartIndex(heightTracker, columns, span) {
  let bestStart = 0;
  let bestTop = Number.POSITIVE_INFINITY;

  for (let start = 0; start <= columns - span; start += 1) {
    const top = Math.max(...heightTracker.slice(start, start + span));
    if (top < bestTop) {
      bestTop = top;
      bestStart = start;
    }
  }

  return bestStart;
}

function layoutConcertMasonry(gallery) {
  const cards = [...gallery.querySelectorAll(":scope > .gallery-card")];
  if (cards.length === 0) {
    return;
  }

  const columns = getConcertColumns(gallery);
  const mobileNarrow = window.matchMedia("(max-width: 640px)").matches;
  const mobile = window.matchMedia("(max-width: 860px)").matches;
  const gap = mobileNarrow ? 2 : mobile ? 4 : 6;
  const columnWidth = (gallery.clientWidth - gap * (columns - 1)) / columns;
  if (columnWidth <= 0) {
    return;
  }

  gallery.style.position = "relative";
  const heightTracker = Array.from({ length: columns }, () => 0);
  const groupedStartMap = new Map();

  cards.forEach((card) => {
    const spanRaw = Number.parseInt(card.dataset.columnSpan || "", 10);
    const span = Number.isInteger(spanRaw) ? Math.max(1, Math.min(columns, spanRaw)) : 1;
    const lockIndex = Number.parseInt(card.dataset.columnLock || "", 10);
    const groupKey = card.dataset.columnGroup;

    let start = null;
    if (Number.isInteger(lockIndex)) {
      start = Math.max(0, Math.min(columns - span, lockIndex));
    } else if (groupKey && Number.isInteger(groupedStartMap.get(groupKey))) {
      start = groupedStartMap.get(groupKey);
    } else {
      start = getBestStartIndex(heightTracker, columns, span);
      if (groupKey) {
        groupedStartMap.set(groupKey, start);
      }
    }

    const top = Math.max(...heightTracker.slice(start, start + span));
    const width = columnWidth * span + gap * (span - 1);
    const left = start * (columnWidth + gap);

    card.style.position = "absolute";
    card.style.width = `${width}px`;
    card.style.margin = "0";
    card.style.transform = `translate(${left}px, ${top}px)`;

    const measuredHeight = card.getBoundingClientRect().height;
    const cardHeight = measuredHeight > 1 ? measuredHeight : getEstimatedCardHeight(card, width);
    const nextHeight = top + cardHeight + gap;
    for (let i = start; i < start + span; i += 1) {
      heightTracker[i] = nextHeight;
    }
  });

  const contentHeight = Math.max(0, Math.max(...heightTracker) - gap);
  gallery.style.height = `${contentHeight}px`;
}

function updateConcertCollapsibleState() {
  concertGroups.forEach((group) => {
    const gallery = group.querySelector(".concert-gallery");
    if (!gallery) {
      return;
    }

    const toggle = ensureConcertToggle(group);
    const fullHeight = gallery.scrollHeight;
    group.style.setProperty("--concert-expanded-height", `${fullHeight}px`);

    if (fullHeight > collapsedConcertHeight + 8) {
      group.classList.add("is-collapsible");
      toggle.hidden = false;
      const expanded = group.classList.contains("is-expanded");
      setConcertToggleState(toggle, expanded);
      return;
    }

    group.classList.remove("is-collapsible");
    group.classList.remove("is-expanded");
    group.style.removeProperty("--concert-expanded-height");
    toggle.hidden = true;
    setConcertToggleState(toggle, false);
  });
}

let concertLayoutTimer = null;
function scheduleConcertLayout() {
  if (concertLayoutTimer) {
    clearTimeout(concertLayoutTimer);
  }
  concertLayoutTimer = setTimeout(() => {
    concertGalleries.forEach((gallery) => layoutConcertMasonry(gallery));
    updateConcertCollapsibleState();
    syncInitialLifeTarget("auto");
  }, 80);
}

if (concertGalleries.length > 0) {
  window.addEventListener("load", scheduleConcertLayout);
  window.addEventListener("resize", scheduleConcertLayout);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleConcertLayout);
  }

  concertGalleries.forEach((gallery) => {
    gallery.querySelectorAll("img").forEach((img) => {
      img.addEventListener("load", scheduleConcertLayout);
    });
  });

  scheduleConcertLayout();

  if ("MutationObserver" in window) {
    const langObserver = new MutationObserver(() => {
      refreshConcertToggleLabels();
    });
    langObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });
  }
}
