// Moon Phase
// version 2023.3.2
// https://forum.vivaldi.net/post/461432
// Displays the current moon phase as button icon. Download the moon-phase.svg
// file and load it in theme settings. Moon phase calculation adapted from
// https://minkukel.com/en/various/calculating-moon-phase/

(function moonPhase() {
  const moon = {
    phases: [
      ["New", 0, 1],
      ["Waxing Crescent", 1, 6.38264692644],
      ["First Quarter", 6.38264692644, 8.38264692644],
      ["Waxing Gibbous", 8.38264692644, 13.76529385288],
      ["Full", 13.76529385288, 15.76529385288],
      ["Waning Gibbous", 15.76529385288, 21.14794077932],
      ["Last Quarter", 21.14794077932, 23.14794077932],
      ["Waning Crescent", 23.14794077932, 28.53058770576],
      ["", 28.53058770576, 29.53058770576],
    ],
    phase: () => {
      const lunarcycle = 29.53058770576;
      const lunartime = lunarcycle * 86400;
      const unixtime = Math.round(Date.now() / 1000);
      const newmoon = 947182440;
      const diff = unixtime - newmoon;
      const mod = diff % lunartime;
      const frac = mod / lunartime;
      const age = frac * lunarcycle;
      for (let i = 0; i < moon.phases.length; i++) {
        if (age >= moon.phases[i][1] && age <= moon.phases[i][2]) {
          if (i === 8) i = 0;
          return {
            phase: i,
            name: moon.phases[i][0],
            progress: Math.trunc(frac * 100),
          };
        }
      }
    },
  };

  function icon() {
    const lc = moon.phase();
    let p = 0;
    if (hemisphere === "southern") {
      const pa = [0, 7, 6, 5, 4, 3, 2, 1];
      p = pa[lc.phase];
    } else p = lc.phase;
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
    const btns = document.querySelectorAll(
      ".ToolbarButton-Button[name=" + CSS.escape(command) + "]"
    );
    btns.forEach((btn) => {
      btn.title = `${lc.name} Moon ${lc.progress}%`;
      const mod = btn.querySelector("#vm-mp-mod");
      mod.setAttribute("x", icon[p][0]);
      mod.setAttribute("width", icon[p][1]);
    });
  }

  // choose your hemisphere (northern or southern)
  const hemisphere = "northern";
  // command chain identifier (inspect UI and input your own)
  const command = "COMMAND_cln9yq818001n2v649xyaiird";

  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.name === command) {
            icon();
            this.addEventListener("click", icon);
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
