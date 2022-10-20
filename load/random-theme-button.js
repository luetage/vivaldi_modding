// Random Theme Button
// version 2022.10.0
// https://forum.vivaldi.net/topic/34767/random-theme-button
// Load a random theme when clicking a command chain button.

(function randomTheme() {
  function randomize() {
    vivaldi.prefs.get("vivaldi.themes.current", (current) => {
      vivaldi.prefs.get("vivaldi.themes.user", (collection) => {
        if (collection.length > 1) {
          let rd = "";
          while (rd === "" || rd.id === current) {
            rd = collection[Math.floor(Math.random() * collection.length)];
          }
          vivaldi.prefs.set({ path: "vivaldi.themes.current", value: rd.id });
        } else {
          console.log(
            "Please create additional themes in vivaldi://settings/themes"
          );
        }
      });
    });
  }

  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (arguments[0].tagName === "BUTTON") {
      setTimeout(
        function () {
          if (arguments[0].title === "Random Theme" && !arguments[0].classList.contains("item")) {
            arguments[0].innerHTML = `<span><svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px"><path d="m 14.936132,10.137092 c -0.53285,-0.53249 -1.41225,-0.15587 -1.41225,0.59766 v 1.69152 h -1.69047 L 5.4096224,3.8612218 c -0.21131,-0.28174 -0.54588,-0.45079 -0.90158,-0.45079 h -3.38094 c -0.62301007,0 -1.12698005752,0.50362 -1.12698005752,1.12698 0,0.62336 0.50396998752,1.12698 1.12698005752,1.12698 h 2.81745 l 6.4237896,8.5650502 c 0.2113,0.28527 0.54588,0.45079 0.90158,0.45079 h 2.2529 v 1.68836 c 0,0.75332 0.91075,1.13121 1.4436,0.59871 l 2.78575,-2.81675 c 0.33059,-0.33059 0.33059,-0.86601 0,-1.19636 z m -3.10272,-4.4727002 h 1.68941 v 1.69153 c 0,0.7533102 0.9111,1.1301502 1.41225,0.59765 l 2.78576,-2.81675 c 0.33059,-0.33073 0.33052,-0.86601 -5e-5,-1.19636 l -2.78575,-2.81674 c -0.53285,-0.53249996 -1.4436,-0.15464996 -1.4436,0.5987 v 1.68801 h -2.22151 c -0.35429,0 -0.68887,0.16729 -0.90123,0.45114 l -1.4231696,1.89791 1.3770296,1.87713 z M 3.9445524,12.426272 h -2.81745 c -0.62301007,0 -1.12698005752,0.50397 -1.12698005752,1.12698 0,0.62301 0.50396998752,1.12698 1.12698005752,1.12698 h 3.38094 c 0.35429,0 0.68886,-0.16728 0.90123,-0.45114 l 1.42281,-1.8972 -1.40837,-1.87783 z"/></svg></span>`;
            arguments[0].addEventListener("click", randomize);
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
