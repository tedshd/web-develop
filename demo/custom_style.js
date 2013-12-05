/*global $, jQuery, alert, console, document, angular*/
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2013-12-05 21:04:50
 * @version $Id$
 */

var node;
function node(selector) {
    return document.querySelector(selector);
}

// set style
var layoutList = 'layoutList',
    layoutGrid = 'layoutGrid',
    layoutFull = 'layoutFull',
    layoutCard = 'layoutCard';

function changeLayout(style) {
    // maybe make loading?
    node('body').setAttribute('class', style);
}

// bind click change style
node('#style_1').addEventListener('click', function () {
    changeLayout(layoutGrid);
});
node('#style_2').addEventListener('click', function () {
    changeLayout(layoutList);
});
node('#style_3').addEventListener('click', function () {
    changeLayout(layoutCard);
});
node('#style_4').addEventListener('click', function () {
    changeLayout(layoutFull);
});

/*
scss example

.layoutList {
    .bd {
        .con {
            color: #ff0000;
        }
    }
}
.layoutGrid {
    .bd {
        .con {
            color: #0088ff;
        }
    }
}
.layoutFull {
    .bd {
        .con {
            color: #ff8800;
        }
    }
}
.layoutCard {
    .bd {
        .con {
            color: #00ff00;
        }
    }
}
 */