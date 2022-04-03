// UrlBar Spacing
// version 2022.4.0
// https://forum.vivaldi.net/post/400239
// Adds a flexible margin around the Addressfield, depending
// on width of the window. The window can be dragged by clicking
// the margins.

(function () {
  const spacing = "92%"; // change percentage to control spacing inside wrapper
  const css = `
    .vm-us-wrapper {
      flex: 1 0;
      -webkit-app-region: drag;
    }
    .vm-us-spacer {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      width: ${spacing};
    }
  `;

  const urlBarSpacing = (url) => {
    const check = document.getElementById("vm-us-css");
    if (!check) {
      const style = document.createElement("style");
      style.id = "vm-us-css";
      style.innerHTML = css;
      document.getElementsByTagName("head")[0].appendChild(style);
    }
    const wrapper = document.createElement("div");
    wrapper.classList.add("vm-us-wrapper");
    const spacer = document.createElement("div");
    spacer.classList.add("vm-us-spacer");
    url.parentNode.replaceChild(wrapper, url);
    wrapper.appendChild(spacer);
    spacer.appendChild(url);
  }

  // const _spacing = "92%"; //change percentage to control spacing
  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (arguments[0].tagName === "DIV") {
      setTimeout(
        function () {
          if (arguments[0].classList.contains("UrlBar-AddressField")) {
            const check = document.querySelector(".vm-us-spacer");
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
