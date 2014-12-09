/*global
    alert,
    console,
    document,
    clearInterval,
    clearTimeout,
    node,
    setTimeout,
    setInterval,
    Main,
    YT,
    toHHMMSS
*/
/**
 *
 * @authors Ted Shiu (ted_shiu@miiicasa.com)
 * @date    2014-04-02 18:22:20
 * @version $Id$
 */

// DOM
var welcomeUI = node('#welcome_view'),
    loadingMsgUI = node('#loading_msg'),
    videoListUI = node('#video_list'),
    videoListTitleUI = node('#video_list_channel_title'),
    infoBarUI = node('#info_bar'),
    playingTimeUI = node('#playTime'),
    playingTotalTimeUI = node('#totalTime'),
    progressTimeUI = node('#progress_time'),
    infoBarVideoTitleUI = node('#video_title'),
    channelInfoUI = node('#channel_info'),
    channelNameUI = node('#channel_title'),
    channelNumberUI = node('#channel_number'),
    channelListUI = node('#channel_list'),
    settingUI = node('#setting_view'),
    settingSyncedUsersUI = node('#users_view'),
    settingNoSyncUI = node('#default_view'),
    settingNoSyncInfoUI = node('#default_info'),
    settingUsersListUI = node('#users_list'),
    settingUsersListInfoUI = node('#users_info'),
    settingBindUI = node('#sync_view'),
    settingPingCodeUI = node('#gen_ping_code'),
    pingCodeUI = node('#ping_code'),
    syncOKUI = node('#sync_ok'),
    tosUI = node('#terms_view'),
    tosIframeUI = node('#terms_iframe'),
    menuUI = node('#menu'),
    noVideosUI = node('#no_videos_view'),
    videoErrorUI = node('#video_error_view'),
    removeVideosUI = node('#remove_videos_view'),
    networkErrorUI = node('#network_error_view'),
    // privateVideosUI = node('#private_videos_view'),
    exitUI = node('#exit_confirm'),
    settingGridL = document.querySelectorAll('#setting_grid span').length;

    document.querySelector('#video_list_area').style.width = (Main.row)*320 + 'px';

// time out or interval var
var menuTimeoutToHide,
    updateCurrentTimeInterval,
    infoBarTimeoutToHide,
    timeJumpsTimeoutToJump,
    skipSwitchVideo,
    skipChannelNum,
    skipBufferTimeout,
    skipLoop,
    skip3minPolling,
    switchChannelNum,
    skipSwitchChannel,
    polling;

function menuHide() {
    menuUI.setAttribute('class', 'hide');
    Main.menuOpen = 0;
}

function menuSetTimeoutToHide() {
    clearTimeout(menuTimeoutToHide);
    menuTimeoutToHide = setTimeout(menuHide, 5000);
}
Main.menuSetTimeoutToHide = menuSetTimeoutToHide;

function toggleInfoBar() {
    if (!Main.infoBarOpen && !Main.welcomeState && !Main.settingState) {
        Main.updateCurrentTime(Main.player.getCurrentTime());
        infoBarUI.setAttribute('class', 'info_bar');
        channelInfoUI.setAttribute('class', '');
        Main.infoBarOpen = 1;
        Main.infoBarSetTimeoutToHide();
    } else {
        infoBarUI.setAttribute('class', 'hide');
        channelInfoUI.setAttribute('class', 'hide');
        Main.infoBarOpen = 0;
        clearInterval(updateCurrentTimeInterval);
    }
}
Main.toggleInfoBar = toggleInfoBar;

function showInfoBar(time) {
    alert('showInfoBar');
    // alert(time);
    if (time === 'undefined') {
        time = Main.player.getCurrentTime();
    }
    clearInterval(updateCurrentTimeInterval);
    Main.updateCurrentTime(time);
    infoBarUI.setAttribute('class', 'info_bar');
    Main.infoBarOpen = 1;
    Main.infoBarSetTimeoutToHide();
}
Main.showInfoBar = showInfoBar;

function updateCurrentTime(time) {
    alert('updateCurrentTime:' + toHHMMSS(time));
    clearInterval(updateCurrentTimeInterval);
    if (toHHMMSS(time) === 'NaN:NaN:NaN' || Main.player.getPlayerState() === YT.PlayerState.UNSTARTED) {
        Main.resetPlayerTime();
    } else {
        playingTimeUI.innerHTML = toHHMMSS(time);
        progressTimeUI.style.width = (time / Main.player.getDuration()) * 100 + '%';
    }
    updateCurrentTimeInterval = setInterval(
        function () {
            var currentTime = parseInt(Main.player.getCurrentTime(), 10);
            if (isNaN(currentTime) || Main.player.getPlayerState() === YT.PlayerState.UNSTARTED) {
                Main.resetPlayerTime();
                return;
            }
            // alert('update current time:' + currentTime);
            playingTimeUI.innerHTML = toHHMMSS(currentTime);
            progressTimeUI.style.width = (currentTime / Main.player.getDuration()) * 100 + '%';
        },
        1000
    );
}
Main.updateCurrentTime = updateCurrentTime;

function resetPlayerTime() {
    playingTimeUI.innerHTML = '00:00:00';
    playingTotalTimeUI.innerHTML = '00:00:00';
    progressTimeUI.style.width = 0;
}
Main.resetPlayerTime = resetPlayerTime;

function infoBarSetTimeoutToHide() {
    clearTimeout(infoBarTimeoutToHide);
    infoBarTimeoutToHide = setTimeout(
        function () {
            infoBarUI.setAttribute('class', 'hide');
            channelInfoUI.setAttribute('class', 'hide');
            Main.infoBarOpen = 0;
            clearInterval(updateCurrentTimeInterval);
        },
        8000
    );
}
Main.infoBarSetTimeoutToHide = infoBarSetTimeoutToHide;

function toggleMenu() {
    if (!Main.menuOpen && !Main.welcomeState && !Main.settingState) {
        var date = new Date();
        if ((date.getTime() - Main.menuLastUpdateTime) > Main.menuUpdateTime) {
            Main.menuLastUpdateTime = date.getTime();
            if (Object.keys(Main.users).length === 0) {
                alert('getDefaultChannel update');
                Main.getDefaultChannel();
            } else {
                alert('getUserChannel update');
                Main.getUserChannel();
            }
        }
        menuUI.setAttribute('class', '');
        Main.menuOpen = 1;
        Main.menuSetTimeoutToHide();
    } else {
        menuHide();
    }
}
Main.toggleMenu = toggleMenu;

function timeJumps(status) {
    clearTimeout(timeJumpsTimeoutToJump);
    var seekToTime = Main.videoTotalTime/20;
    if (isNaN(seekToTime) ||
        typeof seekToTime === 'undefined' ||
        Main.player.getPlayerState() === YT.PlayerState.UNSTARTED ||
        !Main.videosList.length) {
        alert('cant get total time');
        return;
    }
    if (!Main.keyKeepDown) {
        Main.jumpTime = Main.player.getCurrentTime();
        if (typeof Main.jumpTime === 'undefined') {
            return;
        }
        alert('jump getCurrentTime: '+Main.jumpTime+', '+seekToTime);
    }
    if (Main.player.getPlayerState() === YT.PlayerState.PLAYING) {
        Main.player.pauseVideo();
    }
    Main.keyKeepDown = 1;
    switch(status) {
        case 'retreat':
            Main.jumpTime-= seekToTime;
            if (Main.jumpTime < 0) {
                Main.jumpTime = 0;
            }
        break;
        case 'advance':
            Main.jumpTime+= seekToTime;
            if (Main.jumpTime > Main.videoTotalTime) {
                Main.jumpTime = Main.videoTotalTime;
            }
        break;
        default:
        return;
    }
    alert('final time:'+toHHMMSS(Main.jumpTime));
    // show info bar
    Main.showInfoBar(Main.jumpTime);
    clearTimeout(skipBufferTimeout);
    skipBufferTimeout = setTimeout(Main.skipBuffer, Main.bufferTime);
    timeJumpsTimeoutToJump = setTimeout(function() {
        alert('jump');
        alert(toHHMMSS(Main.jumpTime));
        Main.player.seekTo(Main.jumpTime, true);
        Main.player.setPlaybackQuality('hd720');
        Main.player.playVideo();
        Main.keyKeepDown = 0;
    }, 900);
}
Main.timeJumps = timeJumps;

function skipBuffer() {
    alert('run skipBuffer');
    clearTimeout(skipBufferTimeout);
    if (Main.keyKeepDown === 1 || Main.player.getPlayerState() === YT.PlayerState.PLAYING || Main.player.getPlayerState() === YT.PlayerState.PAUSED) {
        return;
    }
    t = Main.player.getCurrentTime();
    alert('buffer getCurrentTime:'+t);
    if (t > 10) {
        alert('buffer reload');
        Main.player.stopVideo();
        Main.player.clearVideo();
        Main.player.loadVideoById(Main.videosList[Main.playCount].youtube_hash, Math.max(t, 0), 'hd720');
    }
}
Main.skipBuffer = skipBuffer;

