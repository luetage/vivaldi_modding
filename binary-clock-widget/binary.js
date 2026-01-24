// Binary Clock Widget
// version 2026.1.0
// Guide and updates → https://forum.vivaldi.net/post/786622
// ———————— *** ————————

"use strict";

function timer(time) {
  const jump = (60 - time.getSeconds()) * 1000 - time.getMilliseconds();
  setTimeout(() => update(), jump);
}

function update() {
  const now = new Date();
  timer(now);
  const binary_hours = now.getHours().toString(2).padStart(5, "0");
  const binary_minutes = now.getMinutes().toString(2).padStart(6, "0");
  const binary = binary_hours.concat(binary_minutes).split("");
  circles.forEach((circle, i) => {
    if (binary[i] === "1") circle.classList.add("one");
    else circle.classList.remove("one");
  });
}

const circles = document.querySelectorAll("svg circle");
update();
