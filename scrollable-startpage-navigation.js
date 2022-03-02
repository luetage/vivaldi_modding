// Scrollable Startpage Navigation
// version 2022.03.0
// https://forum.vivaldi.net/topic/72601/scrollable-speed-dials/14
// Navigate startpage categories with mousewheel.

(function () {
  let scroll = (event) => {
    const btns = Array.from(
      document.querySelectorAll(".startpage-navigation-group button")
    );
    let index = btns.findIndex((x) => x.classList.contains("active"));
    delta = event.wheelDelta / 60;
    direction = delta > 0 ? "up" : "down";
    if (direction === "up") {
      if (index > 0) {
        btns[index - 1].click();
      } else {
        btns[btns.length - 1].click();
      }
    } else {
      if (index < btns.length - 1) {
        btns[index + 1].click();
      } else {
        btns[0].click();
      }
    }
  };

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url.startsWith("chrome://vivaldi-webui/startpage")) {
      const check = document.querySelector(".vm-scroll");
      if (!check) {
        const nav = document.querySelector(".startpage-navigation");
        nav.classList.add("vm-scroll");
        nav.addEventListener("mousewheel", scroll);
      }
    }
  });
})();
