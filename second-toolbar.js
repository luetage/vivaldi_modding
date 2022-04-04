// Second Toolbar
// version 2022.4.0
// https://forum.vivaldi.net/post/560359
// Adds a second toolbar to the UrlBar and moves »numberOfButtons« from the
// original toolbar to it.

(function secondToolbar() {
  function addToolbar(adr) {
    const check = document.querySelector(".vm-st-move");
    if (!check) {
      const div = document.createElement("div");
      div.classList.add(
        "toolbar",
        "toolbar-droptarget",
        "toolbar-mainbar",
        "toolbar-large",
        "vm-st-move"
      );
      adr.parentNode.insertBefore(div, adr.nextSibling);
      const target = document.querySelector(".vm-st-move");
      const numberOfButtons = 2; // change number of buttons to be moved
      for (let i = 0; i < numberOfButtons; i++) {
        const btn = document.querySelector(
          ".UrlBar .toolbar-mainbar .button-toolbar button"
        );
        target.appendChild(btn.parentNode);
      }
    }
  }

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
