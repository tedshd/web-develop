/* Regex-pattern to check URLs against.
   It matches URLs like: http[s]://[...]mobile01.com[...] */
var urlRegex = /^https?:\/\/(?:[^\.]+\.)?stackoverflow\.com/;

/* A function creator for callbacks */
function doStuffWithDOM(domContent) {
    console.log("I received the following DOM content:\n" + domContent);
}

/* When the browser-action button is clicked... */
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log(document);
    chrome.tabs.sendMessage(tab.id, { text: "report_back" }, function(domContent) {
        console.log("I received the following DOM content:\n" + domContent);
    });
    /*...check the URL of the active tab against our pattern and... */
    if (urlRegex.test(tab.url)) {
        /* ...if it matches, send a message specifying a callback too */
    }
});