// Attack on the statusbar
// https://forum.vivaldi.net/topic/22766/attack-on-the-status-bar
// Moves the statusbar to the top and makes it compact. Furthermore introduces a button in the statusbar
// to toggle the status-info (link address, status information) and a biscuit button for showing and
// copying the Vivaldi version (biscuit mode needs to be enabled for this).

{
    function statusInfoLogic() {
        const statusInfoToggle = document.getElementById('statusInfoToggle');
        const statusInfo = document.querySelector('.StatusInfo');
        if (statusInfoToggle.classList.contains('zeig')) {
            statusInfoToggle.classList.remove('zeig');
            statusInfo.removeAttribute('id');
            var info = 'off';
        }
        else {
            statusInfoToggle.classList.add('zeig');
            statusInfo.id = 'zeig';
            var info = 'on';
        }
        chrome.storage.local.set({'statusInfo': info});
    }

    function statusMod() {
        const cont = document.createElement('div');
        const statusBar = document.querySelector('.toolbar-statusbar');
        const statusInfo = document.querySelector('.StatusInfo');
        cont.id = 'statusContainer';
        document.querySelector('.inner').appendChild(cont);
        cont.appendChild(statusBar);
        if (document.querySelector('.biscuit-string')) {
            const version = document.querySelector('.biscuit-string').innerText;
            const divB = document.createElement('div');
            divB.classList.add('button-toolbar');
            divB.id = 'biscuitButton';
            divB.setAttribute('title', version + '\nClick to copy version string');
            divB.innerHTML = '<button draggable="false" tabindex="-1"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 12 24 C 17.26 24 20.18 24 22.09 22.09 C 24 20.18 24 17.29 24 12 C 24 6.71 24 3.82 22.09 1.91 C 20.18 0 17.26 0 12 0 C 6.74 0 3.82 0 1.9 1.94 C -0.02 3.88 0 6.77 0 12 C 0 17.23 0 20.21 1.9 22.12 C 3.8 24.03 6.74 24 12 24 Z  M 18.9 8.6 Q 16.11 13.42 13.34 18.24 C 13.042 18.82 12.461 19.199 11.81 19.24 C 11.088 19.323 10.388 18.954 10.05 18.31 Q 8.3 15.31 6.56 12.31 L 4.46 8.58 C 4.12 8.017 4.103 7.315 4.415 6.736 C 4.727 6.157 5.322 5.786 5.98 5.76 C 6.704 5.709 7.386 6.105 7.7 6.76 L 9.25 9.4 C 9.63 10.05 9.99 10.7 10.37 11.34 C 10.868 12.24 11.802 12.813 12.83 12.85 C 14.416 12.94 15.797 11.778 15.98 10.2 C 15.988 10.097 15.988 9.993 15.98 9.89 C 15.981 9.408 15.871 8.933 15.66 8.5 C 15.298 7.843 15.364 7.033 15.827 6.443 C 16.29 5.853 17.061 5.597 17.785 5.792 C 18.509 5.988 19.047 6.597 19.15 7.34 C 19.207 7.776 19.12 8.219 18.9 8.6 Z "></path></svg></button>';
            statusBar.insertBefore(divB, statusInfo);
            document.getElementById('biscuitButton').addEventListener('click', function() {
                navigator.clipboard.writeText(version);
            })
        }
        const divL = document.createElement('divL');
        divL.classList.add('button-toolbar');
        divL.id = 'statusInfoToggle';
        divL.setAttribute('title', 'Toggle status info');
        divL.innerHTML = '<button draggable="false" tabindex="-1"><svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1520 1216q0-40-28-68l-208-208q-28-28-68-28-42 0-72 32 3 3 19 18.5t21.5 21.5 15 19 13 25.5 3.5 27.5q0 40-28 68t-68 28q-15 0-27.5-3.5t-25.5-13-19-15-21.5-21.5-18.5-19q-33 31-33 73 0 40 28 68l206 207q27 27 68 27 40 0 68-26l147-146q28-28 28-67zm-703-705q0-40-28-68l-206-207q-28-28-68-28-39 0-68 27l-147 146q-28 28-28 67 0 40 28 68l208 208q27 27 68 27 42 0 72-31-3-3-19-18.5t-21.5-21.5-15-19-13-25.5-3.5-27.5q0-40 28-68t68-28q15 0 27.5 3.5t25.5 13 19 15 21.5 21.5 18.5 19q33-31 33-73zm895 705q0 120-85 203l-147 146q-83 83-203 83-121 0-204-85l-206-207q-83-83-83-203 0-123 88-209l-88-88q-86 88-208 88-120 0-204-84l-208-208q-84-84-84-204t85-203l147-146q83-83 203-83 121 0 204 85l206 207q83 83 83 203 0 123-88 209l88 88q86-88 208-88 120 0 204 84l208 208q84 84 84 204z"/></svg></button>';
        statusBar.insertBefore(divL, statusInfo);
        document.getElementById('statusInfoToggle').addEventListener('click', statusInfoLogic);
        chrome.storage.local.get({'statusInfo': 'on'}, function(check) {
            const info = check.statusInfo;
            if (info === 'on') {
                document.querySelector('.StatusInfo').id = 'zeig';
                document.getElementById('statusInfoToggle').classList.add('zeig');
            }
        })
    }

    setTimeout(function wait() {
        const browser = document.getElementById('browser');
        if (browser) {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'statusMod';
            style.innerHTML = `#statusContainer {position: absolute;z-index: 1;max-width: 100vw;right: 0;top: 0;box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);}.toolbar-statusbar {display: none;border-top: none;border-bottom: 1px solid var(--colorBorder);}#statusContainer .toolbar-statusbar {display: flex}.toolbar-statusbar .button-popup.button-popup-above {bottom: unset;top: 22px;}.toolbar-statusbar .button-popup.button-popup-above:before, .toolbar-statusbar .button-popup.button-popup-above:after {opacity: 0;}.biscuit-setting-version {display: none !important;}#biscuitButton button svg, #statusInfoToggle button svg {width: 14px;height: 14px;}#statusInfoToggle.zeig button svg {fill: var(--colorHighlightBg);}.StatusInfo {display: none;}#zeig.StatusInfo.StatusInfo--Visible {display: inline-block;}`;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        else {
            setTimeout(wait, 300);
        }
    }, 300)

    var appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (arguments[0].tagName === 'DIV') {
            setTimeout(function() {
                if (this.classList.contains('toolbar-statusbar')) {
                    const statusContainer = document.getElementById('statusContainer');
                    if (!statusContainer) {
                        statusMod();
                    }
                }
            }.bind(this, arguments[0]))
        }
        return appendChild.apply(this, arguments);
    }

    var removeChild = Element.prototype.removeChild;
    Element.prototype.removeChild = function () {
        if (arguments[0].tagName === 'DIV' && arguments[0].classList.contains('toolbar-statusbar')) {
            document.getElementById('statusContainer').remove();
        }
        else {
            return removeChild.apply(this, arguments);
        }
    }
}
