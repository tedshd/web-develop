/*global $, jQuery, alert, console, window*/
/**
 * Mockup:
 *
 * @authors Ted Shiu (you@example.org)
 * @date    2013-08-08 20:59:26
 * @version $Id$
 */

$(function () {
    var scrollToTop;
    scrollToTop = function (set) {
        var tipNode;
        if ($(set.node).length) {
            tipNode = $(set.node);
        } else {
            $('body').append('<div class="scroll-to-top hidden">Top</div>');
            tipNode = $('.scroll-to-top');
            tipNode.css({
                'position': 'fixed',
                'bottom': '10px',
                'right': '10px',
                'padding': '10px',
                'cursor': 'pointer',
                'background': '#ccc'
            });
        }
        tipNode.click(function () {
            $('body, html').animate(
                {
                    scrollTop: '0px'
                }
            );
        });
        $(window).scroll(function() {
            if ($(window).scrollTop() > 0) {
                tipNode.removeClass('hidden');
            } else {
                tipNode.addClass('hidden');
            }
        });
    };
    $.scrollToTop = scrollToTop;
});