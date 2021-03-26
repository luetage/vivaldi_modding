// History Moon
// https://forum.vivaldi.net/topic/58821/project-history-moon/
// Displays the current moon phase instead of the history clock icon in the panel.
// Depends on the installation of additional CSS code (history-moon.css).

{
    let moonphase = () => {
        let dateobj = new Date();
        let day = dateobj.getUTCDate();
        let month = dateobj.getUTCMonth() + 1;
        let year = dateobj.getUTCFullYear();
        let c = e = jd = b = 0;
        if (month < 3) {
            year--;
            month += 12;
        }
        ++month;
        c = 365.25 * year;
        e = 30.6 * month;
        jd = c + e + day - 694039.09;
        jd /= 29.5305882;
        b = parseInt(jd);
        jd -= b;
        b = Math.round(jd * 8);
        if (b >= 8 ) {
            b = 0;
        }
        switch(b) {
            case 0:
                t = 'New Moon';
                break;
            case 1:
                t = 'Waxing Crescent Moon';
                break;
            case 2:
                t = 'Quarter Moon';
                break;
            case 3:
                t = 'Waxing Gibbous Moon';
                break;
            case 4:
                t = 'Full Moon';
                break;
            case 5:
                t = 'Waning Gibbous Moon';
                break;
            case 6:
                t = 'Last Quarter Moon';
                break;
            case 7:
                t = 'Waning Crescent Moon';
                break;
        }
        return [b, t];
    }

    let historymoon = () => {
        const history = document.querySelector('#switch button.history svg');
        history.innerHTML = `<path d="M15.491980933394752,7.711674344216877 A7.7459914508859775,7.711673374168715 0 0 1 7.74598948250877,15.423347718385598 A7.7459914508859775,7.711673374168715 0 0 1 -0.000001968377209657949,7.711674344216877 A7.7459914508859775,7.711673374168715 0 0 1 7.74598948250877,9.70048160457734e-7 A7.7459914508859775,7.711673374168715 0 0 1 15.491980933394752,7.711674344216877 z"></path><path class="history-moon-${_p[0]} history-moon-color" d=""></path>`;
        history.classList.add('history-moon');
    }

    let callback = mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
               historymoon();
            }
        })
    }

    var appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (this.tagName === 'BUTTON'){
            setTimeout(function() {
                if (this.classList.contains('panelbtn') && this.classList.contains('history')) {
                    _p = moonphase();
                    this.title += '\n' + _p[1];
                    historymoon();
                    const mutationObserver = new MutationObserver(callback);
                    mutationObserver.observe(this, {attributes: true});
                }
            }.bind(this, arguments[0]));
        }
        return appendChild.apply(this, arguments);
    }
}
