const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebarFab = document.querySelector(".sidebar-fab");
const isMobile = () => window.matchMedia("(max-width: 860px)").matches;

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

function optimizeGalleryImageLoading() {
  if (galleryImages.length === 0) {
    return;
  }

  const eagerCount = 3;
  galleryImages.forEach((img, index) => {
    const isEager = index < eagerCount;
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
};

if (lightbox && lightboxImage && lightboxCaption) {
  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const src = button.getAttribute("data-lightbox-src");
      const alt = button.getAttribute("data-lightbox-alt") || "";
      const caption = button.closest(".gallery-card")?.querySelector("figcaption")?.textContent || "";
      if (!src) {
        return;
      }
      lightboxImage.src = src;
      lightboxImage.alt = alt;
      lightboxCaption.textContent = caption;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

const concertGalleries = [...document.querySelectorAll(".concert-gallery")];
const concertGroups = [...document.querySelectorAll(".concert-group")];
const collapsedConcertHeight = 520;
const concertToggleText = {
  collapsed: "Show more",
  expanded: "Show less"
};

function setConcertToggleState(toggle, expanded) {
  toggle.textContent = expanded ? concertToggleText.expanded : concertToggleText.collapsed;
  toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
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
  const gap = 14;
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
}
