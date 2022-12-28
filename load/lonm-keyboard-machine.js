// Keyboard Machine, a Mod for Vivaldi
// Make custom shortcuts that do stuff™ and use them in the vivaldi UI
// Based on "button machine". NO COPYRIGHT RESERVED. lonm.vivaldi.net
// Version 1.0.0

(function keyboardMachine() {
  // Add custom commands here
  // key: String of what keys to press - written in the form (Ctrl+Shift+Alt+Key)
  // value: A function describing what to do when the key is pressed

  const SHORTCUTS = {
    "Ctrl+Y": () => {
      // get version
      const active = document.activeElement;
      const version = vivaldi.utilities.getVersion();
      document.querySelector(".vivaldi").focus();
      navigator.clipboard.writeText(version.vivaldiVersion);
      setTimeout(() => active.focus(), 100);
    },
    "Alt+=": () => {
      // zoom speed dials
      vivaldi.prefs.get("vivaldi.startpage.speed_dial.width", (current) => {
        const width = [120, 170, 220, 270, 320];
        let index = width.findIndex((x) => x === current);
        if (index === 4) index = -1;
        vivaldi.prefs.set({
          path: "vivaldi.startpage.speed_dial.width",
          value: width[index + 1],
        });
      });
    },
  };

  // Handle a potential keyboard shortcut
  // @param {String} combination written in the form (CTRL+SHIFT+ALT+KEY)
  // @param {boolean} extras I don't know what this does, but it's an extra argument

  function keyCombo(code, combination, extras) {
    const customShortcut = SHORTCUTS[combination];
    if (customShortcut) {
      customShortcut();
    }
  }

  // Check that the browser is loaded up properly, and init the mod

  function initMod() {
    if (document.querySelector("#browser")) {
      vivaldi.tabsPrivate.onKeyboardShortcut.addListener(keyCombo);
    } else {
      setTimeout(initMod, 500);
    }
  }
  initMod();
})();
