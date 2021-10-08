// History Moon
// version 2021.10.0
// https://forum.vivaldi.net/topic/58821/project-history-moon/
// Displays the current moon phase in the panel instead of the history clock
// icon. Moon phase calculation adapted from
// https://minkukel.com/en/various/calculating-moon-phase/

(function () {
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
    const hbtn = document.querySelector("#switch button.history span");
    if (phase === 0) {
      // new moon
      hbtn.innerHTML = `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="8" cy="8" r="6" fill="none"/>
        </svg>
      `;
    } else if (phase === 1) {
      // waxing crescent
      hbtn.innerHTML = `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">
          <defs>
            <clipPath id="cut">
              <rect x="10" y="0" width="6" height="16"/>
            </clipPath>
          </defs>
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="8" cy="8" r="6" fill="none"/>
          <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
        </svg>
      `;
    } else if (phase === 2) {
      // first quarter
      hbtn.innerHTML = `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">
          <defs>
            <clipPath id="cut">
              <rect x="8" y="0" width="8" height="16"/>
            </clipPath>
          </defs>
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="8" cy="8" r="6" fill="none"/>
          <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
        </svg>
      `;
    } else if (phase === 3) {
      // waxing gibbous
      hbtn.innerHTML = `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">
          <defs>
            <clipPath id="cut">
              <rect x="6" y="0" width="10" height="16"/>
            </clipPath>
          </defs>
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="8" cy="8" r="6" fill="none"/>
          <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
        </svg>
      `;
    } else if (phase === 4) {
      // full moon
      hbtn.innerHTML = `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="8" cy="8" r="6" fill="none"/>
          <circle cx="8" cy="8" r="5"/>
        </svg>
      `;
    } else if (phase === 5) {
      // waning gibbous
      hbtn.innerHTML = `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">
          <defs>
            <clipPath id="cut">
              <rect x="0" y="0" width="10" height="16"/>
            </clipPath>
          </defs>
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="8" cy="8" r="6" fill="none"/>
          <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
        </svg>
      `;
    } else if (phase === 6) {
      // last quarter
      hbtn.innerHTML = `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">
          <defs>
            <clipPath id="cut">
              <rect x="0" y="0" width="8" height="16"/>
            </clipPath>
          </defs>
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="8" cy="8" r="6" fill="none"/>
          <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
        </svg>
      `;
    } else {
      // waning crescent
      hbtn.innerHTML = `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">
          <defs>
            <clipPath id="cut">
              <rect x="0" y="0" width="6" height="16"/>
            </clipPath>
          </defs>
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="8" cy="8" r="6" fill="none"/>
          <circle cx="8" cy="8" r="5" clip-path="url(#cut)"/>
        </svg>
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
            const watch = new MutationObserver(mw);
            watch.observe(this, { attributes: true });
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
