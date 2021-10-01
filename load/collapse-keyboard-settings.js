// Collapse Keyboard Settings
// version 2021.9.0
// https://forum.vivaldi.net/topic/24543/keyboard-settings-should-default-to-collapsed/6
// Automatically collapses the keyboard settings items in
// vivaldi://settings/keyboard.

(function () {
  const settingsUrl =
    "chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=";
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url === `${settingsUrl}keyboard`) {
      setTimeout(() => {
        document.querySelector(".category.show button").click();
      }, 100);
    }
  });
})();
