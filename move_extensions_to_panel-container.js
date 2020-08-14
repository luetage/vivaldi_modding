/*
Move Extensions to Panel
https://forum.vivaldi.net/topic/17879/moving-extension-icons-next-to-the-panel-toggles/16
Moves the extension action buttons to the panel.
*/

function csse() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    #switch .extensions-wrapper {
        display: flex;
        flex-flow: row wrap;
    }
    #switch .extensions-wrapper {
        -webkit-app-region: no-drag;
    }
    #switch .button-toolbar.browserAction-button img {
        height: auto;
        width: 19px;
    }
    #switch .button-toolbar.toggle-extensions-group svg  {
        height: 16px;
        width: 4px;
    }
    #switch .extensions-wrapper .dragging-cancelled, #switch .toggle-extensions-group {
        background-color: transparent !important;
    }
    #switch .extensions-wrapper span:hover, #switch .toggle-extensions-group:hover {
        background-color: var(--colorBgDarker) !important;
    }
    #switch {
        contain: initial;
    }
    #switch .extension-popup.top::before, #switch .extension-popup.top::after {
        display: none !important;
    }
    #panels-container.left #switch .extension-popup {
        position: absolute !important;
        top: 1px !important;
        left: 35px !important;
    }
    #panels-container.right #switch .extensionaction {
        position: absolute !important;
        top: 1px !important;
            left: unset !important;
        right: 35px;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
};

function extPanel() {
    csse();
    const wrapper = document.querySelector('UrlBar.toolbar > .extensions-wrapper');
    const pref = document.getElementById('overlay');
    const panel = document.getElementById('switch');
    panel.insertBefore(wrapper, pref);
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        extPanel();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
