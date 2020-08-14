/*
Safari Style
https://forum.vivaldi.net/topic/23138/solved-modding-the-adressbar-top-window-to-get-it-look-like-safari-browser/6
Safari (browser) like address bar. Requested mod.
*/

function cssm() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    #tabs-container.no-thumbs.bottom {
        order: -1;
        padding-top: 4px;
        padding-bottom: 0px;
    }
    .toolbar.UrlBar {
        display: flex;
        order: -2;
    }
    .stacks-on.tabs-bottom .tab-strip .tab-group-indicator {
        bottom: 28px;
    }
    .stacks-on.tabs-bottom .tab-strip .tab-group-indicator .tab-indicator.active {
        padding-top: 3px;
    }
    #header {
        min-height: 0 !important;
        z-index: auto;
    }
    .container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        -webkit-app-region: drag;
    }
    #browser.mac .window-buttongroup {
        display: flex;
        margin-top: 9px !important;
    }
    #browser.mac .window-buttongroup button {
        margin-right: 8px;
    }
    #browser.mac .window-buttongroup button.window-minimze {
        order: 1;
    }
    #browser.mac .window-buttongroup button.window-maximize {
        order: 2;
    }
    .UrlBar-AddressField {
        max-width: 600px;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
};

function safariStyle() {
    cssm();
    const adr = document.querySelector('.UrlBar');
    var windowbuttons = document.querySelector('.window-buttongroup');
    var container = document.createElement('div');
    var extwrapper = document.querySelector('.UrlBar > .extensions-wrapper');
    var tools = document.querySelector('.UrlBar .toolbar');
    var adfield = document.querySelector('.UrlBar-AddressField');
    container.classList.add('container')
    adr.insertBefore(windowbuttons,adr.firstChild);
    adr.insertBefore(container,adr.lastChild);
    container.appendChild(tools);
    container.appendChild(adfield);
    container.appendChild(extwrapper);
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        safariStyle();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
