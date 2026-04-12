export const flyToCart = (emoji: string, x: number, y: number) => {
  const cart = document.querySelector("[data-cart-icon]") as HTMLElement | null;

  if (!cart) return;

  const rect = cart.getBoundingClientRect();

  const el = document.createElement("div");
  el.innerText = emoji;

  el.style.position = "fixed";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  /* Bigger emoji */
  el.style.fontSize = "32px";

  el.style.zIndex = "9999";
  el.style.pointerEvents = "none";
  el.style.transition = "all .7s cubic-bezier(.22,1,.36,1)";

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = `translate(${rect.left - x}px, ${rect.top - y}px) scale(.35)`;
    el.style.opacity = "0";
  });

  setTimeout(() => {
    el.remove();
  }, 700);
};