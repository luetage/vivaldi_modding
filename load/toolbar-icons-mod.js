// Toolbar icons mod
// version 2023.3.2
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
              this.innerHTML = `<span><svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g opacity="0.8"><path d="m 18.342208,17.892805 c -0.671069,-1.16602 -1.931219,-1.949439 -3.370525,-1.949439 h -1.943365 c -1.439306,0 -2.699457,0.783419 -3.3705259,1.949439 1.0688519,1.190311 2.6174709,1.937292 4.3422079,1.937292 1.724738,0 3.273357,-0.750017 4.342208,-1.937292 z M 6.2265373,14 A 7.7734629,7.7734629 0 1 1 21.773463,14 7.7734629,7.7734629 0 1 1 6.2265373,14 Z M 14,14.485842 a 2.1862865,2.1862865 0 1 0 0,-4.372573 2.1862865,2.1862865 0 1 0 0,4.372573 z"></path></g></svg></span>`;
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
            if (this.title.startsWith("Show Closed Tabs")) {
              this.innerHTML = `<span class="button-icon"><svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 9 h13 v2 h-13 Z M7.5 13 h13 v2 h-13 Z M10 17 h8 v2 h-8 Z"></path></svg></span>`;
            }
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
