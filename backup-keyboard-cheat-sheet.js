// Backup Keyboard Cheat Sheet
// version 2024.4.3
// https://forum.vivaldi.net/post/745999
// Writes the contents of the keyboard cheat sheet to your clipboard in markdown
// format. Open keyboard cheat sheet popup, open user interface console, paste
// code and hit Enter to execute.

const sheet = document.querySelector(".keyboardShortcutsWrapper");
const heading = sheet.querySelector("h1");
const pb = "<div style='page-break-after:avoid'></div>";
let output = `# ${heading.innerText}\n\n<table>\n`;
sheet.querySelectorAll(".category").forEach((category) => {
  const caps = category.firstChild.innerText.toUpperCase();
  output += `<tr><td><b>${caps}</b></td><td>${pb}</td></tr>\n`;
  category.querySelectorAll(".keycombo").forEach((command) => {
    output += `<tr><td>${command.innerText}</td><td>`;
    command.querySelectorAll("input").forEach((combo) => {
      output += `${combo.value}<br>`;
    });
    output += "</td></tr>\n";
  });
  output += "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>\n";
});
output += "</table>";
copy(output);
console.info(output);
