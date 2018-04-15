/*
Improved Extension Toggle
https://forum.vivaldi.net/topic/20373/improved-extension-toggle
Keep selected extension buttons visible, hide/show others as normal.
*/

function extensionToggle() {

// Add extension IDs of buttons, you want to keep permanently visible, to the array. Remove example IDs.

	var selectIDs =
		[
		"ffhafkagcdhnhamiaecajogjcfgienom"
		];

	// create the button
	var button = document.createElement('button');
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	button.classList.add('button-toolbar', 'toggle-extensions-group');
	button.id = 'togglemod';
	button.setAttribute("title", "Toggle mod");
	button.setAttribute("tabindex", "-1");
	svg.setAttributeNS(null, "width", "4");
	svg.setAttributeNS(null, "height", "16");
	svg.setAttributeNS(null, "viewBox", "0 0 4 16");
	path.style = "d: path('M2 4c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0 6c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0 6c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z')";
	adr.appendChild(button);
	button.appendChild(svg);
	svg.appendChild(path);

	// startup setting
	const startup = document.querySelectorAll("button.button-toolbar.browserAction-button");
	const togstat = document.getElementById('togglemod');
	for (var i=0; i < startup.length; i++) {
		if (startup[i].classList.contains('actionVisibility-hidden')) {
			startup[i].style.display = "none";
		}
		else if (selectIDs.indexOf(startup[i].id) != -1) {
			startup[i].style.display = "flex";
		}
		else {
			startup[i].style.display = "none";
		}
	}

	// toggle logic
	togstat.addEventListener('click', function() {
		const buttons = document.querySelectorAll("button.button-toolbar.browserAction-button");
		if (togstat.classList.contains('expanded')) {
			togstat.classList.remove('expanded');
		}
		else {
			togstat.classList.add('expanded');
		}
		for (var i=0; i < buttons.length; i++) {
			if (buttons[i].classList.contains('actionVisibility-hidden')) {
				buttons[i].style.display = "none";
			}
			else if (selectIDs.indexOf(buttons[i].id) != -1 || togstat.classList.contains('expanded')) {
				buttons[i].style.display = "flex";
			}
			else {
				buttons[i].style.display = "none";
			}
		}
	});
};

// Below code is a loop waiting for the browser to load the UI. Something like it has to be used in all similar javascript mods to ensure the interface has loaded before running dependent functions. You can call all functions you might use from just one instance.

let adr = {};
setTimeout(function wait() {
	adr = document.querySelector(".toolbar-addressbar.toolbar");
	if (adr) {
		extensionToggle();
	}
	else {
		setTimeout(wait, 300);
	}
}, 300);
