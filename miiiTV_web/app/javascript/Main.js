if (!test.app) {
    var widgetAPI = new Common.API.Widget();
    var pluginAPI = new Common.API.Plugin();
    var fileSystemObj = new FileSystem();
    if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
        fileSystemObj.createCommonDir(curWidget.id);
    }
}

var Main =
{
    w: 1280,
    h: 720,
    appInfo: {},
    playingLog: {},
    users: {},
    usersList: [],
    bufferTime: 5000,
    keyKeepDown: 0,
    currentUserUid: 0,
    currentChannelPid: 0,
    lastBindUser: {},
    infoBarOpen: 0,
    welcomeState: 0,
    // loader
    loadState: 1,
    // setting
    settingState: 0,
    settingFocus: 1,
    usersListState: 0,
    // usersList: 0,
    usersListCount: 0,
    unBindConfirm: 0,
    unBindFocus: 1,
    syncUserState: 0,
    termsState: 0,
    scrollCount: 0,
    // menu
    menuView: 7,
    menuChannelsVRendered: 8,
    menuCount: 0,
    channelsCount: 0,
    menuOpen: 0,
    menuUpdateTime: 20000,
    menuLastUpdateTime: 0,
    viewMenuChannelsUid: 0,
    // video list
    videoListState: 0,
    videoListView: 0,
    lastFocus: 1,
    currentFocus: 1,
    row: 4,
    videoTotalTime: 0,
    // exit
    exitState: 0,
    exitFocus: 1,
    // channel
    defaultChannels: [],
    tmpUsersChannels: {}, // tmpUsersChannels: {<uid>:[channels li, channels li],<uid>:[channels li, channels li]}
    channelNeedsUpdate: 0,
    channelsDefault: {},
    matchDefaultData: {},
    usersChannelsData: {},
    matchUserData: {},
    channelsUsrLength: 0,
    chPlayingCount: 0,
    numberCount: 0,
    playingChannel: {},
    usersChannelsLog: {},
    usersChannelLists: {}, // save channel number match channel title & pid
    usersChannelsCount: 0,
    usersChannelsNumber: [], // save channel numbers
    playingChannelCount: 0,
    sort: 1, // sort 1 = small to big, 2 = big to small
    // control play
    videoBeginTime: 0,
    videoCount: 0,
    videosList: [],
    playCount: 0,
    channelCount: 0,
    jumpTime: 0,
    keyCount: 0
};

