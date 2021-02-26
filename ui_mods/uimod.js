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
        chrome.tabs.executeScript({code: tabScrollScript});
        tabScrollExit(tab);
    }

    function tabScroll(e, tab) {
        if (tab.parentNode.classList.contains('active') && e.which === 1 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
            tab.addEventListener('mousemove', tabScrollExit(tab));
            tab.addEventListener('click', tabScrollTrigger(tab));
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


    // Attack on the status bar

    function statusInfoLogic() {
        const statusInfoToggle = document.getElementById('statusInfoToggle');
        const statusInfo = document.querySelector('.StatusInfo');
        if (statusInfoToggle.classList.contains('zeig')) {
            statusInfoToggle.classList.remove('zeig');
            statusInfo.removeAttribute('id');
            var info = 'off';
        }
        else {
            statusInfoToggle.classList.add('zeig');
            statusInfo.id = 'zeig';
            var info = 'on';
        }
        chrome.storage.local.set({'statusInfo': info});
    }

    function statusMod() {
        const cont = document.createElement('div');
        const statusBar = document.querySelector('.toolbar-statusbar');
        const statusInfo = document.querySelector('.StatusInfo');
        cont.id = 'statusContainer';
        document.querySelector('.inner').appendChild(cont);
        cont.appendChild(statusBar);
        if (document.querySelector('.biscuit-string')) {
            const version = document.querySelector('.biscuit-string').innerText;
            const divB = document.createElement('div');
            divB.classList.add('button-toolbar');
            divB.id = 'biscuitButton';
            divB.setAttribute('title', version + '\nClick to copy version string');
            divB.innerHTML = '<button draggable="false" tabindex="-1"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 12 24 C 17.26 24 20.18 24 22.09 22.09 C 24 20.18 24 17.29 24 12 C 24 6.71 24 3.82 22.09 1.91 C 20.18 0 17.26 0 12 0 C 6.74 0 3.82 0 1.9 1.94 C -0.02 3.88 0 6.77 0 12 C 0 17.23 0 20.21 1.9 22.12 C 3.8 24.03 6.74 24 12 24 Z  M 18.9 8.6 Q 16.11 13.42 13.34 18.24 C 13.042 18.82 12.461 19.199 11.81 19.24 C 11.088 19.323 10.388 18.954 10.05 18.31 Q 8.3 15.31 6.56 12.31 L 4.46 8.58 C 4.12 8.017 4.103 7.315 4.415 6.736 C 4.727 6.157 5.322 5.786 5.98 5.76 C 6.704 5.709 7.386 6.105 7.7 6.76 L 9.25 9.4 C 9.63 10.05 9.99 10.7 10.37 11.34 C 10.868 12.24 11.802 12.813 12.83 12.85 C 14.416 12.94 15.797 11.778 15.98 10.2 C 15.988 10.097 15.988 9.993 15.98 9.89 C 15.981 9.408 15.871 8.933 15.66 8.5 C 15.298 7.843 15.364 7.033 15.827 6.443 C 16.29 5.853 17.061 5.597 17.785 5.792 C 18.509 5.988 19.047 6.597 19.15 7.34 C 19.207 7.776 19.12 8.219 18.9 8.6 Z "></path></svg></button>';
            statusBar.insertBefore(divB, statusInfo);
            document.getElementById('biscuitButton').addEventListener('click', function() {
                navigator.clipboard.writeText(version);
            })
        }
        const divL = document.createElement('div');
        divL.classList.add('button-toolbar');
        divL.id = 'statusInfoToggle';
        divL.setAttribute('title', 'Toggle status info');
        divL.innerHTML = '<button draggable="false" tabindex="-1"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1520 1216q0-40-28-68l-208-208q-28-28-68-28-42 0-72 32 3 3 19 18.5t21.5 21.5 15 19 13 25.5 3.5 27.5q0 40-28 68t-68 28q-15 0-27.5-3.5t-25.5-13-19-15-21.5-21.5-18.5-19q-33 31-33 73 0 40 28 68l206 207q27 27 68 27 40 0 68-26l147-146q28-28 28-67zm-703-705q0-40-28-68l-206-207q-28-28-68-28-39 0-68 27l-147 146q-28 28-28 67 0 40 28 68l208 208q27 27 68 27 42 0 72-31-3-3-19-18.5t-21.5-21.5-15-19-13-25.5-3.5-27.5q0-40 28-68t68-28q15 0 27.5 3.5t25.5 13 19 15 21.5 21.5 18.5 19q33-31 33-73zm895 705q0 120-85 203l-147 146q-83 83-203 83-121 0-204-85l-206-207q-83-83-83-203 0-123 88-209l-88-88q-86 88-208 88-120 0-204-84l-208-208q-84-84-84-204t85-203l147-146q83-83 203-83 121 0 204 85l206 207q83 83 83 203 0 123-88 209l88 88q86-88 208-88 120 0 204 84l208 208q84 84 84 204z"/></svg></button>';
        statusBar.insertBefore(divL, statusInfo);
        document.getElementById('statusInfoToggle').addEventListener('click', statusInfoLogic);
        chrome.storage.local.get({'statusInfo': 'on'}, function(check) {
            const info = check.statusInfo;
            if (info === 'on') {
                document.querySelector('.StatusInfo').id = 'zeig';
                document.getElementById('statusInfoToggle').classList.add('zeig');
            }
        })
    }


    // History Clock

    function historyClock() {
        const clock = document.querySelector('#switch button.history');
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        if (clockSetInt === true) {
            if (clockRelax !== -1 && clockRelax !== minutes) {
                clearInterval(clockTimer)
                setInterval(historyClock, 60000);
                clockSetInt = false;
            }
            clockRelax = minutes;
        }
        if (clock) {
            clock.style = '--timeHourRotation: rotate(' + Math.floor(hours*30+minutes/2) + 'deg); --timeMinuteRotation: rotate(' + minutes*6 + 'deg)';
        }
    }


    // Internal pages

    function intpages(id, page) {
        const bg = document.documentElement.style.getPropertyValue('--colorBg');
        const bgdark = document.documentElement.style.getPropertyValue('--colorBgDark');
        const bglightintense = document.documentElement.style.getPropertyValue('--colorBgLightIntense');
        const fg = document.documentElement.style.getPropertyValue('--colorFg');
        const fgintense = document.documentElement.style.getPropertyValue('--colorFgIntense');
        const fgfadedmore = document.documentElement.style.getPropertyValue('--colorFgFadedMore');
        const hi = document.documentElement.style.getPropertyValue('--colorHighlightBg');
        const border = document.documentElement.style.getPropertyValue('--colorBorder');
        const green = document.documentElement.style.getPropertyValue('--colorSuccessBg');
        const red = document.documentElement.style.getPropertyValue('--colorErrorBg');
        const yellow = document.documentElement.style.getPropertyValue('--colorWarningBg');
        if (page === 'chrome://version/') {
            var sendit = `
                html {
                    background-image: linear-gradient(to bottom, transparent 50%, ${bg} 50%), linear-gradient(to right, ${bgdark} 50%, ${bg} 50%) !important;
                    background-size: 10px 10px, 10px 10px !important;
                }
                .label, #company {
                    color: ${fgintense};
                    font-size: 0.9em !important;
                }
                .version, #slogan {
                    color: ${fg} !important;
                    font-size: 0.85em !important;
                }
                .version, #useragent {
                    font-family: unset !important;
                }
                #copyright {
                    font-size: 0.8em !important;
                }
                a {
                    color: ${hi};
                }
            `;
        }
        else if (page === 'about:blank') {
            var sendit = `
                body {
                    background-image: linear-gradient(to bottom, transparent 50%, ${bg} 50%), linear-gradient(to right, ${bgdark} 50%, ${bg} 50%);
                    background-size: 10px 10px, 10px 10pt;
                }
            `;
        }
        chrome.tabs.insertCSS(id, {code: sendit});
    }

    /*------ end of function block ------*/


    const tabScrollScript = '!' + function () {
        var offset = window.pageYOffset;
        if (offset > 0) {
            window.sessionStorage.setItem('tabOffset',offset);
            window.scrollTo(0,0);
        }
        else {
            window.scrollTo(0,window.sessionStorage.getItem('tabOffset')||0);
        }
    } + '();';

    var clockSetInt = true;
    var clockRelax = -1;
    var clockTimer = setInterval(historyClock, 1000);

    var appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (arguments[0].tagName === 'BUTTON'){
            setTimeout(function() {
                if (this.classList.contains('profile-popup')) {
                    profileImage(arguments[0]);
                }
            }.bind(this, arguments[0]));
        }
        if (arguments[0].tagName === 'DIV') {
            setTimeout(function() {
                if (this.classList.contains('toolbar-statusbar')) {
                    const statusContainer = document.getElementById('statusContainer');
                    if (!statusContainer) {
                        statusMod();
                    }
                }
                if (arguments[0].classList.contains('tab-header')) {
                    const trigger = (event) => tabScroll(event, arguments[0]);
                    arguments[0].addEventListener('mousedown', trigger);
                }
            }.bind(this, arguments[0]));
        }
        return appendChild.apply(this, arguments);
    }

    var removeChild = Element.prototype.removeChild;
    Element.prototype.removeChild = function () {
        if (arguments[0].tagName === 'DIV' && arguments[0].classList.contains('toolbar-statusbar')) {
            document.getElementById('statusContainer').remove();
        }
        else {
            return removeChild.apply(this, arguments);
        }
    }

    setTimeout(function wait() {
        const browser = document.getElementById('browser');
        if (browser) {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'statusMod';
            style.innerHTML = `#statusContainer {position: absolute;z-index: 1;max-width: 100vw;right: 0;top: 0;box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);}.toolbar-statusbar {display: none;border-top: none;border-bottom: 1px solid var(--colorBorder);}#statusContainer .toolbar-statusbar {display: flex}.toolbar-statusbar .button-popup.button-popup-above {bottom: unset;top: 22px;}.toolbar-statusbar .button-popup.button-popup-above:before, .toolbar-statusbar .button-popup.button-popup-above:after {opacity: 0;}.biscuit-setting-version {display: none !important;}#biscuitButton button svg, #statusInfoToggle button svg {width: 14px;height: 14px;}#statusInfoToggle.zeig button svg {fill: var(--colorHighlightBg);}.StatusInfo {display: none;}#zeig.StatusInfo.StatusInfo--Visible {display: inline-block;}`;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        else {
            setTimeout(wait, 300);
        }
    }, 300)

    const settingsUrl = 'chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=';
    const _themeBtn = '.setting-group.unlimited > .toolbar.toolbar-default > .button-toolbar > button';
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.url === `${settingsUrl}search`) {
            setTimeout(searchEngines, 100);
        }
        else if (changeInfo.url === `${settingsUrl}themes`) {
            setTimeout(portThemes, 100);
        }
        else if (changeInfo.url === 'chrome://version/' || changeInfo.title === 'About Version' || changeInfo.url === 'about:blank') {
            intpages(tabId, changeInfo.url);
        }
    })
}


