const statements = [
  "Michael Pogorzhelskiy designs digital products and experiences for people.",
  "Michael Pogorzhelskiy works at the intersection of industrial, interaction and user experience design.",
  "Michael Pogorzhelskiy\ndid research on telepresence, virtual reality for clinical training and augmented reality for surgery",
  "Michael Pogorzhelskiy\nprefers pen and paper, then AI."
];

const el = document.getElementById("statement");
const mail = document.getElementById("mail");
const startParam = parseInt(new URLSearchParams(location.search).get("i"), 10);
let i = Number.isFinite(startParam) ? ((startParam % statements.length) + statements.length) % statements.length : 0;
el.textContent = statements[i];

function advance() {
  i = (i + 1) % statements.length;
  el.textContent = statements[i];
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#mail")) return;
  advance();
});

document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
    e.preventDefault();
    advance();
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    i = (i - 1 + statements.length) % statements.length;
    el.textContent = statements[i];
  }
});
