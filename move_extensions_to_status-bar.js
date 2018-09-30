/*
Move Extensions to Status-Bar
https://forum.vivaldi.net/topic/20643/showing-extension-icons-on-the-bottom-of-the-browser/6
Moves the extension action buttons to the status bar.
*/

function csse() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    #footer .extensions-wrapper {
        -webkit-app-region: no-drag;
    }
    #footer .extensions-wrapper img {
        height: 16px;
        width: 16px;
    }
    #footer .extensions-wrapper .button-badge {
        max-height: 10px;
        max-width: 10px;
        min-width: 5px;
    }
    #footer .toggle-extensions-group svg {
        vertical-align: middle;
    }
    #footer .extensions-wrapper .dragging-cancelled, #footer .toggle-extensions-group {
        border-right: none;
    }

    /* colors */
    #footer .extensions-wrapper .dragging-cancelled, #footer .toggle-extensions-group {
        background-color: transparent;
    }
    #footer .extensions-wrapper span:hover, #footer .toggle-extensions-group:hover {
        background-color: var(--colorBgDark);
    }
    #footer .extensions-wrapper button:focus:not([tabindex='-1']) {
        box-shadow: none;
        border-color: var(--colorBorder);
    }

    /* popup */
    #footer .extensionaction .popup.top::before, #footer .extensionaction .popup.top::after {
        display: none !important;
    }
    #footer .extensionaction {
        position: absolute;
        top: unset !important;
        bottom: 22px;
    }

    /* footer button alignment */
    #footer input.button-toolbar-small:last-of-type {
        margin-right: 6px;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
};

function extStatus() {
    csse();
    const wrapper = document.querySelector('.toolbar-addressbar.toolbar > .extensions-wrapper');
    const footer = document.getElementById('footer');
    footer.appendChild(wrapper);
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        extStatus();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
