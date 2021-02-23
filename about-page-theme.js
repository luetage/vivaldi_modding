// About‐Page Theme
// https://forum.vivaldi.net/topic/57420/about-page-theme
// Injects CSS into the internal page vivaldi://about, uses native theme colors.
// Relies on chrome.tabs restore method ☛ https://forum.vivaldi.net/topic/57191/restore-methods-for-chrome-tabs

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
