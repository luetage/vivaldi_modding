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
              this.innerHTML = `<span><svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><path d="M 19.090434,18.563592 C 18.30373,17.19665 16.826437,16.278236 15.139118,16.278236 h -2.278236 c -1.687318,0 -3.1646121,0.918414 -3.9513154,2.285356 1.2530304,1.395419 3.0684994,2.271116 5.0904334,2.271116 2.021935,0 3.837404,-0.879256 5.090434,-2.271116 z M 23.112944,14 c 0,5.033478 -4.079466,9.112944 -9.112944,9.112944 -5.0334775,0 -9.1129439,-4.079466 -9.1129439,-9.112944 0,-5.0334775 4.0794664,-9.1129439 9.1129439,-9.1129439 5.033478,0 9.112944,4.0794664 9.112944,9.1129439 z M 14,14.569559 c 1.416778,0 2.563016,-1.146237 2.563016,-2.563015 0,-1.416778 -1.146238,-2.5630158 -2.563016,-2.5630158 -1.416778,0 -2.563015,1.1462378 -2.563015,2.5630158 0,1.416778 1.146237,2.563015 2.563015,2.563015 z"></path></svg></span>`;
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
