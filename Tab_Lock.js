// Tab Lock
// https://forum.vivaldi.net/topic/30957/tab-lock/24
// Throws a warning when you try to navigate.

window.addEventListener('beforeunload', event => {
    event.preventDefault();
    event.returnValue = '';
})

window.addEventListener('popstate', () => console.log('block navigation'));