// Restore Methods for chrome.tabs
// Written by Tam710562
window.gnoh=Object.assign(window.gnoh||{},{tabs:{getAllInWindow:function(){let e,t;Array.from(arguments).forEach(function(c){switch(typeof c){case"number":e=c;break;default:t=c}}),chrome.tabs.query({windowId:e||vivaldiWindowId},function(e){t(e)})},getSelected:function(){let e,t;Array.from(arguments).forEach(function(c){switch(typeof c){case"number":e=c;break;default:t=c}}),chrome.tabs.query({active:!0,windowId:e||vivaldiWindowId},function(e){const c=e[0];c&&t(c)})},executeScript:function(){let e,t,c;Array.from(arguments).forEach(function(n){switch(typeof n){case"number":e=n;break;case"object":t=n;break;default:c=n}}),e?gnoh.webPageView.callMethod(e,"executeScript",[t,c]):gnoh.webPageView.callMethod("executeScript",[t,c])},insertCSS:function(){let e,t,c;Array.from(arguments).forEach(function(n){switch(typeof n){case"number":e=n;break;case"object":t=n;break;default:c=n}}),e?gnoh.webPageView.callMethod(e,"insertCSS",[t,c]):gnoh.webPageView.callMethod("insertCSS",[t,c])}},webPageView:{getSelected(e){gnoh.tabs.getSelected(function(t){e(this.get(t.id))}.bind(this))},get:function(e){return document.getElementById(e)},callMethod:function(){let e,t,c;if(Array.from(arguments).forEach(function(n){switch(typeof n){case"number":e=n;break;case"string":t=n;break;default:c=n}}),e){const n=this.get(e);n[t].apply(n,c)}else this.getSelected(function(e){e[t].apply(e,c)})}}}),chrome.tabs.getAllInWindow||(chrome.tabs.getAllInWindow=gnoh.tabs.getAllInWindow),chrome.tabs.getSelected||(chrome.tabs.getSelected=gnoh.tabs.getSelected),chrome.tabs.executeScript||(chrome.tabs.executeScript=gnoh.tabs.executeScript),chrome.tabs.insertCSS||(chrome.tabs.insertCSS=gnoh.tabs.insertCSS);
