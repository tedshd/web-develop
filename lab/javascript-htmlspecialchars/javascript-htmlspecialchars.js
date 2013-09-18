/*global $, jQuery, alert, console, angular*/
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2013-09-12 11:45:54
 * @version $Id$
 */

var util = {
    htmlspecialchars:
        function (str) {
            console.log(str);
            return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        },
    htmlspecialchars_decode:
        function (str) {
            return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
        },
    nl2br:
        function (str) {
            return str.replace(/\n/g, "<br>");
        }
};