/*
 * Import Export Command Chains
 * Written by Tam710562
 */

(function () {
  'use strict';

  const gnoh = {
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
      }
    },
    addStyle: function (css, id, isNotMin) {
      this.styles = this.styles || {};
      if (Array.isArray(css)) {
        css = css.join(isNotMin === true ? '\n' : '');
      }
      id = id || this.uuid.generate(Object.keys(this.styles));
      this.styles[id] = this.createElement('style', {
        html: css || '',
        'data-id': id
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
        html: (html || '').trim()
      }).content;
    },
    constant: {
      dialogButtons: {
        submit: {
          label: chrome.i18n.getMessage('_79__75_0') || 'OK',
          type: 'submit'
        },
        cancel: {
          label: chrome.i18n.getMessage('_67_ancel0') || 'Cancel',
          cancel: true
        },
        primary: {
          class: 'primary'
        },
        danger: {
          class: 'danger'
        },
        default: {}
      }
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
        tabindex: '0'
      });
      const div = this.createElement('div', {
        style: {
          width: config.width ? config.width + 'px' : ''
        }
      });
      dialog = this.createElement('form', {
        'data-dialog-id': id,
        class: 'dialog-custom modal-wrapper'
      }, div);
      if (config.class) {
        dialog.classList.add(config.class);
      }
      const dialogHeader = this.createElement('header', {
        class: 'dialog-header'
      }, dialog, '<h1>' + (title || '') + '</h1>');
      const dialogContent = this.createElement('div', {
        class: 'dialog-content'
      }, dialog, content);
      if (buttons && buttons.length > 0) {
        const dialogFooter = this.createElement('footer', {
          class: 'dialog-footer'
        }, dialog, buttonElements);
      }
      modalBg = this.createElement('div', {
        id: 'modal-bg',
        class: 'slide'
      }, undefined, [focusModal.cloneNode(true), div, focusModal.cloneNode(true)]);
      const inner = document.querySelector('#main .inner');
      if (inner) {
        inner.prepend(modalBg);
      }
      return {
        dialog: dialog,
        dialogHeader: dialogHeader,
        dialogContent: dialogContent,
        buttons: buttonElements,
        close: closeDialog
      };
    },
    alert: function (message, okEvent) {
      const buttonOkElement = Object.assign({}, this.constant.dialogButtons.submit, {
        cancel: true
      });
      if (typeof okEvent === 'function') {
        buttonOkElement.click = function (data) {
          okEvent.bind(this)(data);
        };
      }

      return this.dialog('Gnoh', message, [buttonOkElement], {
        width: 400,
        class: 'dialog-javascript'
      });
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
    copy: chrome.i18n.getMessage('verb_4__67_opy0') || 'Copy',
    export: chrome.i18n.getMessage('verb_4__69_xport0') || 'Export',
    import: chrome.i18n.getMessage('_73_mport0') || 'Import',
    install: chrome.i18n.getMessage('_73_nstall0') || 'Install',
  };

  gnoh.addStyle([
    '.import-export-command-chains input[type="file"]::file-selector-button { border: 0px; border-right: 1px solid var(--colorBorder); height: 28px; padding: 0 18px; color: var(--colorFg); background: linear-gradient(var(--colorBgLightIntense) 0%, var(--colorBg) 100%); margin-right: 18px; }',
    '.import-export-command-chains input[type="file"]::file-selector-button:hover { background: linear-gradient(var(--colorBg), var(--colorBg)); }'
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

        const content = gnoh.createElement('textarea', {
          rows: 5,
          readonly: true,
          style: {
            'resize': 'vertical',
            'max-height': '300px',
          },
          events: {
            click: (e) => e.target.select()
          },
          value: JSON.stringify(commandChain),
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
            chrome.downloads.download({
              url: commandChainUrl,
              filename: `${commandChain.label.trim().replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '')}.json`,
              saveAs: true,
            });
          },
        });

        const buttonCancelElement = Object.assign({}, gnoh.constant.dialogButtons.cancel);

        gnoh.dialog(
          'Export Command Chain',
          content,
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

  async function parseTextFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = event => resolve(event.target.result);
      fileReader.onerror = error => reject(error);
      fileReader.readAsText(file);
    })
  }

  async function showDialogImport(commandChainText) {
    const p1 = gnoh.createElement('p', {
      class: 'info',
      text: 'Import from code',
    });

    const textarea = gnoh.createElement('textarea', {
      name: 'textarea',
      rows: 5,
      style: {
        'resize': 'vertical',
        'max-height': '300px',
      },
    });

    let p2 = null;
    let inputFile = null;
    const content = [p1, textarea];

    if (commandChainText) {
      textarea.value = commandChainText;
      textarea.readonly = true;
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
          commandChainText = textarea.value.trim();
        } else if (data.file && data.file[0]) {
          commandChainText = await parseTextFile(data.file[0]);
        }

        if (!commandChainText || !checkCommandChain(commandChainText)) {
          gnoh.alert('Import failed');
        } else {
          await importCommandChain(JSON.parse(commandChainText));
          await reloadSetting();
        }
      },
    });

    const buttonCancelElement = Object.assign({}, gnoh.constant.dialogButtons.cancel);

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

  async function reloadSetting() {
    const tabs = await chrome.tabs.query({ url: urls.quickCommands, currentWindow: true });
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, { url: urls.general });
      chrome.tabs.onUpdated.addListener(async function listener(tabId, changeInfo) {
        if (changeInfo.status === 'complete' && tabId === tabs[0].id) {
          chrome.tabs.onUpdated.removeListener(listener);
          await chrome.tabs.update(tabs[0].id, { url: urls.quickCommands });
        }
      });
    }
  }

  chrome.runtime.onMessage.addListener(function (info, sender, sendResponse) {
    if (info.type === messageType && info.action === 'import') {
      showDialogImport(info.data);
    }
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      if (tab.url === urls.quickCommands) {
        if (timeOut) {
          timeOut.stop();
        }
        timeOut = gnoh.timeOut(chainedCommand => {
          chainedCommand.importExportCommandChains = true;
          const masterToolbar = chainedCommand.querySelector('.master-toolbar');
          const master = chainedCommand.querySelector('.master');

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
        }, '.Setting--ChainedCommand:not([data-import-export-command-chains="true"])');
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
                || commandChain.chain.some(c => typeof c.key !== 'string' || !/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(c.key))
                || typeof commandChain.key !== 'string'
                || typeof commandChain.label !== 'string'
                || typeof commandChain.name !== 'string'
              ) {
                return false;
              } else {
                return true;
              }
            }

            function createInstall(node) {
              const codes = node.querySelectorAll('code:not([data-import-export-command-chains="true"])');

              codes.forEach((code) => {
                code.dataset.importExportCommandChains = true;

                if (checkCommandChain(code.innerText.trim())) {
                  const commandChainElement = document.createElement('div');
                  commandChainElement.className = 'command-chain';

                  const buttonInstallElement = document.createElement('button');
                  buttonInstallElement.className = 'btn btn-primary mb-3';
                  buttonInstallElement.innerText = langs.install;
                  buttonInstallElement.addEventListener('click', () => {
                    chrome.runtime.sendMessage({
                      type: messageType,
                      action: 'import',
                      data: code.innerText.trim(),
                    });
                  });
                  commandChainElement.append(buttonInstallElement);

                  const pre = code.closest('pre');
                  if (pre) {
                    pre.parentNode.insertBefore(commandChainElement, pre.nextSibling);
                  } else {
                    code.parentNode.insertBefore(commandChainElement, code.nextSibling);
                  }
                }
              });
            }

            createInstall(document.body);

            const observer = new MutationObserver((mutationList, observer) => {
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
})();
