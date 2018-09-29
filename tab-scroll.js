/*
Tab Scroll
https://forum.vivaldi.net/topic/27856/tab-scroll
Clicking a tab scrolls page to top, clicking it again returns to previous scroll position.
*/

function tabScroll(event) {
    const target = event.target;
    if (target.classList.contains('tab-header') && target.hasAttribute('id')) {
        const id = target.getAttribute('id');
        if (id === 'scrollTop') {
            chrome.tabs.executeScript({code:'function pos(){var position=window.pageYOffset;window.scrollTo(0,0);return position;};pos();'}, msg);
            target.id = 'scrollPre';
        }
        if (id === 'scrollPre') {
            chrome.tabs.executeScript({code:'chrome.storage.local.get({"offset":""},function(local){var offset=local.offset;window.scrollTo(0,offset);});'});
            target.id = 'scrollTop';
        }
    }
    if (target.classList.contains('tab-header') && !target.hasAttribute('id')) {
        rmID();
        target.id = 'scrollTop';
    }
};

function msg(position) {
    var offset = position[0];
    chrome.storage.local.set({'offset': offset});
};

function rmID() {
    const top = document.getElementById('scrollTop');
    const pre = document.getElementById('scrollPre');
    if (top) {
        top.removeAttribute('id');
    }
    if (pre) {
        pre.removeAttribute('id');
    }
};

// The code below is a loop waiting for the browser to load the UI. Something like this has to be used in all similar javascript mods, to ensure the interface has loaded before running dependent functions. You can call all functions you might use from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        document.body.addEventListener('click', tabScroll);
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
