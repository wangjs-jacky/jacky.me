(() => {
  const motionCase = document.querySelector('[data-motion-case="first-03"]');
  if (!motionCase) return;

  const article = motionCase.closest(".project-motion");
  const cover = motionCase.querySelector(".motion-case-cover");
  const detail = motionCase.querySelector(".motion-case-detail");
  const close = motionCase.querySelector(".motion-case-close");
  const thumb = motionCase.querySelector(".motion-case-thumb");
  const preview = motionCase.querySelector(".motion-case-preview");
  const bridge = motionCase.querySelector(".motion-case-bridge");
  const image = motionCase.querySelector(".motion-case-image");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let imageTransition;

  function setDetail(open) {
    article.setAttribute("data-motion-engaged", "");
    const source = image.getBoundingClientRect();
    const sourceStyle = getComputedStyle(image);
    const sourcePosition = sourceStyle.objectPosition;
    const sourceRadius = sourceStyle.borderRadius;
    imageTransition?.cancel();
    imageTransition = undefined;

    const slot = open ? preview : thumb;
    cover.setAttribute("aria-expanded", String(open));
    detail.hidden = !open;
    cover.hidden = open;
    image.alt = open ? "身穿青色雪服的滑雪者和雪山" : "";
    (open ? close : cover).focus({ preventScroll: true });

    if (reducedMotion.matches || !image.naturalWidth || !image.animate) {
      slot.append(image);
      if (!open) article.removeAttribute("data-motion-engaged");
      return;
    }

    const target = slot.getBoundingClientRect();
    const stage = bridge.getBoundingClientRect();
    const targetPosition = open ? "50% 62%" : "50% 64%";
    const targetRadius = getComputedStyle(slot).borderRadius;
    const xScale = stage.width / bridge.offsetWidth || 1;
    const yScale = stage.height / bridge.offsetHeight || 1;
    const frame = (rect, objectPosition, borderRadius) => ({
      left: `${(rect.left - stage.left) / xScale}px`,
      top: `${(rect.top - stage.top) / yScale}px`,
      width: `${rect.width / xScale}px`,
      height: `${rect.height / yScale}px`,
      objectPosition,
      borderRadius,
    });

    bridge.append(image);
    const transition = image.animate(
      [frame(source, sourcePosition, sourceRadius), frame(target, targetPosition, targetRadius)],
      { duration: open ? 430 : 330, easing: "cubic-bezier(.2,.78,.24,1)", fill: "both" },
    );
    imageTransition = transition;
    transition.onfinish = () => {
      if (imageTransition !== transition) return;
      slot.append(image);
      imageTransition = undefined;
      transition.cancel();
      if (!open) article.removeAttribute("data-motion-engaged");
    };
  }

  cover.addEventListener("click", () => setDetail(true));
  close.addEventListener("click", () => setDetail(false));
  motionCase.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || detail.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    setDetail(false);
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) imageTransition?.finish();
  });
  window.addEventListener("resize", () => imageTransition?.finish());
})();
