/*
Tab Lock
https://forum.vivaldi.net/topic/14723/legacy-panel
Download this file and add it to Vivaldi's user_files folder within the application. This will make the mod available as page action in the status bar.
*/

document.body.addEventListener('click', function(event) {
    const target = event.target;
    do {
        if (target.nodeName.toUpperCase() === 'A' && target.href) {
            target.href = 'javascript:'; //disables all links
            // target.target = '_blank'; //opens links in new tab
            break;
        }
    } while (target = target.parentElement);
}, true);
