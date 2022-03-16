// UrlBar Spacing
// version 2022.3.0
// https://forum.vivaldi.net/post/400239
// Adds a flexible margin around the Addressfield, depending
// on width of the window. The window can be dragged by clicking
// the margins.

(function () {
  const urlBarSpacing = (url) => {
    const checkStyle = document.getElementById("vm-url-spacing");
    if (!checkStyle) {
      const style = document.createElement("style");
      style.id = "vm-url-spacing";
      style.innerHTML = `.vm-wrapper {flex: 1 0;-webkit-app-region: drag;}.vm-spacer {display: flex;margin-left:  auto;margin-right: auto;width: ${_spacing};}`;
      document.getElementsByTagName("head")[0].appendChild(style);
    }
    const bar = url.parentNode;
    const wrapper = document.createElement("div");
    wrapper.classList.add("vm-wrapper");
    const spacer = document.createElement("div");
    spacer.classList.add("vm-spacer");
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
            const check = document.querySelector(".vm-spacer");
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
