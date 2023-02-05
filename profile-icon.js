// Profile Icon
// version 2023.2.0
// https://forum.vivaldi.net/post/522106
// Exchanges your account/default profile image (sync), for a proper SVG icon
// using theme colors. Credits to tam710562 for coming up with a solution to
// reinstate the SVG when the address bar is being toggled. Icon: Font Awesome 6
// Free.

(function profileIcon() {
  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (arguments[0].tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.classList.contains("ToolbarButton-Button")) {
            if (this.name === "AccountButton") {
              this.innerHTML = `<span><svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><path d="M 19.090434,18.563592 C 18.30373,17.19665 16.826437,16.278236 15.139118,16.278236 h -2.278236 c -1.687318,0 -3.1646121,0.918414 -3.9513154,2.285356 1.2530304,1.395419 3.0684994,2.271116 5.0904334,2.271116 2.021935,0 3.837404,-0.879256 5.090434,-2.271116 z M 23.112944,14 c 0,5.033478 -4.079466,9.112944 -9.112944,9.112944 -5.0334775,0 -9.1129439,-4.079466 -9.1129439,-9.112944 0,-5.0334775 4.0794664,-9.1129439 9.1129439,-9.1129439 5.033478,0 9.112944,4.0794664 9.112944,9.1129439 z M 14,14.569559 c 1.416778,0 2.563016,-1.146237 2.563016,-2.563015 0,-1.416778 -1.146238,-2.5630158 -2.563016,-2.5630158 -1.416778,0 -2.563015,1.1462378 -2.563015,2.5630158 0,1.416778 1.146237,2.563015 2.563015,2.563015 z"></path></svg></span>`;
            }
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