// DOM
var welcomeUI = document.querySelector('#welcome_view'),
    videoListUI = document.querySelector('#video_list'),
    infoBarUI = document.querySelector('#info_bar'),
    channelInfoUI = document.querySelector('#channel_info'),
    channelNameUI = document.querySelector('#channel_title'),
    channelNumberUI = document.querySelector('#channel_number'),
    channelListUI = document.querySelector('#channel_list'),
    settingUI = document.querySelector('#setting_view'),
    settingSyncedUsersUI = document.querySelector('#users_view'),
    settingNoSyncUI = document.querySelector('#default_view'),
    settingUsersListUI = document.querySelector('#users_list'),
    settingBindUI = document.querySelector('#sync_view'),
    tosUI = document.querySelector('#terms_view'),
    menuUI = document.querySelector('#menu'),
    noVideosUI = document.querySelector('#no_videos_view'),
    exitUI = document.querySelector('#exit_confirm'),
    settingGridL = document.querySelectorAll('#setting_grid span').length;

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
    alert('updateCurrentTime:'+toHHMMSS(time));
    clearInterval(updateCurrentTimeInterval);
    if (toHHMMSS(time) === 'NaN:NaN:NaN') {
        document.querySelector('#playTime').innerHTML = '00:00:00';
        document.querySelector('#progress_time').style.width = 0;
    } else {
        document.querySelector('#playTime').innerHTML = toHHMMSS(time);
        document.querySelector('#progress_time').style.width = (time/Main.player.getDuration())*100 + '%';
    }
    updateCurrentTimeInterval = setInterval(
        function () {
            var currentTime = parseInt(Main.player.getCurrentTime(), 10);
            if (isNaN(currentTime)) {
                return;
            }
            // alert('update current time:' + currentTime);
            document.querySelector('#playTime').innerHTML = toHHMMSS(currentTime);
            document.querySelector('#progress_time').style.width = (currentTime/Main.player.getDuration())*100 + '%';
        },
        1000
    );
}
Main.updateCurrentTime = updateCurrentTime;

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
                // update default channel
                // init channels to used by channel up & down
                Main.getDefaultChannel();
            } else {
                alert('getUserChannel update');
                // update user + default channel
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

function menuUpdate() {
    if (Main.channelNeedsUpdate == 0) {
        return;
    }
    Main.channelNeedsUpdate = 0;
    Main.usersChannelLists[Main.currentUserUid] = {};
    Main.tmpUsersChannels[Main.currentUserUid] = [];
        var tmpChannel = document.createElement('ul');
        // build channel list
        if (Object.keys(Main.usersChannelsData).length) {
            for (x in Main.usersChannelsData[Main.currentUserUid]) {
                if (Main.usersChannelsData[Main.currentUserUid].hasOwnProperty(x)) {
                        Main.usersChannelLists[Main.currentUserUid][Main.usersChannelsData[Main.currentUserUid][x].ch_num] = {
                            title: Main.usersChannelsData[Main.currentUserUid][x].ch_name,
                            pid: Main.usersChannelsData[Main.currentUserUid][x].pid
                        };
                    var li = document.createElement('li'),
                        img = document.createElement('img'),
                        span = document.createElement('span'),
                        divName = document.createElement('div'),
                        divNum = document.createElement('div'),
                        p = document.createElement('p');
                    img.setAttribute('width', 160);
                    img.setAttribute('height', 90);
                    img.setAttribute('src', Main.usersChannelsData[Main.currentUserUid][x].shot);
                    divName.setAttribute('class', 'normal');
                    divNum.setAttribute('class', 'small');
                    divName.innerHTML = Main.usersChannelsData[Main.currentUserUid][x].ch_name;
                    divNum.innerHTML = 'CH ' + Main.usersChannelsData[Main.currentUserUid][x].ch_num;
                    p.innerHTML = Main.usersChannelsData[Main.currentUserUid][x].pid;
                    p.setAttribute('class', 'hide');
                    li.appendChild(img);
                    li.appendChild(span);
                    li.appendChild(p);
                    span.appendChild(divName);
                    span.appendChild(divNum);
                    // tmpChannel.appendChild(li);
                Main.tmpUsersChannels[Main.currentUserUid].push(li);
                }
            }
        }
    console.log(Main.tmpUsersChannels[Main.currentUserUid]);
    for (x in Main.channelsDefault) {
        if (Main.channelsDefault.hasOwnProperty(x)) {
                Main.usersChannelLists[Main.currentUserUid][Main.channelsDefault[x].ch_num] = {
                    title: Main.channelsDefault[x].ch_name,
                    pid: Main.channelsDefault[x].pid
                };
            var li = document.createElement('li'),
                img = document.createElement('img'),
                span = document.createElement('span'),
                divName = document.createElement('div'),
                divNum = document.createElement('div'),
                p = document.createElement('p');
            img.setAttribute('width', 160);
            img.setAttribute('height', 90);
            img.setAttribute('src', Main.channelsDefault[x].shot);
            divName.setAttribute('class', 'normal');
            divNum.setAttribute('class', 'small');
            divName.innerHTML = Main.channelsDefault[x].ch_name;
            divNum.innerHTML = 'CH ' + Main.channelsDefault[x].ch_num;
            p.innerHTML = Main.channelsDefault[x].pid;
            p.setAttribute('class', 'hide');
            li.appendChild(img);
            li.appendChild(span);
            li.appendChild(p);
            span.appendChild(divName);
            span.appendChild(divNum);
            if (Main.sort === 1) {
                // tmpChannel.insertBefore(li, tmpChannel.childNodes[0]);
                Main.tmpUsersChannels[Main.currentUserUid].unshift(li);
            }
            if (Main.sort === 2) {
                // tmpChannel.appendChild(li);
                Main.tmpUsersChannels[Main.currentUserUid].push(li);
            }
        }
    }
    console.log(Main.tmpUsersChannels);
    alert('Main.sort::'+Main.sort);
    console.log(Main.tmpUsersChannels[Main.currentUserUid]);
    if (Object.keys(Main.channelsDefault).length && Main.viewMenuChannelsUid === Main.currentUserUid) {
        var channelListView = document.createElement('ul');
        for (var i = 0; i < Main.menuChannelsVRendered; i++) {
            var viewList = Main.tmpUsersChannels[Main.currentUserUid][i];
            channelListView.appendChild(viewList);
        }
        channelListView.querySelectorAll('li')[Main.menuCount].setAttribute('class', 'menu_focus');
        document.querySelector('.channel_list').innerHTML = channelListView.innerHTML;
        channelListView.querySelectorAll('li')[Main.menuCount].setAttribute('class', '');
    }
    // update channel data
    Main.usersChannelsNumber = Object.keys(Main.usersChannelLists[Main.currentUserUid]);
    if (Main.sort === 2) {
        Main.usersChannelsNumber = Main.usersChannelsNumber.sort(function(a,b){return b-a});
    }
}

function timeJumps(status) {
    clearTimeout(timeJumpsTimeoutToJump);
    var seekToTime = Main.videoTotalTime/20;
    if (isNaN(seekToTime) || typeof seekToTime === 'undefined') {
        return;
    }
    if (!Main.keyKeepDown) {
        Main.jumpTime = Main.player.getCurrentTime();
        if (typeof Main.jumpTime === 'undefined') {
            return;
        }
        alert('jump getCurrentTime: '+Main.jumpTime+', '+seekToTime);
    }
    Main.keyKeepDown = 1;
    switch(status) {
        case 0:
            Main.jumpTime-= seekToTime;
            if (Main.jumpTime < 0) {
                Main.jumpTime = 0;
            }
        break;
        case 1:
            Main.jumpTime+= seekToTime;
            if (Main.jumpTime > Main.videoTotalTime) {
                Main.jumpTime = Main.videoTotalTime;
            }
        break;
        default:
        return;
    }
    alert('final time'+Main.jumpTime);
    // show info bar
    Main.showInfoBar(Main.jumpTime);
    timeJumpsTimeoutToJump = setTimeout(function() {
        alert('jump');
        alert(toHHMMSS(Main.jumpTime));
        Main.player.seekTo(Main.jumpTime, true);
        // Main.player.playVideo();
        clearTimeout(skipBufferTimeout);
        Main.keyKeepDown = 0;
        alert('buffer time:'+Main.bufferTime);
        skipBufferTimeout = setTimeout(Main.skipBuffer, Main.bufferTime);
    }, 500);
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
Main.viewOpen = viewOpen;
function viewClose(dom, state) {
    alert('viewClose');
    dom.setAttribute('class', 'hide');
    if (state) {
        Main[state] = 0;
    }
}
Main.viewClose = viewClose;

// var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/appInfo.data');
// var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/users.data');
// check did
if (!test.app) {
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
}
function saveCurrentUser() {
    var fileCurrentUserUid = fileSystemObj.openCommonFile(curWidget.id + '/currentUser.data', 'w');
    if (fileCurrentUserUid) {
        fileCurrentUserUid.writeAll(Main.currentUserUid.toString());
    }
    fileSystemObj.closeCommonFile(fileCurrentUserUid);
}
Main.saveCurrentUser = saveCurrentUser;

function gaStayTime (argument) {
    // body...
}

Main.onLoad = function()
{
    var h = window.document.documentElement.clientHeight;
    var w = window.document.documentElement.clientWidth;
    console.log('H', h);
    console.log('W', w);
    if (w === 1920) {
        Main.w = 1920;
        Main.h = 1080;
        document.body.style.width = '1920px';
        document.body.style.height = '1080px';
        document.querySelector('#menu').style.height = '100%';
    } else if (w === 1280) {
        Main.w = 1280;
        Main.h = 720;
    } else if (w === 1024) {
        Main.w = 1024;
        Main.h = 576;
        document.body.style.width = '1024px';
        document.body.style.height = '576px';
        Main.menuView = 5;
    } else if (w === 853) {
        Main.w = 853;
        Main.h = 480;
    } else if (w === 640) {
        Main.w = 640;
        Main.h = 360;
    } else {
        Main.w = w;
        Main.h = (w*9)/16;
        document.body.style.width = w + 'px';
        document.body.style.height = (w*9)/16 + 'px';
        Main.menuView = Math.floor(Main.h/90) - 1;
    }
    // Enable key event processing
    if (!test.app) {
        widgetAPI.sendReadyEvent();
        // set volume OSD(On Screen Display)
        window.onShow = Main.volumeOSD;
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
                    'http://www.miiitv.com/tvservice2/reg/tvsignup',
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
                        // _gaq.push(['_trackPageview','feature/' + 'binding_ok']);
                        // ga('send', 'event', 'feature', 'binding_ok');
                        // fail handle
                    }
                );
            }
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

    document.querySelector('#loading_msg').innerHTML = '載入使用者...';

    function getAllProfile() {
        var getUsersData = 'http://www.miiitv.com/tvservice2/device/getAllProfileInfo';
        var sig = CryptoJS.HmacSHA1(getUsersData + 'did=' + Main.appInfo.did, Main.appInfo.secretCode);
        sig = window.btoa(sig.toString());
        JSONP.init({
            error: function(ex){
                alert("Failed to load : " + ex.url);
                console.log("Failed to load : " + ex.url);
            }
        });
        JSONP.get(
            getUsersData,
            {
                did: Main.appInfo.did,
                sig: sig,
                source: 'webtv',
            },
            function(data) {
                alert(data);
                alert('currentUserUid:'+Main.currentUserUid);
                if (data.status === 'ok') {
                    for (var i = 0; i < data.user.length; i++) {
                        Main.users[data.user[i].uid] = data.user[i];
                        // init users channel
                        Main.tmpUsersChannels[data.user[i].uid] = [];
                    }
                    Main.usersList = Object.keys(Main.users);
                    if (!Main.currentUserUid || Main.usersList.indexOf(Main.currentUserUid.toString()) === -1) {
                        if (data.user.length === 0) {
                            Main.currentUserUid = 0;
                            Main.users = {};
                            Main.tmpUsersChannels[0] = [];
                        } else {
                            console.log('reset current user');
                            Main.currentUserUid = data.user[0].uid;
                            Main.saveCurrentUser();
                        }
                    }
                    Main.viewMenuChannelsUid = Main.currentUserUid;
                    Main.usersChannelsCount = Main.usersList.indexOf(Main.currentUserUid.toString());
                    alert('currentUserUid+:'+Main.currentUserUid);
                    if (Object.keys(Main.users).length) {
                        loadAllChannels();
                    }
                    loadPlayingChannels();
                } else {
                    // getAllProfile();
                    // or load local data
                }
            }
        );
    }
    getAllProfile();

    function loadAllChannels() {
        var getUsersData = 'http://www.miiitv.com/tvservice2/device/getAllChannel';
        var sig = CryptoJS.HmacSHA1(getUsersData + 'did=' + Main.appInfo.did, Main.appInfo.secretCode);
        sig = window.btoa(sig.toString());
        JSONP.init({
            error: function(ex){
                alert("Failed to load : " + ex.url);
                console.log("Failed to load : " + ex.url);
            }
        });
        JSONP.get(
            getUsersData,
            {
                did: Main.appInfo.did,
                sig: sig,
                source: 'webtv',
            },
            function(data) {
                console.log(data);
                console.log(data.default_channels);
                console.log(data.user);
                for (var i = 0; i < data.user.length; i++) {
                    Main.usersChannelLists[data.user[i].uid] = {};
                    Main.tmpUsersChannels[data.user[i].uid] = [];
                    for (var k = 0; k < data.user[i].channels.length; k++) {
                        data.user[i].channels[k]
                        Main.usersChannelLists[data.user[i].uid][data.user[i].channels[k].ch_num] = {
                            title: data.user[i].channels[k].ch_name,
                            pid: data.user[i].channels[k].pid
                        };
                        var li = document.createElement('li'),
                            img = document.createElement('img'),
                            span = document.createElement('span'),
                            divName = document.createElement('div'),
                            divNum = document.createElement('div'),
                            p = document.createElement('p');
                        img.setAttribute('width', 160);
                        img.setAttribute('height', 90);
                        img.setAttribute('src', data.user[i].channels[k].shot);
                        divName.setAttribute('class', 'normal');
                        divNum.setAttribute('class', 'small');
                        divName.innerHTML = data.user[i].channels[k].ch_name;
                        divNum.innerHTML = 'CH ' + data.user[i].channels[k].ch_num;
                        p.innerHTML = data.user[i].channels[k].pid;
                        p.setAttribute('class', 'hide');
                        li.appendChild(img);
                        li.appendChild(span);
                        li.appendChild(p);
                        span.appendChild(divName);
                        span.appendChild(divNum);
                        Main.tmpUsersChannels[data.user[i].uid].push(li);
                    }
                    for (var j = 0; j < data.default_channels.length; j++) {
                        Main.usersChannelLists[data.user[i].uid][data.default_channels[j].ch_num] = {
                            title: data.default_channels[j].ch_name,
                            pid: data.default_channels[j].pid
                        };
                        var li = document.createElement('li'),
                            img = document.createElement('img'),
                            span = document.createElement('span'),
                            divName = document.createElement('div'),
                            divNum = document.createElement('div'),
                            p = document.createElement('p');
                        img.setAttribute('width', 160);
                        img.setAttribute('height', 90);
                        img.setAttribute('src', data.default_channels[j].shot);
                        divName.setAttribute('class', 'normal');
                        divNum.setAttribute('class', 'small');
                        divName.innerHTML = data.default_channels[j].ch_name;
                        divNum.innerHTML = 'CH ' + data.default_channels[j].ch_num;
                        p.innerHTML = data.default_channels[j].pid;
                        p.setAttribute('class', 'hide');
                        li.appendChild(img);
                        li.appendChild(span);
                        li.appendChild(p);
                        span.appendChild(divName);
                        span.appendChild(divNum);
                        Main.tmpUsersChannels[data.user[i].uid].push(li);
                    }
                }
                // var tmpChannel = document.createElement('ul');

            }
        );
    }

    function loadPlayingChannels() {
        // load user channel if it saved
        if (Object.keys(Main.users).length === 0) {
            alert('2.getDefaultChannel');
            getDefaultChannel('init');
        } else {
            alert('init load user channel');
            // getUsersInfo();
            // Main.users[0].uid
            // Main.users[0].name
            // Main.users[0].img
            function userInfo() {
                document.querySelector('#setting_1 img').setAttribute('src', Main.users[Main.currentUserUid].icon);
                document.querySelector('#setting_1 p').innerHTML = Main.users[Main.currentUserUid].name;
                document.querySelector('.menu_title img').setAttribute('src', Main.users[Main.currentUserUid].icon);
                document.querySelector('.menu_title span').innerHTML = Main.users[Main.currentUserUid].name + '的頻道列表';
            }
            userInfo();
            // Main.usersList = 1;
            getUserChannel('init');
            buildUsersList();
        }
    }

    function buildUsersList() {
        // build user list
        var tmpUsersList = document.createElement('ul');
        for (x in Main.users) {
            if (Main.users.hasOwnProperty(x)) {
                var li = document.createElement('li'),
                    img = document.createElement('img'),
                    spanName = document.createElement('span'),
                    spanCancel = document.createElement('span'),
                    spanNuBind = document.createElement('span');
                li.setAttribute('id', 'user_' + x);
                img.setAttribute('width', '62px');
                img.setAttribute('height', '62px');
                img.setAttribute('src', Main.users[x].icon);
                spanName.setAttribute('class', 'user_anme');
                spanName.innerHTML = Main.users[x].name;
                spanCancel.setAttribute('class', 'cancel_binding');
                spanCancel.innerHTML = '<div class="ico_enter">' +
                                        '<div class="ico_box">' +
                                        '<div class="ico_arrow"></div>' +
                                        '</div>' +
                                        '<div class="ico_h_line"></div>' +
                                        '<div class="ico_v_line"></div>' +
                                        '</div>' +
                                        ' 取消同步';
                spanNuBind.setAttribute('class', 'hide unbind_confirm');
                spanNuBind.innerHTML = '<p>' +
                                        '確定要取消同步' +
                                        '<span class="user_anme_unbind">' + Main.users[x].name + '</span>' +
                                        '的頻道列表？' +
                                        '</p>' +
                                        '<span class="unbind_confirm_box">' +
                                        '<div class="unbind_1 unbind_focus">是</div>' +
                                        '<div class="unbind_2">否</div>' +
                                        '</span>';
                li.appendChild(img);
                li.appendChild(spanName);
                li.appendChild(spanCancel);
                li.appendChild(spanNuBind);
                tmpUsersList.appendChild(li);
            }
        }
        document.querySelector('#bind_users').innerHTML = tmpUsersList.innerHTML;
        document.querySelectorAll('#bind_users li')[0].setAttribute('class', 'users_list_focus');
    }

    function unBindUser(uid) {
        alert('unBindUser');
        var getUsersData = 'http://www.miiitv.com/tvservice2/device/unbind';
        var sig = CryptoJS.HmacSHA1(getUsersData + 'did=' + Main.appInfo.did + '&uid=' + uid, Main.appInfo.secretCode);
        sig = window.btoa(sig.toString());
        JSONP.init({
            error: function(ex){
                alert("Failed to load : " + ex.url);
                console.log("Failed to load : " + ex.url);
            }
        });
        JSONP.get(
            getUsersData,
            {
                did: Main.appInfo.did,
                uid: uid,
                sig: sig,
                source: 'webtv',
            },
            function(data) {
                alert(data);
                if (data.status === 'ok') {
                    delete Main.usersChannelsLog[uid];
                    delete Main.usersChannelLists[uid];
                    delete Main.tmpUsersChannels[uid];
                    // update users list UI
                    var bindingUser = document.querySelector('#user_' + uid + '');
                    bindingUser.outerHTML = '';
                    delete bindingUser;
                    // update Main.users
                    delete Main.users[uid];
                    Main.usersList = Object.keys(Main.users);
                    delete Main.usersChannelsData[uid];
                    delete Main.matchUserData[uid];
                    alert('update users');
                    alert(Main.users);
                    // check Main.users no user show default
                    if (!Object.keys(Main.users).length) {
                        if (uid === Main.currentUserUid) {
                            Main.currentUserUid = 0;
                            Main.viewMenuChannelsUid = 0;
                            Main.usersListCount = 0;
                        }
                        // load d4 channel
                        Main.sort = 1;
                        document.querySelector('.menu_title').innerHTML = '<li>' +
                            '<span>miiiTV 預設</span>' +
                            '<img src="img/ico_defult_bighead.png" alt="img" width="50" height="50">' +
                            '</li>';
                        document.querySelector('#setting_1').innerHTML = '<h3>使用者列表</h3>' +
                            '<img src="img/ico_defult_bighead.png" alt="avatar" width="128" height="128">' +
                            '<p>無</p>' +
                            '</span>';
                        Main.channelsCount = 0;
                        getDefaultChannel();
                        settingUI.setAttribute('class', 'view');
                        Main.viewClose(settingSyncedUsersUI, 'usersListState');
                        document.querySelector('#gen_ping_code').setAttribute('class', 'hide');
                    } else {
                        Main.usersListCount--;
                        if (Main.usersListCount < 0) {
                            Main.usersListCount = 0
                        }
                        document.querySelectorAll('#bind_users li')[Main.usersListCount].setAttribute('class', 'users_list_focus');
                    }
                    console.log(uid === Main.currentUserUid);
                    if (uid === Main.currentUserUid) {
                        var lastBindUserId = document.querySelectorAll('#bind_users li')[0].getAttribute('id').slice(5);
                        console.log(lastBindUserId);
                        Main.currentUserUid = parseInt(lastBindUserId, 10);
                        if (uid === Main.viewMenuChannelsUid) {
                            // detele user channel list
                            document.querySelector('.menu_title').innerHTML = '';
                            document.querySelector('.channel_list').innerHTML = '';
                            document.querySelector('.channel_list').innerHTML = '';
                            var channelListView = document.createElement('ul');
                            if (Main.channelsCount > Main.tmpUsersChannels[Main.currentUserUid].length - 1) {
                                for (var i = Main.tmpUsersChannels[Main.currentUserUid].length - Main.menuView; i < Main.tmpUsersChannels[Main.currentUserUid].length; i++) {
                                    var viewList = Main.tmpUsersChannels[Main.currentUserUid][i];
                                    channelListView.appendChild(viewList);
                                }
                                Main.channelsCount = Main.tmpUsersChannels[Main.currentUserUid].length - 1;
                            } else {
                                for (var i = Main.channelsCount - Main.menuCount; i < Main.channelsCount - Main.menuCount + Main.menuChannelsVRendered; i++) {
                                    var viewList = Main.tmpUsersChannels[Main.currentUserUid][i];
                                    channelListView.appendChild(viewList);
                                }
                            }
                            channelListView.querySelectorAll('li')[Main.menuCount].setAttribute('class', 'menu_focus');
                            document.querySelector('.channel_list').innerHTML = channelListView.innerHTML;
                            channelListView.querySelectorAll('li')[Main.menuCount].setAttribute('class', '');
                        }
                    }
                    Main.viewMenuChannelsUid = Main.currentUserUid;
                    Main.usersChannelsCount = Main.usersList.indexOf(Main.currentUserUid.toString());
                    document.querySelector('#setting_1 img').setAttribute('src', Main.users[Main.currentUserUid].icon);
                    document.querySelector('#setting_1 p').innerHTML = Main.users[Main.currentUserUid].name;
                    document.querySelector('.menu_title').innerHTML = '<li>' +
                            '<span>' + Main.users[Main.currentUserUid].name + '的頻道列表</span>' +
                            '<img src="' + Main.users[Main.currentUserUid].icon + '" alt="img" width="50" height="50">' +
                            '</li>';
                    Main.usersChannelsNumber = Object.keys(Main.usersChannelLists[Main.currentUserUid]);
                    Main.usersChannelsNumber = Main.usersChannelsNumber.sort(function(a,b){return b-a});
                    Main.playingChannelCount = -1;
                    // save current user
                    Main.saveCurrentUser();

                    console.log(Main.currentUserUid);
                }
            }
        );
    }
    Main.unBindUser = unBindUser;

    document.querySelector('#loading_msg').innerHTML = '頻道更新中...';

    // bind user
    function bindUser(again) {
        alert('bindUser');

        // check user data
        clearInterval(skip3minPolling);
        again ? Main.renew = 1 : Main.renew = 0;
        // get pin code
        var pingCodeUrl = 'http://www.miiitv.com/tvservice2/device/getTVPinCode';
        var sig = CryptoJS.HmacSHA1(pingCodeUrl + 'did=' + Main.appInfo.did + '&renew=' + Main.renew, Main.appInfo.secretCode);
        sig = window.btoa(sig.toString());
        JSONP.init({
            error: function(ex){
                alert("Failed to load : " + ex.url);
                console.log("Failed to load : " + ex.url);
            }
        });
        JSONP.get(
            pingCodeUrl,
            {
                did: Main.appInfo.did,
                sig: sig,
                renew: Main.renew,
                source: 'webtv'
            },
            function(data) {
                // get pin code
                // {"status":"ok","errmsg":"","errno":"","pin_code":"736654","response":0}
                if (data.status === 'ok') {
                    // show pin code on tv
                    alert(JSON.stringify(data));
                    document.querySelector('#ping_code').innerHTML = data.pin_code;
                }
                bind(data);
            }
        );
        // polling
        polling = setInterval(
            function () {
                alert('polling');
                var sig = CryptoJS.HmacSHA1(pingCodeUrl + 'did=' + Main.appInfo.did + '&renew=0', Main.appInfo.secretCode);
                sig = window.btoa(sig.toString());
                JSONP.init({
                    error: function(ex){
                        alert("Failed to load : " + ex.url);
                        console.log("Failed to load : " + ex.url);
                    }
                });
                JSONP.get(
                    pingCodeUrl,
                    {
                        did: Main.appInfo.did,
                        sig: sig,
                        renew: 0,
                        source: 'webtv'
                    },
                    function(data) {
                        var count;
                        alert('polling response');
                        alert('polling status:'+JSON.stringify(data));
                        bind(data);
                    }
                );
            },
            5000
        );

        skip3minPolling = setTimeout(function() {
            alert('after 3min clear polling');
            clearInterval(polling);
        }, 180000);
    }
    Main.bindUser = bindUser;

    // check bind user
    function bind(data) {
        if (data.bind_uid) {
            for (x in data.user) {
                if(data.user[x].uid === data.bind_uid) {
                    count = x;
                }
            }
            clearInterval(polling);
            // alert('bind user:'+JSON.stringify(data));
            document.querySelector('#sync_ok').setAttribute('class', 'info_bar large');
            document.querySelector('#sync_ok span').innerHTML = data.user[count].name;
            if (document.querySelector('#sync_ok').getAttribute('class') === 'info_bar large') {
                setTimeout(function() {
                    document.querySelector('#sync_ok').setAttribute('class', 'hide');
                }, 5000);
            }
            document.querySelector('#setting_1 img').setAttribute('src', data.user[count].user_icon);
            document.querySelector('#setting_1 p').innerHTML = data.user[count].name;
            document.querySelector('.menu_title img').setAttribute('src', data.user[count].user_icon);
            document.querySelector('.menu_title span').innerHTML = data.user[count].name + '的頻道列表';

            // var updateUsers = Main.users.push(data.user.uid);
            Main.users[data.user[count].uid] = {
                uid: data.user[count].uid,
                name: data.user[count].name,
                icon: data.user[count].user_icon
            };
            Main.usersList = Object.keys(Main.users);
            buildUsersList();
            // Main.usersList = 1;
            // if (fileSystemObj.isValidCommonPath(curWidget.id) == 0){
            //     fileSystemObj.createCommonDir(curWidget.id);
            // }
            // data.user[0] = JSON.stringify(data.user[0]);
            // var fileUid = fileSystemObj.openCommonFile(curWidget.id + '/users.data', 'w');
            // if (fileUid) {
            //     fileUid.writeAll(data.user[0]);
            // }
            // fileSystemObj.closeCommonFile(fileUid);

            // save last bind user data
            Main.lastBindUser = {
                uid: data.user[count].uid,
                name: data.user[count].name,
                img: data.user[count].user_icon
            };
            var fileLastBindUid = fileSystemObj.openCommonFile(curWidget.id + '/lastBindUser.data', 'w');
            if (fileLastBindUid) {
                fileLastBindUid.writeAll(JSON.stringify(Main.lastBindUser));
            }
            fileSystemObj.closeCommonFile(fileLastBindUid);

            // update current user
            Main.currentUserUid = parseInt(data.user[count].uid, 10);
            Main.usersChannelsCount = Main.usersList.indexOf(Main.currentUserUid.toString());
            Main.viewMenuChannelsUid = Main.currentUserUid;
            Main.saveCurrentUser();

            Main.usersChannelLists[Main.currentUserUid] = {};
            Main.tmpUsersChannels[Main.currentUserUid] = [];
            syncUserChannels(data, count);
        }
    }

    function syncUserChannels(data, count) {
        alert('syncUserChannels');
        var tmpChannel = document.createElement('ul');
        // build user channel list
        Main.sort = 2;
        for (x in data.user[count].channels) {
            if (data.user[count].channels.hasOwnProperty(x)) {
                Main.usersChannelLists[Main.currentUserUid][data.user[count].channels[x].ch_num] = {
                    title: data.user[count].channels[x].ch_name,
                    pid: data.user[count].channels[x].pid
                };
                var li = document.createElement('li'),
                    img = document.createElement('img'),
                    span = document.createElement('span'),
                    divName = document.createElement('div'),
                    divNum = document.createElement('div'),
                    p = document.createElement('p');
                img.setAttribute('width', 160);
                img.setAttribute('height', 90);
                img.setAttribute('src', data.user[count].channels[x].shot);
                divName.setAttribute('class', 'normal');
                divNum.setAttribute('class', 'small');
                divName.innerHTML = data.user[count].channels[x].ch_name;
                divNum.innerHTML = 'CH ' + data.user[count].channels[x].ch_num;
                p.innerHTML = data.user[count].channels[x].pid;
                p.setAttribute('class', 'hide');
                li.appendChild(img);
                li.appendChild(span);
                li.appendChild(p);
                span.appendChild(divName);
                span.appendChild(divNum);
                // tmpChannel.appendChild(li);
                Main.tmpUsersChannels[Main.currentUserUid].push(li);
            }
        }
        // build default channel list
        for (x in data.default_channels) {
            if (data.default_channels.hasOwnProperty(x)) {
                Main.usersChannelLists[Main.currentUserUid][data.default_channels[x].ch_num] = {
                    title: data.default_channels[x].ch_name,
                    pid: data.default_channels[x].pid
                };
                var li = document.createElement('li'),
                    img = document.createElement('img'),
                    span = document.createElement('span'),
                    divName = document.createElement('div'),
                    divNum = document.createElement('div'),
                    p = document.createElement('p');
                img.setAttribute('width', 160);
                img.setAttribute('height', 90);
                img.setAttribute('src', data.default_channels[x].shot);
                divName.setAttribute('class', 'normal');
                divNum.setAttribute('class', 'small');
                divName.innerHTML = data.default_channels[x].ch_name;
                divNum.innerHTML = 'CH ' + data.default_channels[x].ch_num;
                p.innerHTML = data.default_channels[x].pid;
                p.setAttribute('class', 'hide');
                li.appendChild(img);
                li.appendChild(span);
                li.appendChild(p);
                span.appendChild(divName);
                span.appendChild(divNum);
                // tmpChannel.appendChild(li);
                Main.tmpUsersChannels[Main.currentUserUid].push(li);
            }
        }
        // document.querySelector('.channel_list').innerHTML = tmpChannel.innerHTML;

        Main.menuCount = 0;
        Main.channelsCount = 0;

        var channelListView = document.createElement('ul');
        for (var i = 0; i < Main.menuChannelsVRendered; i++) {
            var viewList = Main.tmpUsersChannels[Main.currentUserUid][i];
            channelListView.appendChild(viewList);
        }
        channelListView.querySelectorAll('li')[Main.menuCount].setAttribute('class', 'menu_focus');
        document.querySelector('.channel_list').innerHTML = channelListView.innerHTML;
        channelListView.querySelectorAll('li')[Main.menuCount].setAttribute('class', '');
        // Main.usersChannelsData = data.user[count].channels;
        Main.usersChannelsNumber = Object.keys(Main.usersChannelLists[Main.currentUserUid]);
        Main.usersChannelsNumber = Main.usersChannelsNumber.sort(function(a,b){return b-a});
        // Main.playingChannelCount = Main.usersChannelsNumber.length - 1 - Main.playingChannelCount;
        Main.playingChannelCount = -1;
        alert('sync' + Main.usersChannelsNumber);

        channelSelect();

        // var pid = document.querySelector('.menu_focus').childNodes[2].innerHTML;
        // Main.clearsPlaying();
        // Main.playingChannelCount = indexInParent(document.querySelector('.menu_focus'));
        // Main.loadVideos(pid, 'play', Main.playingChannelCount);
    }
    // syncUserChannels(testdata);


    // get default channel
    function getDefaultChannel(status) {
        alert('3.getDefaultChannel');
        var defaultUrl = 'http://www.miiitv.com/tvservice2/device/getDefaultChannel';
        var sig = CryptoJS.HmacSHA1(defaultUrl + 'did=' + Main.appInfo.did, Main.appInfo.secretCode);
        sig = window.btoa(sig.toString());
        JSONP.init({
            error: function(ex){
                alert("Failed to load : " + ex.url);
                console.log("Failed to load : " + ex.url);
            }
        });
        JSONP.get(
            defaultUrl,
            {
                did: Main.appInfo.did,
                source: 'webtv',
                sig: sig,
            },
            function(data) {
                alert('4.getdefaultchanneldata');
                console.log(data);
                loadDefaultChannels(data, status, Main.sort);
            }
        );
    }
    Main.getDefaultChannel = getDefaultChannel;

    // sort 1 = small to big, 2 = big to small
    function loadDefaultChannels(data, status, sort) {
        alert('5.loadDefaultChannels');
        var tmpDefaultChannelData = [];
        for (var i = 0; i < data.length; i++) {
            tmpDefaultChannelData.push(data[i].pid);
        }
        if (JSON.stringify(tmpDefaultChannelData) !== JSON.stringify(Main.matchDefaultData[Main.currentUserUid])) {
            Main.channelsDefault = data;
            Main.matchDefaultData[Main.currentUserUid] = tmpDefaultChannelData;
            // for GA
            Main.defaultChannels = tmpDefaultChannelData;
            Main.channelNeedsUpdate = 1;
            menuUpdate();
            // load player
            if (status === 'init') {
                loadPlayer(sort);
            }
        }
    }

    // get user channels
    function getUserChannel(status) {
        alert('getUserChannel');
        // http://www.miiitv.com/tvservice2/profile/getUserChannel?did=3f6c64cbc323c287&uid=27
        var getUserUrl = 'http://www.miiitv.com/tvservice2/profile/getUserChannel';
        var sig = CryptoJS.HmacSHA1(getUserUrl + 'did=' + Main.appInfo.did + '&uid=' + Main.users[Main.currentUserUid].uid, Main.appInfo.secretCode);
        sig = window.btoa(sig.toString());
        JSONP.init({
            error: function(ex){
                alert("Failed to load : " + ex.url);
                console.log("Failed to load : " + ex.url);
            }
        });
        JSONP.get(
            getUserUrl,
            {
                did: Main.appInfo.did,
                uid: Main.users[Main.currentUserUid].uid,
                sig: sig,
                source: 'webtv',
            },
            function(data) {
                if (data.status === 'ok') {
                    Main.sort = 2;
                    loadUserChannel(data, status);
                    Main.channelsDefault = {};
                }
            }
        );
    }
    Main.getUserChannel = getUserChannel;

    function loadUserChannel(data, status) {
        alert('user loadUserChannel');
        var tmpUserChannelData = [];
        for (var i = 0; i < data.channels.length; i++) {
            tmpUserChannelData.push(data.channels[i].pid);
        }
        if (JSON.stringify(tmpUserChannelData) !== JSON.stringify(Main.matchUserData[Main.currentUserUid])) {
            Main.usersChannelsData[Main.currentUserUid] = data.channels;
            Main.matchUserData[Main.currentUserUid] = tmpUserChannelData;
            Main.channelNeedsUpdate = 1;
            // build default channel
            getDefaultChannel(status);
            menuUpdate();
        }
    }

    function gaData(channel, name) {
        JSONP.init({
            error: function(ex){
                alert("Failed to load : " + ex.url);
            }
        });
        JSONP.get(
            'http://tedshd.lionfree.net/demo/ga.php',
            {
                channel: channel,
                channelName: name
            },
            function(data) {
                console.log('ga data ok');
            }
        );
    }

    function loadVideos(pid, status, playingChannelCount) {
        alert('loadVideos');
        alert('pid:'+pid);
        alert('playingChannelCount:'+playingChannelCount);
        noVideosUI.setAttribute('class', 'hide');

        // save last channel log
        // if (status === 'play') {
        //     Main.channelBreakLog('w');
        // }
        var videosUrl = 'http://www.miiitv.com/tvservice2/profile/getChannelVideo';
        var sig = CryptoJS.HmacSHA1(videosUrl + 'did=' + Main.appInfo.did + '&pid=' + pid, Main.appInfo.secretCode);
        sig = window.btoa(sig.toString());
        JSONP.init({
            error: function(ex){
                alert("Failed to load : " + ex.url);
            }
        });
        JSONP.get(
            videosUrl,
            {
                did: Main.appInfo.did,
                pid: pid,
                source: 'webtv',
                sig: sig
            },
            function(data) {
                if (data.status === 'fail') {
                    var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/appInfo.data');
                    var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/users.data');
                    Main.checkRegistration();
                    return;
                }
                if (!data.user) {
                    Main.currentChannelPid = document.querySelector('.menu_focus').childNodes[2].innerHTML;
                    Main.loadVideos(Main.currentChannelPid, '', Main.playingChannelCount);
                    return;
                }
                // GA
                if (Main.defaultChannels.indexOf(pid) === -1) {
                    // _gaq.push(['_trackPageview','watch/' + 'normal_' + pid + '/' + data.user.name]);
                    // _gaq.push(['_trackEvent', 'watch', 'normal_' + pid + '', data.user.name]);
                    // ga('send', 'event', 'watch', 'normal_' + pid + '', data.user.name);
                } else {
                    // _gaq.push(['_trackPageview','watch/' + 'official_' + pid + '/' + data.user.name]);
                    // _gaq.push(['_trackEvent', 'watch', 'official_' + pid + '', data.user.name]);
                    // ga('send', 'event', 'watch', 'official_' + pid + '', data.user.name);
                }
                Main.currentChannelPid = pid;
                // build playlist
                alert(Main.usersChannelsNumber);
                alert(playingChannelCount);
                document.querySelector('#channel_number').innerHTML = Main.usersChannelsNumber[playingChannelCount];
                document.querySelector('#channel_title').innerHTML = data.user.name;
                Main.playingChannel = {
                    title: data.user.name,
                    number: Main.usersChannelsNumber[playingChannelCount]
                };
                alert('playingChannel:'+JSON.stringify(Main.playingChannel));
                // data.user.ch_num
                // data.user.name
                // data.user.pid
                // Main.usersChannelLists

                // rander video list UI
                // data.user.videos
                document.querySelector('#video_list_bg').innerHTML = '';
                var videoListCount = 1;
                if (data.user.videos.length === 0) {
                    // no video in channel
                    alert('no video in this channel');
                    if (Main.player && Main.player.getPlayerState() === 1) {
                        alert('pause');
                        Main.player.pauseVideo();
                        Main.clearsPlaying();
                    }
                    noVideosUI.setAttribute('class', 'normal');
                    document.querySelector('#video_list_channel_title').innerHTML = data.user.name;
                    document.querySelector('#video_title').innerHTML = '';
                    Main.videosList = [];
                } else {
                    alert('build video list');
                    for (x in data.user.videos) {
                        if (data.user.videos.hasOwnProperty(x)) {
                            if (data.user.videos[x].media_format === '5,1,6') {
                                var cell = document.createElement('div'),
                                    img = document.createElement('img'),
                                    divName = document.createElement('div');
                                img.setAttribute('width', 320);
                                img.setAttribute('height', 180);
                                img.setAttribute('src', data.user.videos[x].cover);
                                divName.setAttribute('class', 'list_video_title normal');
                                divName.innerHTML = data.user.videos[x].title;
                                if (videoListCount === 1) {
                                    cell.setAttribute('class', 'cell list_focus');
                                } else {
                                    cell.setAttribute('class', 'cell');
                                }
                                cell.setAttribute('id', 'video_' + videoListCount);
                                cell.appendChild(img);
                                cell.appendChild(divName);
                                document.querySelector('#video_list_bg').appendChild(cell);
                                videoListCount++;
                            }
                        }
                    }
                    document.querySelector('#video_list_channel_title').innerHTML = data.user.name;
                    Main.lastFocus = 0;
                    Main.currentFocus = 1;
                    // document.querySelector('#video_1').setAttribute('class', 'cell list_focus');
                    document.querySelector('#video_list_bg').style.top = '50px';

                    Main.videosList = [];
                    Main.videosList = data.user.videos;
                    Main.playCount = 0;
                    Main.channelBreakLog('r', pid);
                    document.querySelector('#video_title').innerHTML = Main.videosList[Main.playCount].title;
                    if (status === 'play') {
                        if (Main.player.getPlayerState() === 1) {
                            alert('pause');
                            Main.player.pauseVideo();
                        }
                        Main.clearsPlaying();
                        if (!Main.settingState) {
                            Main.showInfoBar();
                        }
                        Main.player.loadVideoById(Main.videosList[Main.playCount].youtube_hash, Main.videoBeginTime, 'hd720');
                    }
                }
            }
        );
    }
    Main.loadVideos = loadVideos;

    function loadPlayer(sort) {
        alert('loadplayer');

        // check save current channel exist and update playingChannelCount
        for (x in Main.usersChannelLists[Main.currentUserUid]) {
            if (Main.currentChannelPid == Main.usersChannelLists[Main.currentUserUid][x].pid) {
                Main.playingChannelCount = Main.usersChannelsNumber.indexOf(x.toString());
                break;
            } else {
                Main.currentChannelPid === 0
            }
        };
        // Main.playingChannelCount = Main.usersChannelsNumber.indexOf(Main.currentChannelPid.toString());
        if (Main.currentChannelPid === 0) {
            Main.currentChannelPid = document.querySelector('.menu_focus').childNodes[2].innerHTML;
            Main.playingChannelCount = 0;
        }
        Main.loadVideos(Main.currentChannelPid, '', Main.playingChannelCount);
        Main.channelBreakLog('r', Main.currentChannelPid);

        if (document.querySelector('#player')) {
            initPlayer();
        }
        function initPlayer() {
            var player;
            function playChannel(count) {
                // init player
                player = new YT.Player('player', {
                    width: Main.w,
                    height: Main.h,
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
                    document.querySelector('#video_title').innerHTML = Main.videosList[Main.playCount].title;
                    Main.toggleMenu();
                    setTimeout(function() {
                        Main.toggleInfoBar();
                    }, 1000);
                    alert('videolist:'+Main.videosList);
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
                        alert('play get total time:'+player.getDuration());
                        document.querySelector('#totalTime').innerHTML = toHHMMSS(player.getDuration());
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
                    player.destroy();
                    Main.playCount++;
                    if (Main.playCount > (Main.videosList.length -1)) {
                        Main.playCount = 0;
                    }
                    document.querySelector('#video_title').innerHTML = Main.videosList[Main.playCount].title;
                    playChannel(Main.playCount);
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
                document.querySelector('#progress_time').style.width = 0;
                Main.playCount++;
                if (Main.playCount > (Main.videosList.length -1)) {
                    Main.playCount = 0;
                }
                Main.clearsPlaying();
                document.querySelector('#video_title').innerHTML = Main.videosList[Main.playCount].title;
                Main.showInfoBar();
                player.loadVideoById(Main.videosList[Main.playCount].youtube_hash, 0 , 'hd720');
                // player.playVideo();
            }
            Main.playLoop = playLoop;

            function switchVideo(switching) {
                alert('switchVideo');
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
                document.querySelector('#video_title').innerHTML = Main.videosList[Main.playCount].title;
                document.querySelector('#progress_time').style.width = 0;
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
                switch(switching) {
                    case 0:
                    Main.playingChannelCount--;
                    if (Main.playingChannelCount < 0) {
                        Main.playingChannelCount = Main.usersChannelsNumber.length -1;
                    }
                    break;
                    case 1:
                    Main.playingChannelCount++;
                    if (Main.playingChannelCount > (Main.usersChannelsNumber.length -1)) {
                        Main.playingChannelCount = 0;
                    }
                    break;
                }
                channelInfoUI.setAttribute('class', '');
                channelNumberUI.innerHTML = Main.usersChannelsNumber[Main.playingChannelCount];
                channelNameUI.innerHTML = Main.usersChannelLists[Main.currentUserUid][Main.usersChannelsNumber[Main.playingChannelCount]].title;
                // Main.viewOpen(channelInfoUI, 'infoBarOpen');
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

    function channelBreakLog(status, pid) {
        switch(status) {
            case 'w':
                // write
                if (!Main.usersChannelsLog[Main.currentUserUid]) {
                    Main.usersChannelsLog[Main.currentUserUid] = {};
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
                                console.log('break');
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
                console.log('Main.menuCount:'+Main.channelsCount);
            break;
            case 'down':
                Main.menuCount++;
                Main.channelsCount++;
                if (Main.menuCount > Main.menuView - 1) {
                    Main.menuCount = Main.menuView - 1;
                    if (Main.channelsCount < Main.tmpUsersChannels[Main.viewMenuChannelsUid].length) {
                        var view = document.createElement('ul');
                        for (var i = Main.channelsCount - Main.menuView + 1; i < Main.channelsCount + 2; i++) {
                            if (i === Main.tmpUsersChannels[Main.viewMenuChannelsUid].length) {
                                console.log('break');
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
                console.log('Main.menuCount:'+Main.channelsCount);
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
                console.log('con' + Main.channelsCount);
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
                    console.error(1);
                    var l = Main.tmpUsersChannels[Main.viewMenuChannelsUid].length;
                    Main.channelsCount = l - 1;
                    Main.menuCount = Main.menuView - 1;
                    var view = document.createElement('ul');
                    for (var i = l - Main.menuView; i < l; i++) {
                        var viewList = Main.tmpUsersChannels[Main.viewMenuChannelsUid][i];
                        view.appendChild(viewList);
                    }
                } else {
                    console.error(2);
                    var view = document.createElement('ul');
                    for (var i = Main.channelsCount; i < Main.channelsCount + Main.menuView; i++) {
                        var viewList = Main.tmpUsersChannels[Main.viewMenuChannelsUid][i];
                        view.appendChild(viewList);
                    }
                }
                console.log('Main.menuCount:'+Main.channelsCount);
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
            console.log('right');
            Main.usersChannelsCount++;
            if (Main.usersChannelsCount > Main.usersList.length - 1) {
                Main.usersChannelsCount = 0;
            }
        } else {
            console.log('left');
            Main.usersChannelsCount--;
            if (Main.usersChannelsCount < 0) {
                Main.usersChannelsCount = Main.usersList.length - 1;
            }
        }
        var viewUserChannels = parseInt(Main.usersList[Main.usersChannelsCount], 10);
        Main.viewMenuChannelsUid = viewUserChannels;
        console.log(Main.viewMenuChannelsUid);
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
        console.log(channelListView);
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
                console.log(top - listHeight);
                if (h === (top - listHeight)) {
                    document.querySelector('#bind_users').style.top = '-' + (top - listHeight) + 'px';
                }
                console.log((l - 1)*listHeight);
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
                console.log(listHeight*(Main.usersListCount - (listView - 1)));
                if (!top) {
                    top = 0;
                }
                if ((h - top) === listHeight*listView) {
                    document.querySelector('#bind_users').style.top = '-' + listHeight*(Main.usersListCount - (listView - 1)) + 'px';
                    console.log(listHeight*(Main.usersListCount - (listView - 1)));
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
    function videoSelect(lastFocus, currentFocus) {
        if (lastFocus === currentFocus) {
           return;
        }
        document.querySelector('#video_' + lastFocus).setAttribute('class', 'cell');
        document.querySelector('#video_' + currentFocus).setAttribute('class', 'cell list_focus');

        if (currentFocus%16 !== 0) {
            document.querySelector('#video_list_bg').style.top = '-' + (Math.floor(currentFocus/16)*720 - 50) + 'px';
        } else {
            document.querySelector('#video_list_bg').style.top = '-' + (((currentFocus/16) - 1)*720 - 50) + 'px';
        }
    }
    Main.videoSelect = videoSelect;

    /**
     * use number switch channel
     * @param {number} num [reomte control number]
     */
    function NumSwitchChannel(num) {
        if (!Main.settingState) {
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
                channelNameUI.innerHTML = Main.playingChannel.title;
            }, 3000);
        }
    }
    Main.NumSwitchChannel = NumSwitchChannel;
}

};

Main.onUnload = function()
{
    Main.channelBreakLog('w');
    var fileCurrentChannelPid = fileSystemObj.openCommonFile(curWidget.id + '/currentChannelPid.data', 'w');
    if (fileCurrentChannelPid) {
        fileCurrentChannelPid.writeAll(Main.currentChannelPid.toString());
    }
    fileSystemObj.closeCommonFile(fileCurrentChannelPid);
    Main.clearsPlaying();
};

window.onkeydown = keyBoardControl;
function keyBoardControl(e) {
    switch(e.keyCode)
    {
        case 88:
            alert("RETURN");
            if (!Main.loadState) {
                widgetAPI.blockNavigation(event);
                alert('settingState:'+Main.settingState);
                alert('videoListView:'+Main.videoListView);
                if (!Main.settingState) {
                    if (Main.videoListState) {
                        alert('videoList return');
                        // video list
                        Main.viewClose(videoListUI, 'videoListState');
                        Main.videoListView = 0;
                            if (Main.videosList.length !== 0) {
                                Main.player.playVideo();
                            }
                    } else if (Main.menuOpen) {
                        alert('menu return');
                        Main.viewClose(menuUI, 'menuOpen');
                    } else if(Main.exitState) {
                        Main.viewClose(exitUI, 'exitState');
                        Main.exitFocus = 1;
                        document.querySelector('#exit_1').setAttribute('class', 'exit_focus');
                        document.querySelector('#exit_2').setAttribute('class', '');
                    } else {
                        alert('app return');
                        // save playing log
                        Main.channelBreakLog('w');
                        var fileCurrentChannelPid = fileSystemObj.openCommonFile(curWidget.id + '/currentChannelPid.data', 'w');
                        if (fileCurrentChannelPid) {
                            fileCurrentChannelPid.writeAll(Main.currentChannelPid.toString());
                        }
                        fileSystemObj.closeCommonFile(fileCurrentChannelPid);

                        // confirm exit
                        Main.viewOpen(exitUI, 'exitState');

                        // widgetAPI.sendReturnEvent();
                    }
                } else {
                    alert('setting return');
                    if (Object.keys(Main.users).length === 0) {
                        if (Main.usersListState) {
                            Main.viewClose(settingSyncedUsersUI, 'usersListState');
                            settingNoSyncUI.setAttribute('class', 'hide');
                            if (Main.videoListView) {
                                // return videolist
                                alert('setting return videoList(no user)');
                                Main.viewClose(settingUI, 'settingState');
                                Main.videoListState = 1;
                            } else {
                                alert('userList return(no user)');
                                Main.settingState = 0;
                                if (Main.videosList.length !== 0) {
                                    Main.player.playVideo();
                                }
                            }
                        }
                        if (Main.syncUserState) {
                            // for not user sync default view
                            clearInterval(polling);
                            document.querySelector('#ping_code').innerHTML = 'Loading...';
                            document.querySelector('#gen_ping_code').setAttribute('class', 'hide');
                            Main.viewClose(settingBindUI, 'syncUserState');
                            Main.viewOpen(settingSyncedUsersUI, 'usersListState', 'view');
                        } else {
                            Main.viewClose(settingUI, 'settingState');
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
                            document.querySelectorAll('#bind_users li')[Main.usersListCount].setAttribute('class', '');
                            Main.usersListCount = 0;
                            document.querySelectorAll('#bind_users li')[Main.usersListCount].setAttribute('class', 'users_list_focus');
                            document.querySelector('#bind_users').style.top = 0;
                            settingUI.setAttribute('class', 'view');
                            Main.viewClose(settingSyncedUsersUI, 'usersListState');
                            document.querySelector('#gen_ping_code').setAttribute('class', 'hide');
                            clearInterval(polling);
                        } else if (Main.syncUserState) {
                            settingUI.setAttribute('class', 'view');
                            Main.viewClose(settingBindUI, 'syncUserState');
                            document.querySelector('#gen_ping_code').setAttribute('class', 'hide');
                            clearInterval(polling);
                            document.querySelector('#ping_code').innerHTML = 'Loading...';
                        } else if (Main.termsState) {
                            settingUI.setAttribute('class', 'view');
                            Main.viewClose(tosUI, 'termsState');
                            Main.scrollCount = 0;
                            document.querySelector('#terms_iframe').scrollTop = 0;
                        } else if (Main.videoListView) {
                            // return videolist
                            settingNoSyncUI.setAttribute('class', 'hide');
                            Main.viewClose(settingSyncedUsersUI, 'usersListState');
                            Main.viewClose(settingUI, 'settingState');
                            Main.videoListState = 1;
                        } else {
                            // setting back player
                            alert('setting back player');
                            Main.viewClose(settingUI, 'settingState');
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
        case 37:
            alert("LEFT");
            if (!Main.loadState) {
                if (!Main.settingState) {
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
                            Main.videoSelect(Main.lastFocus, Main.currentFocus);
                        }
                    } else {
                        Main.timeJumps(0);
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
            if (!Main.loadState) {
                if (!Main.settingState) {
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
                        Main.videoSelect(Main.lastFocus, Main.currentFocus);
                    } else {
                        Main.timeJumps(1);
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
            if (!Main.loadState) {
                if (!Main.settingState) {
                    if (Main.menuOpen) {
                        Main.channelSelect('up');
                        Main.menuSetTimeoutToHide();
                    } else if (Main.videoListState) {
                        if (Main.currentFocus > Main.row) {
                            Main.lastFocus = Main.currentFocus;
                            Main.currentFocus -= Main.row;
                            Main.videoSelect(Main.lastFocus, Main.currentFocus);
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
                        alert('upup');
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
            if (!Main.loadState) {
                if (!Main.settingState) {
                    if (Main.menuOpen) {
                        Main.channelSelect('down');
                        Main.menuSetTimeoutToHide();
                    } else if (Main.videoListState) {
                        var l = document.querySelectorAll('.cell').length;
                        Main.lastFocus = Main.currentFocus;
                        Main.currentFocus += Main.row;
                        if (Main.currentFocus > l) {
                            Main.currentFocus -= Main.row;
                        } else {
                            Main.currentFocus = Math.min(l, Main.currentFocus);
                        }
                        Main.videoSelect(Main.lastFocus, Main.currentFocus);
                    } else {
                        if (Main.videosList.length !== 0) {
                            if (Main.player.getCurrentTime() !== 0) {
                                Main.switchVideo(1);
                            }
                        }
                    }
                } else {
                    if (Object.keys(Main.users).length && Main.usersListState && !Main.unBindConfirm) {
                        alert('downdown');
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
            if (!Main.loadState) {
                if (!Main.settingState) {
                    if (Main.menuOpen) {
                        Main.channelBreakLog('w');
                        // play channel
                        var pid = document.querySelector('.menu_focus').childNodes[2].innerHTML;
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
                        Main.playingChannelCount = Main.channelsCount;
                        console.error(Main.channelsCount);
                        Main.loadVideos(pid, 'play', Main.playingChannelCount);
                        Main.viewClose(menuUI, 'menuOpen');
                        Main.viewClose(videoListUI, 'videoListState');

                        if (Main.currentUserUid === Main.viewMenuChannelsUid) {
                            Main.saveCurrentUser();
                        }
                    } else if (Main.videoListState) {
                        if (Main.player.getPlayerState() === 1) {
                            alert('pause');
                            Main.player.pauseVideo();
                        }
                        // play video
                        var count = document.querySelector('.list_focus').getAttribute('id');
                        count = parseInt(count.slice(6), 10) - 1;
                        Main.playCount = count;
                        Main.clearsPlaying();
                        document.querySelector('#video_title').innerHTML = Main.videosList[Main.playCount].title;
                        document.querySelector('#progress_time').style.width = 0;
                        Main.toggleInfoBar();
                        Main.player.loadVideoById(Main.videosList[Main.playCount].youtube_hash, 0, 'hd720');
                        Main.viewClose(videoListUI, 'videoListState');
                        Main.videoListView = 0;
                    } else if (Main.exitState) {
                        // for player exit
                        switch(Main.exitFocus) {
                            case 1:
                                Main.viewClose(exitUI, 'exitState');
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
                        Main.viewOpen(settingSyncedUsersUI, 'usersListState', 'view');
                        // if not user
                        if (Object.keys(Main.users).length === 0) {
                            settingNoSyncUI.setAttribute('class', '');
                            settingUsersListUI.setAttribute('class', 'hide');
                            document.querySelector('#users_info').setAttribute('class', 'hide');
                            document.querySelector('#default_info').setAttribute('class', 'info');
                        } else {
                            settingNoSyncUI.setAttribute('class', 'hide');
                            settingUsersListUI.setAttribute('class', '');
                            document.querySelector('#users_info').setAttribute('class', 'info');
                            document.querySelector('#default_info').setAttribute('class', 'hide');
                        }
                    } else if (Object.keys(Main.users).length === 0 && Main.usersListState) {
                        alert('not user into sync default view');
                        // for not user sync default view
                        Main.viewClose(settingSyncedUsersUI, 'usersListState');
                        Main.viewOpen(settingBindUI, 'syncUserState','view');
                        document.querySelector('#gen_ping_code').setAttribute('class', '');
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
                        Main.viewOpen(settingBindUI, 'syncUserState', 'view');
                        document.querySelector('#gen_ping_code').setAttribute('class', '');
                        Main.bindUser();
                    }
                }
            }
            if (Main.welcomeState && Main.exitState === 0) {
                Main.viewClose(welcomeUI, 'welcomeState');
                setTimeout(function() {
                    Main.checkRegistration();
                },3000);
            }
            if (Main.exitState) {
                // for load exit
                switch(Main.exitFocus) {
                    case 1:
                        Main.viewClose(exitUI, 'exitState');
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
        case 114:
            alert("Red");
            if (!Main.loadState && !Main.settingState && !Main.exitState) {
                if (!Main.videoListState) {
                    // show videolist
                    Main.viewClose(menuUI, 'menuOpen');
                    infoBarUI.setAttribute('class', 'hide');
                    channelInfoUI.setAttribute('class', 'hide');
                    Main.infoBarOpen = 0;
                    Main.player.pauseVideo();
                    Main.viewOpen(videoListUI, 'videoListState');
                } else {
                    if (Main.videosList.length !== 0) {
                        Main.player.playVideo();
                    }
                    Main.viewClose(videoListUI, 'videoListState');
                }
            }
        break;
        case 71:
        case 179:
            alert("Green");
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
        case 177:
            alert("Yellow");
            if (!Main.loadState && !Main.settingState && !Main.exitState) {
                if (Main.player.getPlayerState() === 1 || Main.player) {
                    Main.player.pauseVideo();
                }
                // reset UI
                infoBarUI.setAttribute('class', 'hide');
                channelInfoUI.setAttribute('class', 'hide');
                Main.infoBarOpen = 0;
                Main.viewClose(menuUI, 'menuOpen');

                Main.settingState = 1;
                if (Object.keys(Main.users).length === 0) {
                    // if not user
                    settingUI.setAttribute('class', 'hide');
                    settingSyncedUsersUI.setAttribute('class', 'view');
                    Main.usersListState = 1;
                    settingNoSyncUI.setAttribute('class', '');
                    document.querySelector('#default_info').setAttribute('class', 'info');
                    settingUsersListUI.setAttribute('class', 'hide');
                    document.querySelector('#users_info').setAttribute('class', 'hide');
                } else if (!Main.welcomeState) {
                    settingUI.setAttribute('class', 'view');
                }
                if (Main.videoListState) {
                    Main.videoListState = 0;
                    Main.videoListView = 1;
                }
            }
        break;
        case 66:
        case 176:
            alert("Blue");
            if (!Main.loadState && !Main.exitState) {
                Main.toggleMenu();
                if (Main.settingState && !Main.usersListState && !Main.syncUserState) {
                    settingUI.setAttribute('class', 'hide');
                    Main.viewOpen(tosUI, 'termsState', 'view');
                }
            }
        break;
        case 33:
            alert("ch up");
            if (!Main.loadState) {
                if (Main.menuOpen) {
                    Main.channelSelect('pgUp');
                    Main.menuSetTimeoutToHide();
                } else if (Main.videoListState) {
                    if (Main.currentFocus > 16) {
                        Main.lastFocus = Main.currentFocus;
                        Main.currentFocus -= 16;
                        Main.videoSelect(Main.lastFocus, Main.currentFocus);
                    } else {
                       Main.lastFocus = Main.currentFocus;
                       Main.currentFocus = 1;
                       Main.videoSelect(Main.lastFocus, Main.currentFocus);
                   }
                } else if (!Main.settingState) {
                    Main.channelBreakLog('w');
                    Main.switchChannel(0);
                }
            }
        break;
        case 34:
            alert("ch down");
            if (!Main.loadState) {
                if (Main.menuOpen) {
                    Main.channelSelect('pgDn');
                    Main.menuSetTimeoutToHide();
                } else if (Main.videoListState) {
                    var l = document.querySelectorAll('.cell').length;
                    Main.lastFocus = Main.currentFocus;
                    Main.currentFocus += 16;
                    // if (Main.currentFocus > l) {
                    //  Main.currentFocus -= 16;
                    // } else {
                    //  Main.currentFocus = Math.min(l, Main.currentFocus);
                    // }
                    Main.currentFocus = Math.min(l, Main.currentFocus);
                    Main.videoSelect(Main.lastFocus, Main.currentFocus);
                } else if (!Main.settingState) {
                    Main.channelBreakLog('w');
                    Main.switchChannel(1);
                }
            }
        break;
        case 83:
            alert('save');
            Main.channelBreakLog('w');
            var fileCurrentChannelPid = fileSystemObj.openCommonFile(curWidget.id + '/currentChannelPid.data', 'w');
            if (fileCurrentChannelPid) {
                fileCurrentChannelPid.writeAll(Main.currentChannelPid.toString());
            }
            fileSystemObj.closeCommonFile(fileCurrentChannelPid);
        break;
        case 49:
            alert("1");
            var num = 1;
            Main.NumSwitchChannel(num);
        break;
        case 50:
            alert("2");
            var num = 2;
            Main.NumSwitchChannel(num);
        break;
        case 51:
            alert("3");
            var num = 3;
            Main.NumSwitchChannel(num);
        break;
        case 52:
            alert("4");
            var num = 4;
            Main.NumSwitchChannel(num);
        break;
        case 53:
            alert("5");
            var num = 5;
            Main.NumSwitchChannel(num);
        break;
        case 54:
            alert("6");
            var num = 6;
            Main.NumSwitchChannel(num);
        break;
        case 55:
            alert("7");
            var num = 7;
            Main.NumSwitchChannel(num);
        break;
        case 56:
            alert("8");
            var num = 8;
            Main.NumSwitchChannel(num);
        break;
        case 57:
            alert("9");
            var num = 9;
            Main.NumSwitchChannel(num);
        break;
        case 48:
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
    } else if (e.keyCode === 66 && Main.keyCount === 8) {
        Main.keyCount++;
    } else if (e.keyCode === 65 && Main.keyCount === 9) {
        Main.keyCount = 0;
        alert('打密技阿你');
        console.error('打密技阿你');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/appInfo.data');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/users.data');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/lastBindUser.data');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/currentUser.data');
        var bResult = fileSystemObj.deleteCommonFile(curWidget.id + '/usersChannelsLog.data');
    } else {
        Main.keyCount = 0;
    }
}
