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
// var watchCB = {
//     onconnect : function (type) {
//         // (1) connected
//         alert(type + " is connected successfully");
//         if (Main.player) {
//             if (Main.player.getPlayerState() === YT.PlayerState.PAUSED) {
//                 Main.player.playVideo();
//             }
//         }
//         node('#network_error_view').setAttribute('class', 'hide');
//         Main.networkError = 0;
//     },

//     ondisconnect : function(type) {
//         // (0) disconnected
//         alert(type + " is disconnected");
//         if (Main.player) {
//             if (Main.player.getPlayerState() === YT.PlayerState.PLAYING) {
//                 Main.player.pauseVideo();
//             }
//         }
//         node('#network_error_view').setAttribute('class', 'large');
//         Main.networkError = 1;
//     }
// };

// function setWatchCB(networks) {
//     for (var i = 0; networks.length; i++) {
//         if (networks[i].isActive()) {
//             networks[i].setWatchListener(watchCB, errorCB);
//         }
//     }
// };

// function unsetWatchCB(networks) {
//     for (var i = 0; networks.length; i++) {
//         if (networks[i].isActive())
//             networks[i].unsetWatchListener(watchCB, errorCB);
//     }
// };

// function errorCB(error) {
//     alert(error.message);
// };

alert('====INIT SAMSUNG API====');

var networkPlugin = document.getElementById('pluginObjectNetwork');

var internetConnectionInterval = 5000; //this is just an example value that repeats the connection check every 500 milliseconds

function cyclicInternetConnectionCheck() {

    // alert('connection status:'+checkConnection());
  if(!checkConnection()){

    // no internet connection

    if (Main.player) {
        if (Main.player.getPlayerState() === YT.PlayerState.PLAYING) {
            Main.player.pauseVideo();
        }
    }
    node('#network_error_view').setAttribute('class', 'large');
    Main.networkError = 1;

  } else {

    // if error message was shown, it should be returned back to normal

    if (Main.player && Main.networkError === 1) {
        if (Main.player.getPlayerState() === YT.PlayerState.PAUSED) {
            Main.player.playVideo();
        }
        node('#network_error_view').setAttribute('class', 'hide');
        Main.networkError = 0;
    }

  }

}

setInterval(cyclicInternetConnectionCheck, internetConnectionInterval);

function checkConnection() {

  var gatewayStatus = 0,

  // Get active connection type - wired or wireless.

  currentInterface =networkPlugin.GetActiveType();

  // If no active connection.

  if (currentInterface === -1) {

    return false;

  }

  // Check Gateway connection of current interface.

  gatewayStatus = networkPlugin.CheckGateway(currentInterface);

  // If not connected or error.

  if (gatewayStatus !== 1) {

    return false;

  }

  // Everything went OK.

  return true;

}