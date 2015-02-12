/*global $, jQuery, alert, console, angular, JSONP, Main*/
/**
 *
 * @authors Ted Shiu (ted_shiu@miiicasa.com)
 * @date    2014-04-16 16:16:21
 * @version $Id$
 */

function ajaxHandle(url, sig, param, functionName, otherParam) {
    JSONP.init({
        error: function(ex) {
            alert("Failed to load : " + ex.url);
            console.log("Failed to load : " + ex.url);
        }
    });
    JSONP.get(
        url,
        param,
        function(data) {
            // var data = utf8_decode(JSON.stringify(data));
            // data = JSON.parse(data);
            switch (functionName) {
            case 'getAllProfileInfo':
                if (data.status === 'fail') {
                    Main.errorHandleReRegApp();
                    return;
                }
                getAllProfileInfo(data);
                break;
            case 'getAllChannel':
                if (data.status === 'fail') {
                    Main.errorHandleReRegApp();
                    return;
                }
                getAllChannel(data);
                break;
            case 'unBindUser':

                if (data.status === 'fail') {
                    Main.errorHandleReRegApp();
                    return;
                }
                unBindUser(data);

                break;
            case 'bindUser':
                if (data.status === 'fail') {
                    Main.errorHandleReRegApp();
                    return;
                }
                bindUser(data);
                break;
            case 'polling':
                var count;
                alert('polling response');
                alert('polling status:'+JSON.stringify(data));
                bind(data);
                break;
            case 'getDefaultChannel':
                var status = otherParam;
                alert('4.getdefaultchanneldata');
                loadDefaultChannels(data, status, Main.sort);
                break;
            case 'getUserChannel':
                var status = otherParam;
                if (data.status === 'fail') {
                    if (data.errmsg === 'User not exist!') {
                        if (Object.keys(Main.users).length) {
                            Main.currentUserUid = parseInt(Object.keys(Main.users)[0], 10);
                            Main.getUserChannel(status);
                            Main.userInfo();
                        // } else {
                            // TODO
                        }
                        // return;
                    }
                    Main.errorHandleReRegApp();
                    return;
                }
                Main.sort = 2;
                loadUserChannel(data, status);
                // Main.channelsDefault = {};
                break;
            case 'loadVideos':
                if (data.status === 'fail') {
                    Main.errorHandleReRegApp();
                    return;
                }
                loadVideos(data);

                break;
            }
        }
    );

    function getAllProfileInfo(data) {
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
                alert('reset current user');
                Main.currentUserUid = data.user[0].uid;
                Main.saveCurrentUser();
            }
        }
        Main.viewMenuChannelsUid = Main.currentUserUid;
        Main.usersChannelsCount = Main.usersList.indexOf(Main.currentUserUid.toString());
        alert('currentUserUid+:'+Main.currentUserUid);
        if (Object.keys(Main.users).length) {
            Main.getAllChannel();
        }
        loadPlayingChannels();
    }

    function loadPlayingChannels() {
        // load user channel if it saved
        if (Object.keys(Main.users).length === 0) {
            alert('2.getDefaultChannel');
            Main.getDefaultChannel('init');
        } else {
            alert('init load user channel');
            Main.userInfo();
            // Main.usersList = 1;
            Main.getUserChannel('init');
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

    function getAllChannel(data) {
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
    }

    function unBindUser(data) {
        var uid = otherParam;
        delete Main.usersChannelsLog[uid];
        delete Main.usersChannelLists[uid];
        delete Main.tmpUsersChannels[uid];
        // detele user channel list
        document.querySelector('.menu_title').innerHTML = '';
        document.querySelector('.channel_list').innerHTML = '';
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
                Main.matchDefaultData[0] = {};
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
            Main.playingChannelCount = -1;
            Main.getDefaultChannel();
            settingUI.setAttribute('class', 'view');
            viewClose(settingSyncedUsersUI, 'usersListState');
            settingUsersListUI.setAttribute('class', 'hide');
            settingUsersListInfoUI.setAttribute('class', 'hide');
            settingNoSyncUI.setAttribute('class', '');
            settingNoSyncInfoUI.setAttribute('class', 'info');
            settingPingCodeUI.setAttribute('class', 'hide');
        } else {
            Main.usersListCount--;
            if (Main.usersListCount < 0) {
                Main.usersListCount = 0
            }
            document.querySelectorAll('#bind_users li')[Main.usersListCount].setAttribute('class', 'users_list_focus');
        }
        if (uid === Main.currentUserUid) {
            var lastBindUserId = document.querySelectorAll('#bind_users li')[0].getAttribute('id').slice(5);
            Main.currentUserUid = parseInt(lastBindUserId, 10);
            if (uid === Main.viewMenuChannelsUid) {
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
        } else {
            console.error(1);
            if (uid === Main.viewMenuChannelsUid) {
                console.error(2);
                var channelListView = document.createElement('ul');
                if (Main.channelsCount > Main.tmpUsersChannels[Main.currentUserUid].length - Main.menuView) {
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
    }

    function bindUser(data) {
        // show pin code on tv
        alert(JSON.stringify(data));
        pingCodeUI.innerHTML = data.pin_code;
        bind(data);
    }

    // check bind user
    function bind(data) {
        if (data.bind_uid) {
            for (x in data.user) {
                if(data.user[x].uid === data.bind_uid) {
                    count = x;
                }
            }
            clearInterval(polling);
            document.querySelector('#sync_ok span').innerHTML = data.user[count].name;
            syncOKUI.setAttribute('class', 'info_bar large');
            if (syncOKUI.getAttribute('class') === 'info_bar large') {
                setTimeout(function() {
                    syncOKUI.setAttribute('class', 'hide');
                }, 5000);
            }
            document.querySelector('#setting_1 img').setAttribute('src', data.user[count].user_icon);
            document.querySelector('#setting_1 p').innerHTML = data.user[count].name;
            document.querySelector('.menu_title img').setAttribute('src', data.user[count].user_icon);
            document.querySelector('.menu_title span').innerHTML = data.user[count].name + '的頻道列表';

            Main.users[data.user[count].uid] = {
                uid: data.user[count].uid,
                name: data.user[count].name,
                icon: data.user[count].user_icon
            };
            Main.usersList = Object.keys(Main.users);
            buildUsersList();

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
                Main.tmpUsersChannels[Main.currentUserUid].push(li);
            }
        }
        Main.channelsDefault = data.default_channels;

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
        Main.usersChannelsNumber = Object.keys(Main.usersChannelLists[Main.currentUserUid]);
        Main.usersChannelsNumber = Main.usersChannelsNumber.sort(function(a,b){return b-a});
        Main.playingChannelCount = -1;

        Main.channelSelect();
    }

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
            // GA (define for GA)
            Main.defaultChannels = tmpDefaultChannelData;
            Main.channelNeedsUpdate = 1;
            menuUpdate();
            // load player
            if (status === 'init') {
                Main.loadPlayer(sort);
            }
        }
    }

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
            Main.getDefaultChannel(status);
            menuUpdate();
        }
    }

    function menuUpdate() {
        if (Main.channelNeedsUpdate === 0) {
            return;
        }
        Main.channelNeedsUpdate = 0;
        Main.usersChannelLists[Main.currentUserUid] = {};
        Main.tmpUsersChannels[Main.currentUserUid] = [];
        var tmpChannel = document.createElement('ul');
        // build channel list
        // user channel
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
        // default channel
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
        if (!Object.keys(Main.users).length) {
            var moreChannel = document.createElement('li'),
                msg = document.createElement('div');
            msg.style.height= '90px';
            msg.setAttribute('class', 'normal moreChannel');
            msg.innerHTML = '更多頻道';
            moreChannel.appendChild(msg);
            Main.tmpUsersChannels[Main.currentUserUid].push(moreChannel);
        }
        if (Object.keys(Main.channelsDefault).length && Main.viewMenuChannelsUid === Main.currentUserUid) {
            var channelListView = document.createElement('ul');
            for (var i = 0; i < Main.menuChannelsVRendered; i++) {
                var viewList = Main.tmpUsersChannels[Main.currentUserUid][i];
                channelListView.appendChild(viewList);
            }
            channelListView.querySelectorAll('li')[0].setAttribute('class', 'menu_focus');
            Main.channelsCount = 0;
            Main.menuCount = 0;
            document.querySelector('.channel_list').innerHTML = channelListView.innerHTML;
            channelListView.querySelectorAll('li')[Main.menuCount].setAttribute('class', '');
        }
        // update channel data
        Main.usersChannelsNumber = Object.keys(Main.usersChannelLists[Main.currentUserUid]);
        if (Main.sort === 2) {
            Main.usersChannelsNumber = Main.usersChannelsNumber.sort(function(a,b){return b-a});
        }
        Main.playingChannelCount = Main.usersChannelsNumber.indexOf(Main.playingChannel.number);
    }

    function loadVideos(data) {
        var pid = otherParam.pid,
            status = otherParam.status,
            playingChannelCount = otherParam.playingChannelCount;
        // GA
        if (Main.defaultChannels.indexOf(pid) === -1) {
            _gaq.push(['_trackEvent', 'watch', 'normal_' + pid + '', data.user.name]);
        } else {
            _gaq.push(['_trackEvent', 'watch', 'official_' + pid + '', data.user.name]);
        }

        Main.currentChannelPid = pid;

        channelNumberUI.innerHTML = Main.usersChannelsNumber[playingChannelCount];
        channelNameUI.innerHTML = Main.usersChannelLists[Main.currentUserUid][Main.usersChannelsNumber[Main.playingChannelCount]].title;
        document.querySelector('#video_list_bg').innerHTML = '';
        Main.playingChannel = {
            title: data.user.name,
            number: Main.usersChannelsNumber[playingChannelCount]
        };

        if (!data.user) {
            removeVideosUI.setAttribute('class', 'large');
            channelVideosErrorHandle();
        } else if (data.user.videos.length === 0) {
            // no video in channel
            alert('no video in this channel');
            noVideosUI.setAttribute('class', 'large');
            channelVideosErrorHandle();
        } else if (data.user.onair === '0' && data.user.author_uid !== Main.currentUserUid.toString()) {
            console.log('private');
            removeVideosUI.setAttribute('class', 'large');
            channelVideosErrorHandle();
        } else {
            Main.saveCurrentChannel();

            alert('build video list');
            var videoListCount = 1,
                videoCount = 1;
            Main.videoListTop = 0;
            // TODO Modify to memory build list
            var tmpVideoList = document.createDocumentFragment();
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
                        cell.setAttribute('data-video-count', videoCount);
                        cell.appendChild(img);
                        cell.appendChild(divName);
                        tmpVideoList.appendChild(cell);
                        Main.tmpVideoList.push(cell);
                        videoListCount++;
                        videoCount++;
                    } else {
                        var cell = document.createElement('div'),
                            divError = document.createElement('div'),
                            divName = document.createElement('div');
                        divError.innerHTML = '不能播放';
                        divName.setAttribute('class', 'list_video_title normal');
                        divName.innerHTML = data.user.videos[x].title;
                        if (videoListCount === 1) {
                            cell.setAttribute('class', 'cell list_focus');
                        } else {
                            cell.setAttribute('class', 'cell');
                        }
                        cell.setAttribute('id', 'video_' + videoListCount);
                        divError.setAttribute('class', 'video_format_error');
                        cell.appendChild(divError);
                        cell.appendChild(divName);
                        tmpVideoList.appendChild(cell);
                        Main.tmpVideoList.push(cell);
                        videoListCount++;
                    }
                }
            }
            document.querySelector('#video_list_bg').appendChild(tmpVideoList);
            videoListTitleUI.innerHTML = data.user.name;
            Main.lastFocus = 0;
            Main.currentFocus = 1;
            document.querySelector('#video_list_bg').style.top = '0px';

            Main.videosList = [];
            for (var i = 0; i < data.user.videos.length; i++) {
                if (data.user.videos[i].media_format === '5,1,6') {
                    Main.videosList.push(data.user.videos[i]);
                }
            }
            if (Main.videosList.length === 0) {
                noVideosUI.setAttribute('class', 'large');
                channelVideosErrorHandle();
            }
            Main.playCount = 0;
            Main.channelBreakLog('r', pid);
            if (Main.videosList.length) {
                infoBarVideoTitleUI.innerHTML = Main.videosList[Main.playCount].title;
            }
            if (status === 'play') {
                if (Main.player.getPlayerState() === YT.PlayerState.PLAYING) {
                    Main.player.pauseVideo();
                }
                Main.clearsPlaying();
                if (!Main.settingState) {
                    document.querySelector('#channel_info').setAttribute('class', '');
                    Main.showInfoBar();
                }
                if (Main.videosList.length) {
                    Main.player.loadVideoById(Main.videosList[Main.playCount].youtube_hash, Main.videoBeginTime, 'hd720');
                }
            }
        }
        if (status === 'build') {
            Main.buildPlayer();
        }
        function channelVideosErrorHandle() {
            clearInterval(updateCurrentTimeInterval);
            if (Main.player) {
                Main.player.pauseVideo();
                Main.clearsPlaying();
            }
            videoListTitleUI.innerHTML = Main.usersChannelLists[Main.currentUserUid][Main.usersChannelsNumber[Main.playingChannelCount]].title;
            infoBarVideoTitleUI.innerHTML = '';
            Main.resetPlayerTime();
            Main.videosList = [];
        }
    }
}
Ajax.ajaxHandle = ajaxHandle;