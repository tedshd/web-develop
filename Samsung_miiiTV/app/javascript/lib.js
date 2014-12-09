/*global $, jQuery, alert, console, angular*/
/**
 *
 * @authors Ted Shiu (ted_shiu@miiicasa.com)
 * @date    2014-04-02 23:19:11
 * @version $Id$
 */

// handle get element
function node(selector) {
    if (selector.indexOf('.') === -1) {
        // return node list to handle class
        return document.querySelector(selector);
    } else {
        return document.querySelectorAll(selector);
    }
}

// handle index
function indexInParent(node) {
    var children = node.parentNode.childNodes;
    var num = 0;
    for (var i=0; i<children.length; i++) {
         if (children[i]==node) return num;
         if (children[i].nodeType==1) num++;
    }
    return -1;
}

// handle time
function toHHMMSS(sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

function viewOpen(dom, state, view) {
    alert('viewOpen');
    if (view) {
        dom.setAttribute('class', view);
    } else {
        dom.setAttribute('class', '');
    }
    if (state) {
        Main[state] = 1;
    }
}

function viewClose(dom, state) {
    alert('viewClose');
    dom.setAttribute('class', 'hide');
    if (state) {
        Main[state] = 0;
    }
}