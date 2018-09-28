/*
Panel Toggle
https://forum.vivaldi.net/topic/22835/panel-toggle-to-address-bar
Moves the panel toggle from status to address bar and gives it two states (on/off).
*/

function panelToggle() {
    var panel = document.getElementById('panels-container');
    var paneltog = document.querySelector('.paneltogglefooter');
    var panelsvg = document.querySelector('.paneltogglefooter svg');
    var panelpath = document.querySelector('.paneltogglefooter svg path');
    var sright = 'd: path("M20 8v10h-14v-10h14zm-2 8v-6h-4v6h4z")';
    var sleft = 'd: path("M20 8v10h-14v-10h14zm-8 8v-6h-4v6h4z")';
    paneltog.classList.add('button-toolbar');
    paneltog.classList.remove('button-toolbar-small');
    paneltog.style.order = 'unset';
    panelsvg.style.transform = 'none';
    panelsvg.setAttributeNS(null, 'viewBox', '0 0 26 26');

    if (panel.classList.contains('right')) {
        adr.appendChild(paneltog);
        var pof = sright;
        var pon = sleft;
    }
    else {
        adr.insertBefore(paneltog,adr.firstChild);
        var pof = sleft;
        var pon = sright;
    }
    if (panel.classList.contains('switcher')) {
        panelpath.style = pof;
    }
    else {
        panelpath.style = pon;
    }

    paneltog.addEventListener('click', function(event) {
        if (!event.altKey) {
            if (panel.classList.contains('switcher')) {
                panelpath.style = pon;
            }
            else {
                panelpath.style = pof;
            }
        }
    });
};

// The code below is a loop waiting for the browser to load the UI. Something like this has to be used in all similar javascript mods, to ensure the interface has loaded before running dependent functions. You can call all functions you might use from just one instance.

let adr = {};
setTimeout(function wait() {
    adr = document.querySelector('.toolbar-addressbar.toolbar');
    if (adr) {
        panelToggle();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
