/**
 *
 * @authors Your Name (you@example.org)
 * @date    2013-06-27 11:38:35
 * @version $Id$
 */

$(function() {
    $('button').zclip({
        path: 'javascripts/jquery.zclip.1.1.0/ZeroClipboard.swf',
        copy: $('.link').html()
    }).click(function(){
        alert('Copy: ' + $('.link').html());
    });
});