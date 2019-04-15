/*
History Clock
https://forum.vivaldi.net/topic/36080/history-clock-keeping-easter-egg-alive
Sets the time on the history clock panel icon, an easter egg featured by Vivaldi on 1st April 2019.
 */

function historyClock() {
    const clock = document.querySelector('#switch button.history');
    var time = new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    if (clockSetInt === true) {
        if (clockRelax !== -1 && clockRelax !== minutes) {
            clearInterval(clockTimer)
            setInterval(historyClock, 60000);
            clockSetInt = false;
        }
        clockRelax = minutes;
    }
    if (clock) {
        clock.style = '--timeHourRotation: rotate(' + Math.floor(hours*30+minutes/2) + 'deg); --timeMinuteRotation: rotate(' + minutes*6 + 'deg)';
    }
};

var clockSetInt = true;
var clockRelax = -1;
var clockTimer = setInterval(historyClock, 1000);
