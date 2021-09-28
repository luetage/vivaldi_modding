// Tab Lock
// version 2021.9.0
// https://forum.vivaldi.net/topic/30957/tab-lock/24
// Custom page action. Throws a warning when you try to navigate.

(function () {
  window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "";
  });

  window.addEventListener("popstate", () => console.log("block navigation"));
})();
