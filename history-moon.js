// History Moon
// https://forum.vivaldi.net/topic/58821/project-history-moon/
// Displays the current moon phase, instead of the history clock icon, in the panel.
// Depends on the installation of additional CSS code (history-moon.css).
// Moon phase calculation from https://gist.github.com/endel/dfe6bb2fbe679781948c

{
    let moon = {
        phases: ['New', 'Waxing Crescent', 'Quarter', 'Waxing Gibbous', 'Full', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'],
        phase: () => {
            let date = new Date();
            let day = date.getUTCDate();
            let month = date.getUTCMonth() + 1;
            let year = date.getUTCFullYear();
            if (month < 3) {
                year--;
                month += 12;
            }
            ++month;
            let c = 365.25 * year;
            let e = 30.6 * month;
            let jd = c + e + day - 694039.09;
            jd /= 29.5305882;
            let b = parseInt(jd);
            jd -= b;
            b = Math.round(jd * 8);
            if (b >= 8) b = 0;
            return {phase: b, name: moon.phases[b]};
        }
    }

    let historymoon = () => {
        const hbtn = document.querySelector('#switch button.history span');
        hbtn.innerHTML = `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 216.2 216.2" class="history-moon"><path class="history-moon-${_p.phase}" d="" fill-rule="evenodd"></path></svg>`;
    }

    let repel = mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
               historymoon(); 
            }
        })
    }

    let appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (this.tagName === 'BUTTON'){
            setTimeout(function() {
                if (this.classList.contains('panelbtn') && this.classList.contains('history')) {
                    _p = moon.phase();
                    this.title += '\n' + _p.name + ' Moon';
                    historymoon();
                    const moonwatch = new MutationObserver(repel);
                    moonwatch.observe(this, {attributes: true});
                }
            }.bind(this, arguments[0]));
        }
        return appendChild.apply(this, arguments);
    }
}
