const statements = [
  "Designs digital tools and experiences for people. Mixing research and application.",
  "Digital Product Design\nUser Experience\nXR Interaction\nResearch",
  "Statement 3",
  "Statement 4"
];

const TOTAL_MS    = 600;
const FADE_OUT_MS = 120;
const LETTER_MS   = 180;
const MAX_STAGGER = 9;

const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const el        = document.getElementById("statement");
const portraits = document.querySelectorAll(".portrait[data-statement]");


function buildFragment(text, getDelay) {
  const frag = document.createDocumentFragment();
  const lines = text.split("\n");
  let chIdx = 0;
  lines.forEach((line, li) => {
    if (li > 0) frag.appendChild(document.createTextNode("\n"));
    const words = line.split(" ");
    words.forEach((word, wi) => {
      if (wi > 0) frag.appendChild(document.createTextNode(" "));
      if (!word) return;
      const wspan = document.createElement("span");
      wspan.className = "word";
      for (const ch of word) {
        const c = document.createElement("span");
        c.className = "ch";
        c.textContent = ch;
        c.style.setProperty("--d", `${getDelay(chIdx++)}ms`);
        wspan.appendChild(c);
      }
      frag.appendChild(wspan);
    });
  });
  return frag;
}

function setPortraitInstant(index) {
  portraits.forEach(fig => {
    const match = fig.dataset.statement === String(index);
    fig.hidden = !match;
    fig.classList.toggle("is-visible", match);
    fig.classList.remove("is-entering");
  });
}

function fadeOutPortraits() {
  portraits.forEach(fig => fig.classList.remove("is-visible"));
}

function fadeInPortrait(index) {
  portraits.forEach(fig => {
    const match = fig.dataset.statement === String(index);
    fig.hidden = !match;
    if (match) {
      fig.classList.add("is-entering");
      void fig.offsetWidth;
      fig.classList.remove("is-entering");
      fig.classList.add("is-visible");
    }
  });
}

function renderInstant(index) {
  el.textContent = "";
  el.appendChild(buildFragment(statements[index], () => 0));
  setPortraitInstant(index);
}

let animToken = 0;

function swap(index) {
  if (prefersReducedMotion) {
    renderInstant(index);
    return;
  }

  const token = ++animToken;
  el.classList.add("is-leaving");
  fadeOutPortraits();

  setTimeout(() => {
    if (token !== animToken) return;

    const text = statements[index];
    const visibleCount = [...text].filter((c) => c !== " " && c !== "\n").length || 1;
    const budget = TOTAL_MS - FADE_OUT_MS - LETTER_MS;
    const stagger = Math.min(MAX_STAGGER, Math.max(0, budget / Math.max(1, visibleCount - 1)));

    el.textContent = "";
    el.appendChild(buildFragment(text, (idx) => idx * stagger));
    fadeInPortrait(index);

    el.classList.remove("is-leaving");
    el.classList.add("is-entering");
    void el.offsetWidth;
    el.classList.remove("is-entering");
  }, FADE_OUT_MS);
}

const startParam = parseInt(new URLSearchParams(location.search).get("i"), 10);
let i = Number.isFinite(startParam)
  ? ((startParam % statements.length) + statements.length) % statements.length
  : 0;
renderInstant(i);

function go(delta) {
  i = (i + delta + statements.length) % statements.length;
  swap(i);
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#mail")) return;
  go(1);
});

document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
    e.preventDefault();
    go(1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    go(-1);
  }
});
