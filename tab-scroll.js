/*
Tab Scroll
https://forum.vivaldi.net/topic/27856/tab-scroll
Clicking the tab title scrolls page to top, clicking it again returns to previous scroll position.
*/

function tabScroll(event) {
    const target = event.target;
    if (target.classList.contains('title')) {
        const par = target.parentNode;
        if (par.classList.contains('tab-header') && target.hasAttribute('id') === true) {
            const id = target.getAttribute('id');
            if (id === 'scrollTop') {
                chrome.tabs.executeScript({code:'window.pageYOffset'}, msg);
                chrome.tabs.executeScript({code:'window.scrollTo(0,0)'});
                target.id = 'scrollPre';
            }
            if (id === 'scrollPre') {
                chrome.tabs.executeScript({code:'chrome.storage.local.get({"offset": ""},function(local){var offset = local.offset; window.scrollTo(0,offset)})'});
                target.id = 'scrollTop';
            }
        }
        if (par.classList.contains('tab-header') && target.hasAttribute('id') === false) {
            rmID();
            target.id = 'scrollTop';
        }
    }
};

function msg(position) {
    offset = position[0];
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

// Below code is a loop waiting for the browser to load the UI. Something like it has to be used in all similar javascript mods to ensure the interface has loaded before running dependent functions. You can call all functions you might use from just one instance.

var offset = 1;
let adr = {};
setTimeout(function wait() {
    adr = document.querySelector('.toolbar-addressbar.toolbar');
    if (adr) {
        document.body.addEventListener('click', tabScroll);
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
