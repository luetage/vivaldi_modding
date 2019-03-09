/*
Theme Import and Export
https://forum.vivaldi.net/topic/33154/import-and-export-themes
Adds Import and Export button to Vivaldi's theme page when clicking the +/add or pencil/edit button. Exports theme by copying the theme code as json string to clipboard. Enables backing up and sharing themes.
*/

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
    var set = JSON.parse(themeCode);
    _themeName.select();
    document.execCommand('insertText', false, set.themeName);
    setTimeout(function() {
        _themeBg.select();
        document.execCommand('insertText', false, set.themeBg);
    }, 200);
    setTimeout(function() {
        _themeFg.select();
        document.execCommand('insertText', false, set.themeFg);
    }, 400);
    setTimeout(function() {
        _themeHi.select();
        document.execCommand('insertText', false, set.themeHi);
    }, 600);
    setTimeout(function() {
        _themeAc.select();
        document.execCommand('insertText', false, set.themeAc);
    }, 800);
    if ((set.themePage === 1 && !_themePage.checked) || (set.themePage === 0 && _themePage.checked)) {
        setTimeout(function() {
            _themePage.click();
        }, 1000);
    }
    if ((set.themeWin === 1 && !_themeWin.checked) || (set.themeWin === 0 && _themeWin.checked)) {
        setTimeout(function() {
            _themeWin.click();
        }, 1200);
    }
    if ((set.themeTabs === 1 && !_themeTabs.checked) || (set.themeTabs === 0 && _themeTabs.checked)) {
        setTimeout(function() {
            _themeTabs.click();
        }, 1400);
    }
    setTimeout(function () {
        const disp = document.querySelector('.border-radius label span');
        if (set.themeRound === '-1') {
            disp.innerText = 'Disabled';
        }
        else if (set.themeRound === '0') {
            disp.innerText = 'Default';
        }
        else {
            disp.innerText = set.themeRound + 'px';
        }
        _themeRound.value = set.themeRound;
        chrome.storage.local.get({'THEMES_USER': ''}, function(round) {
            var userThemes = round.THEMES_USER;
            for (i=0; i<userThemes.length; i++) {
                if (userThemes[i].name === _themeName.value) {
                    userThemes[i].settings.borderRadius = set.themeRound;
                    chrome.storage.local.set({
                        'THEMES_USER': userThemes,
                        'BORDER_RADIUS': set.themeRound
                    });
                    _themeName.focus();
                    break;
                }
            }
        });
    }, 1600);
};

function _exportTheme() {
    if (_themePage.checked === true) {
        var checkPage = 1;
    }
    else {
        var checkPage = 0;    }
    if (_themeWin.checked === true) {
        var checkWin = 1;    }
    else {
        var checkWin = 0;    }
    if (_themeTabs.checked === true) {
        var checkTabs = 1;
    }
    else {
        var checkTabs = 0;
    }
    const share = {'themeName': _themeName.value, 'themeBg': _themeBg.value, 'themeFg': _themeFg.value, 'themeHi': _themeHi.value, 'themeAc': _themeAc.value, 'themePage': checkPage, 'themeWin': checkWin, 'themeTabs': checkTabs, 'themeRound': _themeRound.value};
    const themeCode = JSON.stringify(share);
    navigator.clipboard.writeText(themeCode);
    const confirm = document.createElement('span');
    confirm.innerText = 'Theme code copied to clipboard.';
    confirm.style = 'color: var(--colorHighlightBg); margin-left: 6px; margin-top: 6px;)';
    confirm.id = 'confirmExport';
    const confirmExport = document.getElementById('confirmExport');
    if (!confirmExport) {
        _cont.appendChild(confirm);
        setTimeout(function() {
            _cont.removeChild(confirm);
        }, 3500);
    }
};

function portThemes() {
    const edit = document.querySelector('.themes-edit');
    const check = document.getElementById('importTheme');
    if (edit && !check) {
        _cont = document.querySelector('.theme-metadata');
        _themeName = document.querySelector('.theme-name');
        _themeBg = document.querySelector('.theme-colors div:nth-of-type(1) input');
        _themeFg = document.querySelector('.theme-colors div:nth-of-type(2) input');
        _themeHi = document.querySelector('.theme-colors div:nth-of-type(3) input');
        _themeAc = document.querySelector('.theme-colors div:nth-of-type(4) input');
        _themePage = document.querySelector('.theme-settings div div:nth-of-type(1) label input');
        _themeWin = document.querySelector('.theme-settings div div:nth-of-type(2) label input');
        _themeTabs = document.querySelector('.theme-settings div div:nth-of-type(3) label input');
        _themeRound = document.querySelector('.border-radius label input');
        const importBtn = document.createElement('input');
        importBtn.setAttribute('type', 'text');
        importBtn.setAttribute('placeholder', 'Import');
        importBtn.style = 'margin-left: 6px;  ';
        importBtn.id = 'importTheme';
        _cont.appendChild(importBtn);
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '#importTheme {width: 80px;} #importTheme::-webkit-input-placeholder {opacity: 1; color: var(--colorHighlightBg); text-align: center;}';
        document.getElementsByTagName('head')[0].appendChild(style);
        const exportBtn = document.createElement('input');
        exportBtn.setAttribute('type', 'submit');
        exportBtn.classList.add('primary');
        exportBtn.setAttribute('value', 'Export');
        exportBtn.style.marginLeft = '6px';
        exportBtn.id = 'exportTheme';
        _cont.appendChild(exportBtn);
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
    }
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        document.body.addEventListener('click', function() {
            setTimeout(portThemes, 500);
        });
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
