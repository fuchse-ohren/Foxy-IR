function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

if (isMobile()) {
  const style = document.createElement("style");
  style.textContent = `
                html { font-size: 30px; }
                body { width: 95vw; margin: 0 auto; padding: 5px; }
                #icon { width: 100px; }
                .dads-input-text__input { border: 3px solid var(--color-neutral-solid-gray-600) !important; }
                .dads-button[data-type="outline"] { border: 3px solid currentcolor !important; }
            `;
  document.head.appendChild(style);
}
