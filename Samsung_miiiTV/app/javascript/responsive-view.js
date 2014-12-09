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
document.querySelector('#menu').style.height = '100%';
Main.playerWidth = (16*h)/9;
Main.playerHeight = h;
document.querySelector('#view').style.width = (16*h)/9 + 'px';
document.querySelector('#view').style.height = h + 'px';
