// Backup Keyboard Cheat Sheet
// version 2024.4.5
// https://forum.vivaldi.net/post/745999
// Writes the contents of the keyboard cheat sheet to your clipboard in markdown
// format. Open keyboard cheat sheet popup, open user interface console, paste
// code and hit Enter to execute.

const sheet = document.querySelector(".keyboardShortcutsWrapper");
const heading = sheet.querySelector("h1").innerText;
const pb1 = "<style>\n  tr{page-break-inside:avoid}\n</style>\n\n";
const pb2 = `<div style="page-break-after:avoid"></div>`;
let output = `${pb1}# ${heading}\n\n<table>\n`;
sheet.querySelectorAll(".category").forEach((category, key, arr) => {
  const caps = category.firstChild.innerText.toUpperCase();
  output += `  <tr><td><b>${caps}</b></td><td>${pb2}</td></tr>\n`;
  category.querySelectorAll(".keycombo").forEach((command) => {
    output += `  <tr><td>${command.innerText}</td><td>`;
    command.querySelectorAll("input").forEach((combo, key, arr) => {
      output += combo.value;
      if (Object.is(arr.length - 1, key)) output += "</td></tr>\n";
      else output += "<br>";
    });
  });
  if (Object.is(arr.length - 1, key)) output += "</table>";
  else output += "  <tr><td>&nbsp;</td><td>&nbsp;</td></tr>\n";
});
copy(output);
console.info(output);
