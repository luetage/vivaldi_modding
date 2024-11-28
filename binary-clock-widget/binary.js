// Binary Clock Widget
// version 2024.11.0
// Guide and updates ☛ https://forum.vivaldi.net/post/786622
// ————————  ⁂  ————————

"use strict";

function update() {
  const now = new Date();
  const binary_hours = now.getHours().toString(2).padStart(5, "0");
  const binary_minutes = now.getMinutes().toString(2).padStart(6, "0");
  const binary = binary_hours.concat(binary_minutes).split("");
  circles.forEach((circle, i) => {
    if (binary[i] === "1") circle.classList.add("one");
    else circle.classList.remove("one");
  });
}

function timer() {
  const time = new Date();
  const jump = (60 - time.getSeconds()) * 1000 - time.getMilliseconds();
  setTimeout(() => {
    update();
    timer();
  }, jump);
}

const circles = document.querySelectorAll("svg circle");
update();
timer();
