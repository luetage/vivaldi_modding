// Backup Search Engines
// https://forum.vivaldi.net/topic/35443/backup-search-engines
// Adds functionality to backup and restore search engines in vivaldi://settings/search.

{
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

    const settingsUrl = 'chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=';
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.url === `${settingsUrl}search`) {
            setTimeout(searchEngines, 100);
        }
    })
}
