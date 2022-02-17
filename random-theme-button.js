// Random Theme Button
// version 2022.2.0
// https://forum.vivaldi.net/topic/34767/random-theme-button
// Adds a button to the address bar, which will load a random user created theme on click.

(function () {
  let randomize = () => {
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
  };

  let randomTheme = (adr) => {
    const check = document.querySelector(".vm-random");
    if (!check) {
      const src = document.querySelector(".UrlBar-SearchField");
      const div = document.createElement("div");
      div.innerHTML =
        '<button class="ToolbarButton-Button" title="Random theme" tabindex="0"><svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="M424.1 287c-15.13-15.12-40.1-4.426-40.1 16.97V352H336L153.6 108.8C147.6 100.8 138.1 96 128 96H32C14.31 96 0 110.3 0 128s14.31 32 32 32h80l182.4 243.2C300.4 411.3 309.9 416 320 416h63.97v47.94c0 21.39 25.86 32.12 40.99 17l79.1-79.98c9.387-9.387 9.387-24.59 0-33.97L424.1 287zM336 160h47.97v48.03c0 21.39 25.87 32.09 40.1 16.97l79.1-79.98c9.387-9.391 9.385-24.59-.0013-33.97l-79.1-79.98c-15.13-15.12-40.99-4.391-40.99 17V96H320c-10.06 0-19.56 4.75-25.59 12.81L254 162.7L293.1 216L336 160zM112 352H32c-17.69 0-32 14.31-32 32s14.31 32 32 32h96c10.06 0 19.56-4.75 25.59-12.81l40.4-53.87L154 296L112 352z"><path d="M666 481q-60 92-137 273-22-45-37-72.5t-40.5-63.5-51-56.5-63-35-81.5-14.5h-224q-14 0-23-9t-9-23v-192q0-14 9-23t23-9h224q250 0 410 225zm1126 799q0 14-9 23l-320 320q-9 9-23 9-13 0-22.5-9.5t-9.5-22.5v-192q-32 0-85 .5t-81 1-73-1-71-5-64-10.5-63-18.5-58-28.5-59-40-55-53.5-56-69.5q59-93 136-273 22 45 37 72.5t40.5 63.5 51 56.5 63 35 81.5 14.5h256v-192q0-14 9-23t23-9q12 0 24 10l319 319q9 9 9 23zm0-896q0 14-9 23l-320 320q-9 9-23 9-13 0-22.5-9.5t-9.5-22.5v-192h-256q-48 0-87 15t-69 45-51 61.5-45 77.5q-32 62-78 171-29 66-49.5 111t-54 105-64 100-74 83-90 68.5-106.5 42-128 16.5h-224q-14 0-23-9t-9-23v-192q0-14 9-23t23-9h224q48 0 87-15t69-45 51-61.5 45-77.5q32-62 78-171 29-66 49.5-111t54-105 64-100 74-83 90-68.5 106.5-42 128-16.5h256v-192q0-14 9-23t23-9q12 0 24 10l319 319q9 9 9 23z"/></svg></button>';
      div.classList.add("button-toolbar", "vm-random");
      let target = "";
      if (src) target = src;
      else target = adr;
      target.parentNode.insertBefore(div, target.nextSibling);
      document.querySelector(".vm-random button svg").style =
        "width: 16px; height: 16px;";
      document.querySelector(".vm-random").addEventListener("click", randomize);
    }
  };

  var appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (arguments[0].tagName === "DIV") {
      setTimeout(
        function () {
          if (this.classList.contains("UrlBar-AddressField")) {
            randomTheme(this);
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
