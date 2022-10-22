// Changing toolbar icons
// version 2022.10.0
// Icons: Font Awesome 6 Free

(function profileIcon() {
  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (arguments[0].tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.classList.contains("profile-popup")) {
            arguments[0].innerHTML =
              '<svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:18px;width:18px"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"></path></svg>';
          }
          if (
            arguments[0].title === "Toggle extensions" &&
            arguments[0].classList.contains("ToolbarButton-Button")
          ) {
            arguments[0].innerHTML =
              '<svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:16px;width:16px"><path d="M418.4 157.9c35.3-8.3 61.6-40 61.6-77.9c0-44.2-35.8-80-80-80c-43.4 0-78.7 34.5-80 77.5L136.2 151.1C121.7 136.8 101.9 128 80 128c-44.2 0-80 35.8-80 80s35.8 80 80 80c12.2 0 23.8-2.7 34.1-7.6L259.7 407.8c-2.4 7.6-3.7 15.8-3.7 24.2c0 44.2 35.8 80 80 80s80-35.8 80-80c0-27.7-14-52.1-35.4-66.4l37.8-207.7zM156.3 232.2c2.2-6.9 3.5-14.2 3.7-21.7l183.8-73.5c3.6 3.5 7.4 6.7 11.6 9.5L317.6 354.1c-5.5 1.3-10.8 3.1-15.8 5.5L156.3 232.2z"></path></svg>';
          }
          if (
            arguments[0].title === "Copy Page Address" &&
            arguments[0].classList.contains("ToolbarButton-Button")
          ) {
            arguments[0].innerHTML =
              '<svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:16px;width:16px"><path d="M64 464H288C296.8 464 304 456.8 304 448V384H352V448C352 483.3 323.3 512 288 512H64C28.65 512 0 483.3 0 448V224C0 188.7 28.65 160 64 160H128V208H64C55.16 208 48 215.2 48 224V448C48 456.8 55.16 464 64 464zM160 64C160 28.65 188.7 0 224 0H448C483.3 0 512 28.65 512 64V288C512 323.3 483.3 352 448 352H224C188.7 352 160 323.3 160 288V64zM224 304H448C456.8 304 464 296.8 464 288V64C464 55.16 456.8 48 448 48H224C215.2 48 208 55.16 208 64V288C208 296.8 215.2 304 224 304z"></path></svg>';
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
