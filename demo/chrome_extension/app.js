/*global $, jQuery, alert, console, angular, document, Element, chrome*/
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2013-11-21 00:52:08
 * @version $Id$
 */

function runApp (fb_data) {

    var xhr,
        formData,
        getTabUrl,
        video_hash,
        // node
        choice = node('#choice'),
        // Function
        handleClick,
        handleSelect,
        handleCreate,
        handleAdd;

    console.log('get_data', fb_data);
    // node('#data').innerHTML = fb_data;
    node('#avatar').setAttribute('alt', fb_data.name);
    node('#avatar').setAttribute('src', 'https://graph.facebook.com/'+fb_data.id+'/picture');
    node('#user').innerHTML = fb_data.name;

    function loginMiiiTV () {
        formData = new FormData();
        var token_arr = localStorage.accessToken.split('=');
        formData.append('sns_uid', fb_data.id);
        formData.append('token', token_arr[1]);

        xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://www.miiitv.com/service/q/login', true);
        xhr.onload = function(e) {
            var data;
            console.log('loginMiiiTV');
            // console.log(e);
            // console.log(this);
            // console.log('response', this.response);
            data = JSON.parse(this.response);
            console.log(data);
            if (data.status === 'ok') {
                loadChannelList();
            } else {
                document.write('loginMiiiTV fail');
            }
        };
        xhr.send(formData);
    };
    loginMiiiTV();

    function loadChannelList () {
        xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://www.miiitv.com/service/q/getChannelList', true);
        xhr.onload = function(e) {
            var data,
                x;
            console.log('loadChannelList');
            // console.log(e);
            // console.log(this);
            // console.log('response', this.response);
            data = JSON.parse(this.response);
            console.log(data);
            console.log(data.channels);
            if (data.status === 'ok') {
                for (x in data.channels) {
                    if (data.channels.hasOwnProperty(x)) {
                        var li = document.createElement('li');
                        li.setAttribute('class', 'channel');
                        li.setAttribute('data-pid', data.channels[x].pid);
                        li.innerHTML = data.channels[x].ch_name;
                        // console.log(li);
                        node('#channel_list').appendChild(li);
                    }
                }
                // console.log(data.channels.ch_name);
            } else {
                document.write('loadChannelList fail');
            }
        };
        xhr.send();

    }


    /**
     *         __                    ____                                                       __
     *      / /_  ____ _____  ____/ / /__     ____ _____  ____  _____   ___ _   _____  ____  / /_
     *     / __ \/ __ `/ __ \/ __  / / _ \   / __ `/ __ \/ __ \/ ___/  / _ \ | / / _ \/ __ \/ __/
     *    / / / / /_/ / / / / /_/ / /  __/  / /_/ / /_/ / /_/ (__  )  /  __/ |/ /  __/ / / / /_
     *   /_/ /_/\__,_/_/ /_/\__,_/_/\___/   \__,_/ .___/ .___/____/   \___/|___/\___/_/ /_/\__/
     *                                          /_/   /_/
     *
     * getTabUrl
     * handleClick
     * handleSelect
     * handleCreate
     * handleAdd
     */

    chrome.tabs.getSelected(null, function(tab) {
        getTabUrl(tab.url);
    });

    function getTabUrl(tabUrl) {
        console.log(tabUrl);
        if (tabUrl.match('youtube')) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
                match = tabUrl.match(regExp);
            if (match && match[2].length === 11) {
                video_hash = match[2];
                // document.write(match[2]);
            } else {
                document.write('It is not youtube video page');
            }
        } else {
            document.write('It is not youtube video page');
            //error
        }
    }

    function handleClick() {
        var channelList = node('#option');
        if (channelList.getAttribute('class')) {
            channelList.setAttribute('class', '');
        } else {
            channelList.setAttribute('class', 'hide');
        }
    }

    function handleSelect() {
        if (!node('#add').getAttribute('disabled')) {
            node('#add').removeAttribute('disabled');
        }
        choice.innerHTML = this.innerHTML;
        choice.setAttribute('class', 'btn btn-info');
        choice.setAttribute('data-pid', this.getAttribute('data-pid'));
    }

    function handleCreate() {
        var channelName = node('#channel_name'),
            newList = document.createElement('li');
        if (!channelName.value) {
            node('#error_msg').setAttribute('class', 'error');
            return;
        }
        // reset UI
        node('#error_msg').setAttribute('class', 'hide');
        newList.setAttribute('class', 'channel');
        newList.innerHTML = channelName.value;
        node('#channel_list').appendChild(newList);
        channelName.value = '';
    }

    function handleAdd () {
        // console.log(choice.innerHTML);
        // console.log(choice.getAttribute('data-pid'));
        // console.log(video_hash);
        formData = new FormData();
        if (choice.getAttribute('data-pid') === 'null') {
            formData.append('pid', 'new');
        } else {
            formData.append('pid', choice.getAttribute('data-pid'));
        }
        formData.append('video_hash', video_hash);
        formData.append('p_name', choice.innerHTML);

        xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://www.miiitv.com/service/q/addVideo', true);
        xhr.onload = function(e) {
            var data;
            console.log('handleAdd');
            // console.log(e);
            // console.log(this);
            // console.log('response', this.response);
            data = JSON.parse(this.response);
            console.log(data);
            if (data.status === 'ok') {
                node('#add').setAttribute('class', 'btn btn-success');
                node('#add').innerHTML = 'success';
                setTimeout(function () {
                    node('#add').setAttribute('class', 'btn');
                    node('#add').innerHTML = 'Add';
                },
                1600);
            } else {
                document.write('handleAdd fail');
            }
        };
        xhr.send(formData);
    }

    choice.addEventListener('click', handleClick);
    node('ul').addDelegateListener('click', 'li', handleSelect);
    node('#create').addEventListener('click', handleCreate);
    node('#add').addEventListener('click', handleAdd);
}
