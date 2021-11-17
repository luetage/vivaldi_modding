// Theme Interface plus
// version 2021.11.5
// https://forum.vivaldi.net/topic/68564/theme-interface-plus
// Adds functionality to toggle system themes, sort user themes alphabetically
// and move themes individually to Vivaldi’s settings page.

(function () {
  let toggle = (init) => {
    const css = document.getElementById("tipCSS");
    if (
      (systemDefault === 0 && init === 1) ||
      (systemDefault === 1 && init !== 1)
    ) {
      if (!css) {
        vivaldi.prefs.get("vivaldi.themes.system", (sys) => {
          const hide = document.createElement("style");
          hide.setAttribute("type", "text/css");
          hide.id = "tipCSS";
          hide.innerText = `.ThemePreviews .ThemePreview:nth-child(-n+${sys.length}){display: none}`;
          document.getElementsByTagName("head")[0].appendChild(hide);
        });
      }
      systemDefault = 0;
    } else {
      if (css) css.parentNode.removeChild(css);
      systemDefault = 1;
    }
  };

  let sort = () => {
    vivaldi.prefs.get("vivaldi.themes.user", (collection) => {
      collection.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      vivaldi.prefs.set({ path: "vivaldi.themes.user", value: collection });
    });
  };

  let move = (dir) => {
    vivaldi.prefs.get("vivaldi.themes.current", (current) => {
      vivaldi.prefs.get("vivaldi.themes.user", (collection) => {
        let index = collection.findIndex((x) => x.id === current);
        if (index !== -1 && dir === "right" && index < collection.length - 1) {
          let fromI = collection[index];
          let toI = collection[index + 1];
          collection[index + 1] = fromI;
          collection[index] = toI;
        } else if (index !== -1 && dir !== "right" && index > 0) {
          let fromI = collection[index];
          let toI = collection[index - 1];
          collection[index - 1] = fromI;
          collection[index] = toI;
        } else return;
        vivaldi.prefs.set({ path: "vivaldi.themes.user", value: collection });
      });
    });
  };

  let goUI = {
    buttons: [
      // text, title, function (translate strings)
      ["Toggle", "Toggle System Themes", toggle],
      ["Sort", "Sort Themes Alphabetically", sort],
      ["◂", "Move Theme Left", move],
      ["▸", "Move Theme Right", () => move("right")],
    ],
    load: () => {
      const footer = document.querySelector(".TabbedView-Footer");
      const link = document.querySelector(".TabbedView-Footer a");
      if (!footer.classList.contains("tipBtn")) {
        footer.classList.add("tipBtn");
        goUI.buttons.forEach((button) => {
          let b = document.createElement("div");
          b.classList.add("button-toolbar");
          b.innerHTML = `<button title="${button[1]}" type="button" class="ToolbarButton-Button button-textonly"><span class="button-title">${button[0]}</span></button>`;
          footer.insertBefore(b, link);
          b.addEventListener("click", button[2]);
        });
      }
    },
  };

  let systemDefault = 0; // set to »1« to display system themes by default
  const settingsUrl =
    "chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=";
  toggle(1);
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url === `${settingsUrl}themes`) {
      setTimeout(goUI.load, 100);
      document
        .querySelector(".TabbedView-List button:first-of-type")
        .addEventListener("click", () => {
          setTimeout(goUI.load, 100);
        });
    }
  });
})();
