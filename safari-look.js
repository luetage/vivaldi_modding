/*
Safari Look
https://forum.vivaldi.net/topic/23138/solved-modding-the-adressbar-top-window-to-get-it-look-like-safari-browser/6
Safari (browser) like address bar. Requested mod. Dependent on safari-look.css
*/

function safariLook() {
	var windowbuttons = document.querySelector('.window-buttongroup');
	var container = document.createElement('div');
	var extwrapper = document.querySelector('.toolbar-addressbar.toolbar > .extensions-wrapper');
	var tools = document.querySelector('.toolbar-addressbar.toolbar .toolbar');
	var adfield = document.querySelector('.addressfield');
	container.classList.add('container')
	adr.insertBefore(windowbuttons,adr.firstChild);
	adr.insertBefore(container,adr.lastChild);
	container.appendChild(tools);
	container.appendChild(adfield);
	container.appendChild(extwrapper);
};

// The code below is a loop waiting for the browser to load the UI. Something like this has to be used in all similar javascript mods, to ensure the interface has loaded before running dependent functions. You can call all functions you might use from just one instance.

let adr = {};
setTimeout(function wait() {
	adr = document.querySelector('.toolbar-addressbar.toolbar');
	if (adr) {
		safariLook();
	}
	else {
		setTimeout(wait, 300);
	}
}, 300);
