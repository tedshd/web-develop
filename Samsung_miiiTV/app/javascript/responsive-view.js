/*global $, jQuery, alert, console, angular*/
/**
 *
 * @authors Ted Shiu (ted_shiu@miiicasa.com)
 * @date    2014-04-02 23:58:23
 * @version $Id$
 */

// responsive view
var h = window.document.documentElement.clientHeight;
var w = window.document.documentElement.clientWidth;
console.log('H', h);
console.log('W', w);
if (w === 1920) {
    Main.playerWidth = 1920;
    Main.playerHeight = 1080;
    document.body.style.width = '1920px';
    document.body.style.height = '1080px';
    document.querySelector('#menu').style.height = '100%';
} else if (w === 1280) {
    Main.playerWidth = 1280;
    Main.playerHeight = 720;
} else if (w === 1024) {
    Main.playerWidth = 1024;
    Main.playerHeight = 576;
    document.body.style.width = '1024px';
    document.body.style.height = '576px';
    Main.menuView = 5;
} else if (w === 853) {
    Main.playerWidth = 853;
    Main.playerHeight = 480;
} else if (w === 640) {
    Main.playerWidth = 640;
    Main.playerHeight = 360;
} else {
    Main.playerWidth = w;
    Main.playerHeight = (w*9)/16;
    document.body.style.width = w + 'px';
    document.body.style.height = (w*9)/16 + 'px';
}