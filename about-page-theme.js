// About‐Page Theme

{
    function aboutMod(id) {
        const bg = document.documentElement.style.getPropertyValue('--colorBg');
        const bgdark = document.documentElement.style.getPropertyValue('--colorBgDark');
        const fg = document.documentElement.style.getPropertyValue('--colorFg');
        const fgintense = document.documentElement.style.getPropertyValue('--colorFgIntense');
        const hi = document.documentElement.style.getPropertyValue('--colorHighlightBg');
        const sendit = `
            html {
                background-image: linear-gradient(to bottom, transparent 50%, ${bg} 50%), linear-gradient(to right, ${bgdark} 50%, ${bg} 50%) !important;
                background-size: 10px 10px, 10px 10px !important;
            }
            .label, #company {
                color: ${fgintense};
                font-size: 0.9em !important;
            }
            .version, #slogan {
                color: ${fg} !important;
                font-size: 0.85em !important;
            }
            .version, #useragent {
                font-family: unset !important;
            }
            #copyright {
                font-size: 0.8em !important;
            }
            a {
                color: ${hi};
            }
        `;
        chrome.tabs.insertCSS(id, {code: sendit});
    }

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.url === 'chrome://version/') {
            aboutMod(tabId);
        }
    })
}

// Restore Methods for chrome.tabs
// Written by Tam710562
window.gnoh=Object.assign(window.gnoh||{},{tabs:{getAllInWindow:function(){let e,t;Array.from(arguments).forEach(function(c){switch(typeof c){case"number":e=c;break;default:t=c}}),chrome.tabs.query({windowId:e||vivaldiWindowId},function(e){t(e)})},getSelected:function(){let e,t;Array.from(arguments).forEach(function(c){switch(typeof c){case"number":e=c;break;default:t=c}}),chrome.tabs.query({active:!0,windowId:e||vivaldiWindowId},function(e){const c=e[0];c&&t(c)})},executeScript:function(){let e,t,c;Array.from(arguments).forEach(function(n){switch(typeof n){case"number":e=n;break;case"object":t=n;break;default:c=n}}),e?gnoh.webPageView.callMethod(e,"executeScript",[t,c]):gnoh.webPageView.callMethod("executeScript",[t,c])},insertCSS:function(){let e,t,c;Array.from(arguments).forEach(function(n){switch(typeof n){case"number":e=n;break;case"object":t=n;break;default:c=n}}),e?gnoh.webPageView.callMethod(e,"insertCSS",[t,c]):gnoh.webPageView.callMethod("insertCSS",[t,c])}},webPageView:{getSelected(e){gnoh.tabs.getSelected(function(t){e(this.get(t.id))}.bind(this))},get:function(e){return document.getElementById(e)},callMethod:function(){let e,t,c;if(Array.from(arguments).forEach(function(n){switch(typeof n){case"number":e=n;break;case"string":t=n;break;default:c=n}}),e){const n=this.get(e);n[t].apply(n,c)}else this.getSelected(function(e){e[t].apply(e,c)})}}}),chrome.tabs.getAllInWindow||(chrome.tabs.getAllInWindow=gnoh.tabs.getAllInWindow),chrome.tabs.getSelected||(chrome.tabs.getSelected=gnoh.tabs.getSelected),chrome.tabs.executeScript||(chrome.tabs.executeScript=gnoh.tabs.executeScript),chrome.tabs.insertCSS||(chrome.tabs.insertCSS=gnoh.tabs.insertCSS);
