/*
Extensions to Panel
https://forum.vivaldi.net/topic/17879/moving-extension-icons-next-to-the-panel-toggles/16
Moves the extension action buttons to the panel. Dependent on extensions-to-panel.css
*/

function extPanel() {
	const wrapper = document.querySelector('.toolbar-addressbar.toolbar > .extensions-wrapper');
	const pref = document.getElementById('overlay');
	const panel = document.getElementById('switch');
	panel.insertBefore(wrapper, pref);
};

// The code below is a loop waiting for the browser to load the UI. Something like this has to be used in all similar javascript mods, to ensure the interface has loaded before running dependent functions. You can call all functions you might use from just one instance.

let adr = {};
setTimeout(function wait() {
	adr = document.querySelector('.toolbar-addressbar.toolbar');
	if (adr) {
		extPanel();
	}
	else {
		setTimeout(wait, 300);
	}
}, 300);
