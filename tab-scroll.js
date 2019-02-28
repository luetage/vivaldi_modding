/*
Tab Scroll
https://forum.vivaldi.net/topic/27856/tab-scroll
Clicking a tab scrolls page to top, clicking it again returns to previous scroll position.
*/

function tabScroll(event) {
    var target = event.target;
    if (target.parentNode.classList.contains('tab-header')) {
        target = target.parentNode;
    }
    if (target.classList.contains('tab-header')) {
        if (target.hasAttribute('id')) {
            const id = target.getAttribute('id');
            if (id === 'scrollTop') {
                chrome.tabs.executeScript({code:'function pos(){var position=window.pageYOffset;window.scrollTo(0,0);return position;};pos();'}, msg);
                target.id = 'scrollPre';
            }
            else {
                chrome.tabs.executeScript({code:'chrome.storage.local.get({"offset":""},function(local){var offset=local.offset;window.scrollTo(0,offset);});'});
                target.id = 'scrollTop';
            }
        }
        else {
            rmID();
            target.id = 'scrollTop';
        }
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

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        document.body.addEventListener('click', tabScroll);
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
