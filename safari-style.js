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
    .toolbar.toolbar-addressbar {
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
    .addressfield {
        max-width: 600px;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
};

function safariStyle() {
    cssm();
    var windowbuttons = document.querySelector('.window-buttongroup');
    var container = document.createElement('div');
    var extwrapper = document.querySelector('.toolbar-addressbar.toolbar > .extensions-wrapper');
    var tools = document.querySelector('.toolbar-addressbar.toolbar .toolbar');
    var adfield = document.querySelector('.addressfield');
    container.classList.add('container')
    adr.insertBefore(windowbuttons,adr.firstChild);
    adr.insertBefore(container,adr.lastChild);
    container.appendChild(tools);
    container.appendChild(adfield);
    container.appendChild(extwrapper);
};

// The code below is a loop waiting for the browser to load the UI. Something like this has to be used in all similar javascript mods, to ensure the interface has loaded before running dependent functions. You can call all functions you might use from just one instance.

let adr = {};
setTimeout(function wait() {
    adr = document.querySelector('.toolbar-addressbar.toolbar');
    if (adr) {
        safariStyle();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
