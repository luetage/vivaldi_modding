// Backup Search Engines
// version 2022.3.4
// https://forum.vivaldi.net/post/277594
// Adds functionality to backup and restore search engines in
// vivaldi://settings/search.

(function () {
  function msg(print) {
    clearTimeout(msgTimeout);
    if (print === "backup") {
      info.innerText = "Backup copied to clipboard";
    } else if (print === "restore") {
      info.innerText = "Search engines restored";
    } else {
      info.innerText = "Code error, aborted";
    }
    msgTimeout = setTimeout(() => (info.innerText = ""), 5000);
  }

  function lookup(n) {
    const defaults = [n.defaultSearch, n.defaultPrivate, n.defaultImage];
    return defaults;
  }

  function bringingItAllBackHome(remains) {
    vivaldi.searchEngines.getTemplateUrls((engines) => {
      const getNames = engines.templateUrls.map((e) => e.name);
      for (let i = 0; i < defaultsArray.length; i++) {
        const index = getNames.lastIndexOf(defaultsArray[i][0]);
        const id = engines.templateUrls[index].id.toString();
        const ds = defaultsArray[i][1];
        vivaldi.searchEngines.setDefault(ds, id);
      }
      remains.forEach((remove) => {
        vivaldi.searchEngines.removeTemplateUrl(remove);
      });
      defaultsArray = [];
      msg("restore");
    });
  }

  function exec(collection) {
    vivaldi.searchEngines.getTemplateUrls((engines) => {
      const oldDefaults = lookup(engines);
      const newDefaults = lookup(collection);
      engines.templateUrls.forEach((engine) => {
        if (oldDefaults.indexOf(engine.id) === -1) {
          vivaldi.searchEngines.removeTemplateUrl(engine.id);
        }
      });
      collection.templateUrls.forEach((collect) => {
        vivaldi.searchEngines.addTemplateUrl(collect, () => {
          if (newDefaults.indexOf(collect.id) > -1) {
            const indeces = newDefaults
              .map((e, i) => (e === collect.id ? i : ""))
              .filter(String);
            indeces.forEach((index) => {
              let ds;
              if (index === 0) {
                ds = vivaldi.searchEngines.DefaultType.DEFAULT_SEARCH;
              } else if (index === 1) {
                ds = vivaldi.searchEngines.DefaultType.DEFAULT_PRIVATE;
              } else {
                ds = vivaldi.searchEngines.DefaultType.DEFAULT_IMAGE;
              }
              const tunnel = [collect.name, ds];
              defaultsArray.push(tunnel);
            });
          }
        });
      });
      const remains = [...new Set(oldDefaults)];
      bringingItAllBackHome(remains);
    });
  }

  function restore(e) {
    e.preventDefault();
    e.stopPropagation();
    let backupCode;
    let collection;
    if (e.type === "paste") {
      const clipboardData = e.clipboardData;
      backupCode = clipboardData.getData("text");
    } else {
      backupCode = e.dataTransfer.getData("text");
    }
    try {
      collection = JSON.parse(backupCode);
    } catch (err) {
      msg("error");
      return;
    }
    if (
      "defaultImage" in collection &&
      "defaultPrivate" in collection &&
      "defaultSearch" in collection
    ) {
      exec(collection);
    } else {
      msg("error");
    }
  }

  function backup() {
    vivaldi.searchEngines.getTemplateUrls((engines) => {
      const backupCode = JSON.stringify(engines);
      navigator.clipboard.writeText(backupCode);
      msg("backup");
    });
  }

  function ui() {
    const check = document.getElementById("vm-backup");
    if (!check) {
      const place = document.querySelector(
        ".setting-section > div > .setting-group.unlimited > .setting-single"
      );
      const btn = document.createElement("input");
      btn.setAttribute("type", "button");
      btn.setAttribute("value", "Backup");
      btn.id = "vm-backup";
      place.insertBefore(btn, place.lastChild);
      btn.addEventListener("click", backup);
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("placeholder", "Restore Backup");
      input.id = "vm-restore";
      place.insertBefore(input, place.lastChild);
      input.addEventListener("paste", restore);
      input.addEventListener("drop", restore);
      info = document.createElement("span");
      info.id = "vm-msg";
      place.insertBefore(info, place.lastChild);
    }
  }

  const css = `
    #vm-restore {
      width: 130px;
      margin-left: 6px;
      margin-top: 6px;
    }
    #vm-restore::-webkit-input-placeholder {
      opacity: 1;
      color: var(--colorHighlightBg);
      text-align: center;
    }
    #vm-msg {
      margin-left: 12px;
    }
  `;

  let msgTimeout;
  let defaultsArray = [];
  const settingsUrl =
    "chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=";
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url === `${settingsUrl}search`) {
      setTimeout(ui, 100);
      const check = document.getElementById("vm-engines");
      if (!check) {
        const style = document.createElement("style");
        style.id = "vm-engines";
        style.innerHTML = css;
        document.getElementsByTagName("head")[0].appendChild(style);
      }
    }
  });
})();
