// Activate Tab On Hover
// https://forum.vivaldi.net/topic/50354/create-a-new-mod-mouseover-tab-select/4
// Activates tab on hover.

{
    function activateTab(e, tab) {
        if (!tab.parentNode.classList.contains('active') && !e.shiftKey && !e.ctrlKey) {
            tab.addEventListener('mouseleave', function () {
                clearTimeout(wait);
                tab.removeEventListener('mouseleave', tab);
            })
            wait = setTimeout(function () {
                if (tab.parentNode.parentNode.classList.contains('is-substack')) {
                    const down = document.createEvent('MouseEvents');
                    down.initEvent('mousedown', true, true);
                    tab.dispatchEvent(down);
                    const up = document.createEvent('MouseEvents');
                    up.initEvent('mouseup',true,true);
                    tab.dispatchEvent(up);
                }
                else {
                    const id = Number(tab.parentNode.id.replace( /^\D+/g, ''));
                    chrome.tabs.update(id, {active: true, highlighted: true});
                }
            }, delay)
        }
    }

    var wait;
    const delay = 300; //pick a time in milliseconds
    var appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (arguments[0].tagName === 'DIV' && arguments[0].classList.contains('tab-header')) {
            setTimeout(function () {
                var trigger = (event) => activateTab(event, arguments[0]);
                arguments[0].addEventListener('mouseenter', trigger);
            }.bind(this, arguments[0]));
        }
        return appendChild.apply(this, arguments);
    }
}