function enterMoreChannel() {
    if (Main.player.getPlayerState() === YT.PlayerState.PLAYING || Main.player) {
        Main.player.pauseVideo();
    }
    // reset UI
    infoBarUI.setAttribute('class', 'hide');
    channelInfoUI.setAttribute('class', 'hide');
    Main.infoBarOpen = 0;
    viewClose(menuUI, 'menuOpen');

    Main.settingState = 1;
    if (Object.keys(Main.users).length === 0) {
        // if not user
        settingUI.setAttribute('class', 'hide');
        settingSyncedUsersUI.setAttribute('class', 'view');
        Main.usersListState = 1;
        settingNoSyncUI.setAttribute('class', '');
        settingNoSyncInfoUI.setAttribute('class', 'info');
        settingUsersListUI.setAttribute('class', 'hide');
        settingUsersListInfoUI.setAttribute('class', 'hide');
    } else if (!Main.welcomeState) {
        settingUI.setAttribute('class', 'view');
    }
}
Main.enterMoreChannel = enterMoreChannel;

function userInfo() {
    document.querySelector('#setting_1 img').setAttribute('src', Main.users[Main.currentUserUid].icon);
    document.querySelector('#setting_1 p').innerHTML = Main.users[Main.currentUserUid].name;
    document.querySelector('.menu_title img').setAttribute('src', Main.users[Main.currentUserUid].icon);
    document.querySelector('.menu_title span').innerHTML = Main.users[Main.currentUserUid].name + '的頻道列表';
}
Main.userInfo = userInfo;



// var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/appInfo.data');
// var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/users.data');
// check did

var fileDid = fileSystemObj.openCommonFile(curWidget.id + '/appInfo.data', 'r');
if (fileDid) {
    Main.appInfo = JSON.parse(fileDid.readAll());
    if (Main.appInfo == null) {
        Main.appInfo = {};
    }
    // Main.appInfo = {
    //      did: <string>,
    //      secretCode: <string>
    // };
    alert('appInfo:'+JSON.stringify(Main.appInfo));
}
fileSystemObj.closeCommonFile(fileDid);

// check uid
// var fileUid = fileSystemObj.openCommonFile(curWidget.id + '/users.data', 'r');
// if (fileUid) {
//      Main.users = JSON.parse(fileUid.readAll());
//      if (Main.users == null) {
//              Main.users = {};
//      }
//      alert('user'+JSON.stringify(Main.users));
// }
// fileSystemObj.closeCommonFile(fileUid);

// load last bind uid
var fileLastBindUid = fileSystemObj.openCommonFile(curWidget.id + '/lastBindUser.data', 'r');
if (fileLastBindUid) {
    Main.lastBindUser = JSON.parse(fileLastBindUid.readAll());
    if (Main.lastBindUser == null) {
        Main.lastBindUser = {};
    }
    alert('lastBindUser:'+JSON.stringify(Main.lastBindUser));
}
fileSystemObj.closeCommonFile(fileLastBindUid);

// load current uid
var fileCurrentUserUid = fileSystemObj.openCommonFile(curWidget.id + '/currentUser.data', 'r');
if (fileCurrentUserUid) {
    Main.currentUserUid = parseInt(fileCurrentUserUid.readAll(), 10);
    if (Main.currentUserUid == null || !Main.currentUserUid) {
        Main.currentUserUid = 0;
    }
    alert('currentUserUid:'+JSON.stringify(Main.currentUserUid));
}
fileSystemObj.closeCommonFile(fileCurrentUserUid);

// load users channel break log
var fileChannelsLog = fileSystemObj.openCommonFile(curWidget.id + '/usersChannelsLog.data', 'r');
if (fileChannelsLog) {
    Main.usersChannelsLog = JSON.parse(fileChannelsLog.readAll());
    if (Main.usersChannelsLog == null) {
        Main.usersChannelsLog = {};
    }
    alert('usersChannelsLog:'+JSON.stringify(Main.usersChannelsLog));
}
fileSystemObj.closeCommonFile(fileChannelsLog);

// load users exit channel
var fileCurrentChannelPid = fileSystemObj.openCommonFile(curWidget.id + '/currentChannelPid.data', 'r');
if (fileCurrentChannelPid) {
    Main.currentChannelPid = JSON.parse(fileCurrentChannelPid.readAll());
    if (Main.currentChannelPid == null) {
        Main.currentChannelPid = 0;
    }
    alert('currentChannelPid:'+JSON.stringify(Main.currentChannelPid));
}
fileSystemObj.closeCommonFile(fileCurrentChannelPid);

function channelBreakLog(status, pid) {
    switch(status) {
        case 'w':
            // write
            if (!Main.usersChannelsLog[Main.currentUserUid]) {
                Main.usersChannelsLog[Main.currentUserUid] = {};
            }
            if (!Main.videosList[Main.playCount]) {
                return;
            }
            if (!Main.usersChannelsLog[Main.currentUserUid][Main.videosList[Main.playCount].pid]) {
                Main.usersChannelsLog[Main.currentUserUid][Main.videosList[Main.playCount].pid] = {};
            }
            Main.usersChannelsLog[Main.currentUserUid][Main.videosList[Main.playCount].pid] = {
                breakVideo: Main.videosList[Main.playCount].youtube_hash,
                breakTime: Main.player.getCurrentTime()
            };
            console.log('logdata', Main.currentUserUid);
            console.log(Main.videosList[Main.playCount]);
            console.log('save data', Main.usersChannelsLog);
            var fileChannelsLog = fileSystemObj.openCommonFile(curWidget.id + '/usersChannelsLog.data', 'w');
            fileChannelsLog.writeAll(JSON.stringify(Main.usersChannelsLog));
            fileSystemObj.closeCommonFile(fileChannelsLog);
        break;
        case 'r':
            // read
            console.log('read log');
            if (!Main.usersChannelsLog[Main.currentUserUid]) {
                Main.videoBeginTime = 0;
                Main.playCount = 0;
                return;
            }
            if (!Main.usersChannelsLog[Main.currentUserUid][pid]) {
                Main.videoBeginTime = 0;
                Main.playCount = 0;
                return;
            }
            var currentChannel = Main.usersChannelsLog[Main.currentUserUid][pid];
            var youtubeHash = currentChannel.breakVideo;
            for (var i = 0; i < Main.videosList.length; i++) {
                if (Main.videosList[i].youtube_hash === youtubeHash) {
                    Main.playCount = i;
                    Main.videoBeginTime = currentChannel.breakTime;
                    break;
                } else {
                    Main.playCount = Main.videosList.length - 1;
                    Main.videoBeginTime = 0;
                }
            };
            console.log('playCount', Main.playCount);
            console.log(Main.videoBeginTime);
        break;
        default:
        return;
    }
}
Main.channelBreakLog = channelBreakLog;

function saveCurrentUser() {
    var fileCurrentUserUid = fileSystemObj.openCommonFile(curWidget.id + '/currentUser.data', 'w');
    if (fileCurrentUserUid) {
        fileCurrentUserUid.writeAll(Main.currentUserUid.toString());
    }
    fileSystemObj.closeCommonFile(fileCurrentUserUid);
}
Main.saveCurrentUser = saveCurrentUser;

function saveCurrentChannel() {
    var fileCurrentChannelPid = fileSystemObj.openCommonFile(curWidget.id + '/currentChannelPid.data', 'w');
    if (fileCurrentChannelPid) {
        fileCurrentChannelPid.writeAll(Main.currentChannelPid.toString());
    }
    fileSystemObj.closeCommonFile(fileCurrentChannelPid);
}
Main.saveCurrentChannel = saveCurrentChannel;

function errorHandleReRegApp() {
    var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/appInfo.data');
    Main.appInfo = {};
    // var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/users.data');
    Main.checkRegistration();
}
Main.errorHandleReRegApp = errorHandleReRegApp;

