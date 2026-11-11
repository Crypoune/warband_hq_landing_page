// ========================================
// SCREENSHOT LIGHTBOX
// ========================================

const previewButtons = document.querySelectorAll(
  ".preview-image-button, .feature-image-button",
);

const lightbox = document.querySelector("#screenshot-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const closeButton = document.querySelector(".lightbox-close");

let lastFocusedButton = null;

function openLightbox(button) {
  const image = button.querySelector("img");
  if (!image) return;

  lastFocusedButton = button;
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  if (lastFocusedButton) lastFocusedButton.focus();
}

previewButtons.forEach((button) => {
  button.addEventListener("click", () => openLightbox(button));
});

closeButton.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("active")) return;

  if (event.key === "Escape") {
    closeLightbox();
    return;
  }

  if (event.key === "Tab") {
    const focusableElements = lightbox.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});

document.addEventListener("focusin", (event) => {
  if (
    lightbox.classList.contains("active") &&
    !lightbox.contains(event.target)
  ) {
    closeButton.focus();
  }
});

// ========================================
// LANGUAGE SWITCHER
// ========================================

const languageButton = document.querySelector(".language-switch");

function applyLanguage(language) {
  const dictionary = window.translations?.[language];
  if (!dictionary) return;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const translatedText = dictionary[key];

    if (translatedText === undefined) {
      console.warn(`Missing ${language} translation: ${key}`);
      return;
    }

    const attribute = element.dataset.i18nAttr;
    if (attribute) {
      element.setAttribute(attribute, translatedText);
    } else {
      element.textContent = translatedText;
    }
  });

  document.documentElement.lang = language;
  document.body.dataset.language = language;
  if (languageButton) {
    languageButton.dataset.currentLanguage = language;
    languageButton.setAttribute(
      "aria-label",
      dictionary["aria.change.language"],
    );
  }

  try {
    localStorage.setItem("warband-hq-language", language);
  } catch (error) {
    // The page still works when browser storage is unavailable.
  }
}

let savedLanguage = "en";
try {
  const storedLanguage = localStorage.getItem("warband-hq-language");
  if (storedLanguage === "en" || storedLanguage === "fr") {
    savedLanguage = storedLanguage;
  }
} catch (error) {
  // Keep English as the default when browser storage is unavailable.
}

applyLanguage(savedLanguage);

if (languageButton) {
  languageButton.addEventListener("click", () => {
    const currentLanguage = document.documentElement.lang;
    applyLanguage(currentLanguage === "en" ? "fr" : "en");
  });
}
