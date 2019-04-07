/*
Status Bar Dropdown
https://forum.vivaldi.net/topic/22766/attack-on-the-status-bar
Replaces the status bar with a button in the address bar, which loads the status bar as overlay. Also introduces a button in the bar to toggle the status-info (link address) and a biscuit button for showing the Vivaldi version (biscuit mode needs to be enabled for this).
*/

(function () {

function statusToggle() {
    const statusContainer = document.getElementById('statusContainer');
    if (statusContainer.style.display === 'block') {
        statusContainer.style.display = 'none';
    }
    else {
        statusContainer.style.display = 'block';
    }
};

function statusStyle() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'statusDropdown';
    style.innerHTML = `
    #browser.address-off #statusButton {
        display: none;
    }
    #statusToggle svg {
        width: 14px;
        height: 14px;
    }
    .toolbar-statusbar {
        border-top: none;
        border-bottom: 1px solid var(--colorBorder);
    }
    .toolbar-statusbar .button-popup.button-popup-above {
        bottom: unset;
        top: 22px;
    }
    .toolbar-statusbar .button-popup.button-popup-above:before, .toolbar-statusbar .button-popup.button-popup-above:after {
        opacity: 0;
    }
    .biscuit-setting-version {
        display: none !important;
    }
    #biscuitButton button svg, #statusInfoToggle button svg {
        width: 14px;
        height: 14px;
    }
    #statusInfoToggle.zeig button svg {
        fill: var(--colorHighlightBg);
    }
    #statusContainer {
        position: absolute;
        z-index: 1;
        right: 0;
        top: var(--toolbarHeight);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
};

function statusMod() {
    const statusInfoToggle = document.getElementById('statusInfoToggle');
    if (!statusInfoToggle) {
        const statusBar = document.querySelector('.toolbar-statusbar');
        const statusInfo = document.querySelector('.status-info');
        statusInfo.style.display = 'none';
        if (browser.classList.contains('biscuit-mode')) {
            const divB = document.createElement('div');
            divB.classList.add('button-toolbar');
            divB.id = 'biscuitButton';
            divB.setAttribute('title', document.querySelector('.biscuit-string').value);
            divB.innerHTML = '<button draggable="false" tabindex="-1"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 12 24 C 17.26 24 20.18 24 22.09 22.09 C 24 20.18 24 17.29 24 12 C 24 6.71 24 3.82 22.09 1.91 C 20.18 0 17.26 0 12 0 C 6.74 0 3.82 0 1.9 1.94 C -0.02 3.88 0 6.77 0 12 C 0 17.23 0 20.21 1.9 22.12 C 3.8 24.03 6.74 24 12 24 Z  M 18.9 8.6 Q 16.11 13.42 13.34 18.24 C 13.042 18.82 12.461 19.199 11.81 19.24 C 11.088 19.323 10.388 18.954 10.05 18.31 Q 8.3 15.31 6.56 12.31 L 4.46 8.58 C 4.12 8.017 4.103 7.315 4.415 6.736 C 4.727 6.157 5.322 5.786 5.98 5.76 C 6.704 5.709 7.386 6.105 7.7 6.76 L 9.25 9.4 C 9.63 10.05 9.99 10.7 10.37 11.34 C 10.868 12.24 11.802 12.813 12.83 12.85 C 14.416 12.94 15.797 11.778 15.98 10.2 C 15.988 10.097 15.988 9.993 15.98 9.89 C 15.981 9.408 15.871 8.933 15.66 8.5 C 15.298 7.843 15.364 7.033 15.827 6.443 C 16.29 5.853 17.061 5.597 17.785 5.792 C 18.509 5.988 19.047 6.597 19.15 7.34 C 19.207 7.776 19.12 8.219 18.9 8.6 Z "></path></svg></button>';
            statusBar.insertBefore(divB, document.querySelector('.status-info'));
        }
        const divL = document.createElement('divL');
        divL.classList.add('button-toolbar');
        divL.id = 'statusInfoToggle';
        divL.setAttribute('title', 'Toggle Status Info');
        divL.innerHTML = '<button draggable="false" tabindex="-1"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1520 1216q0-40-28-68l-208-208q-28-28-68-28-42 0-72 32 3 3 19 18.5t21.5 21.5 15 19 13 25.5 3.5 27.5q0 40-28 68t-68 28q-15 0-27.5-3.5t-25.5-13-19-15-21.5-21.5-18.5-19q-33 31-33 73 0 40 28 68l206 207q27 27 68 27 40 0 68-26l147-146q28-28 28-67zm-703-705q0-40-28-68l-206-207q-28-28-68-28-39 0-68 27l-147 146q-28 28-28 67 0 40 28 68l208 208q27 27 68 27 42 0 72-31-3-3-19-18.5t-21.5-21.5-15-19-13-25.5-3.5-27.5q0-40 28-68t68-28q15 0 27.5 3.5t25.5 13 19 15 21.5 21.5 18.5 19q33-31 33-73zm895 705q0 120-85 203l-147 146q-83 83-203 83-121 0-204-85l-206-207q-83-83-83-203 0-123 88-209l-88-88q-86 88-208 88-120 0-204-84l-208-208q-84-84-84-204t85-203l147-146q83-83 203-83 121 0 204 85l206 207q83 83 83 203 0 123-88 209l88 88q86-88 208-88 120 0 204 84l208 208q84 84 84 204z"/></svg></button>';
        statusBar.insertBefore(divL, document.querySelector('.status-info'));
        const statusInfoToggle = document.getElementById('statusInfoToggle');
        statusInfoToggle.addEventListener('click', function() {
                if (statusInfo.style.display === 'flex') {
                    statusInfoToggle.classList.remove('zeig');
                    statusInfo.style.display = 'none';
                }
                else {
                    statusInfoToggle.classList.add('zeig');
                    statusInfo.style.display = 'flex';
                }
        });
    }
};

function statusDropdown() {
    if (!document.getElementById('statusDropdown')) {
        statusStyle();
    }
    const adr = document.querySelector('.toolbar-addressbar');
    const btn = document.createElement('div');
    btn.id = 'statusButton';
    btn.classList.add('button-toolbar');
    btn.setAttribute('title', 'Toggle Status Bar');
    btn.innerHTML = '<button id="statusToggle" tabindex="-1"><svg width="14" height="14" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1683 808l-742 741q-19 19-45 19t-45-19l-742-741q-19-19-19-45.5t19-45.5l166-165q19-19 45-19t45 19l531 531 531-531q19-19 45-19t45 19l166 165q19 19 19 45.5t-19 45.5z"></path></button>';
    adr.insertBefore(btn, document.querySelector('.toolbar-extensions'));
    const cont = document.createElement('div');
    cont.id = 'statusContainer';
    cont.style.display = 'none';
    adr.appendChild(cont);
    document.getElementById('statusToggle').addEventListener('click', statusToggle);
};

var appendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function () {
    if (arguments[0].tagName === 'DIV') {
        setTimeout(function() {
            if (this.classList.contains('toolbar-statusbar')) {
                const statusContainer = document.getElementById('statusContainer');
                if (!statusContainer) {
                    statusDropdown();
                }
                if (statusContainer) {
                    statusContainer.appendChild(document.querySelector('.toolbar-statusbar'));
                    statusMod();
                }
            }
        }.bind(this, arguments[0]));
    }
    return appendChild.apply(this, arguments);
};

var removeChild = Element.prototype.removeChild;
Element.prototype.removeChild = function () {
    if (arguments[0].tagName === 'DIV' && arguments[0].classList.contains('toolbar-statusbar')) {
        const statusButton = document.getElementById('statusButton');
        const statusContainer = document.getElementById('statusContainer');
        statusButton.remove();
        statusContainer.remove();
    }
    else {
        return removeChild.apply(this, arguments);
    }
};

})();
