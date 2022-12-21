// History Moon
// version 2022.12.0
// https://forum.vivaldi.net/post/461432
// Displays the current moon phase in the panel instead of the history clock
// icon. Download history-moon-large.svg and history-moon-small.svg files and
// load them in theme settings. Moon phase calculation adapted from
// https://minkukel.com/en/various/calculating-moon-phase/

(function historyMoon() {
  const hemisphere = "northern"; //northern or southern
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

  function icon(phase) {
    let p = 0;
    if (hemisphere === "southern") {
      const pa = [0, 7, 6, 5, 4, 3, 2, 1];
      p = pa[phase];
    } else p = phase;
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
    const mod = document.getElementById("vm-hm-mod");
    mod.setAttribute("x", icon[p][0]);
    mod.setAttribute("width", icon[p][1]);
  }

  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (
            this.name === "PanelHistory" &&
            this.classList.contains("ToolbarButton-Button")
          ) {
            const lc = moon.phase();
            icon(lc.phase);
            this.title += `\n${lc.name} Moon ${lc.progress}%`;
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
