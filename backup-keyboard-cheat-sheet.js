// Backup Keyboard Cheat Sheet
// version 2024.4.2
// https://forum.vivaldi.net/post/745999
// Writes the contents of the keyboard cheat sheet to your clipboard in markdown
// format. Open keyboard cheat sheet popup, open user interface console, paste
// code and hit Enter to execute.

const sheet = document.querySelector(".keyboardShortcutsWrapper");
const heading = sheet.querySelector("h1");
let output = `# ${heading.innerText}\n\n| &nbsp; | &nbsp; |\n|---|---|\n`;
sheet.querySelectorAll(".category").forEach((category) => {
  const caps = category.firstChild.innerText.toUpperCase();
  output += `| **${caps}** | <div style="page-break-after:avoid"></div> |\n`;
  category.querySelectorAll(".keycombo").forEach((key) => {
    output += `| ${key.innerText} |`;
    key.querySelectorAll("input").forEach((combo) => {
      output += ` ${combo.value}<br>`;
    });
    output += " |\n";
  });
  output += "| &nbsp; | &nbsp; |\n";
});
copy(output);
console.info(output);
