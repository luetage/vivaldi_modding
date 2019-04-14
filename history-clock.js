/*
History Clock
https://forum.vivaldi.net/topic/36080/history-clock-keeping-easter-egg-alive
Sets the time on the history clock panel icon, an easter egg featured by Vivaldi on 1st April 2019.
 */

function historyClock() {
    var setInt = true;
    var relax = -1;
    function updateClock() {
        const clock = document.querySelector('#switch button.history');
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        if (setInt === true) {
            if (relax !== -1 && relax !== minutes) {
                clearInterval(timer)
                setInterval(updateClock, 60000);
                setInt = false;
            }
            relax = minutes;
        }
        if (clock) {
            clock.style = '--timeHourRotation: rotate(' + Math.floor(hours*30+minutes/2) + 'deg)' + '; ' + '--timeMinuteRotation: rotate(' + minutes*6 + 'deg)';
        }
    };
    var timer = setInterval(updateClock, 1000);
};

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        historyClock();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
