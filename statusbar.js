// Statusbar above panel
// version 2023.3.0
// https://forum.vivaldi.net/post/652235
// Moves the statusbar above the panel, adds style to fit the theme
// (transparency, blur), and lines up the first and last button.

(function statusbarAbovePanel() {
  const css = `
    footer {
      background-color: var(--colorBgAlphaBlur) !important;
      backdrop-filter: var(--backgroundBlur);
    }
    footer:has(.toolbar-statusbar) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .toolbar-statusbar > .button-toolbar:first-of-type > button {
      padding-left: 3px;
    }
    .toolbar-statusbar > .button-toolbar:last-of-type > button {
      padding-right: 3px;
    }
  `;

  setTimeout(function wait() {
    const footer = document.querySelector("footer");
    if (footer) {
      const style = document.createElement("style");
      style.id = "vm-sap-css";
      style.innerHTML = css;
      document.getElementsByTagName("head")[0].appendChild(style);
      document
        .getElementById("main")
        .insertBefore(footer, document.querySelector(".inner"));
    } else setTimeout(wait, 300);
  }, 300);
})();
