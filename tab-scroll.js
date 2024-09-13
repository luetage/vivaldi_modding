// Tab Scroll
// version 2024.9.0
// https://forum.vivaldi.net/post/214898
// Clicking on an active tab scrolls page to top, clicking it again returns to
// previous scroll position. Credits to tam710562 from Vivaldi Forum for coming
// up with the sessionStorage solution, which made this possible.

(function tabScroll() {
  "use strict";

  function exit(tab) {
    tab.removeEventListener("mousemove", exit);
    tab.removeEventListener("click", trigger);
  }

  function trigger(tab) {
    chrome.scripting.executeScript({
      target: {
        tabId: Number(tab.parentNode.parentNode.id.replace(/\D/g, "")),
      },
      function: script,
    });
    exit(tab);
  }

  function react(e, tab) {
    if (
      tab.parentNode.classList.contains("active") &&
      e.which === 1 &&
      !(e.target.nodeName === "path" || e.target.nodeName === "svg") &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey
    ) {
      tab.addEventListener("mousemove", exit(tab));
      tab.addEventListener("click", trigger(tab));
    }
  }

  const script = () => {
    let offset = window.scrollY;
    if (offset > 0) {
      window.sessionStorage.setItem("offset", offset);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      window.scrollTo({
        top: window.sessionStorage.getItem("offset") || 0,
        behavior: "instant",
      });
    }
  };

  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (
      arguments[0].tagName === "DIV" &&
      arguments[0].classList.contains("tab-header")
    ) {
      setTimeout(
        function () {
          const ts = (event) => react(event, arguments[0]);
          arguments[0].addEventListener("mousedown", ts);
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
