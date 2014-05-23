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

    //prototype
    $("a:eq(0)").focus();

    $("a").focus(function (e) {
        console.log(document.activeElement);
        // console.log("offsetheight:" + $("#doc-main").get(0).offsetHeight);
        // console.log(e);
        // console.log("nodeheigh:" + $(this).get(0).offsetTop);
        // console.log("height:" + e.currentTarget.offsetHeight);
        // console.log("li:" + $("li").height());
        // console.log("this_height:" + $(this).height());
        var nodeheigh = $(this).get(0).offsetTop,
            height    = e.currentTarget.offsetHeight;
        var startTime = new Date().getTime();
        $("#doc-main").stop().animate(
            {scrollTop: "" + nodeheigh - height + "px"},
            500,
            function () {
                var endTime = new Date().getTime();
                console.log("TotalTime:" + (endTime - startTime) + "ms");
            }
        );
    });
    console.log(document.activeElement);
});
