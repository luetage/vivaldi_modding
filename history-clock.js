/*
History Clock
https://forum.vivaldi.net/topic/36080/history-clock-keeping-easter-egg-alive
Sets the time on the history clock panel icon, an easter egg featured by Vivaldi on 1st April 2019.
 */

function historyClock() {
    const history = document.querySelector('#switch button.history');
    document.querySelector('#switch button.history svg rect:nth-of-type(1)').style = 'transform-origin: center; transform: var(--timeHourRotation)';
    document.querySelector('#switch button.history svg rect:nth-of-type(2)').style = 'transform-origin: center; transform: var(--timeMinuteRotation)';
    var setInt = true;
    var relax = -1;
    function updateClock() {
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        if (setInt === true) {
            if (relax !== -1 && relax !== minutes) {
                clearInterval(timer);
                setInterval(updateClock, 60000);
                setInt = false;
            }
            relax = minutes;
        }
        var setHours = '--timeHourRotation: rotate(' + Math.floor(hours*30+minutes/2) + 'deg)';
        var setMinutes = '--timeMinuteRotation: rotate(' + minutes*6 + 'deg)';
        history.style = setHours + ';' + setMinutes;
    };
    var timer = setInterval(updateClock, 1000);
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        historyClock();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
