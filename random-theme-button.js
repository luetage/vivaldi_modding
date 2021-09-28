// Random Theme Button
// version 2021.9.0
// https://forum.vivaldi.net/topic/34767/random-theme-button
// Adds a button in the address bar, which will load a random user created theme on click.

(function () {
  function randomize() {
    chrome.storage.local.get(
      {
        THEMES_USER: "",
        THEME_CURRENT: "",
      },
      function (rd) {
        var userThemes = rd.THEMES_USER;
        var currentTheme = rd.THEME_CURRENT;
        if (userThemes.length > 1) {
          while (random === undefined || random.name === currentTheme) {
            var random =
              userThemes[Math.floor(Math.random() * userThemes.length)];
          }
          chrome.storage.local.set({
            THEME_CURRENT: random.name,
            BROWSER_COLOR_ACCENT_BG: random.colors.accentBg,
            BROWSER_COLOR_BG: random.colors.baseBg,
            BROWSER_COLOR_FG: random.colors.baseFg,
            BROWSER_COLOR_HIGHLIGHT_BG: random.colors.highlightBg,
            TABCOLOR_BEHIND_TABS: random.settings.accentOnWindow,
            USE_TABCOLOR: random.settings.accentFromPage,
            BORDER_RADIUS: random.settings.borderRadius,
            USE_TAB_TRANSPARENT_TABS: random.settings.tabsTransparent,
          });
        } else {
          console.log(
            "Please create additional themes in vivaldi://settings/themes."
          );
        }
      }
    );
  }

  function randomTheme() {
    var div = document.createElement("div");
    div.innerHTML =
      '<button class="" title="Random theme" tabindex="0"><svg width="12" height="12" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M666 481q-60 92-137 273-22-45-37-72.5t-40.5-63.5-51-56.5-63-35-81.5-14.5h-224q-14 0-23-9t-9-23v-192q0-14 9-23t23-9h224q250 0 410 225zm1126 799q0 14-9 23l-320 320q-9 9-23 9-13 0-22.5-9.5t-9.5-22.5v-192q-32 0-85 .5t-81 1-73-1-71-5-64-10.5-63-18.5-58-28.5-59-40-55-53.5-56-69.5q59-93 136-273 22 45 37 72.5t40.5 63.5 51 56.5 63 35 81.5 14.5h256v-192q0-14 9-23t23-9q12 0 24 10l319 319q9 9 9 23zm0-896q0 14-9 23l-320 320q-9 9-23 9-13 0-22.5-9.5t-9.5-22.5v-192h-256q-48 0-87 15t-69 45-51 61.5-45 77.5q-32 62-78 171-29 66-49.5 111t-54 105-64 100-74 83-90 68.5-106.5 42-128 16.5h-224q-14 0-23-9t-9-23v-192q0-14 9-23t23-9h224q48 0 87-15t69-45 51-61.5 45-77.5q32-62 78-171 29-66 49.5-111t54-105 64-100 74-83 90-68.5 106.5-42 128-16.5h256v-192q0-14 9-23t23-9q12 0 24 10l319 319q9 9 9 23z"/></svg></button>';
    div.classList.add("button-toolbar", "random");
    document
      .querySelector(".UrlBar")
      .insertBefore(div, document.querySelector(".toolbar-extensions"));
    document.querySelector(".random button svg").style =
      "width: 14px; height: 14px;";
    document.querySelector(".random").addEventListener("click", randomize);
  }

  setTimeout(function wait() {
    const browser = document.getElementById("browser");
    if (browser) {
      randomTheme();
    } else {
      setTimeout(wait, 300);
    }
  }, 300);
})();
