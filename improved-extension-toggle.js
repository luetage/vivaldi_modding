/*
Improved Extension Toggle
https://forum.vivaldi.net/topic/20373/improved-extension-toggle
Keep selected extension buttons visible, show/hide others in extension container. Compatibel with Vivaldi's extension dropdown.
*/

function extensionToggle() {

    // Add extension IDs of buttons you want to keep permanently visible to the array. Remove example ID.
    var selectIDs =
        [
        'extensionPopupIcons',
        'toggleMod',
        'himccccaelhgphommckogopgpddngimf'
        ];

    // create the button
    const ext = document.querySelector('.toolbar-extensions');
    var div = document.createElement('div');
    div.classList.add('button-toolbar', 'toggleMod');
    div.innerHTML = '<button title="Toggle extensions" tabindex="-1"><svg width="14" height="14" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path></svg></button>';
    ext.appendChild(div);
    const togstat = document.querySelector('.toggleMod');
    togstat.style.order = '1';
    const togstatSVG = document.querySelector('.toggleMod button svg');
    togstatSVG.style.height = '14px';
    togstatSVG.style.width = '14px';
    toggleLogic();
    togstat.addEventListener('click', function() {
        if (togstat.classList.contains('expanded')) {
            togstat.classList.remove('expanded');
        }
        else {
            togstat.classList.add('expanded');
        }
        toggleLogic();
    });

    // toggle it!
    function toggleLogic() {
        const buttons = document.querySelectorAll('.toolbar-extensions .button-toolbar');
        for (var i=0; i < buttons.length; i++) {
            if (selectIDs.indexOf(buttons[i].classList.item(1)) != -1 || togstat.classList.contains('expanded')) {
                buttons[i].style.display = 'flex';
            }
            else {
                buttons[i].style.display = 'none';
            }
        }
    };
};

var appendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function () {
    if (arguments[0].tagName === 'DIV') {
        setTimeout(function() {
            if (this.classList.contains('toolbar-extensions')) {
                const extToggle = document.querySelector('.toggleMod');
                if (!extToggle) {
                    extensionToggle();
                }
            }
        }.bind(this, arguments[0]));
    }
    return appendChild.apply(this, arguments);
};
