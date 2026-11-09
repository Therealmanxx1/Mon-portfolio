// Numéro au format international, sans +, espaces ni tirets.
const WHATSAPP_NUMBER = "2250700111009";
const defaultMessage = "Bonjour, j’ai découvert votre portfolio et j’aimerais échanger avec vous.";
const whatsappUrl = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMessage)}`
  : `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`;
document.querySelectorAll("#whatsapp-link, #whatsapp-float").forEach((link) => link.href = whatsappUrl);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) {
      target.classList.add("visible");
      observer.unobserve(target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuButton.setAttribute("aria-expanded", "false");
  nav.classList.remove("open");
}));

// Les aperçus d’images restent disponibles sur cet appareil après rechargement.
document.querySelectorAll(".photo-slot input").forEach((input, index) => {
  const storageKey = `portfolio-photo-${index}`;
  const slot = input.closest(".photo-slot");
  const preview = (src) => {
    slot.style.backgroundImage = `linear-gradient(rgba(8,9,12,.14),rgba(8,9,12,.14)),url("${src}")`;
    slot.classList.add("has-image");
    slot.setAttribute("aria-label", "Capture ajoutée. Cliquer pour la remplacer.");
  };
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) preview(saved);
  } catch { /* Le portfolio reste utilisable même si le navigateur bloque le stockage. */ }
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      preview(src);
      try { localStorage.setItem(storageKey, src); } catch { /* Aperçu de la session conservé. */ }
    };
    reader.readAsDataURL(file);
  });
});
