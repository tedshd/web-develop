/**
 *
 * @authors Ted Shiu (ted@sitetag.us)
 * @date    2015-06-10 10:41:36
 */


if (typeof UTIL == 'undefined' || !UTIL) {
    var UTIL = {};
}
UTIL.createEl = {
    get: function(sTag, oAttr, handleOnLoad, handleError) {
        var el = document.createElement(sTag);
        for (var i in oAttr) {
            el[i] = oAttr[i];
        }
        if (handleOnLoad) {
            el.onload = handleOnLoad;
        }
        if (handleError) {
            el.onerror = handleError;
        }
        this.append(el);
        return el;
    },
    append: function(dNode) {
        var dHead = document.getElementsByTagName('head')[0] || document.body;
        dHead.appendChild(dNode);
    },
    remove: function(dNode) {
        setTimeout(function() {
            dNode.parentNode.removeChild(dNode);
            dNode = null;
        }, 0);
    },
    js: function(sUrl, handleOnLoad, handleError) {
        var dNode = this.get('script', {
            src: sUrl,
            type: 'text/javascript'
        }, handleOnLoad, handleError);
        return dNode;
    },
    css: function(sUrl, sMedia) {
        if (!sMedia) {
            sMedia = 'all';
        }
        return this.get('link', {
            'href':sUrl,
            'rel':'stylesheet',
            'type':'text/css',
            'media':sMedia
        });
    }
};

// UTIL.createEl.js('http://ad.sitemaji.com/native/pixnet_mobile.js');
// UTIL.createEl.js('http://ad.sitemaji.com/native/gigacircle_source.js');
// UTIL.createEl.js('http://ad.sitemaji.com/native/runningbiji_tw_mobile.js');
// UTIL.createEl.js('http://ad.sitemaji.com/native/clickme_mobile.js');
// UTIL.createEl.js('http://tedshd.lionfree.net/demo/feebee.js');
// UTIL.createEl.css('http://tedshd.lionfree.net/demo/feebee.css');
