// History Moon
// version 2021.10.0
// https://forum.vivaldi.net/topic/58821/project-history-moon/
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
      let pa = [0, 7, 6, 5, 4, 3, 2, 1];
      p = pa[phase];
    } else p = phase;
    const hbtn = document.querySelector("#switch button.history svg");
    if (p === 0) {
      hbtn.innerHTML = `
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="8" r="6" fill="none"/>
      `;
    } else if (p === 1) {
      hbtn.innerHTML = `
        <defs>
          <clipPath id="cut">
            <rect x="10" y="0" width="6" height="16"/>
          </clipPath>
        </defs>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="8" r="6" fill="none"/>
        <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
      `;
    } else if (p === 2) {
      hbtn.innerHTML = `
        <defs>
          <clipPath id="cut">
            <rect x="8" y="0" width="8" height="16"/>
          </clipPath>
        </defs>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="8" r="6" fill="none"/>
        <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
      `;
    } else if (p === 3) {
      hbtn.innerHTML = `
        <defs>
          <clipPath id="cut">
            <rect x="6" y="0" width="10" height="16"/>
          </clipPath>
        </defs>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="8" r="6" fill="none"/>
        <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
      `;
    } else if (p === 4) {
      hbtn.innerHTML = `
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="8" r="6" fill="none"/>
        <circle cx="8" cy="8" r="5"/>
      `;
    } else if (p === 5) {
      hbtn.innerHTML = `
        <defs>
          <clipPath id="cut">
            <rect x="0" y="0" width="10" height="16"/>
          </clipPath>
        </defs>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="8" r="6" fill="none"/>
        <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
      `;
    } else if (p === 6) {
      hbtn.innerHTML = `
        <defs>
          <clipPath id="cut">
            <rect x="0" y="0" width="8" height="16"/>
          </clipPath>
        </defs>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="8" r="6" fill="none"/>
        <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
      `;
    } else {
      hbtn.innerHTML = `
        <defs>
          <clipPath id="cut">
            <rect x="0" y="0" width="6" height="16"/>
          </clipPath>
        </defs>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="8" r="6" fill="none"/>
        <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
      `;
    }
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
