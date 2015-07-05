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

document.querySelector('#run').addEventListener(function () {
    var url = document.querySelector('input').value;
    console.log(url);
    UTIL.createEl.js(url);
});