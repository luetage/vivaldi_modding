/*
Tab Lock
https://forum.vivaldi.net/topic/30957/tab-lock
Disables all links on a page, or forces them to load in a new tab. Download this file and add it to Vivaldi's user_files folder within the application. This will make the mod available as page action in the status bar.
*/

document.body.addEventListener('click', function(event) {
    var target = event.target;
    do {
        if (target.nodeName.toUpperCase() === 'A' && target.href) {
            target.href = 'javascript:'; //disables all links
            //target.target = '_blank'; //opens links in new tab
            break;
        }
    } while (target = target.parentElement);
}, true);
