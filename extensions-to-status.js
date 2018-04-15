/*
Extensions to Status-Bar
https://forum.vivaldi.net/topic/20643/showing-extension-icons-on-the-bottom-of-the-browser/6
Moves the extension action buttons to the status bar. Dependent on extensions-to-status.css
*/

function extStatus() {
	const wrapper = document.querySelector('.toolbar-addressbar.toolbar > .extensions-wrapper');
	const footer = document.getElementById('footer');
	footer.style = "height: 27px";
	footer.appendChild(wrapper);
};

// Below code is a loop waiting for the browser to load the UI. Something like it has to be used in all similar javascript mods to ensure the interface has loaded before running dependent functions. You can call all functions you might use from just one instance.

let adr = {};
setTimeout(function wait() {
	adr = document.querySelector('.toolbar-addressbar.toolbar');
	if (adr) {
		extStatus();
	}
	else {
		setTimeout(wait, 300);
	}
}, 300);
