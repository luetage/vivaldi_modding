// Tab Lock
// version 2021.9.0
// https://forum.vivaldi.net/post/241508
// Custom page action. Throws a warning when you try to navigate. Please read
// installation instructions on the forum.

(function () {
  window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "";
  });
  window.addEventListener("popstate", () => console.log("block navigation"));
})();
