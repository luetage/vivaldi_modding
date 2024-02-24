/*
 * Import Export Command Chains
 * Written by Tam710562
 */

(function () {
  'use strict';

  const gnoh = {
    i18n: {
      getMessageName: function (message, type) {
        message = (type ? type + '\x04' : '') + message;
        return message.replace(/[^a-z0-9]/g, function (i) {
          return '_' + i.codePointAt(0) + '_';
        }) + '0';
      },
      getMessage: function (message, type) {
        return chrome.i18n.getMessage(this.getMessageName(message, type)) || message;
      },
    },
    uuid: {
      check: function (id) {
        return !/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id);
      },
      generate: function (ids) {
        let d = Date.now() + performance.now();
        let r;
        const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

        if (Array.isArray(ids) && ids.includes(id)) {
          return this.uuid.generate(ids);
        }
        return id;
      },
    },
    object: {
      isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
      },
      merge(target, source) {
        let output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
          Object.keys(source).forEach(key => {
            if (this.isObject(source[key])) {
              if (!(key in target))
                Object.assign(output, { [key]: source[key] });
              else
                output[key] = this.merge(target[key], source[key]);
            } else {
              Object.assign(output, { [key]: source[key] });
            }
          });
        }
        return output;
      },
    },
    addStyle: function (css, id, isNotMin) {
      this.styles = this.styles || {};
      if (Array.isArray(css)) {
        css = css.join(isNotMin === true ? '\n' : '');
      }
      id = id || this.uuid.generate(Object.keys(this.styles));
      this.styles[id] = this.createElement('style', {
        html: css || '',
        'data-id': id,
      }, document.head);
      return this.styles[id];
    },
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
    createElementFromHTML: function (html) {
      return this.createElement('template', {
        html: (html || '').trim(),
      }).content;
    },
    get constant() {
      return {
        dialogButtons: {
          submit: {
            label: this.i18n.getMessage('OK'),
            type: 'submit'
          },
          cancel: {
            label: this.i18n.getMessage('Cancel'),
            cancel: true
          },
          primary: {
            class: 'primary'
          },
          danger: {
            class: 'danger'
          },
          default: {},
        }
      };
    },
    getFormData: function (formElement) {
      if (!formElement || formElement.nodeName !== 'FORM') {
        return;
      }

      const data = {};

      function setOrPush(key, value, isOnly) {
        if (data.hasOwnProperty(key) && isOnly !== true) {
          if (!Array.isArray(data[key])) {
            data[key] = data[key] != null ? [data[key]] : [];
          }
          if (value != null) {
            data[key].push(value);
          }
        } else {
          data[key] = value;
        }
      }

      const inputElements = Array.from(formElement.elements).filter(function (field) {
        if (field.name) {
          switch (field.nodeName) {
            case 'INPUT':
              switch (field.type) {
                case 'button':
                case 'image':
                case 'reset':
                case 'submit':
                  return false;
              }
              break;
            case 'BUTTON':
              return false;
          }
          return true;
        } else {
          return false;
        }
      });

      if (inputElements.length === 0) {
        return;
      }

      inputElements.forEach(function (field) {
        if (field.name) {
          switch (field.nodeName) {
            case 'INPUT':
              switch (field.type) {
                case 'color':
                case 'email':
                case 'hidden':
                case 'password':
                case 'search':
                case 'tel':
                case 'text':
                case 'time':
                case 'url':
                case 'month':
                case 'week':
                  setOrPush(field.name, field.value);
                  break;
                case 'checkbox':
                  if (field.checked) {
                    setOrPush(field.name, field.value || field.checked);
                  } else {
                    setOrPush(field.name, null);
                  }
                  break;
                case 'radio':
                  if (field.checked) {
                    setOrPush(field.name, field.value || field.checked, true);
                  } else {
                    setOrPush(field.name, null, true);
                  }
                  break;
                case 'date':
                case 'datetime-local':
                  const date = new Date(field.value);
                  if (isFinite(date)) {
                    date.setTime(d.getTime() + d.getTimezoneOffset() * 60000);
                    setOrPush(field.name, date);
                  } else {
                    setOrPush(field.name, null);
                  }
                  break;
                case 'file':
                  setOrPush(field.name, field.files);
                  break;
                case 'number':
                case 'range':
                  if (field.value && isFinite(Number(field.value))) {
                    setOrPush(field.name, Number(field.value));
                  } else {
                    setOrPush(field.name, null);
                  }
                  break;
              }
              break;
            case 'TEXTAREA':
              setOrPush(field.name, field.value);
              break;
            case 'SELECT':
              switch (field.type) {
                case 'select-one':
                  setOrPush(field.name, field.value);
                  break;
                case 'select-multiple':
                  Array.from(field.options).forEach(function (option) {
                    if (option.selected) {
                      setOrPush(field.name, option.value);
                    } else {
                      setOrPush(field.name, null);
                    }
                  });
                  break;
              }
              break;
            case 'BUTTON':
              break;
          }
        }
      });
      return data;
    },
    dialog: function (title, content, buttons = [], config) {
      let modalBg;
      let dialog;
      let cancelEvent;
      const id = this.uuid.generate();

      if (!config) {
        config = {};
      }
      if (typeof config.autoClose === 'undefined') {
        config.autoClose = true;
      }

      function onKeyCloseDialog(key) {
        if (key === 'Esc') {
          closeDialog(true);
        }
      }

      function onClickCloseDialog(event) {
        if (config.autoClose && !event.target.closest('.dialog-custom[data-dialog-id="' + id + '"]')) {
          closeDialog(true);
        }
      }

      function closeDialog(isCancel) {
        if (isCancel === true && cancelEvent) {
          cancelEvent.bind(this)(gnoh.getFormData(dialog));
        }
        if (modalBg) {
          modalBg.remove();
        }
        vivaldi.tabsPrivate.onKeyboardShortcut.removeListener(onKeyCloseDialog);
        document.removeEventListener('mousedown', onClickCloseDialog);
      }

      vivaldi.tabsPrivate.onKeyboardShortcut.addListener(onKeyCloseDialog);
      document.addEventListener('mousedown', onClickCloseDialog);

      const buttonElements = [];
      for (let button of buttons) {
        button.type = button.type || 'button';
        const clickEvent = button.click;
        if (button.cancel === true && typeof clickEvent === 'function') {
          cancelEvent = clickEvent;
        }
        button.events = {
          click: function (event) {
            event.preventDefault();
            if (typeof clickEvent === 'function') {
              clickEvent.bind(this)(gnoh.getFormData(dialog));
            }
            if (button.closeDialog !== false) {
              closeDialog();
            }
          }
        };
        delete button.click;
        if (button.label) {
          button.value = button.label;
          delete button.label;
        }
        buttonElements.push(this.createElement('input', button));
      }

      const focusModal = this.createElement('span', {
        class: 'focus_modal',
        tabindex: '0',
      });
      const div = this.createElement('div', {
        style: {
          width: config.width ? config.width + 'px' : '',
          margin: '0 auto',
        }
      });
      dialog = this.createElement('form', {
        'data-dialog-id': id,
        class: 'dialog-custom modal-wrapper',
      }, div);
      if (config.class) {
        dialog.classList.add(config.class);
      }
      const dialogHeader = this.createElement('header', {
        class: 'dialog-header',
      }, dialog, '<h1>' + (title || '') + '</h1>');
      const dialogContent = this.createElement('div', {
        class: 'dialog-content',
      }, dialog, content);
      if (buttons && buttons.length > 0) {
        const dialogFooter = this.createElement('footer', {
          class: 'dialog-footer',
        }, dialog, buttonElements);
      }
      modalBg = this.createElement('div', {
        id: 'modal-bg',
        class: 'slide',
      }, undefined, [focusModal.cloneNode(true), div, focusModal.cloneNode(true)]);
      const inner = document.querySelector('#main > .inner') || document.querySelector('#main > .webpageview');
      if (inner) {
        inner.prepend(modalBg);
      }
      return {
        dialog: dialog,
        dialogHeader: dialogHeader,
        dialogContent: dialogContent,
        buttons: buttonElements,
        close: closeDialog,
      };
    },
    alert: function (message, okEvent) {
      const buttonOkElement = Object.assign({}, this.constant.dialogButtons.submit, {
        cancel: true,
      });
      if (typeof okEvent === 'function') {
        buttonOkElement.click = function (data) {
          okEvent.bind(this)(data);
        };
      }

      return this.dialog('Gnoh', message, [buttonOkElement], {
        width: 400,
        class: 'dialog-javascript',
      });
    },
    timeOut: function (callback, conditon, timeOut = 300) {
      let timeOutId = setTimeout(function wait() {
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
          timeOutId = setTimeout(wait, timeOut);
        }
      }, timeOut);

      function stop() {
        if (timeOutId) {
          clearTimeout(timeOutId);
        }
      }

      return {
        stop,
      };
    },
    element: {
      appendAtIndex: function (element, parentElement, index) {
        if (index >= parentElement.children.length) {
          parentElement.append(element)
        } else {
          parentElement.insertBefore(element, parentElement.children[index])
        }
      },
      getIndex: function (element) {
        return Array.from(element.parentElement.children).indexOf(element);
      },
    },
  };

  const messageType = 'import-export-command-chains';
  let timeOut;

  const urls = {
    quickCommands: 'chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=qc',
    general: 'chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/settings/settings.html?path=general',
  };

  const icons = {
    import: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 15L17.55 9.54L16.13 8.13L13 11.25V2H11V11.25L7.88 8.13L6.46 9.55L12 15Z" /></svg>',
    export: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 2L6.46 7.46L7.88 8.88L11 5.75V15H13V5.75L16.13 8.88L17.55 7.45L12 2Z" /></svg>',
  };

  const langs = {
    general: gnoh.i18n.getMessage('General'),
    quickCommands: gnoh.i18n.getMessage('Quick Commands'),
    copy: gnoh.i18n.getMessage('Copy', 'verb'),
    export: gnoh.i18n.getMessage('Export', 'verb'),
    import: gnoh.i18n.getMessage('Import'),
    install: gnoh.i18n.getMessage('Install'),
    installed: gnoh.i18n.getMessage('Installed'),
    update: gnoh.i18n.getMessage('Update'),
  };

  gnoh.addStyle([
    '.import-export-command-chains input[type="file"]::file-selector-button { border: 0px; border-right: 1px solid var(--colorBorder); height: 28px; padding: 0 18px; color: var(--colorFg); background: linear-gradient(var(--colorBgLightIntense) 0%, var(--colorBg) 100%); margin-right: 18px; }',
    '.import-export-command-chains input[type="file"]::file-selector-button:hover { background: linear-gradient(var(--colorBg), var(--colorBg)); }',
    '.import-export-command-chains .editor { width: 100%; height: 100px; position: relative; background-color: var(--colorBgIntense); border-radius: var(--radius); border-width: 1px; border-style: solid; border-color: var(--colorBorder); }',
    '.import-export-command-chains .editor .editing, .import-export-command-chains .editor .highlighting { overflow: auto; white-space: pre-wrap; word-break: break-word; border-radius: var(--radius); border: none; box-shadow: none; position: absolute; top: 0; left: 0; bottom: 0; right: 0; padding: 6px; font-size: 13px; font-family: monospace !important; line-height: 1.3; tab-size: 2; }',
    '.import-export-command-chains .editor .highlighting { color: var(--colorFg); }',
    '.import-export-command-chains .editor .highlighting .json-key, .import-export-command-chains .editor .highlighting .json-key span { color: #0451a5; }',
    '.import-export-command-chains .editor .highlighting .json-string, .import-export-command-chains .editor .highlighting .json-string span { color: #a31515; }',
    '.import-export-command-chains .editor .highlighting .json-number { color: #098658; }',
    '.import-export-command-chains .editor .highlighting .json-bool { color: #0000ff; }',
    '.theme-dark .import-export-command-chains .editor .highlighting .json-key, .theme-dark .import-export-command-chains .editor .highlighting .json-key span { color: #9cdcfe; }',
    '.theme-dark .import-export-command-chains .editor .highlighting .json-string, .theme-dark .import-export-command-chains .editor .highlighting .json-string span { color: #ce9178; }',
    '.theme-dark .import-export-command-chains .editor .highlighting .json-number { color: #b5cea8; }',
    '.theme-dark .import-export-command-chains .editor .highlighting .json-bool { color: #569cd6; }',
    '.import-export-command-chains .editor .editing { color: transparent; background: transparent; caret-color: white; }',
    '.import-export-command-chains .editor .editing::-webkit-scrollbar-button, .import-export-command-chains .editor .editing::-webkit-scrollbar-thumb, .import-export-command-chains .editor .editing::-webkit-scrollbar-track { cursor: default; }',
  ], 'import-export-command-chains');

  const buttons = {
    import: {
      icon: icons.import,
      title: langs.import,
      click: async (key) => {
        showDialogImport();
      },
      index: 2,
    },
    export: {
      icon: icons.export,
      title: langs.export,
      click: async (key) => {
        if (!key) {
          return;
        }
        const commandChain = await getCommandChainByKey(key);
        const commandChainText = JSON.stringify(commandChain);
        const commandChainUrl = URL.createObjectURL(new Blob([commandChainText], { type: 'application/json' }));

        const editor = createEditor({
          readonly: true,
          value: commandChainText,
          events: {
            click: (e) => e.target.select(),
          },
        });

        const buttonCopyElement = Object.assign({}, gnoh.constant.dialogButtons.submit, {
          label: langs.copy,
          click: () => {
            navigator.clipboard.writeText(commandChainText);
          },
        });

        const buttonExportElement = Object.assign({}, gnoh.constant.dialogButtons.submit, {
          label: langs.export,
          click: () => {
            const filename = commandChain.label.trim()
              .replace(/\s+/g, '-').toLowerCase()
              .replace(/[^\p{L}0-9-]/gu, '')
              .replace(/^-+|-+$/g, '') || key;

            chrome.downloads.download({
              url: commandChainUrl,
              filename: filename + '.json',
              saveAs: true,
            });
          },
        });

        const buttonCancelElement = Object.assign({}, gnoh.constant.dialogButtons.cancel);

        gnoh.dialog(
          'Export Command Chain',
          editor.editor,
          [buttonCopyElement, buttonExportElement, buttonCancelElement],
          {
            width: 500,
            class: 'import-export-command-chains',
          }
        );
      },
      index: 3,
    },
  };


  function escapeHtml(text) {
    return text.replace(/[<>&]/g, function (char) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char];
    });
  }

  function highlightJson(text) {
    if (!text) {
      return '';
    }

    if (text[text.length - 1] == '\n') {
      text += ' ';
    }

    return escapeHtml(text)
      .replace(/(("([^"]|\\")+?[^\\]")|"")(\s*.)/ig, (str, g1, g2, g3, g4) => {
        const type = g4.trim() === ':' ? 'json-key' : 'json-string';
        return '<span class="' + type + '">' + g1 + '</span>' + g4;
      })
      .replace(/-?\d+\.?\d*((E|e)[\+]\d+)?/ig, '<span class="json-number">$&</span>')
      .replace(/false|true|null/ig, '<span class="json-bool">$&</span>');
  }

  function createEditor(attribute = {}) {
    const editor = gnoh.createElement('div', {
      class: 'editor',
    });

    const highlighting = gnoh.createElement('div', {
      class: 'highlighting',
      'aria-hidden': 'true',
      html: highlightJson(attribute.value),
    }, editor);

    const textarea = gnoh.createElement('textarea', gnoh.object.merge({
      name: 'textarea',
      class: 'editing',
      rows: 5,
      spellcheck: 'false',
      style: {
        'resize': 'vertical',
        'max-height': '300px',
      },
      events: {
        input: () => {
          highlighting.innerHTML = highlightJson(textarea.value);
          highlighting.scrollTop = textarea.scrollTop;
          highlighting.scrollLeft = textarea.scrollLeft;
        },
        scroll: () => {
          highlighting.scrollTop = textarea.scrollTop;
          highlighting.scrollLeft = textarea.scrollLeft;
        },
      },
    }, attribute), editor);

    new ResizeObserver(() => {
      editor.style.width = textarea.offsetWidth + 2 + 'px';
      editor.style.height = textarea.offsetHeight + 2 + 'px';
      highlighting.scrollTop = textarea.scrollTop;
      highlighting.scrollLeft = textarea.scrollLeft;
    }).observe(textarea);

    return {
      editor,
      highlighting,
      textarea,
    };
  }

  async function parseTextFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = event => resolve(event.target.result);
      fileReader.onerror = error => reject(error);
      fileReader.readAsText(file);
    })
  }

  async function showDialogImport(commandChainText, callback) {
    const p1 = gnoh.createElement('p', {
      class: 'info',
      text: 'Import from code',
    });

    const editor = createEditor({
      name: 'textarea',
    });

    let p2 = null;
    let inputFile = null;
    const content = [p1, editor.editor];

    if (commandChainText) {
      editor.textarea.value = commandChainText;
      editor.textarea.readonly = true;
      editor.highlighting.innerHTML = highlightJson(commandChainText);
    } else {
      p2 = gnoh.createElement('p', {
        class: 'info',
        text: 'Import from file',
      });

      inputFile = gnoh.createElement('input', {
        name: 'file',
        type: 'file',
        accept: 'application/json',
      });

      content.push(p2, inputFile);
    }

    const buttonInputElement = Object.assign({}, gnoh.constant.dialogButtons.submit, {
      label: langs.import,
      click: async (data) => {
        if (data.textarea.trim()) {
          commandChainText = data.textarea.trim();
        } else if (data.file && data.file[0]) {
          commandChainText = await parseTextFile(data.file[0]);
        }

        if (!commandChainText || !checkCommandChain(commandChainText)) {
          gnoh.alert('Import failed');
          callback && callback('fail');
        } else {
          await importCommandChain(JSON.parse(commandChainText));
          await reloadSetting();
          callback && callback('installed');
        }
      },
    });

    const buttonCancelElement = Object.assign({}, gnoh.constant.dialogButtons.cancel, {
      click: () => {
        callback && callback('cancel');
      },
    });

    gnoh.dialog(
      'Import Command Chain',
      content,
      [buttonInputElement, buttonCancelElement],
      {
        width: 500,
        class: 'import-export-command-chains',
      }
    );
  }

  function checkCommandChain(commandChainText) {
    let commandChain = null;
    try {
      commandChain = JSON.parse(commandChainText);
    } catch (e) {
      return false;
    }

    if (
      commandChain.category !== 'CATEGORY_COMMAND_CHAIN'
      || !Array.from(commandChain.chain)
      || commandChain.chain.some(c => typeof c.key !== 'string' || gnoh.uuid.check(c.key))
      || typeof commandChain.key !== 'string'
      || typeof commandChain.label !== 'string'
      || typeof commandChain.name !== 'string'
    ) {
      return false;
    } else {
      return true;
    }
  }

  async function getCommandChains() {
    return vivaldi.prefs.get('vivaldi.chained_commands.command_list');
  }

  async function getCommandChainByKey(key) {
    const commandList = await getCommandChains();
    const commandChain = commandList.find(c => c.key === key);
    if (commandChain) {
      return commandChain;
    } else {
      throw new Error('Key not found');
    }
  }

  async function importCommandChain(commandChain) {
    const commandList = await getCommandChains();
    const index = commandList.findIndex(c => c.key === commandChain.key);

    if (index === -1) {
      commandList.push(commandChain);
    } else {
      commandList[index] = commandChain;
    }

    vivaldi.prefs.set({
      path: 'vivaldi.chained_commands.command_list',
      value: commandList
    });
  }

  function getMenuItem(name) {
    const menuItem = document.evaluate(`//div[contains(concat(" ", normalize-space(@class), " "), " tree-row ") and contains(., "${name}")]`, document, null, XPathResult.ANY_TYPE, null);
    return menuItem.iterateNext();
  }

  async function reloadSetting() {
    try {
      const window = await chrome.windows.getLastFocused({ windowTypes: ['popup'] });
      if (window) {
        try {
          const vivExtData = JSON.parse(window.vivExtData);
          if (vivExtData.isSettings) {
            chrome.runtime.sendMessage({
              type: messageType,
              action: 'reload-setting',
              windowId: window.id,
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }


    const tabs = await chrome.tabs.query({ url: urls.quickCommands });
    tabs.forEach(async tab => {
      chrome.tabs.onUpdated.addListener(async function listener(tabId, changeInfo) {
        if (changeInfo.status === 'complete' && tabId === tab.id) {
          chrome.tabs.onUpdated.removeListener(listener);
          await chrome.tabs.update(tab.id, { url: urls.quickCommands });
        }
      });
      await chrome.tabs.update(tab.id, { url: urls.general });
    });
  }

  chrome.runtime.onMessage.addListener((info, sender, sendResponse) => {
    if (info.type === messageType) {
      (async () => {
        const window = await chrome.windows.getLastFocused({ windowTypes: ['normal'] });

        if (window && window.id === vivaldiWindowId || info.windowId === vivaldiWindowId) {
          switch (info.action) {
            case 'import':
              showDialogImport(info.data);
            case 'check':
              if (checkCommandChain(info.data)) {
                const data = JSON.parse(info.data);
                try {
                  const commandChain = await getCommandChainByKey(data.key);
                  if (JSON.stringify(commandChain) === JSON.stringify(data)) {
                    sendResponse('installed');
                  } else {
                    sendResponse('update');
                  }
                } catch {
                  sendResponse('new');
                }
              } else {
                sendResponse('fail');
              }
              break;
            case 'reload-setting':
              const menuItemGeneralElement = getMenuItem(langs.general);
              const menuItemQuickCommandsElement = getMenuItem(langs.quickCommands);
              if (menuItemGeneralElement && menuItemQuickCommandsElement) {
                setTimeout(() => menuItemGeneralElement.click());
                setTimeout(() => menuItemQuickCommandsElement.click());
              }
              break;
          }
        }
      })();
      return true;
    }
  });

  vivaldi.prefs.onChanged.addListener(async newValue => {
    if (newValue.path === 'vivaldi.chained_commands.command_list') {
      const tabs = await chrome.tabs.query({ url: '*://forum.vivaldi.net/topic/*' });
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: messageType,
          action: 'change',
        });
      });
    }
  });

  function createSettings() {
    if (timeOut) {
      timeOut.stop();
    }
    timeOut = gnoh.timeOut(chainedCommand => {
      chainedCommand.dataset.importExportCommandChains = true;
      const masterToolbar = chainedCommand.querySelector('.master-toolbar:not([data-import-export-command-chains="true"])');
      masterToolbar.dataset.importExportCommandChains = true;

      const master = chainedCommand.querySelector('.master:not([data-import-export-command-chains="true"])');
      master.dataset.importExportCommandChains = true;

      async function selectedKey() {
        const itemSelected = master.querySelector('.master-items .item-selected');
        if (!itemSelected) {
          return;
        }
        const commandList = await getCommandChains();
        const indexSelected = gnoh.element.getIndex(itemSelected);
        return commandList[indexSelected] && commandList[indexSelected].key;
      }

      Object.values(buttons).forEach((button) => {
        gnoh.element.appendAtIndex(
          gnoh.createElement('button', {
            class: 'button-toolbar',
            html: button.icon,
            title: button.title,
            events: {
              click: async (e) => {
                e.preventDefault();
                const key = await selectedKey();
                button.click(key);
              },
            },
          }),
          masterToolbar,
          button.index,
        );
      });
    }, '.Setting--ChainedCommand.master-detail:not([data-import-export-command-chains="true"])');
  }

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      if (tab.url === urls.quickCommands) {
        createSettings();
      } else if (/https:\/\/forum\.vivaldi\.net\/topic\/*/.test(tab.url)) {
        chrome.scripting.executeScript({
          target: {
            tabId: tab.id
          },
          args: [messageType, langs],
          func: (messageType, langs) => {
            if (window.importExportCommandChains) {
              return;
            } else {
              window.importExportCommandChains = true;
            }

            const buttonElements = [];

            chrome.runtime.onMessage.addListener((info) => {
              if (info.type === messageType) {
                switch (info.action) {
                  case 'change':
                    buttonElements.forEach(async buttonElement => {
                      const status = await chrome.runtime.sendMessage({
                        type: messageType,
                        action: 'check',
                        data: buttonElement.code,
                      });

                      updateButton(buttonElement, status);
                    });
                }
              }
            });

            async function onClick(event) {
              chrome.runtime.sendMessage({
                type: messageType,
                action: 'import',
                data: event.target.code,
              });
            }

            function updateButton(buttonElement, status) {
              if (status === 'new') {
                buttonElement.classList.add('btn-primary');
                buttonElement.classList.remove('btn-secondary');
                buttonElement.innerText = langs.install;
                buttonElement.disabled = false;
                buttonElement.addEventListener('click', onClick);
              } else if (status === 'update') {
                buttonElement.classList.add('btn-primary');
                buttonElement.classList.remove('btn-secondary');
                buttonElement.innerText = langs.update;
                buttonElement.disabled = false;
                buttonElement.addEventListener('click', onClick);
              } else if (status === 'installed') {
                buttonElement.classList.remove('btn-primary');
                buttonElement.classList.add('btn-secondary');
                buttonElement.innerText = langs.installed;
                buttonElement.disabled = true;
                buttonElement.removeEventListener('click', onClick);
              }
            }

            function createInstall(node) {
              const codes = node.querySelectorAll('code:not([data-import-export-command-chains="true"])');

              codes.forEach(async (codeElement) => {
                codeElement.dataset.importExportCommandChains = true;

                const code = codeElement.innerText.trim();

                const status = await chrome.runtime.sendMessage({
                  type: messageType,
                  action: 'check',
                  data: code,
                });

                if (status === 'fail') {
                  return;
                }

                const commandChainElement = document.createElement('div');
                commandChainElement.className = 'command-chain';

                const buttonElement = document.createElement('button');
                buttonElement.code = code;
                buttonElement.className = 'btn mb-3';

                updateButton(buttonElement, status);
                buttonElements.push(buttonElement);

                commandChainElement.append(buttonElement);

                const preElement = codeElement.closest('pre');
                if (preElement) {
                  preElement.parentNode.insertBefore(commandChainElement, preElement.nextSibling);
                } else {
                  codeElement.parentNode.insertBefore(commandChainElement, codeElement.nextSibling);
                }
              });
            }

            createInstall(document.body);

            const observer = new MutationObserver((mutationList) => {
              mutationList.forEach(mutation => {
                if (mutation.addedNodes.length) {
                  mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                      createInstall(node);
                    }
                  });
                }
              });
            });

            observer.observe(document.body, {
              childList: true,
              subtree: true,
            });
          },
        });
      }
    }
  });

  gnoh.timeOut((main) => {
    if (document.querySelector('#main > .webpageview')) {
      const menuItemQuickCommandsElement = getMenuItem(langs.quickCommands);

      menuItemQuickCommandsElement.addEventListener('click', createSettings)
    }
  }, '#main');
})();
