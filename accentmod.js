// Accent Mod
// https://forum.vivaldi.net/topic/61827/accent-mod
// Use theme foreground or background color instead of fixed accent foreground color.
// Depends on the installation of additional CSS code (accentmod.css).

{
    let RGB = hex =>
        hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        ,(m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))

    let lum = (r, g, b) => { let a = [r, g, b].map(function (v) {
            v /= 255;
            return v <= 0.03928
                ? v / 12.92
                : Math.pow( (v + 0.055) / 1.055, 2.4 );
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    let contrast = (lum1, lum2) => {
        const bright = Math.max(lum1, lum2);
        const dark = Math.min(lum1, lum2);
        return (bright + 0.05) / (dark + 0.05);
    }

    let accentmod = () => {
        chrome.storage.local.get({
            'USE_TABCOLOR': '',
            'BROWSER_COLOR_BG': '',
            'BROWSER_COLOR_FG': '',
            'BROWSER_COLOR_ACCENT_BG': ''
        }, get => {
            const check = get.USE_TABCOLOR;
            const app = document.getElementById('app');
            if (check === false) {
                app.classList.add('accentmod');
                const bg = get.BROWSER_COLOR_BG;
                const fg = get.BROWSER_COLOR_FG;
                const ac = get.BROWSER_COLOR_ACCENT_BG;
                const rgbBg = RGB(bg);
                const lumBg = lum(rgbBg[0], rgbBg[1], rgbBg[2]);
                const rgbFg = RGB(fg);
                const lumFg = lum(rgbFg[0], rgbFg[1], rgbFg[2]);
                const rgbAc = RGB(ac);
                const lumAc = lum(rgbAc[0], rgbAc[1], rgbAc[2]);
                const conAc1 = contrast(lumAc, lumBg);
                const conAc2 = contrast(lumAc, lumFg);
                if (browser.matches('.theme-dark.acc-dark') && conAc1 > conAc2 ||
                    browser.matches('.theme-light.acc-light') && conAc1 > conAc2 ||
                    browser.matches('.theme-dark.acc-light') && conAc2 > conAc1 ||
                    browser.matches('.theme-light.acc-dark') && conAc2 > conAc1) {
                    if (!app.classList.contains('accentswitch')) app.classList.add('accentswitch');
                }
                else if (app.classList.contains('accentswitch')) app.classList.remove('accentswitch');
            }
            else app.classList = '';
        })
    }

    setTimeout(function wait() {
        const browser = document.getElementById('browser');
        if (browser) {
            accentmod();
            chrome.storage.onChanged.addListener(ch => {
                if (ch.THEME_CURRENT || ch.USE_TABCOLOR || ch.BROWSER_COLOR_ACCENT_BG ||
                    ch.BROWSER_COLOR_BG || ch.BROWSER_COLOR_FG) {
                    accentmod();
                }
            })
        }
        else setTimeout(wait, 300);
    }, 300)
}
