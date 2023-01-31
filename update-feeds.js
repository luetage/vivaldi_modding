// Update feeds
// version 2023.1.0
// https://forum.vivaldi.net/post/641164
// Custom button to update feeds from any toolbar. See linked topic for full
// instructions.

(function updateFeeds() {
  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.classList.contains("ToolbarButton-Button")) {
            // make sure following title exactly matches the name of your
            // command chain
            if (this.title === "Update Feeds") {
              this.addEventListener("click", () => {
                setTimeout(() => {
                  // make sure following input value exactly matches the title
                  // of the button to update all feeds in vivaldi://settings/rss
                  // this is dependent on your browser language settings
                  document
                    .querySelector("input[value='Update All Feeds']")
                    .click();
                }, 150);
              });
            }
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
