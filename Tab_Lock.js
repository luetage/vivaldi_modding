// Tab Lock
// https://forum.vivaldi.net/topic/30957/tab-lock
// Tries to prevent any kind of navigation.

document.body.addEventListener('click', event => {
    let target = event.target;
    do {
        if (target.nodeName.toUpperCase() === 'A' && target.href) {
        target.href = 'javascript:'; //disables all links
        //target.target = '_blank'; //opens links in new tab
        break;
        }
    } while (target = target.parentElement);
}, true)

window.addEventListener('beforeunload', event => {
    event.preventDefault();
    event.returnValue = '';
})

window.addEventListener('popstate', () => console.log('block navigation'));

