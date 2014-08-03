/*global $, jQuery, alert, console, angular, window, Modernizr*/
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2013-09-06 01:22:17
 * @version $Id$
 * @description
 * check CSS3 transition & animation event, load Modernizr.js first
 */

var EffecktDemos = {

    init: function() {

        function removeClass(dom, className) {
            if (dom.classList) {
                dom.classList.remove(className);
            } else {
                var reg = new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi');
                dom.className = dom.className.replace(reg, ' ');
            }
        }
        window.onload = function () {
            for (var i = 0; i < document.querySelectorAll('.no-transitions').length; i++) {
                removeClass(document.querySelectorAll('.no-transitions')[i], 'no-transitions')
            }
        };

        /*$(window).load(function() {
            $(".no-transitions").removeClass("no-transitions");
        });*/

        EffecktDemos.transitionEndEventName = EffecktDemos.transitionEndEventNames[Modernizr.prefixed('transition')];
        EffecktDemos.animationEndEventName = EffecktDemos.animationEndEventNames[Modernizr.prefixed('animation')];

    },

    animationEndEventNames: {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
    },

    transitionEndEventNames: {
        'WebkitTransition' : 'webkitTransitionEnd',
        'OTransition' : 'oTransitionEnd',
        'msTransition' : 'MSTransitionEnd',
        'transition' : 'transitionend'
    }

};

EffecktDemos.init();
