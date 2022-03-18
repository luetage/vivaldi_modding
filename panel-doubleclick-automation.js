// Panel doubleclick automation
// https://forum.vivaldi.net/post/391224
// Switches the tab or opens a bookmark, by simulating a doubleclick on a tab or a bookmark in the windows or bookmark panel.

{
  function doClick(event) {
    event.stopPropagation();
    event.preventDefault();
    var ev = document.createEvent("MouseEvents");
    ev.initEvent("dblclick", true, true);
    this.parentNode.dispatchEvent(ev);
  }

  function checkParents(el, sel) {
    while (el.parentNode) {
      el = el.parentNode;
      if (el.id === sel[0]) {
        return win;
      } else if (el.classList !== undefined && el.classList.contains(sel[1])) {
        return book;
      }
    }
    return null;
  }

  // Set win to 0 or 1 for either triggering the doubleclick on favicon, or window title.
  // Set book to 0 or 1 for either triggering the doubleclick on favicon, or bookmark title.
  const win = 1;
  const book = 1;

  var appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "LABEL" && arguments[0].tagName === "IMG") {
      setTimeout(
        function () {
          var check = checkParents(this, ["window-panel", "panel-bookmarks"]);
          if (check === 0 || check === 1) {
            this.childNodes[check].addEventListener("click", doClick);
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
}
