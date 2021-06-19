// Custom mods

{
    // Profile Image

    function profileImage(image) {
        image.innerHTML = '<svg width="18" height="18" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"></path></svg>';
        const svgImage = document.querySelector('.profile-popup button svg');
        svgImage.style.height = '18px';
        svgImage.style.width = '18px';
        const profile = document.querySelector('.profile-popup');
        profile.classList.add('sichtbar');
    }


    // Tab Scroll

    function tabScrollExit(tab) {
        tab.removeEventListener('mousemove', tabScrollExit);
        tab.removeEventListener('click', tabScrollTrigger);
    }

    function tabScrollTrigger(tab) {
        chrome.scripting.executeScript({
            target: {tabId: Number(tab.parentNode.id.replace(/\D/g, ''))},
            function: tabScrollScript
            })
        tabScrollExit(tab)
    }

    function tabScroll(e, tab) {
        if (tab.parentNode.classList.contains('active') && e.which === 1 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
            tab.addEventListener('mousemove', tabScrollExit(tab));
            tab.addEventListener('click', tabScrollTrigger(tab));
        }
    }

    const tabScrollScript = () => {
        let offset = window.pageYOffset;
        if (offset > 0) {
            window.sessionStorage.setItem('tabOffset',offset);
            window.scrollTo(0,0);
        }
        else {
            window.scrollTo(0,window.sessionStorage.getItem('tabOffset')||0);
        }
    }


    // Theme Import and Export

    function _checkImport() { // written by tam710562
        if (
            typeof _test.colors !== 'object' ||
            typeof _test.colors.accentBg !== 'string' ||
            !/^#(?:[0-9a-f]{3}){1,2}$/i.test(_test.colors.accentBg) ||
            typeof _test.colors.baseBg !== 'string' ||
            !/^#(?:[0-9a-f]{3}){1,2}$/i.test(_test.colors.baseBg) ||
            typeof _test.colors.baseFg !== 'string' ||
            !/^#(?:[0-9a-f]{3}){1,2}$/i.test(_test.colors.baseFg) ||
            typeof _test.colors.highlightBg !== 'string' ||
            !/^#(?:[0-9a-f]{3}){1,2}$/i.test(_test.colors.highlightBg) ||
            typeof _test.name !== 'string' ||
            typeof _test.settings !== 'object' ||
            typeof _test.settings.accentFromPage !== 'boolean' ||
            typeof _test.settings.accentOnWindow !== 'boolean' ||
            (typeof _test.settings.borderRadius !== 'number' && typeof _test.settings.borderRadius !== 'string') ||
            typeof _test.settings.tabsTransparent !== 'boolean' ||
            typeof _test.version !== 'number'
        ) {
            return false;
        }
        else {
            return true;
        }
    }

    function _message(pnt) {
        clearTimeout(_timeout);
        if (pnt === 'export') {
            _msg.innerText = 'Theme code copied to clipboard.';
        }
        else if (pnt === 'backup') {
            _msg.innerText = 'Backup copied to clipboard.';
        }
        else if (pnt === 'import') {
            _msg.innerText = 'Theme imported.';
        }
        else if (pnt === 'restore') {
            _msg.innerText = 'Backup imported.';
        }
        else if (pnt === 'notice') {
            _msg.innerText = 'Nothing to import. Check console.log';
        }
        else if (pnt === 'sort') {
            _msg.innerText = 'User themes sorted alphabetically.'
        }
        else {
            _msg.innerText = 'Theme code error.';
        }
        _timeout = setTimeout(function() {
            _msg.innerText = '';
        }, 5000);
    }

    function _importBackup() {
        chrome.storage.local.get({'THEMES_USER': ''}, function(res) {
            var userThemes = res.THEMES_USER;
            console.log('Importing themes...')
            for (i=0; i<_set.length; i++) {
                _test = _set[i];
                var test = _checkImport;
                if (test()) {
                    var compare = userThemes.findIndex(x => x.name == _set[i].name);
                    if (compare === -1) {
                        var ok = true;
                        userThemes.push(_set[i]);
                        console.log(_set[i].name + ' imported');
                    }
                    else {
                        console.log(_set[i].name + ' is a duplicate');
                    }
                }
                else {
                    console.log(_set[i].name + ' failed');
                }
            }
            if (ok === true) {
                chrome.storage.local.set({'THEMES_USER': userThemes}, function() {
                    _message('restore');
                })
            }
            else {
                _message('notice');
            }
        })
    }

    function _importTheme() {
        event.stopPropagation();
        event.preventDefault();
        if (_eventType === 'paste') {
            var clipboardData = event.clipboardData || window.clipboardData;
            var themeCode = clipboardData.getData('text');
        }
        else {
            var themeCode = event.dataTransfer.getData('text');
        }
        try {
            _set = JSON.parse(themeCode);
        }
        catch(err) {
            _message('error');
            return;
        }
        if (Object.keys(_set)[0] === 'colors') {
            _test = _set;
            var test = _checkImport;
            if (test()) {
                const nameField = document.querySelector('.theme-name');
                nameField.select();
                document.execCommand('insertText', false, _set.name);
                chrome.storage.local.get({'THEMES_USER': ''}, function(imp) {
                    var userThemes = imp.THEMES_USER;
                    for (i=0; i<userThemes.length; i++) {
                        if (userThemes[i].name === nameField.value) {
                            _set.name = nameField.value;
                            userThemes[i] = _set;
                            chrome.storage.local.set({
                                'THEMES_USER': userThemes,
                                'BROWSER_COLOR_ACCENT_BG': _set.colors.accentBg,
                                'BROWSER_COLOR_BG': _set.colors.baseBg,
                                'BROWSER_COLOR_FG': _set.colors.baseFg,
                                'BROWSER_COLOR_HIGHLIGHT_BG': _set.colors.highlightBg,
                                'TABCOLOR_BEHIND_TABS': _set.settings.accentOnWindow,
                                'USE_TABCOLOR': _set.settings.accentFromPage,
                                'BORDER_RADIUS': _set.settings.borderRadius,
                                'USE_TAB_TRANSPARENT_TABS': _set.settings.tabsTransparent,
                                'THEME_CURRENT': _set.name
                            })
                            _message('import');
                            break;
                        }
                    }
                })
            }
            else {
                _message('error');
            }
        }
        else if (Object.keys(_set)[0] === '0') {
            _importBackup();
        }
        else {
            _message('error');
        }
    }

    function _exportTheme(event) {
        if (event.altKey) {
            var backup = true;
        }
        if (event.shiftKey) {
            var order = true;
        }
        chrome.storage.local.get({
            'THEME_CURRENT': '',
            'THEMES_USER': ''
        }, function(exp) {
            const themeName = exp.THEME_CURRENT;
            const userThemes = exp.THEMES_USER;
            if (backup === true) {
                const themeCode = JSON.stringify(userThemes);
                navigator.clipboard.writeText(themeCode);
                _message('backup');
            }
            else if (order === true) {
                userThemes.sort(function (a,b) {
                    return a.name.localeCompare(b.name);
                })
                chrome.storage.local.set({'THEMES_USER': userThemes}, function() {
                    _message('sort');
                })
            }
            else {
                for (i=0; i<userThemes.length; i++) {
                    if (userThemes[i].name === themeName) {
                        const themeCode = JSON.stringify(userThemes[i]);
                        navigator.clipboard.writeText(themeCode);
                        _message('export');
                        break;
                    }
                }
            }
        })
    }

    function _moveTheme() {
        chrome.storage.local.get({
            'THEME_CURRENT': '',
            'THEMES_USER': ''
        }, function(mv) {
            const themeName = mv.THEME_CURRENT;
            const userThemes = mv.THEMES_USER;
            var index = userThemes.findIndex(x => x.name == themeName);
            if (index !== -1) {
                if (_toMove === 'left') {
                    if (index !== 0) {
                        var fromI = userThemes[index];
                        var toI = userThemes[index-1];
                        userThemes[index-1] = fromI;
                        userThemes[index] = toI;
                    }
                    else {
                        return;
                    }
                }
                else {
                    var last = userThemes.length - 1;
                    if (index < last) {
                        var fromI = userThemes[index];
                        var toI = userThemes[index+1];
                        userThemes[index+1] = fromI;
                        userThemes[index] = toI;
                    }
                    else {
                        return;
                    }
                }
                chrome.storage.local.set({'THEMES_USER': userThemes});
            }
        })
    }

    function createPort() {
        if (document.querySelector(_themeBtn).classList.contains('button-pressed')) {
            const cont = document.querySelector('.theme-metadata');
            const importBtn = document.createElement('input');
            importBtn.setAttribute('type', 'text');
            importBtn.setAttribute('placeholder', 'Import');
            importBtn.id = 'importTheme';
            cont.appendChild(importBtn);
            const exportBtn = document.createElement('input');
            exportBtn.setAttribute('type', 'submit');
            exportBtn.classList.add('primary');
            exportBtn.setAttribute('value', 'Export');
            exportBtn.setAttribute('title', 'Click to export theme\nAlt-click to backup all themes\nShift-click to sort themes');
            exportBtn.id = 'exportTheme';
            cont.appendChild(exportBtn);
            _msg = document.createElement('span');
            _msg.id = 'modInfo';
            cont.appendChild(_msg);
            document.getElementById('exportTheme').addEventListener('click', _exportTheme);
            const importInput = document.getElementById('importTheme');
            importInput.addEventListener('paste', function() {
                _eventType = 'paste';
                _importTheme(event);
            });
            importInput.addEventListener('drop', function() {
                _eventType = 'drop';
                _importTheme(event);
            });
            _timeout = {};
        }
    }

    function portThemes() {
        const styleCheck = document.getElementById('portThemes');
        if (!styleCheck) {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'portThemes';
            style.innerHTML = '.move-left button:focus, .move-right button:focus {border-color: var(--colorBorder) !important;box-shadow: none !important;}#importTheme, #exportTheme {width: 80px;margin-left: 6px;}#importTheme::-webkit-input-placeholder {opacity: 1;color: var(--colorHighlightBg);text-align: center;}#modInfo {margin-top: 6px;margin-left: 12px;}';
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        const modCheck = document.querySelector('.move-left');
        if (!modCheck) {
            const group = document.createElement('div');
            group.classList.add('toolbar', 'toolbar-group');
            group.innerHTML = '<div class="button-toolbar move-left"><button draggable="false" tabindex="auto" title="Move Theme Left" class=""><svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1216 448v896q0 26-19 45t-45 19-45-19l-448-448q-19-19-19-45t19-45l448-448q19-19 45-19t45 19 19 45z"/></svg></button></div><hr><div class="button-toolbar move-right"><button draggable="false" tabindex="auto" title="Move Theme Right" class=""><svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1152 896q0 26-19 45l-448 448q-19 19-45 19t-45-19-19-45v-896q0-26 19-45t45-19 45 19l448 448q19 19 19 45z"/></svg></button></div>';
            document.querySelector(_themeBtn).parentNode.parentNode.appendChild(group);
            document.querySelector('.move-left').addEventListener('click', function() {
                _toMove = 'left';
                _moveTheme();
            })
            document.querySelector('.move-right').addEventListener('click', function() {
                _toMove = 'right';
                _moveTheme();
            })
            document.querySelector(_themeBtn).addEventListener('click', function() {
                setTimeout(createPort, 50);
            })
        }
    }


    // Backup search engines

    function _msgSearch(pnt) {
        clearTimeout(_msgTimeout);
        if (pnt === 'backup') {
            _infoSearch.innerText = 'Search engines backup copied to clipboard.';
        }
        else if (pnt === 'restore') {
            _infoSearch.innerText = 'Search engines restored.';
        }
        else {
            _infoSearch.innerText = 'Search engines code error.'
        }
        _msgTimeout = setTimeout(function() {
            _infoSearch.innerText = '';
        }, 5000)
    }

    function _restoreSearch() {
        event.preventDefault();
        event.stopPropagation();
        if (_eventSearch === 'paste') {
            var clipboardData = event.clipboardData || window.clipboardData;
            var engineCode = clipboardData.getData('text');
        }
        else {
            var engineCode = event.dataTransfer.getData('text');
        }
        try {
            var engines = JSON.parse(engineCode);
        }
        catch(err) {
            _msgSearch('error');
            return;
        }
        if ('engines' in engines && 'default' in engines && 'defaultPrivate' in engines) {
            chrome.storage.local.set({'SEARCH_ENGINE_COLLECTION': engines}, function() {
                _msgSearch('restore');
            })
        }
        else {
            _msgSearch('error');
        }
    }

    function _backupSearch() {
        chrome.storage.local.get({'SEARCH_ENGINE_COLLECTION': ''}, function(back) {
            const engines = back.SEARCH_ENGINE_COLLECTION;
            const engineCode = JSON.stringify(engines);
            navigator.clipboard.writeText(engineCode);
            _msgSearch('backup');
        })
    }

    function searchEngines() {
        const styleCheck = document.getElementById('searchEngines');
        if (!styleCheck) {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'searchEngines';
            style.innerHTML = '#backupSearch, #restoreSearch {margin-left: 6px;}#restoreSearch{width: 130px;margin-top: 6px;}#restoreSearch::-webkit-input-placeholder {opacity: 1;color: var(--colorHighlightBg);text-align: center;}#msgConfirm{margin-left: 12px}';
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        const modCheck = document.getElementById('backupSearch');
        if (!modCheck) {
            const place = document.querySelector('.setting-section > div > .setting-group.unlimited > .setting-single');
            const backupBtn = document.createElement('input');
            backupBtn.setAttribute('type', 'button');
            backupBtn.setAttribute('value', 'Backup');
            backupBtn.id = 'backupSearch';
            place.insertBefore(backupBtn, place.lastChild);
            const restoreInput = document.createElement('input');
            restoreInput.setAttribute('type', 'text');
            restoreInput.setAttribute('placeholder', 'Restore Backup');
            restoreInput.id = 'restoreSearch';
            place.insertBefore(restoreInput, place.lastChild);
            _infoSearch = document.createElement('span');
            _infoSearch.id = 'msgConfirm';
            place.insertBefore(_infoSearch, place.lastChild);
            document.getElementById('backupSearch').addEventListener('click', _backupSearch);
            const restoreSearch = document.getElementById('restoreSearch');
            restoreSearch.addEventListener('paste', function() {
                _eventSearch = 'paste';
                _restoreSearch(event);
            })
            restoreSearch.addEventListener('drop', function() {
                _eventSearch = 'drop';
                _restoreSearch(event);
            })
            _msgTimeout = {};
        }
    }


    // History Moon

    let moon = {
        phases: [['New', 0, 1], ['Waxing Crescent', 1, 6.38264692644], ['First Quarter', 6.38264692644, 8.38264692644], ['Waxing Gibbous', 8.38264692644, 13.76529385288], ['Full', 13.76529385288, 15.76529385288], ['Waning Gibbous', 15.76529385288, 21.14794077932], ['Last Quarter', 21.14794077932, 23.14794077932], ['Waning Crescent', 23.14794077932, 28.53058770576], ['', 28.53058770576, 29.53058770576]],
        phase: () => {
            const lunarcycle = 29.53058770576;
            const lunartime = lunarcycle * 86400;
            const unixtime = Math.round(Date.now()/1000);
            const newmoon = 947182440;
            const diff = unixtime - newmoon;
            const mod = diff % lunartime;
            const frac = mod / lunartime;
            const age = frac * lunarcycle;
            console.log('moon age: ' + age);
        for (let i = 0; i < moon.phases.length; i++) {
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


    // Accent Mod

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

    /*------ end of function block ------*/


    let appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        if (arguments[0].tagName === 'BUTTON'){
            setTimeout(function() {
                if (this.classList.contains('profile-popup')) profileImage(arguments[0]);
            }.bind(this, arguments[0]));
        }
        if (this.tagName === 'BUTTON') {
            setTimeout(function() {
                if (this.classList.contains('panelbtn') && this.classList.contains('mail')) this.title = 'M3';
                if (this.classList.contains('panelbtn') && this.classList.contains('history')) {
                    const lc = moon.phase();
                    historymoon(lc.phase);
                    this.title += `\n${lc.name} Moon ${lc.progress}%`;
                    const mw = mutations => moonwatch(mutations, lc.phase);
                    new MutationObserver(mw).observe(this, {attributes: true});
                }
            }.bind(this, arguments[0]));
        }
        if (arguments[0].tagName === 'DIV') {
            setTimeout(function() {
                if (arguments[0].classList.contains('tab-header')) {
                    const trigger = event => tabScroll(event, arguments[0]);
                    arguments[0].addEventListener('mousedown', trigger);
                }
            }.bind(this, arguments[0]));
        }
        return appendChild.apply(this, arguments);
    }

    const settingsUrl = 'chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=';
    const _themeBtn = '.setting-group.unlimited > .toolbar.toolbar-default > .button-toolbar > button';
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>{
        if (changeInfo.url === `${settingsUrl}search`) setTimeout(searchEngines, 100);
        else if (changeInfo.url === `${settingsUrl}themes`) setTimeout(portThemes, 100);
    })

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

// Autosave sessions
// Written by LonM
!function(){"use strict";const e={delay:"Period (minutes)",restart:"This setting requires a restart to take full effect.",maxoldsessions:"Old Sessions Count",prefix:"Prefix",prefixdesc:"A unique prefix made up of the following characters: A-Z 0-9 _",saveprivate:"Save Private Windows"};let t={};function i(e){vivaldi.sessionsPrivate.getAll(i=>{const n=e?"PRIV":"",o=t.LONM_SESSION_AUTOSAVE_PREFIX+n,s=t.LONM_SESSION_AUTOSAVE_MAX_OLD_SESSIONS,a=i.filter(e=>0===e.name.indexOf(o)).sort((e,t)=>e.createDateJS-t.createDateJS),r=o+Math.round(Date.now()/1000);if(!function(e){return/^[^\\\/:\*\?"<>\|]+$/.test(e)&&!/^\./.test(e)&&!/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i.test(e)}(r))throw new Error("[Autosave Sessions] Cannot name a session as "+r);vivaldi.sessionsPrivate.saveOpenTabs(r,{saveOnlyWindowId:0},()=>{});let d=a.length+1,c=0;for(;d>s;)vivaldi.sessionsPrivate.delete(a[c].name,()=>{}),c++,d--})}function n(){chrome.storage.local.get("LONM_SESSION_AUTOSAVE_LAST_WINDOW",e=>{const t=e.LONM_SESSION_AUTOSAVE_LAST_WINDOW;window.vivaldiWindowId!==t?chrome.windows.getAll(e=>{e.find(e=>e.id===t)||chrome.storage.local.set({LONM_SESSION_AUTOSAVE_LAST_WINDOW:window.vivaldiWindowId},()=>{i()})}):i()})}function o(){chrome.storage.local.get("LONM_SESSION_AUTOSAVE_LAST_PRIV_WINDOW",e=>{const t=e.LONM_SESSION_AUTOSAVE_LAST_PRIV_WINDOW;window.vivaldiWindowId!==t?chrome.windows.getAll(e=>{e.find(e=>e.id===t)||chrome.storage.local.set({LONM_SESSION_AUTOSAVE_LAST_PRIV_WINDOW:window.vivaldiWindowId},()=>{i(!0)})}):i(!0)})}const s="chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=general";function a(){const e=document.querySelector(".vivaldi-settings .settings-content section"),i=document.getElementById("lonmAutosaveSessionsSettings");if(e){if(!i){const i=document.createElement("section");i.className="setting-section",i.id="lonmAutosaveSessionsSettings";const n=document.createElement("div");n.insertAdjacentHTML("beforeend","<h2>Autosave Sessions Mod</h2>"),r.forEach(e=>{n.appendChild(function(e){const i=t[e.id],n=document.createElement("div");n.className="setting-single";const o=document.createElement("h3");if(o.innerText=e.title,n.appendChild(o),e.description){const t=document.createElement("p");t.className="info",t.innerText=e.description,n.appendChild(t)}const s=document.createElement("input");switch(s.id=e.id,s.value=i,s.autocomplete="off",s.autocapitalize="off",s.autocorrect="off",s.spellcheck="off",e.type){case Number:s.type="number";break;case String:s.type="text";break;case Boolean:s.type="checkbox",i&&(s.checked="checked");break;default:throw Error("Unknown setting type!")}e.max&&(s.max=e.max);e.min&&(s.min=e.min);e.pattern&&(s.pattern=e.pattern);return s.addEventListener("input",function(e){"checkbox"===e.target.type?t[this.id]=e.target.checked:(e.target.checkValidity(),e.target.reportValidity()&&""!==e.target.value&&(t[this.id]=e.target.value)),chrome.storage.local.set(t)}.bind(e)),n.appendChild(s),n}(e))}),i.appendChild(n),e.insertAdjacentElement("afterbegin",i)}}else setTimeout(a,1e3)}const r=[{id:"LONM_SESSION_AUTOSAVE_DELAY_MINUTES",type:Number,min:1,max:void 0,default:5,title:e.delay,description:e.restart},{id:"LONM_SESSION_AUTOSAVE_MAX_OLD_SESSIONS",type:Number,min:1,max:void 0,default:5,title:e.maxoldsessions},{id:"LONM_SESSION_AUTOSAVE_PREFIX",type:String,pattern:"[\\w_]{0,20}",default:"VSESAUTOSAVE_",title:e.prefix,description:e.prefixdesc},{id:"LONM_SESSION_SAVE_PRIVATE_WINDOWS",type:Boolean,default:!1,title:e.saveprivate,description:e.restart}];function d(){window.vivaldiWindowId?chrome.windows.getCurrent(e=>{e.incognito||chrome.storage.local.set({LONM_SESSION_AUTOSAVE_LAST_WINDOW:e.vivaldiWindowId},()=>{setInterval(n,60*t.LONM_SESSION_AUTOSAVE_DELAY_MINUTES*1e3)}),t.LONM_SESSION_SAVE_PRIVATE_WINDOWS&&e.incognito&&chrome.storage.local.set({LONM_SESSION_AUTOSAVE_LAST_PRIV_WINDOW:e.vivaldiWindowId},()=>{setInterval(o,60*t.LONM_SESSION_AUTOSAVE_DELAY_MINUTES*1e3)}),chrome.tabs.onUpdated.addListener(function(e,t,i){t.url===s&&a()})}):setTimeout(d,500)}!function(){const e=r.reduce((e,t)=>(e[t.id]=t.default,e),{});chrome.storage.local.get(e,e=>{t=e,setTimeout(d,500)})}()}();

