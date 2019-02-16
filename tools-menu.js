/*
Tools Menu
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
    btnT.innerHTML = '<svg width="26" height="26" viewBox="-150 -150 812 812" xmlns="http://www.w3.org/2000/svg"><path d="M483.97,105.709c-2.491-9.958-14.903-13.424-22.157-6.165l-58.913,58.914c-13.083,13.077-34.291,13.077-47.372,0   l-27.03-27.031c-13.082-13.081-13.082-34.289,0-47.372l58.196-58.197c7.307-7.307,3.751-19.838-6.306-22.193   c-13.772-3.218-28.327-4.406-43.339-3.208c-64.522,5.148-123.907,65.649-127.923,130.254c-1.521,24.503,3.43,47.667,13.077,68.186   L16.253,375.878c-9.263,7.96-14.81,19.401-15.323,31.602c-0.519,12.201,4.042,24.068,12.599,32.78l34.902,35.541   c8.64,8.802,20.57,13.586,32.899,13.19c12.33-0.399,23.928-5.936,31.986-15.271l178.388-206.684   c19.917,8.889,42.21,13.424,65.747,11.956c65.041-4.058,125.554-63.92,130.29-128.91   C488.863,134.686,487.482,119.777,483.97,105.709z"></path>';
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
