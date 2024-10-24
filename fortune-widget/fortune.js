// Fortune Widget
// version 2024.10.0
// Guide and updates ☛ https://forum.vivaldi.net/post/787840
// ————————  ⁂  ————————

"use strict";

function typ(x) {
  const bold = /(?<!\*)\*\*(\w)([^*]*?\w)?\*\*(?!\*)/g;
  const italic = /(?<!\*)\*(\w)([^*]*?\w)?\*(?!\*)/g;
  x = x.replace(bold, "<b>$1$2</b>");
  x = x.replace(italic, "<i>$1$2</i>");
  x = x.replace(/---/g, "\u2014");
  x = x.replace(/--/g, "\u2013");
  x = x.replace(/(\d)-(\d)/g, "$1\u2013$2");
  x = x.replace(/(\w)-(\w)/g, "$1\u2010$2");
  x = x.replace(/ - /g, " \u2013 ");
  x = x.replace(/\n\n/g, "<br>");
  return x;
}

function write_fortune(el) {
  const random = Math.floor(Math.random() * data.length);
  const rnd = data[random];
  const fortune = rnd.author
    ? `${typ(rnd.quote)}<br>\u2015\u202f${typ(rnd.author)}`
    : typ(rnd.quote);
  console.info(`${random}: ${fortune}`);
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
