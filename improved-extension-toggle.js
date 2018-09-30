/*
Improved Extension Toggle
https://forum.vivaldi.net/topic/20373/improved-extension-toggle
Keep selected extension buttons visible, hide/show others as normal. The linked topic contains additional variants, especially one that lets you toggle multiple sets of extension icons.
*/

function extensionToggle() {

// Add extension IDs of buttons you want to keep permanently visible to the array. Remove example IDs.

    var selectIDs =
        [
        'ffhafkagcdhnhamiaecajogjcfgienom'
        ];

    // create the button
    const adr = document.querySelector('.toolbar-addressbar.toolbar');
    var button = document.createElement('button');
    button.classList.add('button-toolbar', 'toggle-extensions-group');
    button.id = 'togglemod';
    button.setAttribute('title', 'Toggle mod');
    button.setAttribute('tabindex', '-1');
    button.innerHTML = '<svg width="4" height="16" viewBox="0 0 4 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 4c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0 6c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0 6c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z"></path></svg>';
    adr.appendChild(button);

    // startup setting
    const startup = document.querySelectorAll('button.button-toolbar.browserAction-button');
    const togstat = document.getElementById('togglemod');
    for (var i=0; i < startup.length; i++) {
        if (startup[i].classList.contains('actionVisibility-hidden')) {
            startup[i].style.display = 'none';
        }
        else if (selectIDs.indexOf(startup[i].id) != -1) {
            startup[i].style.display = 'flex';
        }
        else {
            startup[i].style.display = 'none';
        }
    }

    // toggle logic
    togstat.addEventListener('click', function() {
        const buttons = document.querySelectorAll('button.button-toolbar.browserAction-button');
        if (togstat.classList.contains('expanded')) {
            togstat.classList.remove('expanded');
        }
        else {
            togstat.classList.add('expanded');
        }
        for (var i=0; i < buttons.length; i++) {
            if (buttons[i].classList.contains('actionVisibility-hidden')) {
                buttons[i].style.display = 'none';
            }
            else if (selectIDs.indexOf(buttons[i].id) != -1 || togstat.classList.contains('expanded')) {
                buttons[i].style.display = 'flex';
            }
            else {
                buttons[i].style.display = 'none';
            }
        }
    });
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        extensionToggle();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
