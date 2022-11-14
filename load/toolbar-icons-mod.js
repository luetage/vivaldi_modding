// Toolbar icons mod
// version 2022.11.0
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
            if (this.title === "Toggle extensions") {
              this.innerHTML = `<span><svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:16px;width:16px"><path d="M128 32c0-17.7-14.3-32-32-32S64 14.3 64 32V64H32C14.3 64 0 78.3 0 96s14.3 32 32 32H64V384c0 35.3 28.7 64 64 64H352V384H128V32zM384 480c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H448l0-256c0-35.3-28.7-64-64-64L160 64v64l224 0 0 352z"></path></svg></span>`;
            }
            if (this.name === "AccountButton") {
              this.innerHTML = `<span><svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:18px;width:18px"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"></path></svg></span>`;
            }
            if (this.title === "Copy Page Address") {
              this.innerHTML = `<span><svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:16px;width:16px"><path d="M64 464H288C296.8 464 304 456.8 304 448V384H352V448C352 483.3 323.3 512 288 512H64C28.65 512 0 483.3 0 448V224C0 188.7 28.65 160 64 160H128V208H64C55.16 208 48 215.2 48 224V448C48 456.8 55.16 464 64 464zM160 64C160 28.65 188.7 0 224 0H448C483.3 0 512 28.65 512 64V288C512 323.3 483.3 352 448 352H224C188.7 352 160 323.3 160 288V64zM224 304H448C456.8 304 464 296.8 464 288V64C464 55.16 456.8 48 448 48H224C215.2 48 208 55.16 208 64V288C208 296.8 215.2 304 224 304z"></path></svg></span>`;
            }
            if (this.title === "Random Theme") {
              this.innerHTML = `<span><svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px"><path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"/></svg></span>`;
              this.addEventListener("click", randomTheme);
            }
            if (this.title === "Toggle Keys and Gestures") {
              this.innerHTML = `<span><svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:16px;width:16px"><path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"></path></svg></span>`;
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
                    .querySelector(".toolbar-editor .dialog-footer input")
                    .click();
                }
              });
            }
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
