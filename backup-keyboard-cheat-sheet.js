// Backup Keyboard Cheat Sheet
// version 2024.4.0
// https://forum.vivaldi.net/post/745999
// Writes the content of the keyboard cheat sheet to your clipboard in markdown
// format. Open keyboard cheat sheet popup, open user interface console, paste
// code and hit Enter to execute.

let output = "";
const wrapper = document.querySelector(".keyboardShortcutsWrapper");
const title = wrapper.querySelector("h1");
output += `# ${title.innerText}\n\n| &nbsp; | &nbsp; |\n|---|---|\n`;
wrapper.querySelectorAll(".category").forEach((category) => {
  output += `| **${category.firstChild.innerText.toUpperCase()}** |   |\n`;
  category.querySelectorAll(".keycombo").forEach((key) => {
    output += `| ${key.innerText} |`;
    key.querySelectorAll("input").forEach((combo) => {
      output += ` ${combo.value}<br>`;
    });
    output += ` |\n`;
  });
  output += `| &nbsp; | &nbsp; |\n`;
});
copy(output);
console.info(output);
