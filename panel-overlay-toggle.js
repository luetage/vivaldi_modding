/*
Panel Overlay Toggle
https://forum.vivaldi.net/topic/10590/overlay-panels/151
A custom button to toggle the panel overlay mode right from the panels container. The panel toggle must be visible. Move it to the address bar where it will be made invisible by css, then you can reset the status bar to get the panel toggle back and hide or show the status bar as you please.
*/

function overlayToggle() {

    function icn() {
        if (cont.classList.contains('overlay') && exec === 0 || !cont.classList.contains('overlay') && exec === 1) {
            pathS.setAttribute('d', circE);
        }
        else {
            pathS.setAttribute('d', circD);
        }
        exec = 1;
    };

    function simulateClick() {
        const toggle = document.querySelector('.panel-clickoutside-ignore button');
        var down = new PointerEvent('pointerdown', {
            bubbles: true,
            cancelable: true,
            pointerType: "mouse",
            altKey: true
        });
        var up = new PointerEvent('pointerup', {
            bubbles: true,
            cancelable: true,
            pointerType: "mouse",
            altKey: true
        });
        icn();
        toggle.dispatchEvent(down);
        toggle.dispatchEvent(up);
    };

    var exec = 0;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.UrlBar .panel-clickoutside-ignore.button-toolbar {width: 0px !important;visibility: hidden;}';
    document.getElementsByTagName('head')[0].appendChild(style);
    const circE = 'M 13 13m -6, 0a 6,6 0 1,0 12,0a 6,6 0 1,0 -12,0 M 13 13m -4, 0a 4,4 0 1,0 8,0a 4,4 0 1,0 -8,0 M 13 13m -2, 0a 2,2 0 1,0 4,0a 2,2 0 1,0 -4,0';
    const circD = 'M 13 13m -5.5, 0a 5.5,5.5 0 1,0 11,0a 5.5,5.5 0 1,0 -11,0 M 13 13m -2, 0a 2,2 0 1,0 4,0a 2,2 0 1,0 -4,0';
    const cont = document.getElementById('panels-container');
    const switchS = document.getElementById('switch');
    var btnS = document.createElement('button');
    btnS.classList.add('preferences');
    btnS.id = 'overlayToggle';
    btnS.title = 'Toggle Overlay';
    btnS.setAttribute('tabindex', '-1');
    btnS.innerHTML = '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd"></path></svg>';
    switchS.lastChild.style = 'margin-top: 0px';
    switchS.insertBefore(btnS,switchS.lastChild);
    const pathS = document.querySelector('#overlayToggle svg path');
    icn();
    document.getElementById('overlayToggle').addEventListener('click', simulateClick);
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        overlayToggle();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
