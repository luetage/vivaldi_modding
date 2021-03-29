// History Moon
// https://forum.vivaldi.net/topic/58821/project-history-moon/
// Displays the current moon phase, instead of the history clock icon, in the panel.
// Depends on the installation of additional CSS code (history-moon.css).
// Moon phase calculation adapted from https://minkukel.com/en/various/calculating-moon-phase/

{
    let moon = {
        phases: [['New', 0, 1], ['Waxing Crescent', 1, 6.38264692644], ['First Quarter', 6.38264692644, 8.38264692644], ['Waxing Gibbous', 8.38264692644, 13.76529385288], ['Full', 13.76529385288, 15.76529385288], ['Waning Gibbous', 15.76529385288, 21.14794077932], ['Last Quarter', 21.14794077932, 23.14794077932], ['Waning Crescent', 23.14794077932, 28.53058770576], ['end', 28.53058770576, 29.53058770576]],
        phase: () => {
            const lunarcycle = 29.53058770576;
            const lunartime = lunarcycle * 86400;
            const unixtime = Math.round(Date.now()/1000);
            const newmoon = 947182440;
            const diff = unixtime - newmoon;
            const mod = diff % lunartime;
            const frac = mod / lunartime;
            const age = frac * lunarcycle;
            for (let i = 0; i < 9; i++) {
                if (age >= moon.phases[i][1] && age <= moon.phases[i][2]) {
                    if (i === 8) i = 0;
                    return {phase: i, name: moon.phases[i][0], progress: Math.trunc(frac * 100)};
                }
            }
        }
    }

    let historymoon = phase => {
        const hbtn = document.querySelector('#switch button.history span');
        hbtn.innerHTML = `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 216.2 216.2" class="history-moon"><path class="history-moon-${phase}" d="" fill-rule="evenodd"></path></svg>`;
    }

    let moonwatch = (mutations, phase) => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') historymoon(phase);
        })
    }

    let appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (this.tagName === 'BUTTON') {
            setTimeout(function() {
                if (this.classList.contains('panelbtn') && this.classList.contains('history')) {
                    const p = moon.phase();
                    historymoon(p.phase);
                    this.title += '\n' + p.name + ' Moon ' + p.progress + '%';
                    const mw = (mutations) => moonwatch(mutations, p.phase);
                    const resist = new MutationObserver(mw);
                    resist.observe(this, {attributes: true});
                }
            }.bind(this, arguments[0]));
        }
        return appendChild.apply(this, arguments);
    }
}
