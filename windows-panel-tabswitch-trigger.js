/*
Windows-Panel Tabswitch Trigger
https://forum.vivaldi.net/topic/49768/done-emulate-double-click-when-left-click-on-favicon-button-in-window-panel/4
Switches the tab when clicking the favicon/image of a tab in the windows panel.
*/

(function () {

    function doClick() {
        var ev = document.createEvent('MouseEvents');
        ev.initEvent('dblclick', true, true);
        this.parentNode.dispatchEvent(ev);
    };

    function checkParents(el, id) {
        while (el.parentNode) {
            el = el.parentNode;
            if (el.id === id) {
                return el;
            }
        }
        return null;
    };

    var appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (arguments[0].tagName === 'IMG') {
            setTimeout(function() {
                var check = checkParents(this, 'window-panel');
                if (check) {
                    var img = this.childNodes;
                    img[0].addEventListener('click', doClick);
                }
            }.bind(this, arguments[0]));
        }
        return appendChild.apply(this, arguments);
    };

})();
