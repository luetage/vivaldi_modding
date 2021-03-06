// UrlBar Spacing
// https://forum.vivaldi.net/topic/51023/urlbar-spacing 
// Adds a flexible margin around the Addressfield, depending
// on width of the window. The window can be dragged by clicking
// the margins.

{
    function urlBarSpacing(url) {
        const checkStyle = document.getElementById('urlBarSpacer');
        if (!checkStyle) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'urlBarSpacer';
            style.innerHTML = `#urlWrapper {flex: 1 0;-webkit-app-region: drag;}#urlSpacer {display: flex;margin-left:  auto;margin-right: auto;width: ${_spacing};}`;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        var bar = url.parentNode;
        var wrapper = document.createElement('div');
        wrapper.id = 'urlWrapper';
        var spacer = document.createElement('div');
        spacer.id = 'urlSpacer';
        bar.replaceChild(wrapper, url);
        wrapper.appendChild(spacer);
        spacer.appendChild(url);
    }

    const _spacing = '92%'; //change percentage to control spacing
    var appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (arguments[0].tagName === 'DIV') {
            setTimeout(function () {
                if (arguments[0].classList.contains('UrlBar-AddressField')) {
                    const check = document.getElementById('urlSpacer');
                    if (!check) {
                        urlBarSpacing(arguments[0]);
                    }
                }
            }.bind(this, arguments[0]))
        }
        return appendChild.apply(this, arguments)
    }
}
