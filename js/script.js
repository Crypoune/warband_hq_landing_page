// ========================================
// SCREENSHOT LIGHTBOX
// ========================================

const previewButton = document.querySelector(".preview-image-button");
const lightbox = document.querySelector("#screenshot-lightbox");
const closeButton = document.querySelector(".lightbox-close");

function openLightbox() {
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");

  document.body.classList.add("lightbox-open");

  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");

  document.body.classList.remove("lightbox-open");

  previewButton.focus();
}

previewButton.addEventListener("click", openLightbox);

closeButton.addEventListener("click", closeLightbox);

// Close when clicking outside the image
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Close with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("active")) {
    closeLightbox();
  }
});
