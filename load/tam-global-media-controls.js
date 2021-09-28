/*
 * Global Media Controls Panel
 * Written by Tam710562
 */

(function () {
  'use strict';

  const gnoh = {
    createElement: function (tagName, attribute, parent, inner, options) {
      if (typeof tagName === 'undefined') {
        return;
      }
      if (typeof options === 'undefined') {
        options = {};
      }
      if (typeof options.isPrepend === 'undefined') {
        options.isPrepend = false;
      }
      const el = document.createElement(tagName);
      if (!!attribute && typeof attribute === 'object') {
        for (const key in attribute) {
          if (key === 'text') {
            el.textContent = attribute[key];
          } else if (key === 'html') {
            el.innerHTML = attribute[key];
          } else if (key === 'style' && typeof attribute[key] === 'object') {
            for (const css in attribute.style) {
              el.style[css] = attribute.style[css];
            }
          } else if (key === 'events' && typeof attribute[key] === 'object') {
            for (const event in attribute.events) {
              if (typeof attribute.events[event] === 'function') {
                el.addEventListener(event, attribute.events[event]);
              }
            }
          } else if (typeof el[key] !== 'undefined') {
            el[key] = attribute[key];
          } else {
            if (typeof attribute[key] === 'object') {
              attribute[key] = JSON.stringify(attribute[key]);
            }
            el.setAttribute(key, attribute[key]);
          }
        }
      }
      if (!!inner) {
        if (!Array.isArray(inner)) {
          inner = [inner];
        }
        for (let i = 0; i < inner.length; i++) {
          if (inner[i].nodeName) {
            el.append(inner[i]);
          } else {
            el.append(this.createElementFromHTML(inner[i]));
          }
        }
      }
      if (typeof parent === 'string') {
        parent = document.querySelector(parent);
      }
      if (!!parent) {
        if (options.isPrepend) {
          parent.prepend(el);
        } else {
          parent.append(el);
        }
      }
      return el;
    },
    element: {
      appendAtIndex: function (element, parentElement, index) {
        if (index >= parentElement.children.length) {
          parentElement.append(element)
        } else {
          parentElement.insertBefore(element, parentElement.children[index])
        }
      }
    },
    addStyle: function (css, id, isNotMin) {
      this.styles = this.styles || {};
      if (Array.isArray(css)) {
        css = css.join(isNotMin === true ? '\n' : '');
      }
      id = id || this.generateUUID(Object.keys(this.styles));
      this.styles[id] = this.createElement('style', {
        html: css || '',
        'data-id': id
      }, document.head);
      return this.styles[id];
    },
    timeOut: function (callback, conditon, timeout) {
      setTimeout(function wait() {
        let result;
        if (!conditon) {
          result = document.getElementById('browser');
        } else if (typeof conditon === 'string') {
          result = document.querySelector(conditon);
        } else if (typeof conditon === 'function') {
          result = conditon();
        } else {
          return;
        }
        if (result) {
          callback(result);
        } else {
          setTimeout(wait, timeout || 300);
        }
      }, timeout || 300);
    },
    observeDOM: function (obj, callback, config) {
      const obs = new MutationObserver(function (mutations, observer) {
        if (config) {
          callback(mutations, observer);
        } else {
          if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
            callback(mutations, observer);
          }
        }
      });
      obs.observe(obj, config || {
        childList: true,
        subtree: true
      });
    }
  };

  const tabs = {};

  const name = 'Global Media Controls';
  const code = 'data:text/html,' + encodeURIComponent('<title>' + name + '</title>');
  const webpanelId = 'ckttosgg9000y385pq97lf9l1';

  const icons = {
    playlistMusic: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15,6H3V8H15V6M15,10H3V12H15V10M3,16H11V14H3V16M17,6V14.18C16.69,14.07 16.35,14 16,14A3,3 0 0,0 13,17A3,3 0 0,0 16,20A3,3 0 0,0 19,17V8H22V6H17Z" /></svg>',
    play: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>',
    pause: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>',
    pictureInPicture: {
      off: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,11H11V17H19V11M23,19V5C23,3.88 22.1,3 21,3H3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19M21,19H3V4.97H21V19Z" /></svg>',
      on: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.41 19L22.54 21.12L21.12 22.54L19 20.41L16.88 22.54L15.47 21.12L17.59 19L15.47 16.88L16.88 15.47L19 17.59L21.12 15.47L22.54 16.88L20.41 19M19 13C20.09 13 21.12 13.3 22 13.81V6C22 4.89 21.11 4 20 4H4C2.9 4 2 4.89 2 6V18C2 19.11 2.9 20 4 20H13.09C13.04 19.67 13 19.34 13 19C13 15.69 15.69 13 19 13Z" /></svg>'
    },
    tab: {
      on: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,3H3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V5A2,2 0 0,0 21,3M21,19H3V5H13V9H21V19Z" /></svg>',
      off: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M1,9H3V7H1V9M1,13H3V11H1V13M1,5H3V3A2,2 0 0,0 1,5M9,21H11V19H9V21M1,17H3V15H1V17M3,21V19H1A2,2 0 0,0 3,21M21,3H13V9H23V5A2,2 0 0,0 21,3M21,17H23V15H21V17M9,5H11V3H9V5M5,21H7V19H5V21M5,5H7V3H5V5M21,21A2,2 0 0,0 23,19H21V21M21,13H23V11H21V13M13,21H15V19H13V21M17,21H19V19H17V21Z" /></svg>'
    }
  };

  const panelContent = gnoh.createElement('div', {
    class: 'global-media-controls-content'
  });

  function inject(tabId, frameId, windowId) {
    let currentVideo;

    chrome.runtime.onMessage.addListener(function (info, sender, sendResponse) {
      if (info.type === 'global-media-controls' && tabId === info.tabId && frameId === info.frameId) {
        switch (info.action) {
          case 'play':
          case 'pause':
            if (currentVideo) {
              currentVideo[info.action]();
            }
            break;
          case 'picture-in-picture':
            if (document.pictureInPictureEnabled && currentVideo && !isHidden(currentVideo)) {
              if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
              } else {
                currentVideo.requestPictureInPicture();
              }
            }
            break;
        }
      }
    });

    function observeDOM(obj, callback, config) {
      const obs = new MutationObserver(function (mutations, observer) {
        if (config) {
          callback(mutations, observer);
        } else if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          callback(mutations, observer);
        }
      });
      obs.observe(obj, config || {
        childList: true,
        subtree: true
      });
    }

    injectVideo();
    observeDOM(document, function () {
      injectVideo();
    });

    function isPlaying(video) {
      return !video.paused && !video.ended && video.getAttribute('global-media-controls');
    }

    function getImage() {
      let image = '';
      if (navigator.mediaSession.metadata && navigator.mediaSession.metadata.artwork && navigator.mediaSession.metadata.artwork[0]) {
        image = navigator.mediaSession.metadata.artwork[0].src;
      }
      return image;
    }

    function getTitle() {
      let title = '';
      if (navigator.mediaSession.metadata && navigator.mediaSession.metadata.title) {
        title = navigator.mediaSession.metadata.title;
      }
      return title;
    }


    function hasVideoPlaying() {
      return Array.from(document.getElementsByTagName('video')).find(function (video) {
        return isPlaying(video);
      });
    }

    function isHidden(el) {
      return el.offsetParent === null;
    }

    function timeupdateVideo(event) {
      let enable = event.target.getAttribute('global-media-controls');
      if (!event.target.muted) {
        enable = 'on';
        event.target.setAttribute('global-media-controls', enable);
      }
      if (enable) {
        if (event.target.paused && isHidden(event.target)) {
          endedVideo(event);
        } else if (!event.target.paused) {
          currentVideo = event.target;
          chrome.runtime.sendMessage({
            type: 'global-media-controls',
            image: getImage(),
            title: getTitle(),
            tabId: tabId,
            windowId: windowId,
            frameId: frameId,
            paused: event.target.paused,
            pictureInPicture: !!document.pictureInPictureElement
          });
        }
      }
    }

    function pauseVideo(event) {
      const enable = event.target.getAttribute('global-media-controls');
      if (enable) {
        if (isHidden(event.target)) {
          endedVideo(event);
        } else if (!hasVideoPlaying()) {
          currentVideo = event.target;
          chrome.runtime.sendMessage({
            type: 'global-media-controls',
            image: getImage(),
            title: getTitle(),
            tabId: tabId,
            windowId: windowId,
            frameId: frameId,
            paused: event.target.paused,
            pictureInPicture: !!document.pictureInPictureElement
          });
        }
      }
    }

    function endedVideo(event) {
      const enable = event.target.getAttribute('global-media-controls');
      if (enable) {
        if (!hasVideoPlaying()) {
          currentVideo = null;
          chrome.runtime.sendMessage({
            type: 'global-media-controls',
            tabId: tabId,
            windowId: windowId,
            frameId: frameId,
            ended: true
          });
        }
      }
    }

    function enterpictureinpictureVideo(event) {
      if (currentVideo === event.target) {
        chrome.runtime.sendMessage({
          type: 'global-media-controls',
          tabId: tabId,
          frameId: frameId,
          windowId: windowId,
          paused: event.target.paused,
          pictureInPicture: true
        });
      }
    }

    function leavepictureinpictureVideo(event) {
      if (currentVideo === event.target) {
        chrome.runtime.sendMessage({
          type: 'global-media-controls',
          tabId: tabId,
          frameId: frameId,
          windowId: windowId,
          paused: event.target.paused,
          pictureInPicture: false
        });
      }
    }

    function injectVideo() {
      const videos = document.querySelectorAll('video:not([global-media-controls])');

      videos.forEach(function (video) {
        video.setAttribute('global-media-controls', '');
        video.addEventListener('timeupdate', timeupdateVideo);
        video.addEventListener('playing', timeupdateVideo);
        video.addEventListener('pause', pauseVideo);
        video.addEventListener('ended', endedVideo);
        video.addEventListener('error', endedVideo);
        video.addEventListener('enterpictureinpicture', enterpictureinpictureVideo);
        video.addEventListener('leavepictureinpicture', leavepictureinpictureVideo);
      });
    }
  }

  function syncData(keyStorage) {
    chrome.storage.local.get(keyStorage, function (result) {
      Object.keys(result[keyStorage]).forEach(function (key) {
        if (!tabs[key]) {
          createItem(result[keyStorage][key], result[keyStorage][key]);
        }
      });
    });
  }

  function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function hexToRgb(hex) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return {
      r: r,
      g: g,
      b: b
    };
  }

  function getLuminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function isLight(r, g, b) {
    return getLuminance(r, g, b) < 156;
  }

  function resizeCrop(src, width, height, itemInfo, canvas) {
    const crop = width === 0 || height === 0;
    const hasCanvas = !!canvas;

    // not resize
    if (src.width <= width && height == 0) {
      width = src.width;
      height = src.height;
    }
    // resize
    if (src.width > width && height == 0) {
      height = src.height * (width / src.width);
    }

    // check scale
    const xscale = width / src.width;
    const yscale = height / src.height;
    const scale = crop ? Math.min(xscale, yscale) : Math.max(xscale, yscale);
    // create empty canvas
    canvas = hasCanvas ? canvas : gnoh.createElement('canvas');
    canvas.width = width ? width : Math.round(src.width * scale);
    canvas.height = height ? height : Math.round(src.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    // crop it top center
    ctx.drawImage(src, ((src.width * scale) - canvas.width) * -.5, ((src.height * scale) - canvas.height) * -.5);

    const data = ctx.getImageData(0, 0, width, height).data;
    const blockSize = hasCanvas ? canvas.width : 6;
    const colors = {};
    const rgb = {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    }
    let color;

    let i = 0;
    const length = data.length;

    while (i < length) {
      rgb.r = data[i];
      rgb.g = data[i + 1];
      rgb.b = data[i + 2];
      rgb.a = data[i + 3];
      i += blockSize * 4;
      if (rgb.a < 255) {
        continue;
      }
      color = rgbToHex(rgb.r, rgb.g, rgb.b);
      if (!colors[color]) {
        colors[color] = {
          rgb: {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b
          },
          count: 0
        };
      }
      colors[color].count++;
    }

    const entryColors = Object.entries(colors).sort((a, b) => b[1].count - a[1].count);
    const filterEntryColors = entryColors.filter(function (entryColor) {
      const luminance = getLuminance(entryColor[1].rgb.r, entryColor[1].rgb.g, entryColor[1].rgb.b);
      return luminance >= 30 && luminance <= 200;
    });
    let colorMax = '#000000';
    if (filterEntryColors.length > 0) {
      colorMax = filterEntryColors[0][0]
    } else if (entryColors.length > 1 && entryColors[0][0] === '#ffffff' || entryColors[0][0] === '#0000000') {
      colorMax = entryColors[1][0];
    } else if (entryColors.length > 0) {
      colorMax = entryColors[0][0];
    }
    itemInfo.item.style.backgroundColor = colorMax;
    const rgbMax = hexToRgb(colorMax);
    itemInfo.item.style.color = isLight(rgbMax.r, rgbMax.g, rgbMax.b) ? '#f6f6f6' : '#111111';
    itemInfo.contentItem.style.boxShadow = '0px 0px 15px 15px ' + colorMax;

    return canvas;
  }

  function createItem(tab, info) {
    const itemInfo = {
      tabId: tab.id || tab.tabId,
      frameId: info.frameId,
      windowId: tab.windowId,
      setTitle: function (title) {
        if (typeof title !== 'undefined' && itemInfo.title !== title) {
          itemInfo.title = title;
          itemInfo.titleItem.title = title;
          itemInfo.titleItem.textContent = title;
        }
      },
      setUrl: function (url) {
        if (typeof url === 'undefined' || url === itemInfo.url) {
          return;
        }
        itemInfo.url = url;
        const urlObject = new URL(url);
        itemInfo.domainItem.textContent = urlObject.hostname;
        itemInfo.defaultImage = 'chrome://favicon/' + urlObject.origin;
      },
      setImage: function (src) {
        if (typeof src === 'undefined' || src === itemInfo.image) {
          return;
        }
        itemInfo.image = src;
        gnoh.createElement('img', {
          src: itemInfo.image || itemInfo.defaultImage,
          crossOrigin: 'Anonymous',
          events: {
            load: function (e) {
              if (e.target.src === itemInfo.defaultImage) {
                resizeCrop(e.target, 100, 100, itemInfo);
              } else {
                itemInfo.imageItem.style.display = '';
                resizeCrop(e.target, 100, 100, itemInfo, itemInfo.imageItem);
              }
            },
            error: function (e) {
              if (e.target.src !== itemInfo.defaultImage) {
                e.target.src = itemInfo.defaultImage;
              }
            }
          }
        });
      },
      setPaused(paused) {
        if (typeof paused !== 'undefined' && itemInfo.paused !== paused) {
          itemInfo.paused = paused;
          itemInfo.buttonControl.innerHTML = itemInfo.paused ? icons.play : icons.pause;
        }
      },
      setPictureInPicture(pictureInPicture) {
        if (typeof pictureInPicture !== 'undefined' && itemInfo.pictureInPicture !== pictureInPicture) {
          itemInfo.pictureInPicture = pictureInPicture;
          if (itemInfo.pictureInPicture) {
            itemInfo.buttonPictureInPicture.classList.add('active');
          } else {
            itemInfo.buttonPictureInPicture.classList.remove('active');
          }
          itemInfo.buttonPictureInPicture.innerHTML = itemInfo.pictureInPicture ? icons.pictureInPicture.on : icons.pictureInPicture.off;
        }
      },
      setActive(active) {
        if (typeof active !== 'undefined' && itemInfo.active !== active) {
          itemInfo.active = active;
          itemInfo.buttonTab.innerHTML = itemInfo.active ? icons.tab.on : icons.tab.off;
          if (active) {
            itemInfo.buttonTab.classList.add('active', 'disabled');
          } else {
            itemInfo.buttonTab.classList.remove('active', 'disabled');
          }
        }
      }
    };
    itemInfo.domainItem = gnoh.createElement('div', {
      class: 'domain'
    });
    itemInfo.setUrl(tab.url);
    itemInfo.imageItem = gnoh.createElement('canvas', {
      width: 100,
      height: 100,
      style: {
        display: 'none'
      }
    });
    itemInfo.setImage(info.image);
    itemInfo.titleItem = gnoh.createElement('div', {
      class: 'title'
    });
    itemInfo.setTitle(info.title || tab.title);
    itemInfo.buttonControl = gnoh.createElement('button', {
      type: 'button',
      tabindex: -1,
      events: {
        click: function (event) {
          event.preventDefault();
          const request = {
            type: 'global-media-controls',
            tabId: itemInfo.tabId,
            frameId: itemInfo.frameId
          }
          if (itemInfo.paused) {
            request.action = 'play';
          } else {
            request.action = 'pause';
          }
          itemInfo.setPaused(!itemInfo.paused);
          chrome.tabs.sendMessage(itemInfo.tabId, request);
        }
      }
    });
    itemInfo.setPaused(info.paused);
    itemInfo.buttonPictureInPicture = gnoh.createElement('button', {
      type: 'button',
      tabindex: -1,
      events: {
        click: function (event) {
          event.preventDefault();
          chrome.tabs.sendMessage(itemInfo.tabId, {
            type: 'global-media-controls',
            action: 'picture-in-picture',
            tabId: itemInfo.tabId,
            frameId: itemInfo.frameId
          });
        }
      }
    });
    itemInfo.setPictureInPicture(info.pictureInPicture);
    itemInfo.buttonTab = gnoh.createElement('button', {
      type: 'button',
      tabindex: -1,
      events: {
        click: function () {
          chrome.tabs.update(itemInfo.tabId, { active: true }, function () {
            chrome.windows.update(itemInfo.windowId, { focused: true });
          });
          activeItem(itemInfo.tabId);
        }
      }
    });
    itemInfo.setActive(false);
    itemInfo.actionItem = gnoh.createElement('div', {
      class: 'action'
    }, null, [itemInfo.buttonControl, itemInfo.buttonPictureInPicture, itemInfo.buttonTab]);
    itemInfo.contentItem = gnoh.createElement('div', {
      class: 'content'
    }, null, [itemInfo.titleItem, itemInfo.domainItem, itemInfo.actionItem]);
    itemInfo.item = gnoh.createElement('div', {
      class: 'item',
    }, panelContent, [itemInfo.contentItem, itemInfo.imageItem]);
    tabs[itemInfo.tabId] = itemInfo;

    const index = Object.keys(tabs).indexOf(itemInfo.tabId + '');
    gnoh.element.appendAtIndex(itemInfo.item, panelContent, index);
    return itemInfo;
  }

  function deleteItem(tabId) {
    if (tabs[tabId]) {
      tabs[tabId].item.remove();
      delete tabs[tabId];
    }
  }

  function activeItem(tabId) {
    if (!tabs[tabId] || !tabs[tabId].active) {
      Object.keys(tabs).forEach(function (key) {
        tabs[key].setActive(Number(key) === tabId);
      });
    }
  }

  function updateItem(tab, info) {
    if (info.paused !== undefined) {
      if (!tabs[info.tabId]) {
        createItem(tab, info);
        chrome.tabs.query({ active: true, windowId: vivaldiWindowId }, function (tabs) {
          const tab = tabs[0];
          if (tab && info.tabId === tab.id) {
            activeItem(tab.id);
          }
        });
      } else {
        tabs[info.tabId].tabId = tab.id;
        tabs[info.tabId].windowId = tab.windowId;
        tabs[info.tabId].frameId = info.frameId;
        tabs[info.tabId].setTitle(info.title || tab.title);
        tabs[info.tabId].setUrl(tab.url);
        tabs[info.tabId].setImage(info.image);
        tabs[info.tabId].setPaused(info.paused);
        tabs[info.tabId].setPictureInPicture(info.pictureInPicture);
      }
    } else if (info.ended) {
      deleteItem(info.tabId);
    }
  }

  function createPanelCustom(panel, webviewbtn) {
    if (!chrome.extension.inIncognitoContext) {
      if (panel.dataset.globalMediaControls) {
        return;
      }
      panel.dataset.globalMediaControls = true;
      panel.append(panelContent);
    } else if (webviewbtn) {
      webviewbtn.click();
    }
  }

  gnoh.addStyle([
    '[data-global-media-controls] .webpanel-header .toolbar { display: none; }',
    '[data-global-media-controls] .webpanel-content { display: none; }',
    '.global-media-controls-content { display: flex; flex-direction: column; overflow: auto; }',
    '.global-media-controls-content .item { display: flex; overflow: hidden; min-height: 100px; background-color: var(--colorBg); color: var(--colorFg); }',
    '.global-media-controls-content .item .content { display: inline-grid; grid-template-rows: auto 1fr auto; flex: 1; padding: 10px; z-index: 1; }',
    '.global-media-controls-content .item .content .title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.global-media-controls-content .item .content .action { display: flex; align-items: center; margin-top: auto; }',
    '.global-media-controls-content .item .content .action button { background-color: var(--colorBgLightIntense); color: var(--colorFg); padding: 0; border: 0; width: 26px; height: 26px; border-radius: 13px; margin-right: 10px; border: 0; }',
    '.global-media-controls-content .item .content .action button:hover { background-color: var(--colorBg); }',
    '.global-media-controls-content .item .content .action button:active { background-color: var(--colorBgDark); }',
    '.global-media-controls-content .item .content .action button.active { background-color: var(--colorHighlightBg); color: var(--colorHighlightFg); }',
    '.global-media-controls-content .item .content .action button.disabled { pointer-events: none; }',
    '.global-media-controls-content .item .content .action button svg { width: 14px; height: 14px; top: 2px; position: relative; }',
  ], 'global-media-controls');

  function updateIcon(webviewbtn) {
    if (webviewbtn.classList.contains('active')) {
      const panel = document.querySelector('.panel.webpanel.visible');
      if (panel) {
        createPanelCustom(panel, webviewbtn);
      }
    }
    if (!chrome.extension.inIncognitoContext) {
      webviewbtn.firstElementChild.innerHTML = icons.playlistMusic;
    } else {
      webviewbtn.style.display = 'none';
    }
  }

  function createWebpanel() {
    vivaldi.prefs.get('vivaldi.panels.web.items', function (items) {
      let item = items.find(function (i) {
        return i.id === webpanelId;
      })
      if (!item) {
        item = {
          activeUrl: code,
          available: true,
          faviconUrl: code,
          faviconUrlValid: true,
          id: webpanelId,
          mobileMode: true,
          origin: 'user',
          resizable: false,
          title: name,
          url: code,
          width: -1
        };
        items.unshift(item);
      }
      vivaldi.prefs.set({
        path: 'vivaldi.panels.web.items',
        value: items
      });
    });
  }

  vivaldi.windowPrivate.onActivated.addListener(function (windowId, active) {
    if (active) {
      chrome.tabs.query({ active: true, windowId: windowId }, function (tabs) {
        const tab = tabs[0];
        if (tab) {
          activeItem(tab.id);
        }
      });
    }
  });

  if (!chrome.extension.inIncognitoContext) {
    chrome.tabs.onActivated.addListener(function (activeInfo) {
      activeItem(activeInfo.tabId);
    });

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (changeInfo.status === 'loading') {
        deleteItem(tabId);
      }
    });

    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
      deleteItem(tabId);
    });

    chrome.windows.getAll({ windowTypes: ['normal'] }, function (windows) {
      const windowNotIncognitos = windows.filter(function (w) {
        return w.incognito;
      });
      if (windowNotIncognitos.length < 2) {
        chrome.storage.local.remove('GLOBAL_MEDIA_CONTROLS');
      } else {
        syncData('GLOBAL_MEDIA_CONTROLS');
      }
    });

    chrome.runtime.onMessage.addListener(function (info, sender, sendResponse) {
      if (info.type === 'global-media-controls' && !sender.tab.incognito) {
        updateItem(sender.tab, info);
        chrome.storage.local.set({
          GLOBAL_MEDIA_CONTROLS: tabs
        });
      }
    });

    chrome.webNavigation.onDOMContentLoaded.addListener(function (details) {
      chrome.scripting.executeScript({
        target: {
          tabId: details.tabId,
          frameIds: [details.frameId]
        },
        func: inject,
        args: [details.tabId, details.frameId, vivaldiWindowId]
      });
    });
  }

  gnoh.timeOut(function (switchEl) {
    const webviewbtn = switchEl.querySelector('.webviewbtn[data-id~="' + webpanelId + '"]');
    if (webviewbtn) {
      updateIcon(webviewbtn);
    } else {
      createWebpanel();
      gnoh.timeOut(function (webviewbtn) {
        updateIcon(webviewbtn);
      }, '.webviewbtn[data-id~="' + webpanelId + '"]');
    }
  }, '#switch');

  gnoh.observeDOM(document, function (mutations, observer) {
    const webviewbtn = document.querySelector('.webviewbtn.active[data-id~="' + webpanelId + '"]');
    if (webviewbtn) {
      mutations.some(function (mutation) {
        if (mutation.addedNodes.length > 0) {
          if (typeof mutation.target.className === 'string' && mutation.target.className.indexOf('webpanel visible') > -1) {
            createPanelCustom(mutation.target, webviewbtn);
            return true;
          } else {
            return Array.from(mutation.addedNodes).some(function (addedNode) {
              if (typeof addedNode.className === 'string' && addedNode.className.indexOf('webpanel visible') > -1) {
                createPanelCustom(addedNode, webviewbtn);
                return true;
              }
            });
          }
        }
      });
    }
  }, {
    childList: true,
    subtree: true
  });
})();
