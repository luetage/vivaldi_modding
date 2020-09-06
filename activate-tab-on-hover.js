/* Activate Tab On Hover
 * https://forum.vivaldi.net/topic/50354/create-a-new-mod-mouseover-tab-select/4
 * Activates tab on hover. */

{
    function activateTab(tab) {
        tab.addEventListener('mouseleave', function () {
            clearTimeout(wait);
            tab.removeEventListener('mouseleave', tab);
        })
        wait = setTimeout(function () {
            const id = Number(tab.parentNode.id.replace( /^\D+/g, ''));
            chrome.tabs.update(id,{active: true, highlighted: true});
        }, delay)
    }

    var wait;
    const delay = 300; //pick a time in milliseconds
    var appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (arguments[0].tagName === 'DIV' && arguments[0].classList.contains('tab-header')) {
            setTimeout(function () {
                arguments[0].addEventListener('mouseenter', activateTab.bind(arguments[0], arguments[0]));
            }.bind(this, arguments[0]));
        }
        return appendChild.apply(this, arguments);
    }
}
