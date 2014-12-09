/*global $, jQuery, alert, console, window, document, angular*/
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2014-10-01 10:23:15
 * @version $Id$
 */

(function () {
    var addVideoTimeout = 10000,
        watchVideosResult,
        addVideosArray,
        videosCount,
        videosObj = {},
        videosArray = [],
        invalidUrl = 0,
        invalidUrlArray = [],
        pid = $('#pid').val(),
        loadingViewFull = $('#loading-view-full');
    function parseVideos(urlArray, parseEnd) {
        loadingViewFull.removeClass('hide');
        watchDogAddVideos();
        var urlArray = $('.add-videos').val().replace(/\n/g, '<br>').split('<br>');
        addVideosArray = urlArray;
        videosCount = urlArray.length;
        for (var i = 0; i < urlArray.length; i++) {
            if (urlArray[i] === '') {
                videosCount--;
                addVideos();
                break;
            }
            getYoutubeVideoInfo(parseYoutubeId(urlArray[i]), i);
            getDailymotionVideoInfo(parseDailymotionId(urlArray[i]), i);
            getYoukuVideoInfo(parseYoukuId(urlArray[i]), i);
            // console.log(parseYoukuId(urlArray[i]));
            if (invalidUrl === 3) {
                videosCount--;
                invalidUrlArray.push(urlArray[i]);
                addVideos();
            }
            invalidUrl = 0;
        }

        function watchDogAddVideos() {
            watchVideosResult = setTimeout(function() {
                videosCount = 0;
                addVideos();
            }, 15000);
        }
        function addVideos() {
            if (videosCount !== 0) {
                return;
            }
            clearTimeout(watchVideosResult);
            console.log(videosObj);
            for (x in videosObj) {
                if (videosObj.hasOwnProperty(x)) {
                    videosArray.push(videosObj[x]);
                }
            }
            console.log(videosArray);
            console.log(invalidUrlArray);
            if (invalidUrlArray.length) {
                var ul = document.createElement('ul');
                for (var i = 0; i < invalidUrlArray.length; i++) {
                    var li = document.createElement('li');
                    li.innerHTML = invalidUrlArray[i];
                    ul.appendChild(li);
                }
                $('#fail-list').append(ul.innerHTML);
                $('#fail-content').removeClass('hide');
            }

            function addVideosResultNotification(msg) {
                $('.add-video-layer').modFullLayer().close();
                $('.add-videos').val('');
                loadingViewFull.addClass('hide');
                var notification = new NotificationFx({
                    message : msg,
                    layout : 'bar',
                    effect : 'slidetop',
                    type : 'notice', // notice, warning or error
                    ttl: 10000,
                    onClose : function() {
                    }
                });
                // show the notification
                notification.show();
                // reset
                videosArray = [];
                videosObj = {};
                invalidUrlArray = [];
            }
            if (!videosArray.length) {
                var msgFail = '',
                    msg;
                if (invalidUrlArray.length) {
                    msgFail = UTIL.getLang('videos_cannot_process' ,'some videos cannot be process', {':number' : invalidUrlArray.length})+
                        '<a id="add-video-fail-list" href="javascript:void(0)">'+ UTIL.getLang('see_more_video_detail') +'</a>';
                }
                msg = '<span class="icon icon-megaphone"></span>' +
                    '<p>' +UTIL.getLang('already_add') + videosArray.length + ' ' + UTIL.getLang('videos_count') + msgFail + '</p>';
                addVideosResultNotification(msg);
                return;
            }
            // post
            $.ajax({
                url: '/videos',
                type: 'POST',
                data: {
                    id: pid,
                    videos: videosArray
                },
                success: function(data) {
                    console.log(data);
                    var msgFail = '',
                        msg,
                        okVideosCount = 0;
                        failVideosCount = 0,
                        dupVideosCount = 0;
                    okVideosCount = videosArray.length;
                    console.log(addVideosArray);
                    console.log(videosArray);
                    data.data.dup_video = [];
                    if (data.data.dup_video.length || invalidUrlArray.length) {
                        if (data.data.dup_video && data.data.dup_video.length) {
                            $('#duplicate-content').removeClass('hide');
                            var ul = document.createElement('ul');
                            for (var i = 0; i < data.data.dup_video.length; i++) {
                                var li = document.createElement('li');
                                for (var j = 0; j < addVideosArray.length; j++) {
                                    if (addVideosArray[j].search(data.data.dup_video[i]) !== -1) {
                                        li.innerHTML = addVideosArray[j];
                                    }
                                }
                                // TODO change dup_url to hash
                                // li.innerHTML = data.data.dup_video[i];
                                ul.appendChild(li);
                            }
                            $('#duplicate-list').append(ul.innerHTML);
                            dupVideosCount = data.data.dup_video.length;
                            okVideosCount = videosArray.length - data.data.dup_video.length;
                        }
                        if (invalidUrlArray.length) {
                            $('#fail-content').removeClass('hide');
                            failVideosCount = invalidUrlArray.length;
                        }
                        msgFail = UTIL.getLang('but_has') + (failVideosCount + dupVideosCount) + ' ' + UTIL.getLang('videos_cannot_process')+
                            '<a id="add-video-fail-list" href="javascript:void(0)">'+ UTIL.getLang('see_more_video_detail') +'</a>';
                    }
                    msg = '<span class="icon icon-megaphone"></span>' +
                        '<p> ' + UTIL.getLang('already_add') + okVideosCount + ' '+ UTIL.getLang('videos_count')  + msgFail + '</p>';

                    addVideosResultNotification(msg);
                    parseEnd();
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }

        function parseYoutubeId(url) {
            if (url.match('youtube')) {
                var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
                    match = url.match(regExp);
                if (match && match[2].length === 11) {
                    video_hash = match[2];
                    return match[2];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }

        function parseDailymotionId(url) {
            var m = url.match(/^.+dailymotion.com\/((video|hub)\/([^_]+))?[^#]*(#video=([^_&]+))?/);
            return m ? m[5] || m[3] : null;
        }

        function parseYoukuId(url) {
            var m = url.match(/^.*v_show\/id_([0-9a-zA-Z\-\_]+).html/);
            if (m && m[1].search('_') !== -1) {
                m[1] = m[1].slice(0, m[1].search('_'));
            }
            return m ? m[1]: null;
        }

        function getYoutubeVideoInfo(vid, count) {
            if (!vid) {
                invalidUrl++;
                return;
            }
            $.ajax({
                url: 'http://gdata.youtube.com/feeds/api/videos/' + vid + '?v=2&alt=json',
                type: 'GET',
                data: {
                },
                timeout: addVideoTimeout,
                success: function(data) {
                    // console.log('youtube');
                    // console.log(data);
                    // get max youtube video cover
                    var youtubeVideoCovers = data.entry.media$group.media$thumbnail,
                        maxCover,
                        maxWidth = 0;
                    for (var i = 0; i < youtubeVideoCovers.length; i++) {
                        if (youtubeVideoCovers[i].width > maxWidth) {
                            maxCover = i;
                        }
                        maxWidth = youtubeVideoCovers[i].width;
                    }
                    var youtubeVideoObject = {
                        // author: data.entry.author[0].name.$t,
                        cover_url: data.entry.media$group.media$thumbnail[maxCover].url,
                        stream_hash: data.entry.media$group.yt$videoid.$t,
                        name: data.entry.title.$t,
                        // pid: pid,
                        source_type: 0, //0: yt, 1: dm, 2: yk
                        // url: data.entry.link[0].href
                    }
                    console.log(youtubeVideoObject);
                    videosObj[count] = youtubeVideoObject;
                    // videosArray.push(youtubeVideoObject);
                    videosCount--;
                    addVideos();
                },
                error: function(e) {
                    console.log(e);
                    videosCount--;
                    invalidUrlArray.push(addVideosArray[count]);
                }
            });
        }

        function getDailymotionVideoInfo(vid, count) {
            if (!vid) {
                invalidUrl++;
                return;
            }
            $.ajax({
                url: 'https://api.dailymotion.com/video/' + vid,
                type: 'GET',
                data: {
                },
                timeout: addVideoTimeout,
                success: function(data) {
                    // console.log('youtube');
                    // console.log(data);
                    var dailymotionVideoObject = {
                        // author: data.owner,
                        stream_hash: data.id,
                        name: data.title,
                        // pid: pid,
                        source_type: 1, //0: yt, 1: dm, 2: yk
                        // url: 'http://www.dailymotion.com/video/'+ data.id
                        // cover_url: data.entry.media$group.media$thumbnail[2].url
                    }
                    $.ajax({
                        url: 'https://api.dailymotion.com/video/' + data.id + '?fields=thumbnail_720_url',
                        type: 'GET',
                        data: {
                        },
                        timeout: addVideoTimeout,
                        success: function(data) {
                            dailymotionVideoObject.cover_url = data.thumbnail_720_url;
                            console.log(dailymotionVideoObject);
                            videosObj[count] = dailymotionVideoObject;
                            // videosArray.push(dailymotionVideoObject);
                            videosCount--;
                            addVideos();
                        },
                        error: function(e) {
                            console.log(e);
                            videosCount--;
                            invalidUrlArray.push(addVideosArray[count]);
                        }
                    });
                },
                error: function(e) {
                    console.log(e);
                    videosCount--;
                    invalidUrlArray.push(addVideosArray[count]);
                }
            });
        }

        function getYoukuVideoInfo(vid, count) {
            if (!vid) {
                invalidUrl++;
                return;
            }
            $.ajax({
                url: 'https://openapi.youku.com/v2/videos/show.json',
                type: 'GET',
                data: {
                    client_id: 'a3660779c8b57c32',
                    video_id: vid
                },
                timeout: addVideoTimeout,
                success: function(data) {
                    // console.log('youtube');
                    // console.log(data);
                    var youkuVideoObject = {
                        // author: data.user.name,
                        cover_url: data.bigThumbnail,
                        stream_hash: data.id,
                        name: data.title,
                        // pid: pid,
                        source_type: 2, //0: yt, 1: dm, 2: yk
                        // url: data.link
                    }
                    console.log(youkuVideoObject);
                    videosObj[count] = youkuVideoObject;
                    // videosArray.push(youkuVideoObject);
                    videosCount--;
                    addVideos();
                },
                error: function(e) {
                    console.log(e);
                    videosCount--;
                    invalidUrlArray.push(addVideosArray[count]);
                }
            });
        }
    }

    window.parseVideos = parseVideos;
    if (window.MIIITV) {
        window.MIIITV.parseVideos = parseVideos;
    }
})();

var parseVideos = new parseVideos(urlArray, function () {
    $('#sortable li').remove();
    // document.querySelector('#sortable').innerHTML = '';
    loadVideoList();
});
