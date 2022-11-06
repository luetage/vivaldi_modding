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
              el.style.setProperty(css, attribute.style[css]);
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
    },
    override: function (obj, functionName, callback, conditon, runbefore) {
      this._overrides = this._overrides || {};
      let subKey = '';
      try {
        if (obj.ownerDocument === document) {
          this._overrides._elements = this._overrides._elements || [];
          const element = this._overrides._elements.find(function (item) {
            return item.element === obj;
          });
          let id;
          if (element) {
            id = element.id;
          } else {
            id = this.generateUUID(this._overrides._elements.map(function (item) {
              return item.id;
            }));
            this._overrides._elements.push({
              element: obj,
              id: id
            });
          }
          subKey = '_' + id;
        }
      } catch (e) { }
      const key = functionName + '_' + obj.constructor.name + subKey;
      if (!this._overrides[key]) {
        this._overrides[key] = [];
        obj[functionName] = (function (_super) {
          return function () {
            let result;
            let conditon = true;
            for (let i = 0; i < gnoh._overrides[key].length; i++) {
              conditon = conditon && (typeof gnoh._overrides[key][i].conditon !== 'function' && gnoh._overrides[key][i].conditon !== false || typeof gnoh._overrides[key][i].conditon === 'function' && !!gnoh._overrides[key][i].conditon.apply(this, arguments));
              if (conditon === false) {
                continue;
              }
              if (gnoh._overrides[key][i].runbefore === true) {
                gnoh._overrides[key][i].callback.apply(this, arguments);
              }
            }
            if (conditon) {
              result = _super.apply(this, arguments);
            }
            for (let i = 0; i < gnoh._overrides[key].length; i++) {
              if (gnoh._overrides[key][i].runbefore !== true) {
                const args = Array.from(arguments);
                args.push(result);
                gnoh._overrides[key][i].callback.apply(this, args);
              }
            }
            return result;
          };
        })(obj[functionName]);
      }

      this._overrides[key].push({
        callback: callback,
        conditon: conditon,
        runbefore: runbefore
      });
      return key;
    },
    generateUUID: function (ids) {
      let d = Date.now() + performance.now();
      let r;
      const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });

      if (Array.isArray(ids) && ids.includes(id)) {
        return this.generateUUID(ids);
      }
      return id;
    }
  };

  const tabs = {};

  const name = 'Global Media Controls';
  const messageType = 'global-media-controls';
  const nameAttribute = 'global-media-controls';
  const code = 'data:text/html,' + encodeURIComponent('<title>' + name + '</title>');
  const webpanelId = 'ckttosgg9000y385pq97lf9l1';
  const colorLoadeds = {};
  let buttonBadge;
  let dragSource = null;

  const langs = {
    search: chrome.i18n.getMessage('verb_4__83_earch0')
  }

  const icons = {
    playlistMusic: '<svg viewBox="0 0 16 16"><path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2s2.5.895 2.5 2z"/><path fill-rule="evenodd" d="M12 3v10h-1V3h1z"/><path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z"/><path fill-rule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>',
    pause: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>',
    close: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>',
    closePanel: '<svg width="16" height="16"><path d="m12.5 5-1.4-1.4-3.1 3-3.1-3L3.5 5l3.1 3.1-3 2.9 1.5 1.4L8 9.5l2.9 2.9 1.5-1.4-3-2.9"></path></svg>',
    pictureInPicture: {
      off: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,11H11V17H19V11M17,15H13V13H17V15M21,3H3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V5C23,3.88 22.1,3 21,3M21,19H3V4.97H21V19Z" /></svg>',
      on: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,11H11V17H19V11M23,19V5C23,3.88 22.1,3 21,3H3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19M21,19H3V4.97H21V19Z" /></svg>'
    },
    tab: {
      on: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,3H3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V5A2,2 0 0,0 21,3M21,19H3V5H13V9H21V19Z" /></svg>',
      off: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M1,9H3V7H1V9M1,13H3V11H1V13M1,5H3V3A2,2 0 0,0 1,5M9,21H11V19H9V21M1,17H3V15H1V17M3,21V19H1A2,2 0 0,0 3,21M21,3H13V9H23V5A2,2 0 0,0 21,3M21,17H23V15H21V17M9,5H11V3H9V5M5,21H7V19H5V21M5,5H7V3H5V5M21,21A2,2 0 0,0 23,19H21V21M21,13H23V11H21V13M13,21H15V19H13V21M17,21H19V19H17V21Z" /></svg>'
    },
    volume: {
      high: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>',
      medium: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" /></svg>',
      off: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" /></svg>'
    }
  };

  const buttons = {
    pause: {
      icon: icons.pause,
      click: function (event) {
        event.preventDefault();
        Object.keys(tabs).forEach(function (key) {
          if (!tabs[key].paused) {
            tabs[key].buttonControl.click();
          }
        });
      }
    },
    volume: {
      icon: icons.volume.high,
      muted: false,
      click: function (event) {
        event.preventDefault();
        Object.keys(tabs).forEach(function (key) {
          if (buttons.volume.muted) {
            if (tabs[key].muted || tabs[key].volume === 0) {
              tabs[key].buttonVolume.click();
            }
          } else {
            if (!tabs[key].muted && tabs[key].volume !== 0) {
              tabs[key].buttonVolume.click();
            }
          }
        });
      }
    }
  };

  const panelContent = gnoh.createElement('div', {
    class: 'global-media-controls-content'
  });

  function inject() {
    if (window.globalMediaControls) {
      return;
    } else {
      window.globalMediaControls = true;
    }
    const messageType = 'global-media-controls';
    const nameAttribute = 'global-media-controls';
    let currentVideo;

    chrome.runtime.onMessage.addListener(function (info, sender, sendResponse) {
      if (info.type === messageType) {
        switch (info.action) {
          case 'play':
          case 'pause':
            if (currentVideo) {
              currentVideo[info.action]();
            }
            break;
          case 'muted':
            if (currentVideo) {
              if (currentVideo.volume === 0) {
                currentVideo[info.action] = false;
                currentVideo.volume = 1;
              } else {
                currentVideo[info.action] = !currentVideo[info.action];
              }
            }
            break;
          case 'volume':
            if (currentVideo) {
              currentVideo[info.action] = info.volume;
              currentVideo.muted = false;
            }
            break;
          case 'picture-in-picture':
            if (document.pictureInPictureEnabled) {
              if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
              } else if (currentVideo && !currentVideo.disablePictureInPicture && currentVideo.webkitAudioDecodedByteCount && currentVideo.webkitVideoDecodedByteCount) {
                currentVideo.requestPictureInPicture();
              }
            }
            break;
          case 'scroll-into-view':
            if (currentVideo) {
              if (info.frameId !== 0) {
                document.documentElement.scrollIntoView({
                  behavior: 'auto',
                  block: 'center',
                  inline: 'center'
                });
              }
              currentVideo.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center'
              });
              if (document.pictureInPictureEnabled && document.pictureInPictureElement) {
                document.exitPictureInPicture();
              }
            }
            break;
          case 'close':
            if (document.pictureInPictureEnabled && document.pictureInPictureElement) {
              document.exitPictureInPicture();
            }
            currentVideo.setAttribute(nameAttribute, '');
            currentVideo.removeEventListener('pause', pauseVideo);
            function waitPause() {
              currentVideo.removeEventListener('pause', waitPause);
              currentVideo.addEventListener('pause', pauseVideo);
              currentVideo = null;
            }
            currentVideo.addEventListener('pause', waitPause);
            currentVideo.pause();
            sendResponse();
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
      return !video.paused && !video.ended && video.webkitAudioDecodedByteCount && video.getAttribute(nameAttribute);
    }

    function getImage(video) {
      let image = '';
      if (video.poster) {
        image = video.poster;
      } else if (navigator.mediaSession.metadata && navigator.mediaSession.metadata.artwork && navigator.mediaSession.metadata.artwork[0]) {
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
      return Array.from(document.querySelectorAll('video, audio')).find(function (video) {
        return isPlaying(video);
      });
    }

    function getDataControl(video) {
      return {
        type: messageType,
        image: getImage(video),
        title: getTitle(),
        paused: video.paused,
        audio: !video.webkitVideoDecodedByteCount || video.disablePictureInPicture,
        pictureInPicture: !!document.pictureInPictureElement,
        volume: video.volume,
        muted: video.muted,
        duration: video.duration,
        currentTime: video.currentTime
      };
    }

    function timeupdateVideo(event) {
      let enable = event.target.getAttribute(nameAttribute);
      if (!event.target.muted) {
        enable = 'on';
        event.target.setAttribute(nameAttribute, enable);
      }
      if (enable) {
        if (event.target.paused && !event.target.webkitAudioDecodedByteCount && !event.target.webkitVideoDecodedByteCount) {
          endedVideo(event);
        } else if (!event.target.paused) {
          currentVideo = event.target;
          chrome.runtime.sendMessage(getDataControl(currentVideo));
        }
      }
    }

    function pauseVideo(event) {
      const enable = event.target.getAttribute(nameAttribute);
      if (enable) {
        if (!event.target.webkitAudioDecodedByteCount && !event.target.webkitVideoDecodedByteCount) {
          endedVideo(event);
        } else if (!hasVideoPlaying()) {
          currentVideo = event.target;
          chrome.runtime.sendMessage(getDataControl(currentVideo));
        }
      }
    }

    function volumechangeVideo(event) {
      if (currentVideo === event.target) {
        chrome.runtime.sendMessage(getDataControl(currentVideo));
      }
    }

    function endedVideo(event) {
      const enable = event.target.getAttribute(nameAttribute);
      if (enable) {
        if (!hasVideoPlaying()) {
          currentVideo = null;
          chrome.runtime.sendMessage({
            type: messageType,
            ended: true
          });
        }
      }
    }

    function enterpictureinpictureVideo(event) {
      if (currentVideo === event.target) {
        chrome.runtime.sendMessage(getDataControl(currentVideo));
      }
    }

    function leavepictureinpictureVideo(event) {
      if (currentVideo === event.target) {
        chrome.runtime.sendMessage(getDataControl(currentVideo));
      }
    }

    function addEventListeners(video) {
      video.setAttribute(nameAttribute, '');
      video.addEventListener('play', timeupdateVideo);
      video.addEventListener('timeupdate', timeupdateVideo);
      video.addEventListener('volumechange', volumechangeVideo);
      video.addEventListener('playing', timeupdateVideo);
      video.addEventListener('pause', pauseVideo);
      video.addEventListener('ended', endedVideo);
      video.addEventListener('error', endedVideo);
      video.addEventListener('enterpictureinpicture', enterpictureinpictureVideo);
      video.addEventListener('leavepictureinpicture', leavepictureinpictureVideo);
    }

    function injectVideo() {
      const videos = document.querySelectorAll('video:not([global-media-controls]), audio:not([global-media-controls])');

      videos.forEach(function (video) {
        addEventListeners(video);
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

  function getLuminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function isLight(r, g, b) {
    return getLuminance(r, g, b) < 156;
  }

  function shadeColor(r, g, b, percent) {
    r = Math.max(Math.min(255, r + percent), 0);
    g = Math.max(Math.min(255, g + percent), 0);
    b = Math.max(Math.min(255, b + percent), 0);
    return { r, g, b };
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

    if (!colorLoadeds[src.src]) {
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
      let rgbMax = {
        r: 0,
        g: 0,
        b: 0
      };
      if (filterEntryColors.length > 0) {
        colorMax = filterEntryColors[0][0];
        rgbMax = filterEntryColors[0][1].rgb;
      } else if (entryColors.length > 1 && entryColors[0][0] === '#ffffff' || entryColors[0][0] === '#000000') {
        colorMax = entryColors[1][0];
        rgbMax = entryColors[1][1].rgb;
      } else if (entryColors.length > 0) {
        colorMax = entryColors[0][0];
        rgbMax = entryColors[0][1].rgb;
      }

      const isLightBg = isLight(rgbMax.r, rgbMax.g, rgbMax.b);
      const rgbProgressBar = shadeColor(rgbMax.r, rgbMax.g, rgbMax.b, isLightBg ? 80 : -80);

      colorLoadeds[src.src] = {
        backgroundColor: colorMax,
        color: isLightBg ? '#f6f6f6' : '#111111',
        ProgressBarBackgroundColor: rgbToHex(rgbProgressBar.r, rgbProgressBar.g, rgbProgressBar.b)
      };
    }

    itemInfo.isLight = colorLoadeds[src.src].isLight;
    itemInfo.backgroundColor = colorLoadeds[src.src].backgroundColor;
    itemInfo.color = colorLoadeds[src.src].color;
    itemInfo.item.style.setProperty('--colorGMCBg', colorLoadeds[src.src].backgroundColor);
    itemInfo.item.style.setProperty('--colorGMCFg', colorLoadeds[src.src].color);
    itemInfo.item.style.setProperty('--colorGMCProgressBarBg', colorLoadeds[src.src].ProgressBarBackgroundColor);

    return canvas;
  }

  function toHHMMSS(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return [
      h,
      m > 9 ? m : (h ? '0' + m : m || '0'),
      s > 9 ? s : '0' + s
    ].filter(Boolean).join(':');
  }

  function createItem(tab, info) {
    const itemInfo = {
      tabId: tab && (tab.id || tab.tabId),
      frameId: info.frameId,
      windowId: tab && tab.windowId,
      setTitle: function (title) {
        if (title != null && itemInfo.title !== title) {
          itemInfo.title = title;
          itemInfo.titleItem.title = title;
          itemInfo.titleItem.textContent = title;
        }
      },
      setUrl: function (url) {
        if (url == null || url === itemInfo.url) {
          return;
        }
        itemInfo.url = url;
        const urlObject = new URL(url);
        itemInfo.hostname = urlObject.hostname;
        itemInfo.domainItem.textContent = itemInfo.hostname;
        itemInfo.defaultImage = 'chrome://favicon/' + urlObject.origin;
      },
      setImage: function (src) {
        if (src == null || src === itemInfo.image) {
          return;
        }
        itemInfo.image = src;
        gnoh.createElement('img', {
          src: itemInfo.image || itemInfo.defaultImage,
          crossOrigin: 'Anonymous',
          events: {
            load: function (e) {
              if (e.target.src === itemInfo.defaultImage) {
                itemInfo.hasImage = false;
                resizeCrop(e.target, 100, 100, itemInfo);
              } else {
                itemInfo.hasImage = true;
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
        if (paused != null && itemInfo.paused !== paused) {
          itemInfo.paused = paused;
          itemInfo.buttonControl.innerHTML = itemInfo.paused ? icons.play : icons.pause;
        }
      },
      setPictureInPicture(pictureInPicture) {
        if (pictureInPicture != null && itemInfo.pictureInPicture !== pictureInPicture) {
          itemInfo.pictureInPicture = pictureInPicture;
          itemInfo.buttonPictureInPicture.innerHTML = itemInfo.pictureInPicture ? icons.pictureInPicture.on : icons.pictureInPicture.off;
          if (itemInfo.pictureInPicture) {
            itemInfo.buttonPictureInPicture.classList.add('active');
          } else {
            itemInfo.buttonPictureInPicture.classList.remove('active');
          }
        }
      },
      setActive(active) {
        if (active != null && itemInfo.active !== active) {
          itemInfo.active = active;
          itemInfo.buttonTab.innerHTML = itemInfo.active ? icons.tab.on : icons.tab.off;
          if (active) {
            itemInfo.buttonTab.classList.add('active');
          } else {
            itemInfo.buttonTab.classList.remove('active');
          }
        }
      },
      setAudio(audio) {
        if (audio != null && itemInfo.audio !== audio) {
          itemInfo.audio = audio;
          if (itemInfo.audio) {
            itemInfo.buttonPictureInPicture.style.display = 'none';
          } else {
            itemInfo.buttonPictureInPicture.style.display = '';
          }
        }
      },
      setVolume(volume) {
        if (volume != null && itemInfo.volume !== volume) {
          itemInfo.volume = volume;
          itemInfo.muted = false;
          if (itemInfo.volume === 0) {
            itemInfo.buttonVolume.innerHTML = icons.volume.off;
            itemInfo.rangeVolume.value = 0;
          } else if (itemInfo.volume <= 0.5) {
            itemInfo.buttonVolume.innerHTML = icons.volume.medium;
            itemInfo.rangeVolume.value = itemInfo.volume;
          } else {
            itemInfo.buttonVolume.innerHTML = icons.volume.high;
            itemInfo.rangeVolume.value = itemInfo.volume;
          }
        }
      },
      setMuted(muted) {
        if (muted != null && itemInfo.muted !== muted) {
          itemInfo.muted = muted;
          if (itemInfo.muted) {
            itemInfo.buttonVolume.innerHTML = icons.volume.off;
            itemInfo.rangeVolume.value = 0;
          } else if (itemInfo.volume === 0) {
            itemInfo.muted = false;
            itemInfo.buttonVolume.innerHTML = icons.volume.high;
            itemInfo.rangeVolume.value = itemInfo.volume;
          } else if (itemInfo.volume <= 0.5) {
            itemInfo.buttonVolume.innerHTML = icons.volume.medium;
            itemInfo.rangeVolume.value = itemInfo.volume;
          } else {
            itemInfo.buttonVolume.innerHTML = icons.volume.high;
            itemInfo.rangeVolume.value = itemInfo.volume;
          }
        }
      },
      setProgress(duration, currentTime) {
        if (duration != null && itemInfo.duration !== duration || currentTime != null && itemInfo.currentTime !== currentTime) {
          itemInfo.duration = duration;
          itemInfo.currentTime = currentTime;
          itemInfo.durationStr = toHHMMSS(itemInfo.duration);
          itemInfo.currentTimeStr = toHHMMSS(itemInfo.currentTime);
          itemInfo.currentTimeDuration.textContent = itemInfo.currentTimeStr + ' / ' + itemInfo.durationStr;
          itemInfo.item.style.setProperty('--colorGMCProgressBarValue', itemInfo.currentTime / itemInfo.duration * 100 + '%');
        }
      },
    };
    itemInfo.domainItem = gnoh.createElement('div', {
      class: 'domain'
    });
    itemInfo.setUrl(tab && tab.url);
    itemInfo.imageItem = gnoh.createElement('canvas', {
      width: 100,
      height: 100,
      style: {
        display: 'none'
      }
    });
    itemInfo.setImage(info.image);
    itemInfo.buttonClose = gnoh.createElement('button', {
      type: 'button',
      class: 'close-button',
      html: icons.close,
      tabindex: -1,
      draggable: true,
      events: {
        dragstart: function (e) {
          e.preventDefault();
          e.stopPropagation();
        },
        click: function (event) {
          event.preventDefault();
          chrome.tabs.sendMessage(itemInfo.tabId, {
            type: messageType,
            tabId: itemInfo.tabId,
            frameId: itemInfo.frameId,
            action: 'close'
          }, {
            frameId: itemInfo.frameId
          }, function () {
            deleteItem(itemInfo.tabId);
          });
        }
      }
    });
    itemInfo.titleItem = gnoh.createElement('div', {
      class: 'title'
    });
    itemInfo.setTitle(info.title || tab.title);
    itemInfo.buttonControl = gnoh.createElement('button', {
      type: 'button',
      tabindex: -1,
      draggable: true,
      events: {
        dragstart: function (e) {
          e.preventDefault();
          e.stopPropagation();
        },
        click: function (event) {
          event.preventDefault();
          const request = {
            type: messageType,
            tabId: itemInfo.tabId,
            frameId: itemInfo.frameId
          }
          if (itemInfo.paused) {
            request.action = 'play';
          } else {
            request.action = 'pause';
          }
          itemInfo.setPaused(!itemInfo.paused);
          chrome.tabs.sendMessage(itemInfo.tabId, request, {
            frameId: itemInfo.frameId
          });
        }
      }
    });
    itemInfo.setPaused(info.paused);
    itemInfo.buttonPictureInPicture = gnoh.createElement('button', {
      type: 'button',
      tabindex: -1,
      draggable: true,
      events: {
        dragstart: function (e) {
          e.preventDefault();
          e.stopPropagation();
        },
        click: function (event) {
          event.preventDefault();
          if (!itemInfo.audio) {
            chrome.tabs.sendMessage(itemInfo.tabId, {
              type: messageType,
              action: 'picture-in-picture',
              tabId: itemInfo.tabId,
              frameId: itemInfo.frameId
            }, {
              frameId: itemInfo.frameId
            });
          }
        }
      }
    });
    itemInfo.setPictureInPicture(info.pictureInPicture);
    itemInfo.setAudio(info.audio);
    itemInfo.buttonTab = gnoh.createElement('button', {
      type: 'button',
      tabindex: -1,
      draggable: true,
      events: {
        dragstart: function (e) {
          e.preventDefault();
          e.stopPropagation();
        },
        click: function (event) {
          event.preventDefault();
          if (!itemInfo.active) {
            chrome.tabs.update(itemInfo.tabId, { active: true }, function () {
              chrome.windows.update(itemInfo.windowId, { focused: true });
            });
          }

          if (!itemInfo.audio) {
            chrome.tabs.sendMessage(itemInfo.tabId, {
              type: messageType,
              action: 'scroll-into-view',
              tabId: itemInfo.tabId,
              frameId: itemInfo.frameId
            }, {
              frameId: itemInfo.frameId
            });
          }
          activeItem(itemInfo.tabId);
        }
      }
    });
    itemInfo.setActive(info.active || false);
    itemInfo.volumeControl = gnoh.createElement('div', {
      className: 'volume-control',
      draggable: true,
      events: {
        dragstart: function (e) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });
    itemInfo.buttonVolume = gnoh.createElement('button', {
      type: 'button',
      tabindex: -1,
      events: {
        click: function (event) {
          event.preventDefault();
          chrome.tabs.sendMessage(itemInfo.tabId, {
            type: messageType,
            action: 'muted',
            tabId: itemInfo.tabId,
            frameId: itemInfo.frameId
          }, {
            frameId: itemInfo.frameId
          });
          itemInfo.setMuted(!itemInfo.muted);
        }
      }
    }, itemInfo.volumeControl);
    itemInfo.rangeVolume = gnoh.createElement('input', {
      type: 'range',
      tabindex: -1,
      className: 'range-volume',
      min: 0,
      max: 1,
      step: 0.01,
      events: {
        input: function (event) {
          event.preventDefault();
          chrome.tabs.sendMessage(itemInfo.tabId, {
            type: messageType,
            action: 'volume',
            tabId: itemInfo.tabId,
            frameId: itemInfo.frameId,
            volume: event.target.value,
          }, {
            frameId: itemInfo.frameId
          });
        }
      }
    }, itemInfo.volumeControl);
    itemInfo.setVolume(info.volume);
    itemInfo.setMuted(info.muted);
    itemInfo.currentTimeDuration = gnoh.createElement('div', {
      className: 'current-time-duration',
      draggable: true,
      events: {
        dragstart: function (e) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });
    itemInfo.actionItem = gnoh.createElement('div', {
      class: 'action'
    }, null, [itemInfo.buttonControl, itemInfo.buttonPictureInPicture, itemInfo.buttonTab, itemInfo.volumeControl, itemInfo.currentTimeDuration]);
    itemInfo.contentItem = gnoh.createElement('div', {
      class: 'content'
    }, null, [itemInfo.titleItem, itemInfo.domainItem, itemInfo.actionItem]);
    itemInfo.item = gnoh.createElement('div', {
      class: 'item',
      'data-tab-id': itemInfo.tabId,
      draggable: true,
      events: {
        dragstart: function (e) {
          this.classList.add('dragstart');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', itemInfo.tabId);
          dragSource = this;
        },
        dragover: function (e) {
          const target = e.target.closest('.item');
          if (target === dragSource) {
            return;
          }

          const bounding = target.getBoundingClientRect()
          const offset = bounding.y + (bounding.height / 2);
          if (e.clientY - offset > 0) {
            if (target.nextSibling) {
              if (target.nextSibling === dragSource) {
                return;
              }
              target.nextSibling.classList.add('dragover-top');
            } else {
              target.classList.add('dragover-bottom');
            }
            target.classList.remove('dragover-top');
          } else {
            if (target.previousSibling === dragSource) {
              return;
            }
            if (target.nextSibling) {
              target.nextSibling.classList.remove('dragover-top');
            } else {
              target.classList.remove('dragover-bottom');
            }
            target.classList.add('dragover-top');
          }

          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        },
        dragenter: function (e) {
          this.classList.add('dragover');
        },
        dragleave: function (e) {
          this.classList.remove('dragover');
          this.classList.remove('dragover-top');
          if (this.nextSibling) {
            this.nextSibling.classList.remove('dragover-top');
          } else {
            this.classList.remove('dragover-bottom');
          }
        },
        drop: function (e) {
          e.preventDefault();

          const target = e.target.closest('.item');

          if (target.classList.contains('dragover-top')) {
            target.classList.remove('dragover-top');
            target.parentNode.insertBefore(dragSource, target);
          } else {
            if (target.nextSibling) {
              target.nextSibling.classList.remove('dragover-top');
            } else {
              target.classList.remove('dragover-bottom');
            }
            target.parentNode.insertBefore(dragSource, target.nextSibling);
          }
        },
        dragend: function (e) {
          this.classList.remove('dragstart');

          Object.keys(tabs).forEach(function (key) {
            tabs[key].item.classList.remove('dragover');
          });
        }
      }
    }, panelContent, [itemInfo.contentItem, itemInfo.imageItem, itemInfo.buttonClose]);
    itemInfo.setProgress(info.duration, info.currentTime);
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

    updateButtonToolbar();
    updateNumberOfItems();
  }

  function activeItem(tabId) {
    if (!tabs[tabId] || !tabs[tabId].active) {
      Object.keys(tabs).forEach(function (key) {
        tabs[key].setActive(key === tabId + '');
      });
    }
  }

  function updateItem(tab, info) {
    const tabId = tab && (tab.id || tab.tabId);
    if (info.paused !== undefined) {
      if (!tabs[tabId]) {
        createItem(tab, info);
        chrome.tabs.query({ active: true, windowId: vivaldiWindowId || tab && tab.windowId }, function (tabs) {
          const tab = tabs[0];
          if (tabId === tab.id) {
            activeItem(tab.id);
          }
        });
      } else {
        tabs[tabId].tabId = tabId;
        tabs[tabId].windowId = tab && tab.windowId;
        tabs[tabId].frameId = info.frameId;
        tabs[tabId].setTitle(info.title || tab.title);
        tabs[tabId].setUrl(tab && tab.url);
        tabs[tabId].setImage(info.image);
        tabs[tabId].setPaused(info.paused);
        tabs[tabId].setPictureInPicture(info.pictureInPicture);
        tabs[tabId].setAudio(info.audio);
        tabs[tabId].setVolume(info.volume);
        tabs[tabId].setMuted(info.muted);
        tabs[tabId].setProgress(info.duration, info.currentTime);
      }

      updateButtonToolbar();
      updateNumberOfItems();
    } else if (info.ended) {
      deleteItem(tabId);
    }
  }

  function updateButtonToolbar() {
    if (Object.keys(tabs).length === 0) {
      if (buttons.volume.iconEL && buttons.volume.muted) {
        buttons.volume.iconEL.innerHTML = icons.volume.high;
      }
      if (buttons.volume.buttonEl && !buttons.volume.buttonEl.disabled) {
        buttons.volume.buttonEl.disabled = true;
      }
      buttons.volume.muted = false;
      buttons.volume.icon = icons.volume.high;

      if (buttons.pause.buttonEl && !buttons.pause.buttonEl.disabled) {
        buttons.pause.buttonEl.disabled = true;
      }
    } else {
      let iconMute = icons.volume.off;
      let muted = true;

      let pauseDisabled = true;

      Object.keys(tabs).forEach(function (key) {
        if (!tabs[key].muted && tabs[key].volume !== 0) {
          iconMute = icons.volume.high;
          muted = false;
        }

        if (!tabs[key].paused) {
          pauseDisabled = false;
        }
      });

      if (buttons.volume.iconEL && buttons.volume.muted !== muted) {
        buttons.volume.iconEL.innerHTML = iconMute;
      }
      if (buttons.volume.buttonEl && buttons.volume.buttonEl.disabled) {
        buttons.volume.buttonEl.disabled = false;
      }
      buttons.volume.icon = iconMute;
      buttons.volume.muted = muted;

      if (buttons.pause.buttonEl && buttons.pause.buttonEl.disabled !== pauseDisabled) {
        buttons.pause.buttonEl.disabled = pauseDisabled;
      }
    }
  }

  function updateNumberOfItems() {
    if (!buttonBadge) {
      return;
    }
    const numberOfItems = Object.keys(tabs).length;

    if (numberOfItems > 0) {
      if (Number(buttonBadge.textContent) !== numberOfItems) {
        buttonBadge.textContent = numberOfItems;
      }
      buttonBadge.style.display = '';
    } else {
      buttonBadge.style.display = 'none';
    }
  }

  function createPanelCustom(panel, webviewbtn) {
    if (!chrome.extension.inIncognitoContext) {
      if (panel.dataset.globalMediaControls) {
        return;
      }
      panel.dataset.globalMediaControls = true;

      const buttonClose = gnoh.createElement('button', {
        class: 'close transparent',
        events: {
          click: function (e) {
            document.querySelector('.panelbtn.active').click();
          }
        }
      });
      gnoh.createElement('span', {
        class: 'VivaldiSvgIcon',
        style: {
          '--IconSize': 16,
        },
        html: icons.closePanel
      }, buttonClose);
      const title = gnoh.createElement('h1', {
        html: name
      }, null, buttonClose);

      const inputSearch = gnoh.createElement('input', {
        type: 'search',
        placeholder: langs.search,
        events: {
          input: function (e) {
            Object.keys(tabs).forEach(function (key) {
              const value = e.target.value.trim().toLowerCase();
              if (tabs[key].title.toLowerCase().indexOf(value) > -1 || tabs[key].hostname.toLowerCase().indexOf(e.target.value) > -1) {
                tabs[key].item.style.display = '';
              } else {
                tabs[key].item.style.display = 'none';
              }
            });
          }
        }
      });

      const toolbarGroup = gnoh.createElement('div', {
        class: 'toolbar-group'
      });

      Object.keys(buttons).forEach(function (key) {
        const iconEl = gnoh.createElement('span', {
          html: buttons[key].icon
        });
        const buttonEl = gnoh.createElement('button', {
          tabindex: '-1',
          class: 'ToolbarButton-Button',
          disabled: true,
          events: {
            click: buttons[key].click
          }
        }, null, iconEl);
        const buttonToolbar = gnoh.createElement('div', {
          class: 'button-toolbar'
        }, toolbarGroup, buttonEl);
        buttons[key].iconEL = iconEl;
        buttons[key].buttonEl = buttonEl;
        return buttons[key];
      });

      const toolbar = gnoh.createElement('div', {
        class: 'toolbar'
      }, null, toolbarGroup);
      const toolbarWrap = gnoh.createElement('div', {
        class: 'toolbar toolbar-default toolbar-medium toolbar-wrap'
      }, null, [inputSearch, toolbar]);

      const panelHeader = gnoh.createElement('header', null, panel, [title, toolbarWrap]);
      panel.append(panelContent);
    } else if (webviewbtn) {
      webviewbtn.click();
    }
  }

  gnoh.addStyle([
    '#panels-container.left #panels .webpanel-stack [data-global-media-controls] header { padding-left: 9px; }',
    '#panels-container.right #panels .webpanel-stack [data-global-media-controls] header { padding-left: 12px; }',
    '#panels-container #panels .webpanel-stack [data-global-media-controls] header { padding-right: var(--scrollbarWidth); padding-top: 12px; }',
    '#panels-container #panels .webpanel-stack [data-global-media-controls] header.webpanel-header { display: none; }',
    '#panels-container #panels .webpanel-stack [data-global-media-controls] .webpanel-content { display: none; }',
    '.global-media-controls-content { display: flex; flex-direction: column; overflow: auto; }',
    '.global-media-controls-content .item { position: relative; display: flex; overflow: hidden; min-height: 100px; background-color: var(--colorGMCBg); color: var(--colorGMCFg); }',
    '.global-media-controls-content .item:after { position: absolute; content: ""; bottom: 0; height: 4px; width: var(--colorGMCProgressBarValue, 0); z-index: 1; background-color: var(--colorGMCProgressBarBg); }',
    '.global-media-controls-content .item .content { display: inline-grid; grid-template-rows: auto 1fr auto; flex: 1; padding: 10px; z-index: 1; box-shadow: var(--colorGMCBg) 0px 0px 15px 15px; }',
    '.global-media-controls-content .item .content .title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.global-media-controls-content .item .content .action { display: flex; align-items: center; margin-top: auto; position: absolute; bottom: 10px; }',
    '.global-media-controls-content .item .content .action button { margin-right: 10px; flex: 1 0 auto; }',
    '.global-media-controls-content .item button { background-color: var(--colorBgLightIntense); color: var(--colorFg); padding: 0; width: 28px; height: 28px; border-radius: 14px; border: 0; }',
    '.global-media-controls-content .item button:hover { background-color: var(--colorBg); }',
    '.global-media-controls-content .item button:active { background-color: var(--colorBgDark); }',
    '.global-media-controls-content .item button.active { background-color: var(--colorHighlightBg); color: var(--colorHighlightFg); }',
    '.global-media-controls-content .item button.disabled { pointer-events: none; }',
    '.global-media-controls-content .item button svg { width: 16px; height: 16px; top: 2px; position: relative; }',
    '.global-media-controls-content .item button.close-button { position: absolute; top: 6px; right: 6px; display: none; z-index: 1; }',
    '.global-media-controls-content .item .content .action .volume-control { background-color: var(--colorBgLightIntense); color: var(--colorFg); padding: 0; width: 28px; height: 28px; border-radius: 14px; margin-right: 10px; overflow: hidden; padding-right: 10px; flex: 1 0 auto; }',
    '.global-media-controls-content .item .content .action .volume-control:hover { width: auto; display: flex; flex-direction: row; align-items: center; }',
    '.global-media-controls-content .item .content .action .volume-control button { margin-right: 0; }',
    '.global-media-controls-content .item .content .action .volume-control .range-volume { width: 80px; display: none; }',
    '.global-media-controls-content .item .content .action .volume-control:hover .range-volume { display: block; }',
    '.global-media-controls-content .item .content .action .current-time-duration { background-color: var(--colorBgLightIntense); color: var(--colorFg); padding: 0; height: 28px; line-height: 28px; border-radius: 14px; margin-right: 10px; overflow: hidden; padding: 0 10px; flex: 1 0 auto; }',
    '.global-media-controls-content .item:hover button.close-button { display: block; }',
    '.global-media-controls-content .item.dragstart { opacity: 0.4; }',
    '.global-media-controls-content .item.dragover-top::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; box-shadow: 0 2px var(--colorHighlightBg) inset, 0 -2px var(--colorHighlightBg); pointer-events: none; z-index: 2; }',
    '.global-media-controls-content .item.dragover-bottom::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; box-shadow: 0 -2px var(--colorHighlightBg) inset, 0 2px var(--colorHighlightBg); pointer-events: none; z-index: 2; }'
  ], nameAttribute);

  function updateIconAndTitle(webviewbtn) {
    if (webviewbtn.classList.contains('active')) {
      const panel = document.querySelector('.panel.webpanel.visible');
      if (panel) {
        createPanelCustom(panel, webviewbtn);
      }
    }
    if (!chrome.extension.inIncognitoContext) {
      webviewbtn.title = name;
      webviewbtn.firstElementChild.innerHTML = icons.playlistMusic;

      buttonBadge = gnoh.createElement('span', {
        class: 'button-badge unseen',
        style: {
          display: 'none'
        }
      });

      webviewbtn.append(buttonBadge);
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
        return !w.incognito;
      });
      if (windowNotIncognitos.length < 2) {
        chrome.storage.local.remove('GLOBAL_MEDIA_CONTROLS');
      } else {
        syncData('GLOBAL_MEDIA_CONTROLS');
      }
    });

    chrome.runtime.onMessage.addListener(function (info, sender, sendResponse) {
      if (info.type === messageType && (!sender.tab || (sender.tab && !sender.tab.incognito))) {
        info.frameId = sender.frameId;
        updateItem(sender.tab, info);
        chrome.storage.local.set({
          GLOBAL_MEDIA_CONTROLS: tabs
        });
      }
    });

    gnoh.timeOut(function () {
      chrome.tabs.query({ windowId: window.vivaldiWindowId, windowType: 'normal' }, function (tabs) {
        tabs.forEach(function (tab) {
          if (!tab.incognito) {
            chrome.webNavigation.getAllFrames({ tabId: tab.id }, function (details) {
              details.forEach(function (detail) {
                chrome.scripting.executeScript({
                  target: {
                    tabId: tab.id,
                    frameIds: [detail.frameId]
                  },
                  func: inject
                });
              });
            });
          }
        });
      });

      chrome.webNavigation.onCommitted.addListener(function (details) {
        chrome.scripting.executeScript({
          target: {
            tabId: details.tabId,
            frameIds: [details.frameId]
          },
          func: inject
        });
      });
    }, function () {
      return window.vivaldiWindowId != null;
    });
  }

  gnoh.timeOut(function (switchEl) {
    const webviewbtn = switchEl.querySelector('.webviewbtn[data-id~="' + webpanelId + '"]');
    if (webviewbtn) {
      updateIconAndTitle(webviewbtn);
    } else {
      createWebpanel();
      gnoh.timeOut(function (webviewbtn) {
        updateIconAndTitle(webviewbtn);
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
