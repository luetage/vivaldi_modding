// Binary Clock Widget
// version 2024.10.3
// Guide and updates ☛ https://forum.vivaldi.net/post/786622
// ————————  ⁂  ————————

"use strict";

function update() {
  const now = new Date();
  const binary_hours = now.getHours().toString(2).padStart(5, "0");
  const binary_minutes = now.getMinutes().toString(2).padStart(6, "0");
  const binary = binary_hours.concat(binary_minutes).split("");
  const circles = document.querySelectorAll("svg circle");
  for (let i = 0; i < circles.length; i++) {
    if (binary[i] === "1") circles[i].classList.add("one");
    else circles[i].classList.remove("one");
  }
}

function timer() {
  const time = new Date();
  const jump = (60 - time.getSeconds()) * 1000 - time.getMilliseconds();
  setTimeout(function () {
    update();
    timer();
  }, jump);
}

update();
timer();
