/*
Vivaldi Icon
https://forum.vivaldi.net/topic/28047/vivaldi-icon
Places the Vivaldi logo in the UI. Mostly cosmetic.
*/

function vivIcon() {
    const panel = document.getElementById('switch');
    const div = document.createElement('div');
    div.id = 'vivIcn';
    div.style.height = '34px';
    div.innerHTML = '<svg viewBox="0 0 13 12" xmlns="http://www.w3.org/2000/svg"><path d="M9.96 2.446c-.498-1.02.032-2.164 1.115-2.41.881-.2 1.793.464 1.909 1.38.051.402-.027.771-.222 1.118-1.606 2.855-3.213 5.709-4.816 8.566-.298.531-.731.852-1.325.896-.665.049-1.188-.237-1.524-.828-1.016-1.789-2.021-3.586-3.03-5.379-.614-1.092-1.229-2.182-1.84-3.275-.616-1.102.079-2.442 1.315-2.507.653-.034 1.157.274 1.488.854.453.794.897 1.593 1.346 2.389.323.574.64 1.152.972 1.72.481.824 1.189 1.289 2.13 1.347 1.333.081 2.571-.907 2.73-2.358l.025-.272c-.007-.47-.093-.865-.275-1.239z"></path></svg>';
    panel.insertBefore(div, panel.firstChild);
    document.querySelector('#vivIcn svg').style = 'width: 18px; height: 18px; fill: var(--colorFgFaded); display: block; margin: 9px auto;';
    document.getElementById('vivIcn').style = '-webkit-app-region: drag';
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        vivIcon();
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
