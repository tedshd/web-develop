/*global $, jQuery, alert, console, angular*/
/**
 *
 * @authors Ted Shiu (ted_shiu@miiicasa.com)
 * @date    2014-04-02 23:45:46
 * @version $Id$
 */

// init Samsung API
var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var pluginAPI = new Common.API.Plugin();
var fileSystemObj = new FileSystem();
if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
    fileSystemObj.createCommonDir(curWidget.id);
}

// handle network
var watchCB = {
    onconnect : function (type) {
        // (1) connected
        alert(type + " is connected successfully");
        if (Main.player) {
            if (Main.player.getPlayerState() === YT.PlayerState.PAUSED) {
                Main.player.playVideo();
            }
        }
        node('#network_error_view').setAttribute('class', 'hide');
        Main.networkError = 0;
    },

    ondisconnect : function(type) {
        // (0) disconnected
        alert(type + " is disconnected");
        if (Main.player) {
            if (Main.player.getPlayerState() === YT.PlayerState.PLAYING) {
                Main.player.pauseVideo();
            }
        }
        node('#network_error_view').setAttribute('class', 'large');
        Main.networkError = 1;
    }
};

function setWatchCB(networks) {
    for (var i = 0; networks.length; i++) {
        if (networks[i].isActive()) {
            networks[i].setWatchListener(watchCB, errorCB);
        }
    }
};

function unsetWatchCB(networks) {
    for (var i = 0; networks.length; i++) {
        if (networks[i].isActive())
            networks[i].unsetWatchListener(watchCB, errorCB);
    }
};

function errorCB(error) {
    alert(error.message);
};