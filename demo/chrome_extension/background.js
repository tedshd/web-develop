/*global console, document, Element, chrome, localStorage*/
var fb_data,
    runApp;
var node;
/**
 * Easy to get HTML element
 * @param  {string} selector id, class or tag
 * @return {object}
 */
function node(selector) {
    return document.querySelector(selector);
}

var div = document.createElement('div'),
    prefix = ['moz', 'webkit', 'ms', 'o'].filter(function(prefix) {
        return prefix + 'MatchesSelector' in div;
    })[0] + 'MatchesSelector';
/**
 * addDelegateListener delegate event to DOM object
 * @param {string}   type     event
 * @param {string}   selector id, class or tag
 * @param {Function} fn       handle something
 */
Element.prototype.addDelegateListener = function(type, selector, fn) {
    this.addEventListener(type, function(e) {
        var target = e.target;
        while (target && target !== this && !target[prefix](selector)) {
            target = target.parentNode;
        }
        if (target && target !== this) {
            return fn.call(target, e);
        }
    }, false);
};

var successURL = 'https://www.facebook.com/connect/login_success.html';
function onFacebookLogin() {
    var i,
        params,
        access;
    if (!localStorage.accessToken) {
        chrome.tabs.getAllInWindow(null, function(tabs) {
            for (i = 0; i < tabs.length; i++) {
                if (tabs[i].url.indexOf(successURL) === 0) {
                    params = tabs[i].url.split('#')[1];
                    access = params.split('&')[0];
                    console.log(access);
                    localStorage.accessToken = access;
                    chrome.tabs.onUpdated.removeListener(onFacebookLogin);
                    return;
                }
            }
        });
    }
}
chrome.tabs.onUpdated.addListener(onFacebookLogin);
