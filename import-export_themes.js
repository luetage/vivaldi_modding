/*
Theme Import and Export
https://forum.vivaldi.net/topic/33154/import-and-export-themes
Adds Import and Export button to Vivaldi's theme page when clicking the +/add or pencil/edit button. Saves themes in .json format. Enables backing up and sharing themes.
*/

function _importTheme(e) {
    var files = e.target.files, reader = new FileReader();
    reader.onload = _imp;
    reader.readAsText(files[0]);
};
function _imp() {
    var colors = JSON.parse(this.result);
    chrome.storage.local.set(
        colors,
    function() {
        chrome.storage.local.get({
            'themeName': '',
            'themeBg': '',
            'themeFg': '',
            'themeHi': '',
            'themeAc': '',
            'themePage': '',
            'themeWin': '',
            'themeTabs': '',
            'themeRound': ''
        },
        function(set) {
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
                _themeRound.focus();
            }, 1600);
        });
    });
    document.getElementById('importHidden').value = '';
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
    chrome.storage.local.set({
        'themeName': _themeName.value,
        'themeBg': _themeBg.value,
        'themeFg': _themeFg.value,
        'themeHi': _themeHi.value,
        'themeAc': _themeAc.value,
        'themePage': checkPage,
        'themeWin': checkWin,
        'themeTabs': checkTabs,
        'themeRound': _themeRound.value
    },
    function() {
        chrome.storage.local.get({
            'themeName': '',
            'themeBg': '',
            'themeFg': '',
            'themeHi': '',
            'themeAc': '',
            'themePage': '',
            'themeWin': '',
            'themeTabs': '',
            'themeRound': ''
        },
        function(items){
            var result = JSON.stringify(items);
            var url = 'data:application/json;base64,' + btoa(result);
            const getName = items.themeName.replace(/\s+/g, '-').toLowerCase();
            if (getName !== '' && tryAgain === false) {
                var nameIt = getName + '.json';
            }
            else {
                var nameIt = 'theme.json';
            }
            chrome.downloads.download({
                url: url,
                saveAs: true,
                filename: nameIt
            },
            function(download) {
                if (download === undefined && tryAgain === false) {
                    console.log('export error: ' + chrome.runtime.lastError.message);
                    tryAgain = true;
                    _exportTheme();
                }
                else {
                    tryAgain = false;
                }
            });
        });
    });
};

function _buttons() {
    const check = document.getElementById('importTheme');
    const cont = document.querySelector('.theme-metadata');
    if (cont && !check) {
        tryAgain = false;
        _themeName = document.querySelector('.theme-name');
        _themeBg = document.querySelector('.theme-colors div:nth-of-type(1) input');
        _themeFg = document.querySelector('.theme-colors div:nth-of-type(2) input');
        _themeHi = document.querySelector('.theme-colors div:nth-of-type(3) input');
        _themeAc = document.querySelector('.theme-colors div:nth-of-type(4) input');
        _themePage = document.querySelector('.theme-settings div div:nth-of-type(1) label input');
        _themeWin = document.querySelector('.theme-settings div div:nth-of-type(2) label input');
        _themeTabs = document.querySelector('.theme-settings div div:nth-of-type(3) label input');
        _themeRound = document.querySelector('.border-radius label input');
        var importBtn = document.createElement('input');
        importBtn.setAttribute('type', 'submit');
        importBtn.classList.add('primary');
        importBtn.setAttribute('value', 'Import');
        importBtn.style.marginLeft = '6px';
        importBtn.id = 'importTheme';
        cont.appendChild(importBtn);
        var exportBtn = document.createElement('input');
        exportBtn.setAttribute('type', 'submit');
        exportBtn.classList.add('primary');
        exportBtn.setAttribute('value', 'Export');
        exportBtn.style.marginLeft = '6px';
        exportBtn.id = 'exportTheme';
        cont.appendChild(exportBtn);
        var  hiddenBtn = document.createElement('input');
        hiddenBtn.setAttribute('type','file');
        hiddenBtn.id = 'importHidden';
        hiddenBtn.setAttribute('accept','.json');
        hiddenBtn.style.display = 'none';
        cont.appendChild(hiddenBtn);
        importBtn.onclick = function() {
            document.getElementById('importHidden').click();
        };
        document.getElementById('importHidden').addEventListener("change", _importTheme, false);
        document.getElementById('exportTheme').addEventListener('click', _exportTheme);
    }
};

function portThemes() {
    var edit = document.querySelector('.button-toolbar.edit');
    if (edit) {
        var add = document.querySelector('.button-toolbar.add');
        if (!edit.hasAttribute('id')) {
            edit.id = "eventOn";
            edit.addEventListener('click', function() {
                setTimeout(_buttons, 50);
            });
        }
        if (!add.hasAttribute('id')) {
            add.id = "eventOn2";
            add.addEventListener('click', function() {
                setTimeout(_buttons, 50);
            });
        }
    }
};

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
