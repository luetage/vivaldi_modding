// Toolbar icons mod
// version 2023.1.0
// Icons: Font Awesome 6 Free

(function toolbarIconsMod() {
  function randomTheme() {
    vivaldi.prefs.get("vivaldi.themes.current", (current) => {
      vivaldi.prefs.get("vivaldi.themes.user", (collection) => {
        if (collection.length > 1) {
          let rd = "";
          while (rd === "" || rd.id === current) {
            rd = collection[Math.floor(Math.random() * collection.length)];
          }
          vivaldi.prefs.set({ path: "vivaldi.themes.current", value: rd.id });
        } else {
          console.log(
            "Please create additional themes in vivaldi://settings/themes"
          );
        }
      });
    });
  }

  function toggleKeysAndGestures(e, el) {
    vivaldi.prefs.get(sk, (k) => {
      vivaldi.prefs.get(sm, (m) => {
        if (e !== null && !e.ctrlKey) {
          if (e.shiftKey) {
            if (k === true) k = false;
            else k = true;
          } else if (e.altKey) {
            if (m === true) m = false;
            else m = true;
          } else {
            if (k === true) k = false;
            else k = true;
            if (m === true) m = false;
            else m = true;
          }
          vivaldi.prefs.set({ path: sk, value: k });
          vivaldi.prefs.set({ path: sm, value: m });
        }
        if (k === false || m === false) {
          el.style = "color: var(--colorHighlightBg)";
        } else {
          el.style = "color: unset";
        }
        el.title = "Toggle Keys and Gestures";
        if (k === true) el.title += "\n\u{2022} Keys enabled (shift)";
        else el.title += "\n\u{2022} Keys disabled (shift)";
        if (m === true) el.title += "\n\u{2022} Gestures enabled (alt)";
        else el.title += "\n\u{2022} Gestures disabled (alt)";
      });
    });
  }

  const sk = "vivaldi.keyboard.shortcuts.enable";
  const sm = "vivaldi.mouse_gestures.enabled";
  let check = 0;

  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.classList.contains("ToolbarButton-Button")) {
            if (this.name === "AccountButton") {
              this.innerHTML = `<span><svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:18px;width:18px"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"></path></svg></span>`;
            }
            if (this.title === "Random Theme") {
              this.addEventListener("click", randomTheme);
            }
            if (this.title === "Toggle Keys and Gestures") {
              toggleKeysAndGestures(null, this);
              const run = (event) => toggleKeysAndGestures(event, this);
              this.addEventListener("click", run);
              if (check === 0) {
                vivaldi.prefs.onChanged.addListener((e) => {
                  if (e.path === sk || e.path === sm)
                    toggleKeysAndGestures(null, this);
                });
                check = 1;
              }
            }
            if (this.title === "Customize Toolbar") {
              this.addEventListener("click", () => {
                if (document.querySelector(".toolbar-editor")) {
                  document
                    .querySelector(
                      ".toolbar-editor .dialog-footer input:last-of-type"
                    )
                    .click();
                }
              });
            }
            if (this.title === "Update Feeds") {
              this.addEventListener("click", () => {
                setTimeout(() => {
                  document
                    .querySelector("input[value='Update All Feeds']")
                    .click();
                }, 150);
              });
            }
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
// Toolbar icons mod
// version 2023.2.0
// Icons: Font Awesome 6 Free

(function toolbarIconsMod() {
  function toggleKeysAndGestures(e, el) {
    vivaldi.prefs.get(sk, (k) => {
      vivaldi.prefs.get(sm, (m) => {
        if (e !== null && !e.ctrlKey) {
          if (e.shiftKey) {
            if (k === true) k = false;
            else k = true;
          } else if (e.altKey) {
            if (m === true) m = false;
            else m = true;
          } else {
            if (k === true) k = false;
            else k = true;
            if (m === true) m = false;
            else m = true;
          }
          vivaldi.prefs.set({ path: sk, value: k });
          vivaldi.prefs.set({ path: sm, value: m });
        }
        if (k === false || m === false) {
          el.style = "color: var(--colorHighlightBg)";
        } else {
          el.style = "color: unset";
        }
        el.title = "Toggle Keys and Gestures";
        if (k === true) el.title += "\n\u{2022} Keys enabled (shift)";
        else el.title += "\n\u{2022} Keys disabled (shift)";
        if (m === true) el.title += "\n\u{2022} Gestures enabled (alt)";
        else el.title += "\n\u{2022} Gestures disabled (alt)";
      });
    });
  }

  const sk = "vivaldi.keyboard.shortcuts.enable";
  const sm = "vivaldi.mouse_gestures.enabled";
  let check = 0;

  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.classList.contains("ToolbarButton-Button")) {
            if (this.name === "AccountButton") {
              this.innerHTML = `<span><svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:18px;width:18px"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"></path></svg></span>`;
            }
            if (this.title === "Toggle Keys and Gestures") {
              toggleKeysAndGestures(null, this);
              const run = (event) => toggleKeysAndGestures(event, this);
              this.addEventListener("click", run);
              if (check === 0) {
                vivaldi.prefs.onChanged.addListener((e) => {
                  if (e.path === sk || e.path === sm)
                    toggleKeysAndGestures(null, this);
                });
                check = 1;
              }
            }
            if (this.title === "Customize Toolbar") {
              this.addEventListener("click", () => {
                if (document.querySelector(".toolbar-editor")) {
                  document
                    .querySelector(
                      ".toolbar-editor .dialog-footer input:last-of-type"
                    )
                    .click();
                }
              });
            }
            if (this.title === "Update Feeds") {
              this.addEventListener("click", () => {
                setTimeout(() => {
                  document
                    .querySelector("input[value='Update All Feeds']")
                    .click();
                }, 150);
              });
            }
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
