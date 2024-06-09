// Moon Phase
// version 2024.6.0
// https://forum.vivaldi.net/post/461432
// Displays the current moon phase as command chain button. Download the
// moon-phase.svg file and load it in theme settings. Moon phase calculation
// adapted from https://minkukel.com/en/various/calculating-moon-phase/

(function moonPhase() {
  "use strict";
  const lunarcycle = 29.53058770576;
  const lunartime = lunarcycle * 86400;
  const newmoon = 947182440;
  const moon = {
    phases: [
      ["New Moon", 1],
      ["Waxing Crescent", 6.38264692644],
      ["First Quarter", 8.38264692644],
      ["Waxing Gibbous", 13.76529385288],
      ["Full Moon", 15.76529385288],
      ["Waning Gibbous", 21.14794077932],
      ["Last Quarter", 23.14794077932],
      ["Waning Crescent", 28.53058770576],
      ["", lunarcycle],
    ],
    phase: () => {
      const unixtime = Math.round(Date.now() / 1000);
      const progress = ((unixtime - newmoon) % lunartime) / lunartime;
      const age = progress * lunarcycle;
      for (let i = 0; i < moon.phases.length; i++) {
        if (age <= moon.phases[i][1]) {
          if (i === 8) i = 0;
          return {
            phase: i,
            name: moon.phases[i][0],
            progress: Math.trunc(progress * 100),
            age: age.toFixed(1),
          };
        }
      }
    },
  };

  function moonwatch(btn) {
    const lc = moon.phase();
    let p = lc.phase;
    if (hemisphere === "southern") {
      const pa = [0, 7, 6, 5, 4, 3, 2, 1];
      p = pa[p];
    }
    const icon = [
      [-8, 0],
      [2, 6],
      [0, 8],
      [-2, 10],
      [-8, 16],
      [-8, 10],
      [-8, 8],
      [-8, 6],
    ];
    btn.title = `${lc.name}\n${lc.age} days \u{21ba} ${lc.progress}%`;
    const mod = btn.querySelector("#vm-mp-mod");
    mod.setAttribute("x", icon[p][0]);
    mod.setAttribute("width", icon[p][1]);
  }

  // EDIT START
  // choose your hemisphere (northern or southern)
  const hemisphere = "northern";
  // command chain identifier (inspect UI and input your own)
  const command = "COMMAND_cln9yq818001n2v649xyaiird";
  // EDIT END

  const conflate = (el) => {
    const send = () => moonwatch(el);
    send();
    el.addEventListener("click", send);
  };

  setTimeout(() => {
    const check = `.ToolbarButton-Button[name=${command}]`;
    const select = document.querySelector(check);
    if (select) conflate(select);
  });

  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.name === command) conflate(this);
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
