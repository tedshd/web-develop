/*

@authors leon <kairyou@qq.com>
      you
*/

$(document).ready(function () {
    var i;
    //create li list
    for (i = 1; 19 >= i; i++) {
        $("ul").append(
            "<li>" +
                "<a class='shiny-focus' href='javascript:void(0);'>" +
                    "<div clss='box'>" +
                        "<span class='thumb'>" +
                            "<img src='images/Adobe_0" + i + ".png'>" +
                        "</span>" +
                        "<span class='info'>" +
                            "<span class='title'>title:" + i + "</span>" +
                            "<p class='desc'>test content</p>" +
                        "</span>" +
                    "</div>" +
                "</a>" +
            "</li>"
        );
    }
    for (i = 1; 19 >= i; i++) {
        $("ul").append(
            "<li>" +
                "<a class='simple-focus' href='javascript:void(0);'>" +
                    "<div clss='box'>" +
                        "<span class='thumb'>" +
                            "<img src='images/Adobe_0" + i + ".png' width='100' height='100'>" +
                        "</span>" +
                        "<span class='info'>" +
                            "<span class='title'>title:" + i + "</span>" +
                            "<p class='desc'>test content</p>" +
                        "</span>" +
                    "</div>" +
                "</a>" +
            "</li>"
        );
    }
    $("a:eq(0)").focus();
    $("a").focus(function (e) {
        console.log("scrolltop:" + $("#doc-main").get(0).scrollTop);
        console.log("scrollheight:" + $("#doc-main").get(0).scrollHeight);
        console.log("offsettop:" + $("#doc-main").get(0).offsetTop);
        console.log("offsetheight:" + $("#doc-main").get(0).offsetHeight);
        console.log("ThisoffsetTop:" + $(this).get(0).offsetTop);
        console.log("height:" + $("li").height());
        var nodeheigh = $(this).get(0).offsetTop,
            height    = e.currentTarget.offsetHeight;
        $("#doc-main").stop().animate({scrollTop: "" + nodeheigh - height + "px"});
    });
});