Main.onLoad = function()
{

    widgetAPI.sendReadyEvent();
    // set volume OSD(On Screen Display)
    window.onShow = Main.volumeOSD;

    try {
        webapis.network.getAvailableNetworks(setWatchCB, errorCB);
    } catch (error) {
        console.log(error.name);
    }

    // check registration app
    function checkRegistration() {
        if (!Main.appInfo || !Main.appInfo.did) {
            alert('0.reg');

            Main.welcomeState = 1;
            welcomeUI.setAttribute('class', 'view');

            /* get pre-share key not do */
            // JSONP.init({
            //              error: function(ex){
            //                      alert("Failed to load : " + ex.url);
            //                      console.log("Failed to load : " + ex.url);
            //              }
            //      });
            //      JSONP.get(
            //              '/tvservice2/reg/',
            //              {
            //              },
            //              function(data) {
            //                      get key(base64 decode)(privateKey)
            //              }
            //      );
            /* get pre-share key not do */


            // app info(partner, brand, model, lang) to server get did
            function regApp() {
                var regInfo = {
                    partner: 'Samsung',
                    brand: 'Samsung',
                    model: webapis.tv.info.getModel(),
                    // language: webapis.tv.info.getLanguage(),
                    language: 'zh-TW',
                    uniq_id: webapis.tv.info.getDeviceID()
                };
                var base64Key = window.btoa(JSON.stringify(regInfo));
                JSONP.init({
                    error: function(ex){
                        alert("Failed to load : " + ex.url);
                        console.log("Failed to load : " + ex.url);
                    }
                });
                JSONP.get(
                    Main.apiUrl + '/tvservice2/reg/tvsignup',
                    {
                        partner: 'Samsung',
                        brand: 'Samsung',
                        model: webapis.tv.info.getModel(),
                        // language: webapis.tv.info.getLanguage(),
                        language: 'zh-TW',
                        uniq_id: webapis.tv.info.getDeviceID(),
                        d: base64Key
                    },
                    function(data) {
                        if (data.status === 'fail') {
                            Main.regError++;
                            if (Main.regError >= 10) {
                                loadingMsgUI.innerHTML = '系統忙碌中請稍後再試';
                            } else {
                                regApp();
                            }
                            return;
                        }
                        // get did, secret code
                        alert('reg_data:'+JSON.stringify(data));
                        console.log('reg_data:', data);
                        var saveInfo = {
                            did: data.tv_data.did,
                            secretCode: data.tv_data.secret
                        };
                        Main.appInfo = saveInfo;
                        saveInfo = JSON.stringify(saveInfo);
                        // save did
                        var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/appInfo.data', 'w');
                        fileObj.writeAll(saveInfo);
                        fileSystemObj.closeCommonFile(fileObj);
                        // GA
                        _gaq.push(['_trackEvent', 'feature', 'binding_ok']);
                    }
                );
            }
            Main.regApp = regApp;
            regApp();
        } else {
            runApp();
        }
    }
    Main.checkRegistration = checkRegistration;
    checkRegistration();

    function runApp() {
        alert('1.runApp');
        alert('runAppinfo:'+JSON.stringify(Main.appInfo));
        alert('runUser:'+JSON.stringify(Main.users));

        loadingMsgUI.innerHTML = '載入使用者...';

        getAllProfileInfo();
        function getAllProfileInfo() {
            var url = Main.apiUrl + '/tvservice2/device/getAllProfileInfo';
            var sig = CryptoJS.HmacSHA1(url + 'did=' + Main.appInfo.did, Main.appInfo.secretCode);
            sig = window.btoa(sig.toString());
            var param = {
                did: Main.appInfo.did,
                sig: sig,
                source: 'tv',
            };
            Ajax.ajaxHandle(url, sig, param, 'getAllProfileInfo');
        }

        function getAllChannel() {
            var url = Main.apiUrl + '/tvservice2/device/getAllChannel';
            var sig = CryptoJS.HmacSHA1(url + 'did=' + Main.appInfo.did, Main.appInfo.secretCode);
            sig = window.btoa(sig.toString());
            var param = {
                did: Main.appInfo.did,
                sig: sig,
                source: 'tv',
            };
            Ajax.ajaxHandle(url, sig, param, 'getAllChannel');
        }
        Main.getAllChannel = getAllChannel;

        function unBindUser(uid) {
            alert('unBindUser');
            var url = Main.apiUrl + '/tvservice2/device/unbind';
            var sig = CryptoJS.HmacSHA1(url + 'did=' + Main.appInfo.did + '&uid=' + uid, Main.appInfo.secretCode);
            sig = window.btoa(sig.toString());
            var param = {
                did: Main.appInfo.did,
                uid: uid,
                sig: sig,
                source: 'tv',
            };
            Ajax.ajaxHandle(url, sig, param, 'unBindUser', uid);
        }
        Main.unBindUser = unBindUser;

        loadingMsgUI.innerHTML = '頻道更新中...';

        // bind user
        function bindUser(again) {
            alert('bindUser');

            // check user data
            clearInterval(skip3minPolling);
            again ? Main.renew = 1 : Main.renew = 0;
            // get pin code
            var url = Main.apiUrl + '/tvservice2/device/getTVPinCode';
            var sig = CryptoJS.HmacSHA1(url + 'did=' + Main.appInfo.did + '&renew=' + Main.renew, Main.appInfo.secretCode);
            sig = window.btoa(sig.toString());
            var param = {
                did: Main.appInfo.did,
                sig: sig,
                renew: Main.renew,
                source: 'tv'
            };
            Ajax.ajaxHandle(url, sig, param, 'bindUser');
            // polling
            polling = setInterval(
                function () {
                    alert('polling');
                    var sig = CryptoJS.HmacSHA1(url + 'did=' + Main.appInfo.did + '&renew=0', Main.appInfo.secretCode);
                    sig = window.btoa(sig.toString());
                    var param = {
                        did: Main.appInfo.did,
                        sig: sig,
                        renew: 0,
                        source: 'tv'
                    };
                    Ajax.ajaxHandle(url, sig, param, 'polling');
                },
                5000
            );

            skip3minPolling = setTimeout(function() {
                alert('after 3min clear polling');
                clearInterval(polling);
            }, 180000);
        }
        Main.bindUser = bindUser;


        // syncUserChannels(testdata);


        // get default channel
        function getDefaultChannel(status) {
            alert('3.getDefaultChannel');
            var url = Main.apiUrl + '/tvservice2/device/getDefaultChannel';
            var sig = CryptoJS.HmacSHA1(url + 'did=' + Main.appInfo.did, Main.appInfo.secretCode);
            sig = window.btoa(sig.toString());
            var param = {
                did: Main.appInfo.did,
                source: 'tv',
                sig: sig
            };
            Ajax.ajaxHandle(url, sig, param, 'getDefaultChannel', status);
        }
        Main.getDefaultChannel = getDefaultChannel;

        // get user channels
        function getUserChannel(status) {
            alert('getUserChannel');
            // http://www.miiitv.com/tvservice2/profile/getUserChannel?did=3f6c64cbc323c287&uid=27
            var url = Main.apiUrl + '/tvservice2/profile/getUserChannel';
            var sig = CryptoJS.HmacSHA1(url + 'did=' + Main.appInfo.did + '&uid=' + Main.users[Main.currentUserUid].uid, Main.appInfo.secretCode);
            sig = window.btoa(sig.toString());
            var param = {
                did: Main.appInfo.did,
                uid: Main.users[Main.currentUserUid].uid,
                sig: sig,
                source: 'tv'
            };
            Ajax.ajaxHandle(url, sig, param, 'getUserChannel', status);
        }
        Main.getUserChannel = getUserChannel;

        function loadVideos(pid, status, playingChannelCount) {
            alert('loadVideos');
            noVideosUI.setAttribute('class', 'hide');
            removeVideosUI.setAttribute('class', 'hide');
            videoErrorUI.setAttribute('class', 'hide');
            // privateVideosUI.setAttribute('class', 'hide');

            // save last channel log
            // if (status === 'play') {
            //     Main.channelBreakLog('w');
            // }
            var url = Main.apiUrl + '/tvservice2/profile/getChannelVideo';
            var sig = CryptoJS.HmacSHA1(url + 'did=' + Main.appInfo.did + '&pid=' + pid, Main.appInfo.secretCode);
            sig = window.btoa(sig.toString());
            var param = {
                did: Main.appInfo.did,
                pid: pid,
                source: 'tv',
                sig: sig
            };
            var otherParam = {
                pid: pid,
                status: status,
                playingChannelCount: playingChannelCount
            };
            Ajax.ajaxHandle(url, sig, param, 'loadVideos', otherParam);
        }
        Main.loadVideos = loadVideos;

        function loadPlayer(sort) {
            alert('loadplayer');
            var matchChannel = false;
            // check save current channel exist and update playingChannelCount
            for (x in Main.usersChannelLists[Main.currentUserUid]) {
                if (Main.currentChannelPid.toString() === Main.usersChannelLists[Main.currentUserUid][x].pid) {
                    Main.playingChannelCount = Main.usersChannelsNumber.indexOf(x.toString());
                    matchChannel = true;
                    break;
                }
            }
            if (!matchChannel) {
                Main.currentChannelPid = 0;
            }
            console.log(Main.currentChannelPid);
            // Main.playingChannelCount = Main.usersChannelsNumber.indexOf(Main.currentChannelPid.toString());
            if (Main.currentChannelPid === 0) {
                Main.currentChannelPid = document.querySelector('.menu_focus').childNodes[2].innerHTML;
                Main.playingChannelCount = 0;
            }
            Main.loadVideos(Main.currentChannelPid, 'build', Main.playingChannelCount);
            Main.channelBreakLog('r', Main.currentChannelPid);

            function buildPlayer() {
                if (document.querySelector('#player')) {
                    initPlayer();
                }
            }
            Main.buildPlayer = buildPlayer;

            function initPlayer() {
                alert('initPlayer');
                var player;
                function playChannel(count) {
                    // init player
                    player = new YT.Player('player', {
                        width: Main.playerWidth,
                        height: Main.playerHeight,
                        videoId: '',
                        playerVars: {
                            rel: 1,
                            autoplay: 0,
                            disablekb: 0,
                            showsearch: 0,
                            showinfo: 0,
                            controls: 0,
                            autohide: 0,
                            modestbranding: 0,
                            wmode: 'opaque',
                            hd: 1,
                            html5: 1,
                            iv_load_policy: 3
                        },
                        events: {
                            'onReady'        : onPlayerReady,
                            'onStateChange'  : onPlayerStateChange,
                            'onError'        : onError
                        }
                    });
                    Main.player = player;

                    // play video
                    function onPlayerReady() {
                        alert('player ready');
                        // remove loader view
                        document.querySelector('#loader_view').setAttribute('class', 'hide');
                        document.querySelector('#loading').setAttribute('class', '');
                        Main.loadState = 0;
                        // show menu & infobar
                        if (Main.videosList.length) {
                            infoBarVideoTitleUI.innerHTML = Main.videosList[Main.playCount].title;
                        }
                        Main.toggleMenu();
                        setTimeout(function() {
                            Main.toggleInfoBar();
                        }, 1000);
                        // check video in channel
                        if (Main.videosList.length !== 0) {
                            alert('play video');
                            Main.player.loadVideoById(Main.videosList[Main.playCount].youtube_hash, Main.videoBeginTime, 'hd720');
                        }
                    }
                }

                function onPlayerStateChange(event) {
                    alert('onPlayerStateChange:'+ event.data);
                    switch(event.data) {
                        case YT.PlayerState.ENDED:
                            playLoop();
                            break;

                        case YT.PlayerState.PLAYING:
                        case YT.PlayerState.PAUSED:
                            playingTotalTimeUI.innerHTML = toHHMMSS(player.getDuration());
                            Main.videoTotalTime = player.getDuration();
                            clearTimeout(skipBufferTimeout);
                            if (Main.videoListState || Main.settingState) {
                                player.pauseVideo();
                            }
                            break;

                        case YT.PlayerState.BUFFERING:
                            alert('BUFFER');
                            // if (typeof skipBufferTimeout !== 'undefined') {
                            //     return;
                            // }
                            skipBufferTimeout = setTimeout(Main.skipBuffer, Main.bufferTime);
                            break;

                        default:
                            alert(event.data);
                            break;
                    }
                }

                function onError(e) {
                    alert('ERROR'+e);
                    console.log('ERROR', e);
                    if(e.data === 5) {
                        Main.clearsPlaying();
                        player.destroy();
                        Main.playCount++;
                        if (Main.playCount > (Main.videosList.length -1)) {
                            Main.playCount = 0;
                        }
                        infoBarVideoTitleUI.innerHTML = Main.videosList[Main.playCount].title;
                        setTimeout(function() {
                            playChannel(Main.playCount);
                        }, 3000);
                        return;
                    }
                    setTimeout(playLoop, 3000);
                }


                function clearsPlaying() {
                    alert('clearsPlaying');
                    Main.player.stopVideo();
                    Main.player.clearVideo();
                }
                Main.clearsPlaying = clearsPlaying;

                function playLoop() {
                    alert('play loop');
                    progressTimeUI.style.width = 0;
                    Main.playCount++;
                    if (Main.playCount > (Main.videosList.length -1)) {
                        Main.playCount = 0;
                    }
                    Main.clearsPlaying();
                    infoBarVideoTitleUI.innerHTML = Main.videosList[Main.playCount].title;
                    Main.showInfoBar();
                    player.loadVideoById(Main.videosList[Main.playCount].youtube_hash, 0, 'hd720');
                    // player.playVideo();
                }
                Main.playLoop = playLoop;

                function switchVideo(switching) {
                    alert('switchVideo');
                    videoErrorUI.setAttribute('class', 'hide');
                    clearTimeout(skipSwitchVideo);
                    switch(switching) {
                        case 0:
                        Main.playCount--;
                        if (Main.playCount < 0) {
                            Main.playCount = Main.videosList.length -1;
                        }
                        break;
                        case 1:
                        Main.playCount++;
                        if (Main.playCount > (Main.videosList.length -1)) {
                            Main.playCount = 0;
                        }
                        break;
                    }
                    infoBarVideoTitleUI.innerHTML = Main.videosList[Main.playCount].title;
                    progressTimeUI.style.width = 0;
                    Main.showInfoBar();
                    skipSwitchVideo = setTimeout(
                        function () {
                            alert('play switch video');
                            Main.clearsPlaying();
                            player.loadVideoById(Main.videosList[Main.playCount].youtube_hash, 0, 'hd720');
                        },
                        900
                    );
                }
                Main.switchVideo = switchVideo;

                function switchChannel(switching) {
                    alert('switchChannel');
                    clearTimeout(skipSwitchChannel);
                    noVideosUI.setAttribute('class', 'hide');
                    removeVideosUI.setAttribute('class', 'hide');
                    videoErrorUI.setAttribute('class', 'hide');
                    // privateVideosUI.setAttribute('class', 'hide');
                    switch(switching) {
                        case 'down':
                        Main.playingChannelCount--;
                        if (Main.playingChannelCount < 0) {
                            Main.playingChannelCount = Main.usersChannelsNumber.length -1;
                        }
                        break;
                        case 'up':
                        Main.playingChannelCount++;
                        if (Main.playingChannelCount > (Main.usersChannelsNumber.length -1)) {
                            Main.playingChannelCount = 0;
                        }
                        break;
                    }
                    channelInfoUI.setAttribute('class', '');
                    channelNumberUI.innerHTML = Main.usersChannelsNumber[Main.playingChannelCount];
                    channelNameUI.innerHTML = Main.usersChannelLists[Main.currentUserUid][Main.usersChannelsNumber[Main.playingChannelCount]].title;
                    // viewOpen(channelInfoUI, 'infoBarOpen');
                    skipSwitchChannel = setTimeout(
                        function () {
                            alert('play channel video');
                            var pid = Main.usersChannelLists[Main.currentUserUid][Main.usersChannelsNumber[Main.playingChannelCount]].pid;
                            Main.clearsPlaying();
                            Main.loadVideos(pid, 'play', Main.playingChannelCount);
                        },
                        1500
                    );
                }
                Main.switchChannel = switchChannel;

                function onYouTubeIframeAPIReady() {
                    playChannel();
                }

                setTimeout(function() {
                    onYouTubeIframeAPIReady();
                }, 1200);
            }
        }
        Main.loadPlayer = loadPlayer;

        /**
         * Handle menu control up & down
         * @param  {'up', 'down'} status [control up & down]
         */
        function channelSelect(status) {
        var menuList = document.querySelectorAll('.channel_list li');
            if (menuList[Main.menuCount]) {
                menuList[Main.menuCount].setAttribute('class', '');
            }
            switch(status) {
                case 'up':
                    Main.menuCount--;
                    Main.channelsCount--;
                    if (Main.menuCount < 0) {
                        Main.menuCount = 0;
                        if (Main.channelsCount >= 0) {
                            var view = document.createElement('ul');
                            for (var i = Main.channelsCount; i < Main.channelsCount + Main.menuChannelsVRendered; i++) {
                                if (i === Main.tmpUsersChannels[Main.viewMenuChannelsUid].length) {
                                    break;
                                }
                                var viewList = Main.tmpUsersChannels[Main.viewMenuChannelsUid][i];
                                view.appendChild(viewList);
                            }
                            document.querySelector('.channel_list').innerHTML = view.innerHTML;
                        } else {
                            Main.channelsCount = 0;
                        }
                    }
                break;
                case 'down':
                    Main.menuCount++;
                    Main.channelsCount++;
                    if (Main.menuCount > Main.menuView - 1) {
                        Main.menuCount = Main.menuView - 1;
                        if (Main.channelsCount < Main.tmpUsersChannels[Main.viewMenuChannelsUid].length) {
                            var view = document.createElement('ul');
                            for (var i = Main.channelsCount - 6; i < Main.channelsCount + 2; i++) {
                                if (i === Main.tmpUsersChannels[Main.viewMenuChannelsUid].length) {
                                    break;
                                }
                                var viewList = Main.tmpUsersChannels[Main.viewMenuChannelsUid][i];
                                view.appendChild(viewList);
                            }
                            document.querySelector('.channel_list').innerHTML = view.innerHTML;
                        } else {
                            Main.channelsCount = Main.tmpUsersChannels[Main.viewMenuChannelsUid].length - 1;
                        }
                    }
                break;
                case 'pgUp':
                    if (Main.channelsCount >= Main.tmpUsersChannels[Main.viewMenuChannelsUid].length - 1) {
                        Main.channelsCount = Main.tmpUsersChannels[Main.viewMenuChannelsUid].length - (2*Main.menuView);
                    } else {
                        Main.channelsCount-= Main.menuView;
                        if (Main.channelsCount < 0) {
                            Main.channelsCount = 0;
                            Main.menuCount = 0;
                        }
                    }
                    var view = document.createElement('ul');
                    for (var i = Main.channelsCount; i < Main.channelsCount + Main.menuView; i++) {
                        var viewList = Main.tmpUsersChannels[Main.viewMenuChannelsUid][i];
                        view.appendChild(viewList);
                    }
                    document.querySelector('.channel_list').innerHTML = view.innerHTML;
                break;
                case 'pgDn':
                    Main.channelsCount+= Main.menuView;
                    if ((Main.channelsCount + Main.menuView) > Main.tmpUsersChannels[Main.viewMenuChannelsUid].length - 1) {
                        var l = Main.tmpUsersChannels[Main.viewMenuChannelsUid].length;
                        Main.channelsCount = l - 1;
                        Main.menuCount = Main.menuView - 1;
                        var view = document.createElement('ul');
                        for (var i = l - Main.menuView; i < l; i++) {
                            var viewList = Main.tmpUsersChannels[Main.viewMenuChannelsUid][i];
                            view.appendChild(viewList);
                        }
                    } else {
                        var view = document.createElement('ul');
                        for (var i = Main.channelsCount; i < Main.channelsCount + Main.menuView; i++) {
                            var viewList = Main.tmpUsersChannels[Main.viewMenuChannelsUid][i];
                            view.appendChild(viewList);
                        }
                    }
                    document.querySelector('.channel_list').innerHTML = view.innerHTML;
                break;
                default:
                    Main.menuCount = 0;
                }
                document.querySelectorAll('.channel_list li')[Main.menuCount].setAttribute('class', 'menu_focus');
            }
            Main.channelSelect = channelSelect;

        function usersChannelsListSelect(status) {
            if (status === 'right') {
                Main.usersChannelsCount++;
                if (Main.usersChannelsCount > Main.usersList.length - 1) {
                    Main.usersChannelsCount = 0;
                }
            } else {
                Main.usersChannelsCount--;
                if (Main.usersChannelsCount < 0) {
                    Main.usersChannelsCount = Main.usersList.length - 1;
                }
            }
            var viewUserChannels = parseInt(Main.usersList[Main.usersChannelsCount], 10);
            Main.viewMenuChannelsUid = viewUserChannels;
            document.querySelector('.menu_title img').setAttribute('src', Main.users[viewUserChannels].icon);
            document.querySelector('.menu_title span').innerHTML = Main.users[viewUserChannels].name + '的頻道列表';

            document.querySelector('.channel_list').innerHTML = '';
            var channelListView = document.createElement('ul');
            if (Main.channelsCount > Main.tmpUsersChannels[viewUserChannels].length - Main.menuView) {
                for (var i = Main.tmpUsersChannels[viewUserChannels].length - Main.menuView; i < Main.tmpUsersChannels[viewUserChannels].length; i++) {
                    var viewList = Main.tmpUsersChannels[viewUserChannels][i];
                    channelListView.appendChild(viewList);
                }
                Main.channelsCount = Main.tmpUsersChannels[viewUserChannels].length - 1;
            } else {
                for (var i = Main.channelsCount - Main.menuCount; i < Main.channelsCount - Main.menuCount + Main.menuChannelsVRendered; i++) {
                    var viewList = Main.tmpUsersChannels[viewUserChannels][i];
                    channelListView.appendChild(viewList);
                }
            }
            channelListView.querySelectorAll('li')[Main.menuCount].setAttribute('class', 'menu_focus');
            document.querySelector('.channel_list').innerHTML = channelListView.innerHTML;
            channelListView.querySelectorAll('li')[Main.menuCount].setAttribute('class', '');
        }
        Main.usersChannelsListSelect = usersChannelsListSelect;

        function usersListSelect(status) {
            var usersList = document.querySelectorAll('#bind_users li'),
                l = usersList.length,
                listHeight = 97,
                listView = 3;
            if (usersList[Main.usersListCount]) {
                usersList[Main.usersListCount].setAttribute('class', '');
            }
            switch(status) {
                case 'up':
                    Main.usersListCount--;
                    if (Main.usersListCount < 0) {
                        // Main.usersListCount = l - 1;
                        Main.usersListCount = 0;
                    }
                    var h = Main.usersListCount*listHeight,
                        top = document.querySelector('#bind_users').style.top;
                    top = Math.abs(parseInt(top.slice(0, top.length - 2), 10));
                    if (h === (top - listHeight)) {
                        document.querySelector('#bind_users').style.top = '-' + (top - listHeight) + 'px';
                    }
                    if (Main.usersListCount === (l -1)) {
                        document.querySelector('#bind_users').style.top = '-' + (l - 1)*listHeight + 'px';
                    }
                break;
                case 'down':
                    Main.usersListCount++;
                    if (Main.usersListCount > l - 1) {
                        // Main.usersListCount = 0;
                        Main.usersListCount-= 1;
                    }
                    var h = Main.usersListCount*listHeight,
                        top = document.querySelector('#bind_users').style.top;
                    top = Math.abs(parseInt(top.slice(0, top.length - 2), 10));
                    if (!top) {
                        top = 0;
                    }
                    if ((h - top) === listHeight*listView) {
                        document.querySelector('#bind_users').style.top = '-' + listHeight*(Main.usersListCount - (listView - 1)) + 'px';
                    }
                break;
                default:
                    Main.usersListCount = 0;
            }
            usersList[Main.usersListCount].setAttribute('class', 'users_list_focus');
        }
        Main.usersListSelect = usersListSelect;

        /**
         * video list move to select video
         * @param  {number} lastFocus    [last(before move) video focus]
         * @param  {number} currentFocus [now(after move) video focus]
         */
        function videoSelect(lastFocus, currentFocus, status) {
            if (lastFocus === currentFocus || !document.querySelectorAll('.cell')) {
               return;
            }
            document.querySelector('#video_' + lastFocus).setAttribute('class', 'cell');
            document.querySelector('#video_' + currentFocus).setAttribute('class', 'cell list_focus');
            console.error(Main.row*(Main.col - 1));
            if (status === 'retreat') {
                if (((Main.videoListTop)/180)*Main.col >= Main.currentFocus) {
                    Main.videoListTop = Main.videoListTop - 180;
                }
                if (Main.col >= Main.currentFocus) {
                    Main.videoListTop = 0;
                }
                document.querySelector('#video_list_bg').style.top = '-' + Main.videoListTop + 'px';
            }
            if (status === 'advance') {
                if (Main.currentFocus > (((Main.videoListTop)/180)*Main.col + Main.row*(Main.col - 1))) {
                    Main.videoListTop = Math.ceil((Main.currentFocus - Main.row*(Main.col - 1))/Main.row)*180;
                    document.querySelector('#video_list_bg').style.top = '-' + Main.videoListTop + 'px';
                }
            }
            if (status === 'pageup') {
                if (((Main.videoListTop)/180)*Main.col >= Main.currentFocus) {
                    Main.videoListTop = Main.videoListTop - 180*(Math.ceil(Main.col/2));
                }
                if (Main.col >= Main.currentFocus) {
                    Main.videoListTop = 0;
                }
                document.querySelector('#video_list_bg').style.top = '-' + Main.videoListTop + 'px';
            }
        }
        Main.videoSelect = videoSelect;

        /**
         * use number switch channel
         * @param {number} num [reomte control number]
         */
        function NumSwitchChannel(num) {
            if (Main.networkError) {
                return;
            }
            if (!Main.settingState && !Main.exitState) {
                alert('NumSwitchChannel');
                channelInfoUI.setAttribute('class', '');
                clearTimeout(switchChannelNum);
                clearTimeout(skipChannelNum);
                if (Main.numberCount === 0) {
                    channelNumberUI.innerHTML = '';
                    channelNameUI.innerHTML = '';
                    Main.numberCount++;
                }
                if (channelNumberUI.innerHTML.length < 3) {
                    channelNumberUI.insertAdjacentHTML('beforeend', num);
                    switchChannelNum = setTimeout(function() {
                        // update playingChannelCount for switch channel up & down
                        Main.playingChannelCount = Main.usersChannelsNumber.indexOf(channelNumberUI.innerHTML);
                        channelNameUI.innerHTML = Main.usersChannelLists[Main.currentUserUid][channelNumberUI.innerHTML].title;
                        Main.channelBreakLog('w');
                        Main.clearsPlaying();
                        loadVideos(Main.usersChannelLists[Main.currentUserUid][channelNumberUI.innerHTML].pid, 'play', Main.playingChannelCount);
                        videoListUI.setAttribute('class', 'hide');
                        Main.videoListState = 0;
                    }, 1200);
                }
                skipChannelNum = setTimeout(function() {
                    Main.numberCount = 0;
                    Main.infoBarSetTimeoutToHide();
                    channelNumberUI.innerHTML = Main.playingChannel.number;
                    channelNameUI.innerHTML = Main.playingChannel.title || Main.usersChannelLists[Main.currentUserUid][channelNumberUI.innerHTML].title;
                }, 3000);
            }
        }
        Main.NumSwitchChannel = NumSwitchChannel;
    }
    Main.runApp = runApp;

};

