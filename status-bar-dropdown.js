/*
Status Bar Dropdown
https://forum.vivaldi.net/topic/22766/attack-on-the-status-bar
Replaces the status bar with a tool button in the address bar, which loads the status bar as overlay. Also introduces a button in the bar to toggle the status-info (link address).
*/

function create() {
    const footer = document.getElementById('footer');
    const statusToolbar = document.querySelector('.status-toolbar');
    const adr = document.querySelector('.toolbar-addressbar.toolbar');
    footer.classList.add('disabled','zeig');
    var spanT = document.createElement('span');
    var divT = document.createElement('div');
    divT.id = 'droptool';
    var btnT = document.createElement('button');
    btnT.id = 'tools';
    btnT.classList.add('button-toolbar');
    btnT.setAttribute('tabindex', '-1');
    btnT.setAttribute('title', 'Tools');
    btnT.innerHTML = '<svg width="14" height="14" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1683 808l-742 741q-19 19-45 19t-45-19l-742-741q-19-19-19-45.5t19-45.5l166-165q19-19 45-19t45 19l531 531 531-531q19-19 45-19t45 19l166 165q19 19 19 45.5t-19 45.5z"></path>';
    var infdiv = document.createElement('div');
    infdiv.id = 'divID';
    infdiv.innerHTML = '<button id="toggle-links" title="Hide Status Info" class="button-toolbar-small" tabindex="-1"><svg width="16" height="16" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M17.6 20.4l-1.6 1.6-9-9 9-9 1.6 1.6-7.2 7.4 7.2 7.4z" fill="var(--colorHighlightBg)"></path></svg></button>';
    adr.insertBefore(spanT,document.querySelector('.toolbar-addressbar.toolbar > .extensions-wrapper'));
    spanT.appendChild(btnT);
    spanT.appendChild(divT);
    divT.appendChild(footer);
    statusToolbar.appendChild(infdiv);
};

function cssT() {
    var styleS = document.createElement('style');
    styleS.type = 'text/css';
    styleS.innerHTML = '#droptool {position: absolute;z-index: 1;right: 0;box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);}.callout {bottom: unset;margin-top: 1px;}.callout::before, .callout::after {display: none;}#divID {order: 1;}.statusbar-left {order: 2;}.statusbar-right {order: 3;}#footer {border-right: none;}#status_info {display: none;}#footer.zeig #status_info.visible {display: flex;max-width: 500px;}.paneltogglefooter {display: none !important;}';
    document.getElementsByTagName('head')[0].appendChild(styleS);
};

function menuT() {
    if (footer.classList.contains('disabled')) {
        footer.classList.remove('disabled');
    }
    else {
        footer.classList.add('disabled');
    }
};

function statusT() {
    const fill = document.querySelector('#toggle-links svg path');
    const infbtn = document.getElementById('toggle-links');
    if (footer.classList.contains('zeig')) {
        footer.classList.remove('zeig');
        fill.setAttribute('fill', 'var(--colorFg)');
        infbtn.setAttribute('title', 'Show Status Info');
    }
    else {
        footer.classList.add('zeig');
        fill.setAttribute('fill', 'var(--colorHighlightBg)');
        infbtn.setAttribute('title', 'Hide Status Info');
    }
};

function toolsMenu() {
    create();
    cssT();
    document.getElementById('tools').addEventListener('click', menuT);
    document.getElementById('toggle-links').addEventListener('click', statusT);
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        toolsMenu();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
