// Moon Phase
// version 2024.10.0
// https://forum.vivaldi.net/post/461432
// Displays the current moon phase as command chain button. Download the
// moon-phase.svg file and load it in theme settings. Moon phase calculation
// adapted from https://minkukel.com/en/various/calculating-moon-phase/

(function moonPhase() {
  "use strict";

  // EDIT START
  // choose a digit from 0 to 4 approximating your latitude
  // north[0] northern[1] equator[2] southern[3] south[4]
  const approx = 0;
  // alternatively input your exact latitude in degrees (between 90 and -90)
  const latitude = 48.3;
  // command chain identifier (inspect UI and input your own)
  const command = "COMMAND_cln9yq818001n2v649xyaiird";
  // EDIT END

  const lunation = 29.53058770576;
  const lunartime = lunation * 86400;
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
      ["", lunation],
    ],
    illum: [
      [-5, 0],
      [-5, 3],
      [-5, 5],
      [-5, 7],
      [-5, 10],
      [-2, 7],
      [0, 5],
      [2, 3],
    ],
    lat: [90, 45, 0, -45, -90],
    phase: () => {
      const unixtime = Math.floor(Date.now() / 1000);
      const progress = ((unixtime - newmoon) % lunartime) / lunartime;
      const age = progress * lunation;
      for (let i = 0; i < moon.phases.length; i++) {
        if (age <= moon.phases[i][1]) {
          if (i === 8) i = 0;
          return {
            name: moon.phases[i][0],
            age: Math.trunc(age),
            progress: Math.trunc(progress * 100),
            coordinate: moon.illum[i][0],
            range: moon.illum[i][1],
            angle: typeof latitude === "number" ? latitude : moon.lat[approx],
          };
        }
      }
    },
  };

  function moonwatch(btn) {
    const get = moon.phase();
    const number = get.age === 1 ? "day" : "days";
    btn.title = `${get.name}\n${get.age} ${number} \u{21ba} ${get.progress}%`;
    const mod = btn.querySelector("#vm-mp-mod");
    if (mod) {
      mod.setAttribute("y", get.coordinate);
      mod.setAttribute("height", get.range);
      mod.setAttribute("transform", `rotate(${get.angle})`);
    }
  }

  const conflate = (el) => {
    const send = () => moonwatch(el);
    send();
    el.addEventListener("click", send);
  };

  setTimeout(() => {
    const check = `.ToolbarButton-Button[name=${command}]`;
    const select = document.querySelector(check);
    if (select) conflate(select);
  }, 2000);

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
