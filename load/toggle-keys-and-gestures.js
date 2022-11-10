// Toggle Keys and Gestures
// version 2022.11.0
// https://forum.vivaldi.net/post/622831
// Button for toggling keyboard shortcuts and mouse gestures. Highlight
// indicates whether something is disabled. Can be toggled together or
// individually (shift‐click/alt‐click).

(function toggleKeysAndGestures() {
  function run(e, el) {
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
  let check = 0
  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (
            this.title === "Toggle Keys and Gestures" &&
            this.classList.contains("ToolbarButton-Button")
          ) {
            this.innerHTML =
              '<span><svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="height:16px;width:16px"><path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"></path></svg></span>';
            run(null, this);
            const toggle = (event) => run(event, this);
            this.addEventListener("click", toggle);
            if (check === 0) {
              vivaldi.prefs.onChanged.addListener((e) => {
                if (e.path === sk || e.path === sm) run(null, this);
              });
              check = 1;
            }
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
