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
