// Second Toolbar
// version 2022.2.0
// https://forum.vivaldi.net/topic/72371/put-only-reload-button-and-an-extension-button-in-between-address-field-and-search-field/6
// Adds a second toolbar to the UrlBar and moves the first button of the original toolbar to it.

(function () {
  let addToolbar = (adr) => {
    const check = document.querySelector(".vm-move");
    if (!check) {
      const div = document.createElement("div");
      div.classList.add(
        "toolbar",
        "toolbar-droptarget",
        "toolbar-mainbar",
        "toolbar-large",
        "vm-move"
      );
      adr.parentNode.insertBefore(div, adr.nextSibling);
      const btn = document.querySelector(".UrlBar .button-toolbar button");
      const target = document.querySelector(".vm-move");
      target.appendChild(btn.parentNode);
    }
  };

  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (arguments[0].tagName === "DIV") {
      setTimeout(
        function () {
          if (this.classList.contains("UrlBar-AddressField")) {
            addToolbar(this);
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
