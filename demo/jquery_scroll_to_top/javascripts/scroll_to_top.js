$(document).ready(function() {
    $('body').append('<div class="scroll-to-top hidden">Top</div>');
    var scrollToTop = $('.scroll-to-top');
    scrollToTop.click(function() {
        $('body, html').animate({scrollTop: '0px'});
    });
    $(window).scroll(function() {
        if ($(window).scrollTop() > 0) {
            scrollToTop.removeClass('hidden');
        } else {
            scrollToTop.addClass('hidden');
        }
    });
});