/*global $, jQuery, alert, console, angular*/
/**
 *
 * @authors Ted Shiu (ted_shiu@miiicasa.com)
 * @date    2014-04-02 18:22:20
 * @version $Id$
 */

var Main = {
    apiUrl: 'http://www.miiitv.com',
    playerWidth: 1280,
    playerHeight: 720,
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
    regError: 0,
    networkError: 0,
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
    menuUpdateTime: 5000,
    menuLastUpdateTime: 0,
    viewMenuChannelsUid: 0,
    // video list
    tmpVideoList: [],
    videoListState: 0,
    videoListView: 0,
    videoListTop: 0,
    lastFocus: 1,
    currentFocus: 1,
    row: 4,
    videoTotalTime: 0,
    // exit
    exitState: 0,
    exitFocus: 1,
    // channel
    tmpUsersChannels: {}, // tmpUsersChannels: {<uid>:[channels li, channels li],<uid>:[channels li, channels li]}
    channelNeedsUpdate: 0,
    channelsDefault: {},
    matchDefaultData: {},
    usersChannelsData: {},
    defaultChannels: [],
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

var Ajax = {};