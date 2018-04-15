/*
Tools Menu (JS Part)
https://forum.vivaldi.net/topic/22766/attack-on-the-status-bar
Replaces the status bar with a tool button in the address bar, which loads the status bar as overlay. Also introduces a button in the bar to toggle the status-info (link address). Dependent on tools-menu.css
*/

function toolsMenu() {
	var footer = document.getElementById('footer')
	var spanT = document.createElement('span');
	var divT = document.createElement('div');
	var btnT = document.createElement('button');
	var svgT = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	var pathT = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	var infstat = document.getElementById('status_info');
	var infdiv = document.createElement('div');
	var infbtn = document.createElement('button');
	var infsvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	var infpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

	divT.id = 'droptool';
	btnT.id = 'tools';
	btnT.classList.add('button-toolbar');
	btnT.setAttribute('tabindex', '-1');
	btnT.setAttribute('title', 'Tools');
	svgT.setAttributeNS(null, 'width', '26');
	svgT.setAttributeNS(null, 'height', '26');
	svgT.setAttributeNS(null, 'viewBox', '-150 -150 812 812');
	infdiv.id = 'divID';
	infbtn.id = 'toggle-links';
	infbtn.classList.add('button-toolbar-small');
	infbtn.setAttribute('tabindex', '-1');
	infbtn.setAttribute('title', 'Show Status Info');
	infsvg.setAttributeNS(null, 'width', '16');
	infsvg.setAttributeNS(null, 'height', '16');
	infsvg.setAttributeNS(null, 'viewBox', '0 0 26 26');
	adr.insertBefore(spanT,document.querySelector('.searchfield').nextSibling);
	spanT.appendChild(btnT);
	btnT.appendChild(svgT);
	svgT.appendChild(pathT);
	spanT.appendChild(divT);
	divT.appendChild(footer);
	footer.classList.add('disabled');
	footer.appendChild(infdiv);
	infdiv.appendChild(infbtn);
	infbtn.appendChild(infsvg);
	infsvg.appendChild(infpath);

	document.getElementById('tools').addEventListener('click', function() {
		if (footer.classList.contains('disabled')) {
			footer.classList.remove('disabled');
		}
		else {
			footer.classList.add('disabled');
		}
	});

	document.getElementById('toggle-links').addEventListener('click', function () {
		if (footer.classList.contains('zeig')) {
			footer.classList.remove('zeig');
			infpath.style.fill = 'var(--colorFg)';
			infbtn.setAttribute('title', 'Show Status Info');
		}
		else {
			footer.classList.add('zeig');
			infpath.style.fill = 'var(--colorHighlightBg)';
			infbtn.setAttribute('title', 'Hide Status Info');
		}
	});
};

// Below code is a loop waiting for the browser to load the UI. Something like it has to be used in all similar javascript mods to ensure the interface has loaded before running dependent functions. You can call all functions you might use from just one instance.

let adr = {};
setTimeout(function wait() {
	adr = document.querySelector('.toolbar-addressbar.toolbar');
	if (adr) {
		toolsMenu();
	}
	else {
		setTimeout(wait, 300);
	}
}, 300);
