(function universal_web_panel() {
  "use strict";

  const PANEL_ID = "WEBPANEL_7bd381cf-43bb-4196-9b72-16e19ce355e4";

  const DEFAULT_TITLE = "Universal Web Panel";
  const DEFAULT_ICON =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgY2xhc3M9Imljb24iIHZpZXdCb3g9IjAgMCAyMC40OCAyMC40OCI+PGcgc3R5bGU9InN0cm9rZS13aWR0aDoxLjAwMDg2O3N0cm9rZS1kYXNoYXJyYXk6bm9uZSI+PHBhdGggZmlsbD0iI2Y5YzBjMCIgZD0iTTI0OS41IDcwMC42YzE0LjUgMTM1LjUgMTMyLjYgMjQxLjEgMjc2IDI0MS4xczI2MS41LTEwNS42IDI3Ni0yNDEuMXoiIHN0eWxlPSJzdHJva2Utd2lkdGg6MS4wMDA4NjtzdHJva2UtZGFzaGFycmF5Om5vbmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0uODk0IC0uOTI0KSBzY2FsZSguMDIxNzQpIi8+PHBhdGggZmlsbD0iIzk5OSIgZD0iTTUxMiA5NTcuM2MtNzkuNiAwLTE1NC41LTI4LjctMjEwLjgtODAuOC01Ni41LTUyLjItODcuNi0xMjEuNy04Ny42LTE5NS43IDAtNTkuNyAyMC4yLTExNi41IDU4LjQtMTY0LjMgMzYuMi00NS4zIDg1LjQtNzguOCAxNDIuNi05Ny4xVjIwNi4xaC00Ni4xYy0xMS4yIDAtMjAuNC05LjEtMjAuNC0yMC40di0xNy4xYzAtMTEuMiA5LjEtMjAuNCAyMC40LTIwLjRoMjg3LjJjMTEuMiAwIDIwLjQgOS4xIDIwLjQgMjAuNHYxNy4xYzAgMTEuMi05LjEgMjAuNC0yMC40IDIwLjRoLTQ2LjF2MjEzLjRjNTcuMSAxOC4zIDEwNi4zIDUxLjggMTQyLjYgOTcuMSAzOC4yIDQ3LjggNTguNCAxMDQuNiA1OC40IDE2NC4zIDAgNzQtMzEuMSAxNDMuNS04Ny42IDE5NS43LTU2LjUgNTItMTMxLjQgODAuNy0yMTEgODAuN3pNMzY4LjQgMTYzLjJjLTMgMC01LjQgMi40LTUuNCA1LjR2MTcuMWMwIDMgMi40IDUuNCA1LjQgNS40aDYxLjF2MjM5LjVsLTUuMyAxLjZjLTU2LjUgMTctMTA1LjEgNDkuNC0xNDAuNSA5My43LTM2IDQ1LjEtNTUuMSA5OC43LTU1LjEgMTU0LjkgMCA2OS43IDI5LjQgMTM1LjMgODIuOCAxODQuN0MzNjUgOTE1IDQzNi4yIDk0Mi4zIDUxMiA5NDIuM3MxNDcuMS0yNy4zIDIwMC42LTc2LjhjNTMuNC00OS40IDgyLjgtMTE1IDgyLjgtMTg0LjcgMC01Ni4yLTE5LTEwOS44LTU1LjEtMTU0LjktMzUuNC00NC40LTg0LTc2LjgtMTQwLjUtOTMuN2wtNS4zLTEuNlYxOTEuMWg2MS4xYzMgMCA1LjQtMi40IDUuNC01LjR2LTE3LjFjMC0zLTIuNC01LjQtNS40LTUuNHoiIHN0eWxlPSJzdHJva2Utd2lkdGg6MS4wMDA4NjtzdHJva2UtZGFzaGFycmF5Om5vbmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0uODk0IC0uOTI0KSBzY2FsZSguMDIxNzQpIi8+PHBhdGggZmlsbD0iIzk5OSIgZD0iTTIyMC43IDY3Ni44aDU4MS45djhIMjIwLjdabTE5Mi4zLTQ4NmgzOS42djhINDEzWm04Mi41IDBoMTA2LjF2OEg0OTUuNVoiIHN0eWxlPSJzdHJva2Utd2lkdGg6MS4wMDA4NjtzdHJva2UtZGFzaGFycmF5Om5vbmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0uODk0IC0uOTI0KSBzY2FsZSguMDIxNzQpIi8+PHBhdGggZmlsbD0iI2NlMDIwMiIgZD0iTTQ1Mi43IDY0NS43Yy0xNCAwLTI1LjQtMTEuNC0yNS40LTI1LjQgMC0xNCAxMS40LTI1LjQgMjUuNC0yNS40IDE0IDAgMjUuNCAxMS40IDI1LjQgMjUuNCAwIDE0LTExLjQgMjUuNC0yNS40IDI1LjR6bTAtNDIuOWMtOS42IDAtMTcuNCA3LjgtMTcuNCAxNy40IDAgOS42IDcuOCAxNy40IDE3LjQgMTcuNCA5LjYgMCAxNy40LTcuOCAxNy40LTE3LjQgMC05LjYtNy44LTE3LjQtMTcuNC0xNy40em0xMTguOS00NmMtMjcuNiAwLTUwLjEtMjIuNS01MC4xLTUwLjFzMjIuNS01MC4xIDUwLjEtNTAuMSA1MC4xIDIyLjUgNTAuMSA1MC4xLTIyLjUgNTAuMS01MC4xIDUwLjF6bTAtOTIuMmMtMjMuMiAwLTQyLjEgMTguOS00Mi4xIDQyLjEgMCAyMy4yIDE4LjkgNDIuMSA0Mi4xIDQyLjEgMjMuMiAwIDQyLjEtMTguOSA0Mi4xLTQyLjEgMC0yMy4yLTE4LjktNDIuMS00Mi4xLTQyLjF6bS04MC40LTE0Ny45Yy0xNyAwLTMwLjgtMTMuOC0zMC44LTMwLjhzMTMuOC0zMC44IDMwLjgtMzAuOCAzMC44IDEzLjggMzAuOCAzMC44LTEzLjggMzAuOC0zMC44IDMwLjh6bTAtNTMuNmMtMTIuNiAwLTIyLjggMTAuMi0yMi44IDIyLjggMCAxMi42IDEwLjIgMjIuOCAyMi44IDIyLjggMTIuNiAwIDIyLjgtMTAuMiAyMi44LTIyLjggMC0xMi42LTEwLjItMjIuOC0yMi44LTIyLjh6bTUyLTE1MGMtMTIgMC0yMS43LTkuNy0yMS43LTIxLjdzOS43LTIxLjcgMjEuNy0yMS43IDIxLjcgOS43IDIxLjcgMjEuNy05LjcgMjEuNy0yMS43IDIxLjd6bTAtMzUuNGMtNy41IDAtMTMuNyA2LjEtMTMuNyAxMy43czYuMSAxMy43IDEzLjcgMTMuNyAxMy43LTYuMSAxMy43LTEzLjctNi4xLTEzLjctMTMuNy0xMy43eiIgc3R5bGU9InN0cm9rZS13aWR0aDoxLjAwMDg2O3N0cm9rZS1kYXNoYXJyYXk6bm9uZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLS44OTQgLS45MjQpIHNjYWxlKC4wMjE3NCkiLz48L2c+PC9zdmc+";
  const USE_DEFAULT_ICON = true;
  const FAVORITES = []; // [{caption: "Vivaldi", url: "https://vivaldi.net"}, ...]

  const TOOLBAR_HEIGHT = "28px";
  const INPUT_BORDER_RADIUS = "10px";

  class UWP {
    #panelStackChangeObserver;
    #panelChangeObserver;

    constructor() {
      if (this.#panel) {
        this.#panelChangeObserver = this.#createPanelChangeObserver();
        this.#register();
      } else {
        this.#panelStackChangeObserver = this.#createPanelStackChangeObserver();
      }
    }

    #register() {
      this.#isVisible ? this.#registerVisible() : this.#registerInvisible();
    }

    #registerVisible() {
      if (!this.#input) {
        this.createUwpToolbar();
        this.#addInputEvents();
        this.#addWebviewEvents();
        this.#addFavoritesSelectEvents();
      }
      this.#focusInput();
      if (this.#isBlank) {
        this.#title = DEFAULT_TITLE;
        this.#buttonImg = DEFAULT_ICON;
      } else if (USE_DEFAULT_ICON) {
        this.#buttonImg = DEFAULT_ICON;
      }
    }

    #registerInvisible() {
      this.#buttonImg =
        this.#isBlank || USE_DEFAULT_ICON ? DEFAULT_ICON : this.#webview.src;
    }

    // listeners

    #createPanelStackChangeObserver() {
      const panelStackChangeObserver = new MutationObserver((records) => {
        records.forEach(() => this.#handlePanelStackChange());
      });
      panelStackChangeObserver.observe(this.#panelStack, { childList: true });
      return panelStackChangeObserver;
    }

    #createPanelChangeObserver() {
      const panelChangeObserver = new MutationObserver((records) => {
        records.forEach(() => this.#handlePanelChange());
      });
      panelChangeObserver.observe(this.#panel, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return panelChangeObserver;
    }

    #addInputEvents() {
      this.#input.addEventListener("input", () =>
        this.#handleInput(this.#input.value.trim()),
      );
    }

    #addFavoritesSelectEvents() {
      if (this.#isfavoritesEnabled) {
        this.#favoritesSelect.addEventListener("input", () => {
          this.#handleInput(this.#favoritesSelect.value.trim());
          this.#resetFavoritesSelect();
        });
      }
    }

    #addWebviewEvents() {
      this.#webview.addEventListener("contentload", () => {
        this.#showWebview();
        if (this.#isBlank) {
          this.#title = DEFAULT_TITLE;
          this.#buttonImg = DEFAULT_ICON;
        } else if (USE_DEFAULT_ICON) {
          this.#buttonImg = DEFAULT_ICON;
        } else {
          this.#buttonImg = this.#webview.src;
        }
      });
    }

    // builders

    createUwpToolbar() {
      const uwpToolbar = this.#createEmptyUwpToolbar();
      const input = this.#createInput();
      uwpToolbar.appendChild(input);

      if (this.#isfavoritesEnabled) {
        const favoritesSelect = this.#createFavoritesSelect();
        uwpToolbar.appendChild(favoritesSelect);
      }

      this.#panel.appendChild(uwpToolbar);
    }

    #createEmptyUwpToolbar() {
      const uwpToolbar = document.createElement("div");
      uwpToolbar.className = "uwp-toolbar toolbar-default full-width";
      uwpToolbar.width = "100%";
      uwpToolbar.style.height = TOOLBAR_HEIGHT;
      uwpToolbar.style.width = "100%";
      uwpToolbar.style.marginTop = "2px";
      uwpToolbar.style.display = "flex";
      uwpToolbar.style.gap = "2px";
      return uwpToolbar;
    }

    #createInput() {
      const input = document.createElement("input");
      input.className = "uwp-input";
      input.type = "text";
      input.placeholder = "Paste your link, html or javascript";
      input.style.flex = 3;
      input.style.height = TOOLBAR_HEIGHT;
      input.style.padding = "10px";
      input.style.borderRadius = INPUT_BORDER_RADIUS;
      input.style.outline = 'none';
      input.style.borderWidth = '0px';
      return input;
    }

    #createFavoritesSelect() {
      const favoritesSelect = document.createElement("select");
      favoritesSelect.className = "uwp-favorites-select";
      favoritesSelect.style.width = "25px";
      favoritesSelect.style.padding = "5px";
      favoritesSelect.style.backgroundColor = "transparent";
      favoritesSelect.style.backgroundImage = "none";
      favoritesSelect.style.borderWidth = "0px";
      favoritesSelect.style.outline = "none";

      // Create a default option
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "🤍";
      defaultOption.selected = true;
      defaultOption.disabled = true;
      defaultOption.style.backgroundColor = "var(--colorBg)";
      defaultOption.setAttribute("value", 0);
      favoritesSelect.appendChild(defaultOption);

      FAVORITES.forEach((favorite) => {
        const option = document.createElement("option");
        option.value = favorite.url;
        option.textContent = favorite.caption;
        option.style.backgroundColor = "var(--colorBg)";
        favoritesSelect.appendChild(option);
      });

      return favoritesSelect;
    }

    #createHtmlview() {
      const htmlview = document.createElement("div");
      htmlview.id = "htmlview";
      htmlview.style.height = "100%";
      htmlview.style.overflow = "auto";
      return htmlview;
    }

    // getters

    get #panelStack() {
      return document.querySelector(".webpanel-stack");
    }

    get #panel() {
      const selector = `webview[tab_id^="${PANEL_ID}"], webview[vivaldi_view_type^="${PANEL_ID}"`;
      return document.querySelector(selector)?.parentElement?.parentElement;
    }

    get #button() {
      return document.querySelector(`button[name="${PANEL_ID}"]`);
    }

    get #content() {
      return this.#panel.querySelector(".webpanel-content");
    }

    get #title() {
      return this.#panel.querySelector(".webpanel-title").querySelector("span");
    }

    get #htmlview() {
      return this.#panel.querySelector("#htmlview");
    }

    get #webview() {
      return this.#panel.querySelector("webview");
    }

    get #input() {
      return this.#panel.querySelector(".uwp-input");
    }

    get #favoritesSelect() {
      return this.#panel.querySelector(".uwp-favorites-select");
    }

    get #buttonImg() {
      return this.#button.querySelector("img");
    }

    get #isVisible() {
      return this.#panel.classList.contains("visible");
    }

    get #isBlank() {
      return this.#webview.src === "about:blank";
    }

    get #isfavoritesEnabled() {
      return FAVORITES && FAVORITES.length;
    }

    // setters

    set #title(title) {
      setTimeout(() => (this.#title.innerText = title), 100);
    }

    set #buttonImg(url) {
      this.#buttonImg.removeAttribute("srcset");
      const src =
        url && (url.startsWith("http://") || url.startsWith("https://"))
          ? `chrome://favicon/size/16@1x/${url}`
          : url;
      this.#buttonImg.setAttribute("src", src);
    }

    // handlers

    #handleInput(value) {
      if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("file://") ||
        value.startsWith("vivaldi://") ||
        value === "about:blank"
      ) {
        this.#openUrl(value);
      } else if (value.startsWith("(()") && value.endsWith(")()")) {
        this.#executeScript(value);
      } else {
        this.#showHtml(value);
      }
      this.#clearInput();
    }

    #openUrl(url) {
      this.#showWebview();
      this.#webview.src = url;
    }

    #executeScript(script) {
      this.#showWebview();
      this.#webview.executeScript({ code: script });
    }

    #showHtml(html) {
      this.#hideWebview();
      if (!this.#htmlview) {
        const htmlview = this.#createHtmlview();
        this.#content.appendChild(htmlview);
      }
      this.#htmlview.innerHTML = html;
      this.#title = DEFAULT_TITLE;
      this.#buttonImg = DEFAULT_ICON;
    }

    #handlePanelStackChange() {
      if (this.#panel) {
        this.#panelChangeObserver = this.#createPanelChangeObserver();
        this.#register();
      }
    }

    #handlePanelChange() {
      if (this.#isVisible) {
        this.#registerVisible();
      }
    }

    // actions

    #showWebview() {
      if (this.#webview.style.display === "none") {
        this.#htmlview.remove();
        this.#webview.style.display = "";
      }
    }

    #hideWebview() {
      this.#webview.style.display = "none";
    }

    #clearInput() {
      this.#input.value = "";
    }

    #focusInput() {
      setTimeout(() => this.#input.focus(), 100);
    }

    #resetFavoritesSelect() {
      this.#favoritesSelect.value = 0;
    }
  }

  function getPanels() {
    return document.querySelector(".webpanel-stack");
  }

  function initMod() {
    const panels = getPanels();
    if (panels) {
      window.uwp = new UWP();
    } else {
      setTimeout(initMod, 500);
    }
  }

  setTimeout(initMod, 500);
})();
