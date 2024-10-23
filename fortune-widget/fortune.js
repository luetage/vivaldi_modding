// Fortune Widget
// version 2024.10.0
// Guide and updates ☛ https://forum.vivaldi.net/post/783627
// ————————  ⁂  ————————

"use strict";

function write_fortune(el) {
  const rnd = data[Math.floor(Math.random() * data.length)];
  rnd.quote = rnd.quote.replace(/--/g, "\u2013");
  rnd.quote = rnd.quote.replace(/\n\n/g, "<br><br>");
  const fortune = rnd.author
    ? `${rnd.quote}<br>\u2015\u202f${rnd.author}`
    : rnd.quote;
  el.innerHTML = fortune;
}

function init() {
  const text = document.getElementById("text");
  const asterism = document.getElementById("asterism");
  write_fortune(text);
  asterism.addEventListener("click", (e) => {
    if (e.button === 0 && e.ctrlKey) write_fortune(text);
  });
}

init();
