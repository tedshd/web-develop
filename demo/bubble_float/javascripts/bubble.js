/*global $, jQuery, alert, console, angular, document*/
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2014-04-17 17:54:19
 * @version $Id$
 */
var leftPosition = [60, 78, 88, 80, 70, 85],
    randomPosition = [2, 5, 3, 7, 4, 9],
    dom = document.body,
    circle = 10,
    accelerate = false,
    backToTop,
    scrollTop,
    timeOut,
    bubbleTop;

for (var i = 0; i < document.querySelectorAll('.bubble').length; i++) {
    document.querySelectorAll('.bubble')[i].style.left = leftPosition[i] + '%';
};

document.querySelector('#back_to_top').addEventListener('click', backToTop);

function backToTop() {
    bubbleTop = (scrollTop/(dom.scrollHeight - document.documentElement.clientHeight))*100;
    for (var i = 0; i < document.querySelectorAll('.bubble').length; i++) {
        document.querySelectorAll('.bubble')[i].setAttribute('class', 'bubble');
        document.querySelectorAll('.bubble')[i].style.bottom = bubbleTop + Math.floor((Math.random()*10)+1) + '%';
    }
    scrollTop = dom.scrollTop;
    function animate() {
        if (accelerate) {
            scrollTop -= 18;
        } else {
            scrollTop -= 9;
        }
        circle++;
        dom.scrollTop = scrollTop;
        bubbleTop = 100 - (scrollTop/(dom.scrollHeight - document.documentElement.clientHeight))*100;
        for (var i = 0; i < document.querySelectorAll('.bubble').length; i++) {
            document.querySelectorAll('.bubble')[i].style.bottom = bubbleTop + randomPosition[i] + '%';
            document.querySelectorAll('.bubble')[i].style.marginLeft = '-' + (circle/(2*5)) + 'px';
            document.querySelectorAll('.bubble')[i].style.width = (circle/5) + 'px';
            document.querySelectorAll('.bubble')[i].style.height = (circle/5) + 'px';
            document.querySelectorAll('.bubble')[i].style.borderRadius = (circle/5) + 'px';
        }
        if (0 >= scrollTop) {
            for (var i = 0; i < document.querySelectorAll('.bubble').length; i++) {
                document.querySelectorAll('.bubble')[i].setAttribute('class', 'bubble fade_out');
            }
            circle = 10;
            clearTimeout(timeOut);
            accelerate = false;
            return;
        }
        timeOut = setTimeout(animate, 5);
    }
    animate();
    setTimeout(function() {
        accelerate = true;
    }, 3000);
}