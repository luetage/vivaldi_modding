/*
Theme Import and Export
https://forum.vivaldi.net/topic/33154/import-and-export-themes
Adds Import and Export button to Vivaldi's theme page when clicking the +/add or pencil/edit button. Exports theme by copying the theme code as json string to clipboard. Enables backing up and sharing themes. New ersion also allows backing up all themes by alt-click and importing such a backup by pasting it.
*/

function _compmode() {
    if (_set.themePage == 0) {
        _set.themePage = false;
    }
    else {
        _set.themePage = true;
    }
    if (_set.themeWin == 0) {
        _set.themeWin = false;
    }
    else {
        _set.themeWin = true;
    }
    if (_set.themeTabs == 0) {
        _set.themeTabs = false;
    }
    else {
        _set.themeTabs = true;
    }
    var adapt = {
        'colors': {
            'accentBg': '#' + _set.themeAc,
            'baseBg': '#' + _set.themeBg,
            'baseFg': '#' + _set.themeFg,
            'highlightBg': '#' + _set.themeHi,
        },
        'name': _set.themeName,
        'settings': {
            'accentFromPage': _set.themePage,
            'accentOnWindow': _set.themeWin,
            'borderRadius': _set.themeRound,
            'tabsTransparent': _set.themeTabs
        },
        'version': 0.1
    };
    _set = adapt;
};

function _checkImport() {// written by tam710562
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
};

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
    else if (pnt === 'warning') {
        _msg.innerText = 'Overwrite all user themes and restore backup?';
    }
    else if (pnt === 'restore') {
        console.log('restore');
        _msg.innerText = 'Backup restored.';
    }
    else {
        _msg.innerText = 'Theme code error.';
    }
    _timeout = setTimeout(function(){
        _msg.innerText = '';
    }, 5000);
};

function _restoreThemes() {
    _msg.innerText = '';
    _exportBtn.value = 'Export';
    for (i=0; i<_set.length; i++) {
        _test = _set[i];
        var test = _checkImport;
        if (test()) {
            console.log(_set[i].name + ' passed');
        }
        else {
            _message('error');
            return;
        }
    }
    chrome.storage.local.set({'THEMES_USER': _set}, function() {
        _message('restore');
    });
};

function _confirmRestore() {
    _exportBtn.removeEventListener('click', _exportTheme);
    _exportBtn.addEventListener('click', _restoreThemes);
    _exportBtn.value = 'Confirm';
    _message('warning');
    setTimeout(function() {
        _exportBtn.removeEventListener('click', _restoreThemes);
        _exportBtn.addEventListener('click', _exportTheme);
        _exportBtn.value = 'Export';
    }, 5000);
};

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
    if (Object.keys(_set)[0] === 'themeName') {
        _compmode();
    }
    if (Object.keys(_set)[0] === 'colors') {
        const nameField = document.querySelector('.theme-name');
        nameField.select();
        document.execCommand('insertText', false, _set.name);
        chrome.storage.local.get({'THEMES_USER': ''}, function(imp) {
            var userThemes = imp.THEMES_USER;
            for (i=0; i<userThemes.length; i++) {
                if (userThemes[i].name === nameField.value) {
                    _test = _set;
                    var test = _checkImport;
                    if (test()) {
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
                        });
                        _message('import');
                        break;
                    }
                    else {
                        _message('error');
                        break;
                    }
                }
            }
        });
    }
    else if (Object.keys(_set)[0] === '0') {
        _confirmRestore();
    }
    else {
        _message('error');
    }
};

function _exportTheme(event) {
    if (event.altKey) {
        var backup = true;
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
    });
};

function portThemes() {
    const edit = document.querySelector('.themes-edit');
    const check = document.getElementById('importTheme');
    if (edit && !check) {
        _cont = document.querySelector('.theme-metadata');
        const importBtn = document.createElement('input');
        importBtn.setAttribute('type', 'text');
        importBtn.setAttribute('placeholder', 'Import');
        importBtn.style = 'margin-left: 6px;  ';
        importBtn.id = 'importTheme';
        _cont.appendChild(importBtn);
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '#importTheme, #exportTheme {width: 80px;}#importTheme::-webkit-input-placeholder {opacity: 1;color: var(--colorHighlightBg);text-align: center;}';
        document.getElementsByTagName('head')[0].appendChild(style);
        const exportBtn = document.createElement('input');
        exportBtn.setAttribute('type', 'submit');
        exportBtn.classList.add('primary');
        exportBtn.setAttribute('value', 'Export');
        exportBtn.setAttribute('title', 'Alt-Click to Backup');
        exportBtn.style.marginLeft = '6px';
        exportBtn.id = 'exportTheme';
        _cont.appendChild(exportBtn);
        _msg = document.createElement('span');
        _msg.style = 'color: var(--colorFg); margin-left: 12px; margin-top: 6px;)';
        _cont.appendChild(_msg);
        _exportBtn = document.getElementById('exportTheme');
        _exportBtn.addEventListener('click', _exportTheme);
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
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        document.body.addEventListener('click', function() {
            setTimeout(portThemes, 50);
        });
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
