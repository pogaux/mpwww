const NAME = "Michael Pogorzhelskiy";

const statements = [
  "Michael Pogorzhelskiy designs digital products and experiences for people.",
  "Michael Pogorzhelskiy works at the intersection of industrial, interaction and user experience design.",
  "Michael Pogorzhelskiy\ndid research on telepresence, virtual reality for clinical training and augmented reality for surgery",
  "Michael Pogorzhelskiy\nprefers pen and paper, then AI."
];

const TOTAL_MS    = 600;
const FADE_OUT_MS = 120;
const LETTER_MS   = 180;
const MAX_STAGGER = 9;

const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const el = document.getElementById("statement");
const mail = document.getElementById("mail");

// Static structure: <name> + <separator> + <rest>. Only <rest> is ever mutated.
el.textContent = "";
const nameEl = document.createElement("span");
nameEl.className = "name";
nameEl.textContent = NAME;
el.appendChild(nameEl);

let sepNode = document.createTextNode(" ");
el.appendChild(sepNode);

const restEl = document.createElement("span");
restEl.className = "rest";
el.appendChild(restEl);

function setSeparator(kind) {
  const next = kind === "break" ? document.createElement("br") : document.createTextNode(" ");
  el.replaceChild(next, sepNode);
  sepNode = next;
}

function parseTail(text) {
  let tail = text.slice(NAME.length);
  let sep = "space";
  if (tail.startsWith("\n")) { sep = "break"; tail = tail.slice(1); }
  else if (tail.startsWith(" ")) { tail = tail.slice(1); }
  return { sep, tail };
}

function buildRest(tail, getDelay) {
  const frag = document.createDocumentFragment();
  const words = tail.split(" ");
  let chIdx = 0;
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
  return frag;
}

function renderInstant(text) {
  const { sep, tail } = parseTail(text);
  setSeparator(sep);
  restEl.textContent = "";
  restEl.appendChild(buildRest(tail, () => 0));
}

let animToken = 0;

function swap(text) {
  if (prefersReducedMotion) {
    renderInstant(text);
    return;
  }

  const token = ++animToken;
  el.classList.add("is-leaving");

  setTimeout(() => {
    if (token !== animToken) return;

    const { sep, tail } = parseTail(text);
    const visibleCount = [...tail].filter((c) => c !== " ").length || 1;
    const budget = TOTAL_MS - FADE_OUT_MS - LETTER_MS;
    const stagger = Math.min(MAX_STAGGER, Math.max(0, budget / Math.max(1, visibleCount - 1)));

    setSeparator(sep);
    restEl.textContent = "";
    restEl.appendChild(buildRest(tail, (idx) => idx * stagger));

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
renderInstant(statements[i]);

function go(delta) {
  i = (i + delta + statements.length) % statements.length;
  swap(statements[i]);
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
