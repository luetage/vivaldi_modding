/*
Random Theme Button
https://forum.vivaldi.net/topic/34767/random-theme-button
Adds a button in the address bar, which will load a random user created theme on click.
*/

function randomize() {
    chrome.storage.local.get({
        'THEMES_USER': '',
        'THEME_CURRENT': ''
    }, function(rd) {
        var userThemes = rd.THEMES_USER;
        var currentTheme = rd.THEME_CURRENT;
        if (userThemes.length > 1) {
            while (random === undefined || random.name === currentTheme) {
                var random = userThemes[Math.floor(Math.random()*userThemes.length)];
            }
            chrome.storage.local.set({
                'THEME_CURRENT': random.name,
                'BROWSER_COLOR_ACCENT_BG': random.colors.accentBg,
                'BROWSER_COLOR_BG': random.colors.baseBg,
                'BROWSER_COLOR_FG': random.colors.baseFg,
                'BROWSER_COLOR_HIGHLIGHT_BG': random.colors.highlightBg,
                'TABCOLOR_BEHIND_TABS': random.settings.accentOnWindow,
                'USE_TABCOLOR': random.settings.accentFromPage,
                'BORDER_RADIUS': random.settings.borderRadius,
                'USE_TAB_TRANSPARENT_TABS': random.settings.tabsTransparent
            });
        }
        else {
            console.log('Please create additional themes in vivaldi://settings/themes.');
        }
    });
};

function randomTheme() {
    const adr = document.querySelector('.toolbar-addressbar.toolbar');
    var div = document.createElement('div');
    div.innerHTML = '<button class="button-toolbar random" title="Random theme" tabindex="0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><text x="8.5" y="18" style="font-size: 14px; font-weight: bold;">R</text></svg></button>';
    adr.insertBefore(div,document.querySelector('.toolbar-addressbar.toolbar > .extensions-wrapper'));
    document.querySelector('.random').addEventListener('click', randomize);
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        randomTheme();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