Main.volumeOSD=function()
{
    var NNaviPlugin = document.getElementById("pluginObjectNNavi");
    pluginAPI.SetBannerState(1);
    NNaviPlugin.SetBannerState(2);
    pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
    pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
    pluginAPI.unregistKey(tvKey.KEY_MUTE);
    pluginAPI.unregistKey(262);
    pluginAPI.unregistKey(147);
    pluginAPI.unregistKey(45);
    pluginAPI.unregistKey(261);
}

Main.onUnload = function()
{
    alert('onUnload');
    // save playing log
    Main.channelBreakLog('w');
    Main.saveCurrentChannel();
    Main.clearsPlaying();
    try {
        webapis.network.getAvailableNetworks(unsetWatchCB, errorCB);
    } catch (error) {
        console.log(error.name);
    }
};

window.onkeydown = keyboardControl

function keyboardControl(e) {
    // e.preventDefault();
    switch(e.keyCode) {
        case 27:
        case 88:
        case 8:
            alert("RETURN");
            if (!Main.loadState) {
                // widgetAPI.blockNavigation(event);
                alert('settingState:'+Main.settingState);
                alert('videoListView:'+Main.videoListView);
                if (Main.networkError) {
                    return;
                }
                if (!Main.settingState) {
                    e.preventDefault();
                    if (Main.videoListState) {
                        alert('videoList return');
                        // video list
                        viewClose(videoListUI, 'videoListState');
                        Main.videoListView = 0;
                            if (Main.videosList.length !== 0) {
                                Main.player.playVideo();
                            }
                    } else if (Main.menuOpen) {
                        alert('menu return');
                        viewClose(menuUI, 'menuOpen');
                    } else if(Main.exitState) {
                        viewClose(exitUI, 'exitState');
                        Main.exitFocus = 1;
                        document.querySelector('#exit_1').setAttribute('class', 'exit_focus');
                        document.querySelector('#exit_2').setAttribute('class', '');
                    } else {
                        alert('app return');
                        viewOpen(exitUI, 'exitState');
                    }
                } else {
                    e.preventDefault();
                    alert('setting return');
                    if (Object.keys(Main.users).length === 0) {
                        if (Main.usersListState) {
                            viewClose(settingSyncedUsersUI, 'usersListState');
                            settingNoSyncUI.setAttribute('class', 'hide');
                            if (Main.videoListView) {
                                // return videolist
                                alert('setting return videoList(no user)');
                                viewClose(settingUI, 'settingState');
                                Main.videoListState = 1;
                            } else {
                                alert('userList return(no user)');
                                Main.settingState = 0;
                                if (Main.videosList.length !== 0) {
                                    Main.player.playVideo();
                                }
                            }
                        }
                        if (Main.termsState) {
                            settingUI.setAttribute('class', 'view');
                            viewClose(tosUI, 'termsState');
                            Main.scrollCount = 0;
                            document.querySelector('#terms_iframe').scrollTop = 0;
                        }
                        if (Main.syncUserState) {
                            // for not user sync default view
                            clearInterval(polling);
                            pingCodeUI.innerHTML = 'Loading...';
                            settingPingCodeUI.setAttribute('class', 'hide');
                            viewClose(settingBindUI, 'syncUserState');
                            viewOpen(settingSyncedUsersUI, 'usersListState', 'view');
                        } else {
                            viewClose(settingUI, 'settingState');
                            if (Main.videosList.length !== 0) {
                                Main.player.playVideo();
                            }
                        }
                    } else {
                        if (Main.unBindConfirm) {
                            document.querySelector('.users_list_focus .cancel_binding').setAttribute('class', 'cancel_binding');
                            document.querySelector('.users_list_focus .unbind_confirm').setAttribute('class', 'unbind_confirm hide');
                            Main.unBindConfirm = 0;
                            document.querySelector('.unbind_1').setAttribute('class', 'unbind_1 unbind_focus');
                            document.querySelector('.unbind_2').setAttribute('class', 'unbind_2');
                            Main.unBindFocus = 1;
                        }
                        if (Main.usersListState) {
                            document.querySelector('.users_list_focus .unbind_1').setAttribute('class', 'unbind_1 unbind_focus');
                            document.querySelector('.users_list_focus .unbind_2').setAttribute('class', 'unbind_2');
                            Main.unBindFocus = 1;
                            document.querySelectorAll('#bind_users li')[Main.usersListCount].setAttribute('class', '');
                            Main.usersListCount = 0;
                            document.querySelectorAll('#bind_users li')[Main.usersListCount].setAttribute('class', 'users_list_focus');
                            document.querySelector('#bind_users').style.top = 0;
                            settingUI.setAttribute('class', 'view');
                            viewClose(settingSyncedUsersUI, 'usersListState');
                            settingPingCodeUI.setAttribute('class', 'hide');
                            clearInterval(polling);
                        } else if (Main.syncUserState) {
                            settingUI.setAttribute('class', 'view');
                            viewClose(settingBindUI, 'syncUserState');
                            settingPingCodeUI.setAttribute('class', 'hide');
                            clearInterval(polling);
                            pingCodeUI.innerHTML = 'Loading...';
                        } else if (Main.termsState) {
                            settingUI.setAttribute('class', 'view');
                            viewClose(tosUI, 'termsState');
                            Main.scrollCount = 0;
                            document.querySelector('#terms_iframe').scrollTop = 0;
                        } else if (Main.videoListView) {
                            // return videolist
                            settingNoSyncUI.setAttribute('class', 'hide');
                            viewClose(settingSyncedUsersUI, 'usersListState');
                            viewClose(settingUI, 'settingState');
                            Main.videoListState = 1;
                        } else {
                            // setting back player
                            alert('setting back player');
                            viewClose(settingUI, 'settingState');
                            if (Main.videosList.length !== 0) {
                                Main.player.playVideo();
                            }
                        }
                    }

                }
            } else {
                widgetAPI.blockNavigation(event);
            }
        break;
        case 80:
            alert('POWER');
            widgetAPI.blockNavigation(event);
            Main.channelBreakLog('w');
            Main.saveCurrentChannel();
            Main.clearsPlaying();
            widgetAPI.sendReturnEvent();
        break;
        case 37:
            alert("LEFT");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState) {
                if (!Main.settingState && !Main.exitState) {
                    if (Main.menuOpen) {
                        // switch user channel menu
                        if (Object.keys(Main.users).length) {
                            Main.usersChannelsListSelect('left');
                        }
                        Main.menuSetTimeoutToHide();
                    } else if (Main.videoListState && !Main.menuOpen) {
                        if (Main.currentFocus !== 1) {
                            Main.lastFocus = Main.currentFocus;
                            Main.currentFocus -= 1;
                            // Main.videoSelect(Main.lastFocus, Main.currentFocus);
                            Main.videoSelect(Main.lastFocus, Main.currentFocus, 'retreat');
                        }
                    } else {
                        Main.timeJumps('retreat');
                    }
                } else {
                    if (Main.termsState) {
                    } else if (Main.usersListState) {
                    } else if (Main.syncUserState) {
                    } else {
                        alert('setting control');
                        document.querySelector('#setting_' + Main.settingFocus).setAttribute('class', '');
                        Main.settingFocus--;
                        if (Main.settingFocus <= 0) {
                            Main.settingFocus = settingGridL;
                        }
                        document.querySelector('#setting_' + Main.settingFocus).setAttribute('class', 'setting_focus');
                    }

                }
            }
            if (Main.unBindConfirm) {
                document.querySelector('.users_list_focus .unbind_' + Main.unBindFocus + '').setAttribute('class', 'unbind_' + Main.unBindFocus + '');
                Main.unBindFocus--;
                if (Main.unBindFocus === 0) {
                    Main.unBindFocus = 1;
                }
                document.querySelector('.users_list_focus .unbind_' + Main.unBindFocus + '').setAttribute('class', 'unbind_' + Main.unBindFocus + ' unbind_focus');
            }
            if (Main.exitState) {
                document.querySelector('#exit_' + Main.exitFocus).setAttribute('class', '');
                Main.exitFocus--;
                if (Main.exitFocus === 0) {
                    Main.exitFocus = 1;
                }
                document.querySelector('#exit_' + Main.exitFocus).setAttribute('class', 'exit_focus');
            }
        break;
        case 39:
            alert("RIGHT");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState) {
                if (!Main.settingState && !Main.exitState) {
                    if (Main.menuOpen) {
                        // switch user channel menu
                        if (Object.keys(Main.users).length) {
                            Main.usersChannelsListSelect('right');
                        }
                        Main.menuSetTimeoutToHide();
                    } else if (Main.videoListState && !Main.menuOpen) {
                        var l = document.querySelectorAll('.cell').length;
                        Main.lastFocus = Main.currentFocus;
                        Main.currentFocus += 1;
                        Main.currentFocus = Math.min(l, Main.currentFocus);
                        // Main.videoSelect(Main.lastFocus, Main.currentFocus);
                        Main.videoSelect(Main.lastFocus, Main.currentFocus, 'advance');
                    } else {
                        Main.timeJumps('advance');
                    }
                } else {
                    if (Main.termsState) {
                    } else if (Main.usersListState) {
                    } else if (Main.syncUserState) {
                    } else {
                        alert('setting control');
                        document.querySelector('#setting_' + Main.settingFocus).setAttribute('class', '');
                        Main.settingFocus++;
                        if (Main.settingFocus > settingGridL) {
                            Main.settingFocus = 1;
                        }
                        document.querySelector('#setting_' + Main.settingFocus).setAttribute('class', 'setting_focus');
                    }
                }
            }
            if (Main.unBindConfirm) {
                document.querySelector('.users_list_focus .unbind_' + Main.unBindFocus + '').setAttribute('class', 'unbind_' + Main.unBindFocus + '');
                Main.unBindFocus++;
                if (Main.unBindFocus > 2) {
                    Main.unBindFocus = 2;
                }
                document.querySelector('.users_list_focus .unbind_' + Main.unBindFocus + '').setAttribute('class', 'unbind_' + Main.unBindFocus + ' unbind_focus');
            }
            if (Main.exitState) {
                document.querySelector('#exit_' + Main.exitFocus).setAttribute('class', '');
                Main.exitFocus++;
                if (Main.exitFocus > 2) {
                    Main.exitFocus = 2;
                }
                document.querySelector('#exit_' + Main.exitFocus).setAttribute('class', 'exit_focus');
            }
        break;
        case 38:
            alert("UP");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState) {
                if (!Main.settingState && !Main.exitState) {
                    if (Main.menuOpen) {
                        Main.channelSelect('up');
                        Main.menuSetTimeoutToHide();
                    } else if (Main.videoListState) {
                        if (Main.currentFocus > Main.row) {
                            Main.lastFocus = Main.currentFocus;
                            Main.currentFocus -= Main.row;
                            // Main.videoSelect(Main.lastFocus, Main.currentFocus);
                            Main.videoSelect(Main.lastFocus, Main.currentFocus, 'retreat');
                        } else {
                            Main.lastFocus = Main.currentFocus;
                            Main.currentFocus = 1;
                            Main.videoSelect(Main.lastFocus, Main.currentFocus, 'retreat');
                        }
                    } else {
                        if (Main.videosList.length !== 0) {
                            if (Main.player.getCurrentTime() !== 0) {
                                Main.switchVideo(0);
                            }
                        }
                    }
                } else {
                    if (Object.keys(Main.users).length && Main.usersListState && !Main.unBindConfirm) {
                        Main.usersListSelect('up');
                    }
                    if (Main.termsState) {
                        Main.scrollCount--;
                        if (Main.scrollCount < 0) {
                            Main.scrollCount = 0;
                        }
                        document.querySelector('#terms_iframe').scrollTop = 300*Main.scrollCount;
                    }
                }
            }
        break;
        case 40:
            alert("DOWN");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState) {
                if (!Main.settingState && !Main.exitState) {
                    if (Main.menuOpen) {
                        Main.channelSelect('down');
                        Main.menuSetTimeoutToHide();
                    } else if (Main.videoListState) {
                        var l = document.querySelectorAll('.cell').length;
                        Main.lastFocus = Main.currentFocus;
                        Main.currentFocus += Main.row;
                        // if (Main.currentFocus > l) {
                            // Main.currentFocus -= Main.row;
                        // } else {
                            Main.currentFocus = Math.min(l, Main.currentFocus);
                        // }
                        // Main.videoSelect(Main.lastFocus, Main.currentFocus);
                        Main.videoSelect(Main.lastFocus, Main.currentFocus, 'advance');
                    } else {
                        if (Main.videosList.length !== 0) {
                            if (Main.player.getCurrentTime() !== 0) {
                                Main.switchVideo(1);
                            }
                        }
                    }
                } else {
                    if (Object.keys(Main.users).length && Main.usersListState && !Main.unBindConfirm) {
                        Main.usersListSelect('down');
                    }
                    if (Main.termsState) {
                        Main.scrollCount++;
                        if (Main.scrollCount > 11) {
                            Main.scrollCount = 10;
                        }
                        document.querySelector('#terms_iframe').scrollTop = 300*Main.scrollCount;
                    }
                }
            }
        break;
        case 13:
            alert("ENTER");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState) {
                if (!Main.settingState) {
                    if (Main.menuOpen) {
                        if (!document.querySelector('.menu_focus').childNodes[2]) {
                            Main.enterMoreChannel();
                            return;
                        }
                        Main.channelBreakLog('w');
                        // play channel
                        var pid = document.querySelector('.menu_focus').childNodes[2].innerHTML;
                        var num = document.querySelector('.menu_focus').childNodes[1].childNodes[1].innerHTML.slice(3);
                        Main.currentUserUid = Main.viewMenuChannelsUid;
                        Main.usersChannelsNumber = Object.keys(Main.usersChannelLists[Main.currentUserUid]);
                        if (Main.sort === 2) {
                            Main.usersChannelsNumber = Main.usersChannelsNumber.sort(function(a,b){return b-a});
                        }
                        if (Object.keys(Main.users).length) {
                            document.querySelector('#setting_1 img').setAttribute('src', Main.users[Main.currentUserUid].icon);
                            document.querySelector('#setting_1 p').innerHTML = Main.users[Main.currentUserUid].name;
                        }
                        Main.clearsPlaying();
                        Main.playingChannelCount = Main.usersChannelsNumber.indexOf(num);
                        Main.loadVideos(pid, 'play', Main.playingChannelCount);
                        viewClose(menuUI, 'menuOpen');
                        viewClose(videoListUI, 'videoListState');

                        if (Main.currentUserUid === Main.viewMenuChannelsUid) {
                            Main.saveCurrentUser();
                        }
                    } else if (Main.videoListState) {
                        if (Main.player.getPlayerState() === YT.PlayerState.PLAYING) {
                            Main.player.pauseVideo();
                        }
                        if (document.querySelector('.list_focus .video_format_error') || !Main.videosList.length) {
                            return;
                        }
                        // play video
                        // var count = document.querySelector('.list_focus').getAttribute('id');
                        // count = parseInt(count.slice(6), 10) - 1;
                        // Main.playCount = count;
                        // Main.playCount = Main.currentFocus - 1;
                        var count = document.querySelector('.list_focus').getAttribute('data-video-count');
                        Main.playCount = parseInt(count, 10) - 1;
                        Main.clearsPlaying();
                        infoBarVideoTitleUI.innerHTML = Main.videosList[Main.playCount].title;
                        progressTimeUI.style.width = 0;
                        Main.toggleInfoBar();
                        Main.player.loadVideoById(Main.videosList[Main.playCount].youtube_hash, 0, 'hd720');
                        viewClose(videoListUI, 'videoListState');
                        Main.videoListView = 0;
                    } else if (Main.exitState) {
                        // for player exit
                        switch(Main.exitFocus) {
                            case 1:
                                viewClose(exitUI, 'exitState');
                            break;
                            case 2:
                                alert('exit app');
                                // save playing log
                                Main.channelBreakLog('w');
                                Main.saveCurrentChannel();
                                Main.clearsPlaying();
                                widgetAPI.sendReturnEvent();
                                window.history.back();
                            break;
                            default:
                                Main.clearsPlaying();
                                widgetAPI.sendReturnEvent();
                                window.history.back();
                            break;
                        }
                    } else {
                        var playerState = Main.player.getPlayerState();

                        if (playerState === YT.PlayerState.PLAYING) {
                            alert('pause');
                            Main.player.pauseVideo();
                        }else if (playerState === YT.PlayerState.PAUSED) {
                            alert('play');
                            Main.player.playVideo();
                        } else {
                            alert('skip enter playerState'+playerState);
                        }
                    }
                } else {
                    if (Main.settingFocus === 1 && !Main.usersListState && !Main.syncUserState && !Main.termsState) {
                        alert('enter userlist');
                        settingUI.setAttribute('class', 'hide');
                        // Main.settingState = 0;
                        viewOpen(settingSyncedUsersUI, 'usersListState', 'view');
                        // if not user
                        if (Object.keys(Main.users).length === 0) {
                            settingNoSyncUI.setAttribute('class', '');
                            settingUsersListUI.setAttribute('class', 'hide');
                            settingUsersListInfoUI.setAttribute('class', 'hide');
                            settingNoSyncInfoUI.setAttribute('class', 'info');
                        } else {
                            settingNoSyncUI.setAttribute('class', 'hide');
                            settingUsersListUI.setAttribute('class', '');
                            settingUsersListInfoUI.setAttribute('class', 'info');
                            settingNoSyncInfoUI.setAttribute('class', 'hide');
                        }
                    } else if (Object.keys(Main.users).length === 0 && Main.usersListState) {
                        alert('not user into sync default view');
                        // for not user sync default view
                        viewClose(settingSyncedUsersUI, 'usersListState');
                        viewOpen(settingBindUI, 'syncUserState','view');
                        settingPingCodeUI.setAttribute('class', '');
                        Main.bindUser();
                    } else if (!Main.unBindConfirm && Main.usersListState) {
                        alert('cancel sync');
                        document.querySelector('.users_list_focus .cancel_binding').setAttribute('class', 'cancel_binding hide');
                        document.querySelector('.users_list_focus .unbind_confirm').setAttribute('class', 'unbind_confirm');
                        Main.unBindConfirm = 1;
                    } else if (Main.unBindFocus === 1 && Main.unBindConfirm && Main.usersListState) {
                        alert('unbind user');
                        var unBindUserId = document.querySelector('.users_list_focus').getAttribute('id').slice(5);
                        Main.unBindUser(parseInt(unBindUserId, 10));
                        document.querySelector('.users_list_focus .unbind_confirm').setAttribute('class', 'unbind_confirm hide');
                        Main.unBindConfirm = 0;
                    } else if (Main.unBindFocus === 2 && Main.unBindConfirm && Main.usersListState) {
                        alert('cancel unbind user');
                        document.querySelector('.users_list_focus .cancel_binding').setAttribute('class', 'cancel_binding');
                        document.querySelector('.users_list_focus .unbind_confirm').setAttribute('class', 'unbind_confirm hide');
                        Main.unBindConfirm = 0;
                        document.querySelector('.users_list_focus .unbind_1').setAttribute('class', 'unbind_1 unbind_focus');
                        document.querySelector('.users_list_focus .unbind_2').setAttribute('class', 'unbind_2');
                        Main.unBindFocus = 1;
                    } else if (Main.settingFocus === 2 && !Main.usersListState && !Main.syncUserState && !Main.termsState) {
                        alert('enter sync view')
                        settingUI.setAttribute('class', 'hide');
                        // Main.settingState = 0;
                        viewOpen(settingBindUI, 'syncUserState', 'view');
                        settingPingCodeUI.setAttribute('class', '');
                        Main.bindUser();
                    }
                }
            }
            if (Main.welcomeState && Main.exitState === 0) {
                viewClose(welcomeUI, 'welcomeState');
                setTimeout(function() {
                    Main.checkRegistration();
                },3000);
            }
            if (Main.exitState) {
                // for load exit
                switch(Main.exitFocus) {
                    case 1:
                        viewClose(exitUI, 'exitState');
                    break;
                    case 2:
                        Main.clearsPlaying();
                        widgetAPI.sendReturnEvent();
                    break;
                    default:
                        Main.clearsPlaying();
                        widgetAPI.sendReturnEvent();
                    break;
                }
            }
        break;
        case 82:
        case 120:
            alert("Red");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState && !Main.settingState && !Main.exitState) {
                if (!Main.videoListState) {
                    // show videolist
                    viewClose(menuUI, 'menuOpen');
                    infoBarUI.setAttribute('class', 'hide');
                    channelInfoUI.setAttribute('class', 'hide');
                    Main.infoBarOpen = 0;
                    Main.player.pauseVideo();
                    viewOpen(videoListUI, 'videoListState');
                } else {
                    if (Main.videosList.length !== 0) {
                        Main.player.playVideo();
                    }
                    viewClose(videoListUI, 'videoListState');
                }
            }
        break;
        case 71:
        case 121:
            alert("Green");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState && !Main.videoListState && !Main.exitState) {
                if (Main.syncUserState) {
                    alert('polling again');
                    clearInterval(polling);
                    Main.bindUser('again');
                } else {
                    Main.toggleInfoBar();
                }
            }
        break;
        case 89:
        case 122:
            alert("Yellow");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState && !Main.settingState && !Main.exitState) {
                Main.enterMoreChannel();
                if (Main.videoListState) {
                    Main.videoListState = 0;
                    Main.videoListView = 1;
                }
            }
        break;
        case 66:
        case 123:
            alert("Blue");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState && !Main.exitState) {
                Main.toggleMenu();
                if (Main.settingState && !Main.usersListState && !Main.syncUserState) {
                    settingUI.setAttribute('class', 'hide');
                    viewOpen(tosUI, 'termsState', 'view');
                }
            }
        break;
        case 33:
            alert("ch up");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState && !Main.exitState) {
                if (Main.menuOpen) {
                    Main.channelSelect('pgUp');
                    Main.menuSetTimeoutToHide();
                } else if (Main.videoListState) {
                   if (Main.currentFocus > Main.row) {
                        Main.lastFocus = Main.currentFocus;
                        Main.currentFocus -= Main.row*(Main.col - 2);
                        if (0 >= Main.currentFocus) {
                            Main.currentFocus = 1;
                        }
                        Main.videoSelect(Main.lastFocus, Main.currentFocus, 'pageup');
                    } else {
                        Main.lastFocus = Main.currentFocus;
                        Main.currentFocus = 1;
                        Main.videoSelect(Main.lastFocus, Main.currentFocus, 'pageup');
                    }
                } else if (!Main.settingState) {
                    Main.channelBreakLog('w');
                    Main.switchChannel('down');
                }
            }
        break;
        case 34:
            alert("ch down");
            if (Main.networkError) {
                return;
            }
            if (!Main.loadState && !Main.exitState) {
                if (Main.menuOpen) {
                    Main.channelSelect('pgDn');
                    Main.menuSetTimeoutToHide();
                } else if (Main.videoListState) {
                    var l = document.querySelectorAll('.cell').length;
                    Main.lastFocus = Main.currentFocus;
                    Main.currentFocus += Main.row*(Main.col - 1);
                    Main.currentFocus = Math.min(l, Main.currentFocus);
                    Main.videoSelect(Main.lastFocus, Main.currentFocus, 'advance');
                } else if (!Main.settingState) {
                    Main.channelBreakLog('w');
                    Main.switchChannel('up');
                }
            }
        break;
        case 259:
            alert("switch return");
        break;
        case 49:
        case 97:
            alert("1");
            var num = 1;
            Main.NumSwitchChannel(num);
        break;
        case 50:
        case 98:
            alert("2");
            var num = 2;
            Main.NumSwitchChannel(num);
        break;
        case 51:
        case 99:
            alert("3");
            var num = 3;
            Main.NumSwitchChannel(num);
        break;
        case 52:
        case 100:
            alert("4");
            var num = 4;
            Main.NumSwitchChannel(num);
        break;
        case 53:
        case 101:
            alert("5");
            var num = 5;
            Main.NumSwitchChannel(num);
        break;
        case 54:
        case 102:
            alert("6");
            var num = 6;
            Main.NumSwitchChannel(num);
        break;
        case 55:
        case 103:
            alert("7");
            var num = 7;
            Main.NumSwitchChannel(num);
        break;
        case 56:
        case 104:
            alert("8");
            var num = 8;
            Main.NumSwitchChannel(num);
        break;
        case 57:
        case 105:
            alert("9");
            var num = 9;
            Main.NumSwitchChannel(num);
        break;
        case 48:
        case 96:
            alert("0");
            var num = 0;
            Main.NumSwitchChannel(num);
        break;
        default:
            alert("Unhandled key");
        break;
    }

    if (e.keyCode === 38 && Main.keyCount === 0) {
        Main.keyCount++;
    } else if (e.keyCode === 38 && Main.keyCount === 1) {
        Main.keyCount++;
    } else if (e.keyCode === 40 && Main.keyCount === 2) {
        Main.keyCount++;
    } else if (e.keyCode === 40 && Main.keyCount === 3) {
        Main.keyCount++;
    } else if (e.keyCode === 37 && Main.keyCount === 4) {
        Main.keyCount++;
    } else if (e.keyCode === 39 && Main.keyCount === 5) {
        Main.keyCount++;
    } else if (e.keyCode === 37 && Main.keyCount === 6) {
        Main.keyCount++;
    } else if (e.keyCode === 39 && Main.keyCount === 7) {
        Main.keyCount++;
    } else if (e.keyCode === 71 && Main.keyCount === 8) {
        Main.keyCount++;
    } else if (e.keyCode === 82 && Main.keyCount === 9) {
        Main.keyCount = 0;
        alert('打密技阿你');
        console.error('打密技阿你');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/appInfo.data');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/users.data');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/lastBindUser.data');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/currentUser.data');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/usersChannelsLog.data');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/currentChannelPid.data');
    } else {
        Main.keyCount = 0;
    }
}
