// Theme Interface plus
// version 2022.3.0
// https://forum.vivaldi.net/post/531981
// Adds functionality to toggle system themes, sort user themes alphabetically,
// move themes individually and expand the overview, to Vivaldi’s settings page.

(function () {
  const toggle = (init) => {
    const css = document.getElementById("tipCSS");
    if (
      (systemDefault === 0 && init === 1) ||
      (systemDefault === 1 && init !== 1)
    ) {
      if (!css) {
        vivaldi.prefs.get("vivaldi.themes.current", (current) => {
          vivaldi.prefs.get("vivaldi.themes.system", (sys) => {
            let index = sys.findIndex((x) => x.id === current);
            const hide = document.createElement("style");
            hide.id = "tipCSS";
            hide.innerText = `.ThemePreviews > div:nth-child(-n+${sys.length}):not(:nth-child(${index + 1})){display: none}`;
            document.getElementsByTagName("head")[0].appendChild(hide);
          });
        });
      }
      systemDefault = 0;
    } else {
      if (css) css.parentNode.removeChild(css);
      systemDefault = 1;
    }
  };

  const sort = () => {
    vivaldi.prefs.get("vivaldi.themes.user", (collection) => {
      collection.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      vivaldi.prefs.set({ path: "vivaldi.themes.user", value: collection });
    });
  };

  const move = (dir) => {
    vivaldi.prefs.get("vivaldi.themes.current", (current) => {
      vivaldi.prefs.get("vivaldi.themes.user", (collection) => {
        let index = collection.findIndex((x) => x.id === current);
        if (index > -1 && dir === "right") {
          if (index === collection.length - 1) {
            collection.unshift(collection.splice(index, 1)[0]);
          } else {
            let fromI = collection[index];
            let toI = collection[index + 1];
            collection[index + 1] = fromI;
            collection[index] = toI;
          }
        } else if (index > -1 && dir !== "right") {
          if (index === 0) {
            collection.push(collection.splice(index, 1)[0]);
          } else {
            let fromI = collection[index];
            let toI = collection[index - 1];
            collection[index - 1] = fromI;
            collection[index] = toI;
          }
        } else return;
        vivaldi.prefs.set({ path: "vivaldi.themes.user", value: collection });
      });
    });
  };

  const expand = (opt) => {
    const view = document.querySelector(".TabbedView");
    if (opt === 1 || expansion === 0) {
      view.style.maxWidth = "unset";
      expansion = 1;
    } else if (opt === 0) {
      view.style.maxWidth = "660px";
    } else {
      view.style.maxWidth = "660px";
      expansion = 0;
    }
  };

  const goUI = {
    buttons: [
      // text, title, function (translate strings)
      ["Toggle", "Toggle System Themes", toggle],
      ["Sort", "Sort Themes Alphabetically", sort],
      ["\u{25C2}", "Move Theme Left", move],
      ["\u{25B8}", "Move Theme Right", () => move("right")],
      ["<b>\u{FF3B}\u{FF3D}</b>", "Expand/Contract", expand],
    ],
    load: () => {
      const footer = document.querySelector(".TabbedView-Footer");
      const link = document.querySelector(".TabbedView-Footer a");
      if (!footer.classList.contains("vm-tip-footer")) {
        footer.classList.add("vm-tip-footer");
        goUI.buttons.forEach((button) => {
          let b = document.createElement("div");
          b.classList.add("button-toolbar");
          b.innerHTML = `<button title="${button[1]}" type="button" class="ToolbarButton-Button button-textonly"><span class="button-title">${button[0]}</span></button>`;
          footer.insertBefore(b, link);
          b.addEventListener("click", button[2]);
        });
      }
      if (expansion === 1) expand(1);
    },
  };

  const mi5 = (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node.classList.contains("TabbedView-Content") &&
          document.querySelector(".ThemePreviews")
        ) {
          goUI.load();
        } else {
          if (expansion === 1) expand(0);
        }
      });
    });
  };

  let systemDefault = 0; // set to »1« to display system themes by default
  let expansion = 0; // set to »1« for the maximum number of themes per row by default
  const settingsUrl =
    "chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=";
  toggle(1);
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url === `${settingsUrl}themes`) {
      goUI.load();
      const view = document.querySelector(".TabbedView");
      new MutationObserver(mi5).observe(view, { childList: true });
    }
  });
})();
