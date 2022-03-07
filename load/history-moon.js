// History Moon
// version 2021.10.0
// https://forum.vivaldi.net/post/461432
// Displays the current moon phase in the panel instead of the history clock
// icon. Moon phase calculation adapted from
// https://minkukel.com/en/various/calculating-moon-phase/

(function () {
  let hemisphere = "northern"; //northern or southern
  let moon = {
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

  let historymoon = (phase) => {
    let p = 0;
    if (hemisphere === "southern") {
      const pa = [0, 7, 6, 5, 4, 3, 2, 1];
      p = pa[phase];
    } else p = phase;
    const icon = [
      [0, 0],
      [10, 6],
      [8, 8],
      [6, 10],
      [0, 16],
      [0, 10],
      [0, 8],
      [0, 6],
    ];
    document.querySelector("#switch button.history span").innerHTML = `
      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="hmcut">
            <rect x="${icon[p][0]}" y="0" width="${icon[p][1]}" height="16"/>
          </clipPath>
        </defs>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="8" r="5" clip-path="url(#hmcut)"/>
      </svg>
    `;
  };

  let moonwatch = (mutations, phase) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") historymoon(phase);
    });
  };

  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (
            this.classList.contains("panelbtn") &&
            this.classList.contains("history")
          ) {
            const lc = moon.phase();
            historymoon(lc.phase);
            this.title += `\n${lc.name} Moon ${lc.progress}%`;
            const mw = (mutations) => moonwatch(mutations, lc.phase);
            new MutationObserver(mw).observe(this, { attributes: true });
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
