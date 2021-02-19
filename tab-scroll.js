// Tab Scroll
// https://forum.vivaldi.net/topic/27856/tab-scroll
// Clicking on an active tab scrolls page to top, clicking it again returns to previous scroll position.
// Credits to tam710562 from Vivaldi Forum for coming up with the sessionStorage solution, which made this possible.

{
    function tabScrollExit(tab) {
        tab.removeEventListener('mousemove', tabScrollExit);
        tab.removeEventListener('click', tabScrollTrigger);
    }

    function tabScrollTrigger(tab) {
        chrome.tabs.executeScript({code: tabScrollScript});
        tabScrollExit(tab);
    }

    function tabScroll(e, tab) {
        if (tab.parentNode.classList.contains('active') && e.which === 1 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
            tab.addEventListener('mousemove', tabScrollExit(tab));
            tab.addEventListener('click', tabScrollTrigger(tab));
        }
    }

    const tabScrollScript = '!' + function () {
        var offset = window.pageYOffset;
        if (offset > 0) {
            window.sessionStorage.setItem('tabOffset',offset);
            window.scrollTo(0,0);
        }
        else {
            window.scrollTo(0,window.sessionStorage.getItem('tabOffset')||0);
        }
    } + '();';

    var appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (arguments[0].tagName === 'DIV' && arguments[0].classList.contains('tab-header')) {
            setTimeout(function() {
                const trigger = (event) => tabScroll(event, arguments[0]);
                arguments[0].addEventListener('mousedown', trigger);
            }.bind(this, arguments[0]));
        }
        return appendChild.apply(this, arguments);
    }
}

// Restore Methods for chrome.tabs
// Written by Tam710562
window.gnoh=Object.assign(window.gnoh||{},{tabs:{getAllInWindow:function(){let e,t;Array.from(arguments).forEach(function(c){switch(typeof c){case"number":e=c;break;default:t=c}}),chrome.tabs.query({windowId:e||vivaldiWindowId},function(e){t(e)})},getSelected:function(){let e,t;Array.from(arguments).forEach(function(c){switch(typeof c){case"number":e=c;break;default:t=c}}),chrome.tabs.query({active:!0,windowId:e||vivaldiWindowId},function(e){const c=e[0];c&&t(c)})},executeScript:function(){let e,t,c;Array.from(arguments).forEach(function(n){switch(typeof n){case"number":e=n;break;case"object":t=n;break;default:c=n}}),e?gnoh.webPageView.callMethod(e,"executeScript",[t,c]):gnoh.webPageView.callMethod("executeScript",[t,c])},insertCSS:function(){let e,t,c;Array.from(arguments).forEach(function(n){switch(typeof n){case"number":e=n;break;case"object":t=n;break;default:c=n}}),e?gnoh.webPageView.callMethod(e,"insertCSS",[t,c]):gnoh.webPageView.callMethod("insertCSS",[t,c])}},webPageView:{getSelected(e){gnoh.tabs.getSelected(function(t){e(this.get(t.id))}.bind(this))},get:function(e){return document.getElementById(e)},callMethod:function(){let e,t,c;if(Array.from(arguments).forEach(function(n){switch(typeof n){case"number":e=n;break;case"string":t=n;break;default:c=n}}),e){const n=this.get(e);n[t].apply(n,c)}else this.getSelected(function(e){e[t].apply(e,c)})}}}),chrome.tabs.getAllInWindow||(chrome.tabs.getAllInWindow=gnoh.tabs.getAllInWindow),chrome.tabs.getSelected||(chrome.tabs.getSelected=gnoh.tabs.getSelected),chrome.tabs.executeScript||(chrome.tabs.executeScript=gnoh.tabs.executeScript),chrome.tabs.insertCSS||(chrome.tabs.insertCSS=gnoh.tabs.insertCSS);
