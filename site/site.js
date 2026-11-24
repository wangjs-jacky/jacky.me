const greeting = document.querySelector(".greeting");
const greetingButton = greeting.querySelector("button");
const greetingCard = document.querySelector("#greeting-card");

function showGreeting(open) {
  greetingButton.setAttribute("aria-expanded", String(open));
  greetingCard.hidden = !open;
}

greetingButton.addEventListener("click", () => showGreeting(greetingCard.hidden));
greeting.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !greetingCard.hidden) {
    showGreeting(false);
    greetingButton.focus();
  }
});

const steps = document.querySelectorAll("[data-review-step]");
const still = document.querySelector(".review-still");
const recording = document.querySelector(".review-recording");
const captionTitle = document.querySelector(".review-caption strong");
const captionCopy = document.querySelector(".review-caption p");

const scenes = {
  pin: {
    image: "review-pin.webp",
    alt: "实际扩展标出示例网页标题，右下角是网页评注面板",
    title: "定位网页元素",
    description: "点中标题，它在原网页上留下 01 标记。",
  },
  play: {
    image: "review-pin.webp",
    alt: "示例网页的阅读按钮区域和网页评注面板",
    title: "回放一段交互",
    description: "这段原生区域录制保留了页面按钮的选中变化。",
  },
  copy: {
    image: "review-copy.webp",
    alt: "实际保存了 01 和 02 两条评注，页面提示已复制 2 条评注",
    title: "把评注交给 AI",
    description: "复制本页两条评注，再把元素位置和上下文交给 AI。",
  },
};

for (const step of steps) {
  step.addEventListener("click", () => {
    const name = step.dataset.reviewStep;
    const scene = scenes[name];
    for (const item of steps) item.setAttribute("aria-pressed", String(item === step));
    still.src = "assets/" + scene.image;
    still.alt = scene.alt;
    recording.hidden = name !== "play";
    recording.removeAttribute("src");
    if (name === "play") recording.src = "assets/review-recording.webp";
    captionTitle.textContent = scene.title;
    captionCopy.textContent = scene.description;
  });
}


const deviceCard = document.querySelector(".paws-visual");
const devices = deviceCard.querySelectorAll("[data-device]");
for (const device of devices) {
  device.addEventListener("click", () => {
    deviceCard.dataset.front = device.dataset.device;
    for (const item of devices) item.setAttribute("aria-pressed", String(item === device));
  });
}

const reviewLive = document.querySelector(".review-live");
const reviewTargets = reviewLive.querySelectorAll("[data-annotation-target]");
const sampleSheet = reviewLive.querySelector(".review-sheet");
const noteText = reviewLive.querySelector("#review-note-text");
const noteTarget = reviewLive.querySelector(".review-note-target strong");
const copyButton = reviewLive.querySelector(".review-note-copy");
const copyStatus = reviewLive.querySelector(".review-copy-state");
const copyFallback = reviewLive.querySelector(".review-copy-fallback");
const examples = {
  title: {name:"标题「项目笔记」",note:noteText.value},
  button: {name:"按钮「开始阅读」",note:"按钮可以写清楚点开后会读到什么。"},
  page: {name:"整张示例网页",note:"首屏先交代这份笔记适合谁、可以怎么用。"},
};
let selection = "title";

function clearCopyStatus() {
  copyStatus.textContent = "";
  copyFallback.hidden = true;
}

for (const target of reviewTargets) {
  target.addEventListener("click", () => {
    examples[selection].note = noteText.value;
    selection = target.dataset.annotationTarget;
    const example = examples[selection];
    for (const option of reviewTargets) option.setAttribute("aria-pressed", String(option === target));
    sampleSheet.toggleAttribute("data-selected-page", selection === "page");
    noteTarget.textContent = example.name;
    noteText.value = example.note;
    clearCopyStatus();
  });
}

noteText.addEventListener("input", clearCopyStatus);
copyButton.addEventListener("click", async () => {
  clearCopyStatus();
  const note = noteText.value.trim();
  if (!note) {
    copyStatus.textContent = "请先写一条评注意见。";
    noteText.focus();
    return;
  }
  const targetName = examples[selection].name;
  const payload = "Page Review 示例\n位置：" + targetName + "\n评注：" + note;
  try {
    await navigator.clipboard.writeText(payload);
    if (examples[selection].name === targetName && noteText.value.trim() === note) copyStatus.textContent = "已复制评注。";
  } catch {
    if (examples[selection].name !== targetName || noteText.value.trim() !== note) return;
    copyFallback.value = payload;
    copyFallback.hidden = false;
    copyFallback.focus();
    copyFallback.select();
    copyStatus.textContent = "已选中评注，可手动复制。";
  }
});
