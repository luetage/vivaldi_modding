// Profile Icon
// version 2021.9.0
// https://forum.vivaldi.net/topic/34952/choose-a-custom-profile-image/13
// Exchanges the profile image in url bar for a regular svg utilizing Vivaldi's
// theme colors. Credits to tam710562 for coming up with a solution to reinstate
// the svg when the address bar is being toggled. Font Awesome 6 Free icon.

(function () {
  function profileImage(image) {
    image.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"></path></svg>';
    const svgImage = document.querySelector(".profile-popup button svg");
    svgImage.style.height = "18px";
    svgImage.style.width = "18px";
  }

  var appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (arguments[0].tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.classList.contains("profile-popup")) {
            profileImage(arguments[0]);
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
