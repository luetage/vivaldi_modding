// Changing toolbar icons
// version 2022.10.0
// Icons: Font Awesome 6 Free

(function profileIcon() {
  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.parentNode.classList.contains("profile-popup")) {
            this.innerHTML =
              '<svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:18px;width:18px"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"></path></svg>';
          }
          if (
            this.title === "Toggle extensions" &&
            this.classList.contains("ToolbarButton-Button")
          ) {
            this.innerHTML =
              '<svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:18px;width:18px"><path d="M0 208C0 104.4 75.7 18.5 174.9 2.6C184 1.2 192 8.6 192 17.9V81.2c0 8.4 6.5 15.3 14.7 16.5C307 112.5 384 199 384 303.4c0 103.6-75.7 189.5-174.9 205.4c-9.2 1.5-17.1-5.9-17.1-15.2V430.2c0-8.4-6.5-15.3-14.7-16.5C77 398.9 0 312.4 0 208zm288 48c0-53-43-96-96-96s-96 43-96 96s43 96 96 96s96-43 96-96zm-96 32c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"></path></svg>';
          }
          if (
            this.title === "Copy Page Address" &&
            this.classList.contains("ToolbarButton-Button")
          ) {
            this.innerHTML =
              '<svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:16px;width:16px"><path d="M64 464H288C296.8 464 304 456.8 304 448V384H352V448C352 483.3 323.3 512 288 512H64C28.65 512 0 483.3 0 448V224C0 188.7 28.65 160 64 160H128V208H64C55.16 208 48 215.2 48 224V448C48 456.8 55.16 464 64 464zM160 64C160 28.65 188.7 0 224 0H448C483.3 0 512 28.65 512 64V288C512 323.3 483.3 352 448 352H224C188.7 352 160 323.3 160 288V64zM224 304H448C456.8 304 464 296.8 464 288V64C464 55.16 456.8 48 448 48H224C215.2 48 208 55.16 208 64V288C208 296.8 215.2 304 224 304z"></path></svg>';
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
