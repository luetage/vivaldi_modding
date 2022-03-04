// Scrollable Startpage Navigation
// version 2022.03.1
// https://forum.vivaldi.net/post/561919
// Navigate startpage categories with mousewheel.

(function () {
  let scroll = (e) => {
    const btns = Array.from(
      document.querySelectorAll(".startpage-navigation-group button")
    );
    const index = btns.findIndex((x) => x.classList.contains("active"));
    const dir = e.wheelDelta > 0 ? "up" : "down";
    if (dir === "up") {
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
    try {
      if (changeInfo.url.startsWith("chrome://vivaldi-webui/startpage")) {
        const check = document.querySelector(".vm-scroll");
        if (!check) {
          const nav = document.querySelector(".startpage-navigation");
          nav.classList.add("vm-scroll");
          nav.addEventListener("wheel", (event) => {
            let timeout;
            if (timeout) window.cancelAnimationFrame(timeout);
            timeout = window.requestAnimationFrame(() => scroll(event));
          }, {passive: true});
        }
      }
    } catch (error) {
      void 0;
    }
  });
})();
