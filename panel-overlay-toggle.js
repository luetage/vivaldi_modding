/*
Panel Overlay Toggle
https://forum.vivaldi.net/topic/10590/overlay-panels/36
A custom button to toggle css code right from the user interface. In this case it is used to toggle the overlay mode of panels, but you could place the button anywhere, style it independently and load any css with it.
*/

function overlayToggle() {

    // panel overlay css
    const csso = '#main .inner{position:relative}#panels-container{position:absolute;z-index:2;top:0;bottom:0}#browser:not(.minimal-ui) .toolbar-addressbar.toolbar{z-index:3}#panels-container.right{right:0}#panels-container.left + #webview-container,#panels-container.left ~ #tabs-container.left{margin-left:34px}#panels-container.right ~ #webview-container,#panels-container.right ~ #tabs-container.right{margin-right:34px}#browser.tabs-right #webview-container{margin-right:0}#panels-container.left.switcher + #webview-container,#panels-container.left.switcher ~ #tabs-container.left{margin-left:0}#panels-container.right.switcher ~ #webview-container,#panels-container.right.switcher ~ #tabs-container.right{margin-right:0}#browser.tabs-right #webview-container{margin-right:0}#browser.fullscreen #webview-container,#browser.fullscreen #tabs-container{margin-left:0 !important;margin-right:0 !important}#browser.fullscreen #panels-container{position:relative}';

    // create button
    const circE = 'M 13 13m -6, 0a 6,6 0 1,0 12,0a 6,6 0 1,0 -12,0 M 13 13m -4, 0a 4,4 0 1,0 8,0a 4,4 0 1,0 -8,0 M 13 13m -2, 0a 2,2 0 1,0 4,0a 2,2 0 1,0 -4,0';
    const circD = 'M 13 13m -5.5, 0a 5.5,5.5 0 1,0 11,0a 5.5,5.5 0 1,0 -11,0 M 13 13m -2, 0a 2,2 0 1,0 4,0a 2,2 0 1,0 -4,0';
    const switchS = document.getElementById('switch');
    var btnS = document.createElement('button');
    btnS.classList.add('preferences');
    btnS.id = 'overlay';
    btnS.setAttribute('tabindex', '-1');
    btnS.innerHTML = '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd"></path></svg>';
    switchS.lastChild.style = 'margin-top: 0px';
    switchS.insertBefore(btnS,switchS.lastChild);

    // startup setting
    var styleS = document.createElement('style');
    styleS.type = 'text/css';
    styleS.innerHTML = csso;
    document.getElementsByTagName('head')[0].appendChild(styleS);
    btnS.setAttribute('title', 'Disable Overlay');
    const pathS = document.querySelector('#overlay svg path');
    pathS.setAttribute('d', circE);
    var mode = 1;

    // toggle logic
    document.getElementById('overlay').addEventListener('click', function() {
        if (mode === 0) {
            styleS.innerHTML = csso;
            btnS.setAttribute('title', 'Disable Overlay');
            pathS.setAttribute('d', circE);
            mode = 1;
        }
        else {
            styleS.innerHTML = '';
            btnS.setAttribute('title', 'Enable Overlay');
            pathS.setAttribute('d', circD);
            mode = 0;
        }
    });
};

// The code below is a loop waiting for the browser to load the UI. Something like this has to be used in all similar javascript mods, to ensure the interface has loaded before running dependent functions. You can call all functions you might use from just one instance.

let adr = {};
setTimeout(function wait() {
    adr = document.querySelector('.toolbar-addressbar.toolbar');
    if (adr) {
        overlayToggle();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
