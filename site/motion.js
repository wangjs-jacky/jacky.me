const root = document.documentElement;
const mascot = document.querySelector(".hero-mascot");
const workWall = document.querySelector(".works");
const workCards = workWall ? [...workWall.querySelectorAll("article")] : [];
const aboutArt = document.querySelector(".about-art img");
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const compactViewport = matchMedia("(max-width: 640px)");
let queuedFrame = 0;
let pointer = null;

function schedule() {
  if (!queuedFrame) queuedFrame = requestAnimationFrame(update);
}

function update() {
  queuedFrame = 0;
  const height = innerHeight;
  const scrollDistance = root.scrollHeight - height;
  const reduced = motionPreference.matches;
  const tracking = finePointer.matches && !reduced && pointer !== null;

  const mascotBounds = tracking && mascot?.getBoundingClientRect();
  const workTop = workWall?.getBoundingClientRect().top;
  // Offset geometry stays in the layout plane as the visible cards rotate.
  const cardBounds = workCards.map(card => ({
    card,
    top: workTop + card.offsetTop,
    height: card.offsetHeight,
  }));
  const aboutBounds = aboutArt?.parentElement.getBoundingClientRect();

  root.style.setProperty("--read-progress", scrollDistance > 0 ? scrollY / scrollDistance : 0);

  if (mascot) {
    mascot.toggleAttribute("data-gazing", Boolean(mascotBounds));
    if (mascotBounds) {
      const dx = pointer.x - (mascotBounds.left + mascotBounds.width * .42);
      const dy = pointer.y - (mascotBounds.top + mascotBounds.height * .266);
      const reach = Math.max(100, Math.hypot(dx, dy));
      mascot.style.setProperty("--gaze-x", dx / reach * mascotBounds.width * .011 + "px");
      mascot.style.setProperty("--gaze-y", dy / reach * mascotBounds.width * .010 + "px");
    }
  }

  const maxTilt = compactViewport.matches ? 13 : 22;
  for (const {card, top, height: cardHeight} of cardBounds) {
    const distance = (top + cardHeight / 2 - height * .52) / height;
    // Leave the reading area flat. Ease back into the same pose in reverse.
    const edge = Math.min(1, Math.max(0, (Math.abs(distance) - .12) / .31));
    const pose = edge * edge * (3 - 2 * edge);
    card.toggleAttribute("data-scroll-pose", !reduced && pose > 0);
    if (reduced || pose === 0) continue;
    const direction = Math.sign(distance);
    card.style.setProperty("--work-tilt", direction * maxTilt * pose + "deg");
    card.style.setProperty("--work-shift", direction * 20 * pose + "px");
    card.style.setProperty("--work-scale", 1 - .065 * pose);
  }

  if (aboutBounds) {
    root.style.setProperty("--pointer-x", tracking ? pointer.x / innerWidth - .5 : 0);
    const position = Math.max(-1, Math.min(1, (aboutBounds.top + aboutBounds.height / 2 - height / 2) / (height / 2)));
    aboutArt.style.setProperty("--scroll-shift", reduced ? "0px" : position * 15.3 + "px");
  }
}

function resetPointer() {
  pointer = null;
  schedule();
}

if (mascot || aboutArt) {
  document.addEventListener("pointermove", event => {
    if (!finePointer.matches || motionPreference.matches || event.pointerType === "touch") return;
    pointer = {x: event.clientX, y: event.clientY};
    schedule();
  }, {passive: true});
  root.addEventListener("pointerleave", resetPointer);
  window.addEventListener("blur", resetPointer);
  finePointer.addEventListener("change", resetPointer);
}

window.addEventListener("scroll", schedule, {passive: true});
window.addEventListener("resize", schedule);
motionPreference.addEventListener("change", resetPointer);
if (workWall) new ResizeObserver(schedule).observe(workWall);
schedule();

const backToTop = document.querySelector(".footer a[href='#top']");
backToTop?.addEventListener("click", event => {
  event.preventDefault();
  history.replaceState(null, "", "#top");
  document.querySelector(".wordmark").focus({preventScroll: true});
  window.scrollTo({top: 0, behavior: motionPreference.matches ? "instant" : "smooth"});
});
