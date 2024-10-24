// Fortune Widget
// version 2024.10.0
// Guide and updates ☛ https://forum.vivaldi.net/post/783627
// ————————  ⁂  ————————

"use strict";

function write_fortune(el) {
  const random = Math.floor(Math.random() * data.length);
  const rnd = data[random];
  const bold = /(?<!\*)\*\*(\w)([^*]*?\w)?\*\*(?!\*)/g;
  const italic = /(?<!\*)\*(\w)([^*]*?\w)?\*(?!\*)/g;
  rnd.quote = rnd.quote.replace(bold, "<b>$1$2</b>");
  rnd.quote = rnd.quote.replace(italic, "<i>$1$2</i>");
  rnd.quote = rnd.quote.replace(/---/g, "\u2014");
  rnd.quote = rnd.quote.replace(/--/g, "\u2013");
  rnd.quote = rnd.quote.replace(/(\w)-(\w)/g, '$1\u2010$2');
  rnd.quote = rnd.quote.replace(/\n\n/g, "<br>");
  const fortune = rnd.author
    ? `${rnd.quote}<br>\u2015\u202f${rnd.author}`
    : rnd.quote;
  console.info(fortune);
  document.title = `Fortune ${random + 1}`;
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
