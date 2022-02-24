// UrlBar Spacing
// version 2022.2.0
// https://forum.vivaldi.net/topic/51023/urlbar-spacing
// Adds a flexible margin around the Addressfield, depending
// on width of the window. The window can be dragged by clicking
// the margins.

(function () {
  function urlBarSpacing(url) {
    const checkStyle = document.getElementById("urlBarSpacer");
    if (!checkStyle) {
      const style = document.createElement("style");
      style.id = "urlBarSpacer";
      style.innerHTML = `#urlWrapper {flex: 1 0;-webkit-app-region: drag;}#urlSpacer {display: flex;margin-left:  auto;margin-right: auto;width: ${_spacing};}`;
      document.getElementsByTagName("head")[0].appendChild(style);
    }
    const bar = url.parentNode;
    const wrapper = document.createElement("div");
    wrapper.id = "urlWrapper";
    const spacer = document.createElement("div");
    spacer.id = "urlSpacer";
    bar.replaceChild(wrapper, url);
    wrapper.appendChild(spacer);
    spacer.appendChild(url);
  }

  const _spacing = "92%"; //change percentage to control spacing
  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (arguments[0].tagName === "DIV") {
      setTimeout(
        function () {
          if (arguments[0].classList.contains("UrlBar-AddressField")) {
            const check = document.getElementById("urlSpacer");
            if (!check) {
              urlBarSpacing(arguments[0]);
            }
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
