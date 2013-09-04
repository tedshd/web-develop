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

    scrollToTop = function (setting) {
        var tipNode,
            defaultSetting = {
                bottom: '20px',
                right: '20px',
                speed: 1000
            };
        setting = $.extend(defaultSetting, setting);
        console.log(this);
        console.log(this[0]);
        // if does't set any selector or selector doesn't exist
        if (this === window || !this[0]) {
            console.log('not selector');
            $('body').append('<div class="arrowup hidden"></div>');
            tipNode = $('.arrowup');
            tipNode.css({
                'position': 'fixed',
                'bottom': setting.bottom,
                'right': setting.right,
                'cursor': 'pointer'
            });
        } else {
            // if selector is not only one
            if (this.length > 1) {
                alert('Selector is not only one,it is plurality');
                return;
            }
            tipNode = this;
        }

        tipNode.on('click', function () {
            $('body, html').animate(
                {
                    scrollTop: '0px'
                },
                setting.speed
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
    $.fn.scrollToTop = scrollToTop;
});