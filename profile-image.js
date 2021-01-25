/*
Profile Image
https://forum.vivaldi.net/topic/34952/choose-a-custom-profile-image/13
Exchanges the profile image in address bar for a regular svg using Vivaldi's theme colors.
Credits to tam710562 for coming up with a solution to reinstate the svg when the address bar is being toggled.
*/

{
    function profileImage(image) {
        image.innerHTML = '<svg width="18" height="18" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"></path></svg>';
        const svgImage = document.querySelector('.profile-popup button svg');
        svgImage.style.height = '18px';
        svgImage.style.width = '18px';
    }

    var appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (arguments[0].tagName === 'BUTTON') {
            setTimeout(function() {
                if (this.classList.contains('profile-popup')) {
                    profileImage(arguments[0])
                }
            }.bind(this, arguments[0]));
        }
        return appendChild.apply(this, arguments);
    }
}
