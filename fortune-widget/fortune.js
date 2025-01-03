// Fortune Widget
// version 2024.12.0
// Guide and updates ☛ https://forum.vivaldi.net/post/787840
// ————————  ⁂  ————————

"use strict";

function typ(x) {
  const bold = /(?<!\*)\*\*(\w)([^*]*?\w)?\*\*(?!\*)/g;
  const italic = /(?<!\*)\*(\w)([^*]*?\w)?\*(?!\*)/g;
  x = x.replace(bold, "<strong>$1$2</strong>");
  x = x.replace(italic, "<em>$1$2</em>");
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

write_fortune(document.getElementById("text"));
