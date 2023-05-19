// Toggle Keys and Gestures
// version 2023.5.0
// https://forum.vivaldi.net/post/622831
// Button for toggling keyboard shortcuts and mouse gestures. Highlight
// indicates whether something is disabled. Can be toggled together or
// individually (shift‐click/alt‐click). See instructions on the forum for
// creating a custom icon.

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
            this.title === "Toggle Keys and Gestures") {
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
