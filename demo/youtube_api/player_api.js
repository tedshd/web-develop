/*global $, jQuery, alert, console, angular*/
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2014-02-17 00:31:49
 * @version $Id$
 */

// need <script src="http://www.youtube.com/iframe_api"></script> in HTML

// videoList is a array put youtube vide hash id
/*videoList = [
    '9COe8DCV0O8',
    'zebShorVev4',
    'zMpuwAbQcM4',
    '2_BSVWMiojU',
    'EcsoYwO83aw',
    'SquQpiztDME',
    'Qb57Ddj8VRA',
    'tIfjrmkxvYw',
    'Ef2Hfc1Ya9w',
    'Ug3Y3eesePA'
];*/

function loadPlayer() {
    var videoList = {},
        playCount = 0,
        player,
        playLoop;
    function playChannel(count) {
        playCount = count;
        // init player
        player = new YT.Player('player', {
            width: '1280',
            height: '720',
            videoId: videoList[count],
            playerVars: {
                rel: 1,
                autoplay: 1,
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
                'onError'        : Error
            }
        });

        // play video
        function onPlayerReady() {
            setTimeout(
                function() {
                    if (player.getDuration() === 0) {
                        playLoop();
                    }
                },
                3000
            );
        }
    }

    /**
     * when video end auto play next video
     */
    function playLoop() {
        playCount++;
        if (playCount > (videoList.length -1)) {
            playCount = 0;
        }
        player.loadVideoById(videoList[playCount]);
        player.playVideo();
        setTimeout(
            function() {
                if (player.getDuration() === 0) {
                    playLoop();
                }
            },
            3000
        );
    }

    function onPlayerStateChange(event) {
        // get state
        // video end play next vide
        if (event.data === 0) {
            playLoop();
        }
        // video buffer
        if (event.data === 3) {
            console.log('buffer');
            setTimeout(
                function() {
                    if (player.getPlayerState() === 3) {
                        var t = player.getCurrentTime();
                        player.stopVideo();
                        player.clearVideo();
                        player.loadVideoById(videoList[playCount], t);
                        setTimeout(function() {
                            player.playVideo();
                        },500);
                    }
                },
                3000
            );
        }
    }

    function Error(e) {
        console.log('ERROR', e);
    }

    function onYouTubeIframeAPIReady() {
        playChannel(0);
    }

    setTimeout(function() {
        onYouTubeIframeAPIReady();
    }, 1200);

}
loadPlayer();