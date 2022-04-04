// Tab Scroll
// version 2022.4.0
// https://forum.vivaldi.net/topic/27856/tab-scroll
// Clicking on an active tab scrolls page to top, clicking it again returns to
// previous scroll position. Credits to tam710562 from Vivaldi Forum for coming
// up with the sessionStorage solution, which made this possible.

(function tabScroll() {
  function exit(tab) {
    tab.removeEventListener("mousemove", exit);
    tab.removeEventListener("click", trigger);
  }

  function trigger(tab) {
    chrome.scripting.executeScript({
      target: { tabId: Number(tab.parentNode.id.replace(/\D/g, "")) },
      function: script,
    });
    exit(tab);
  }

  function react(e, tab) {
    if (
      tab.parentNode.classList.contains("active") &&
      e.which === 1 &&
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
    let offset = window.pageYOffset;
    if (offset > 0) {
      window.sessionStorage.setItem("tabOffset", offset);
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, window.sessionStorage.getItem("tabOffset") || 0);
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
