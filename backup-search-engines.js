/*
Backup Search Engines
https://forum.vivaldi.net/topic/35443/backup-search-engines
Adds functionality to backup and restore search engines in vivaldi://settings/search.
*/

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
    }, 5000);
};

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
    if ('engines' in engines && `default` in engines && 'defaultPrivate' in engines) {
        chrome.storage.local.set({'SEARCH_ENGINE_COLLECTION': engines}, function() {
            document.querySelector('.setting-search-engine .detail-toolbar input.primary').click();
            _msgSearch('restore');
        });
    }
    else {
        _msgSearch('error');
    }
};

function _backupSearch() {
    chrome.storage.local.get({'SEARCH_ENGINE_COLLECTION': ''}, function(back) {
        const engines = back.SEARCH_ENGINE_COLLECTION;
        const engineCode = JSON.stringify(engines);
        navigator.clipboard.writeText(engineCode);
        _msgSearch('backup');
    });
};

function searchEngines() {
    const search = document.querySelector('.setting-search-engine');
    const check = document.getElementById('backupSearch');
    if (search && !check) {
        const styleCheck = document.getElementById('searchEngines');
        if (!styleCheck) {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'searchEngines';
            style.innerHTML = '#backupSearch, #restoreSearch {margin-left: var(--padding);}#restoreSearch{width: 130px;margin-top: var(--padding);}#restoreSearch::-webkit-input-placeholder {opacity: 1;color: var(--colorHighlightBg);text-align: center;}';
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        const place = document.querySelector('.setting-section .setting-group.unlimited .setting-single');
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
        });
        restoreSearch.addEventListener('drop', function() {
            _eventSearch = 'drop';
            _restoreSearch(event);
        });
        _msgTimeout = {};
    }
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        document.body.addEventListener('click', function() {
            setTimeout(searchEngines, 50);
        });
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
