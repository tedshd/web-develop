<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Tedshd - Version</title>
<meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
<meta name="description" content="">
<meta name="keywords" content="">
<script src="https://rawgithub.com/tedshd/device.js/master/lib/device.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<!-- <script src="../../lib/jquery-1.10.1.js"></script> -->
<!-- <script src="/lib/angular_v1.2.16.js"></script> -->
<!-- <link rel="stylesheet" href="/lib/bootstrap-3.0.0/css/bootstrap.css"> -->
<style>
    body {
        background: #121212;
        color: #aaa;
        line-height: 1.3;
        letter-spacing: 2px;
    }
    .highlight {
        color: #fff;
    }
</style>
</head>
<body>
    <h1>Version: 0.1 Beta</h1>
<?php
/**
echo "USER AGENT : ". $_SERVER['HTTP_USER_AGENT'];
**/
?>
<div>
    USER AGENT : <span class="highlight"><?php echo $_SERVER['HTTP_USER_AGENT']; ?></span>
</div>
<?php
function get_client_ip()
{
    if ($_SERVER['HTTP_CLIENT_IP']) { // check ip from share internet
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif ($_SERVER['HTTP_X_FORWARDED_FOR']) { // to check ip is pass from proxy
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}
// echo "IP : " . get_client_ip();
?>
<div>
    IP : <span class="highlight"><?php echo get_client_ip(); ?></span>
</div>
<?php
    function browser($value='')
    {
        $agent = $_SERVER['HTTP_USER_AGENT'];
        if (strpos($agent, 'OPR') > 0) {
            return 'Opera';
        }
        if (strpos($agent, 'Opera') > 0) {
            return 'Opera';
        }
        if (strpos($agent, 'Firefox') > 0) {
            return 'Firefox';
        }
        if (strpos($agent, 'Chrome') > 0) {
            return 'Chrome';
        }
        if (strpos($agent, 'Safari') > 0) {
            return 'Safari';
        }
        if (strpos($agent, 'MSIE 7') > 0) {
            return 'IE7';
        }
        if (strpos($agent, 'MSIE 8') > 0) {
            return 'IE8';
        }
        if (strpos($agent, 'MSIE 9') > 0) {
            return 'IE9';
        }
        if (strpos($agent, 'MSIE 10') > 0) {
            return 'IE10';
        }
        if (strpos($agent, 'like Gecko') > 0) {
            return 'IE11';
        }
        if (strpos($agent, 'MSIE') > 0) {
            return 'IE';
        }

        return 'unknown browser';
    }
    // echo "Browser : ". browser();
?>
<div>
    Browser : <span class="highlight"><?php echo browser(); ?></span>
</div>
<div>
    <div>Device Type : <span id="device_type" class="highlight"></span></div>
    <div>Orientation : <span id="orientation" class="highlight"></span></div>
    <div>Device OS : <span id="device_os" class="highlight"></span></div>
</div>
<div>
    Width : <span id="w" class="highlight"></span>
    <br>
    Height : <span id="h" class="highlight"></span>
</div>
</body>
<script type="text/javascript">
    $(document).ready(function() {
        win_size();
        function win_size() {
            var h=window.document.documentElement.clientHeight;
            var w=window.document.documentElement.clientWidth;
            $("#h").html(h);
            $("#w").html(w);
        };
        $(window).resize(function() {
            win_size();
        });
    });
</script>
<script type="text/javascript">
    var deviceTypeBoolean = [device.mobile(), device.tablet(), device.desktop()],
        deviceType = ['mobile', 'tablet', 'desktop'],
        orientationBoolean = [device.portrait(), device.landscape()],
        orientation = ['portrait', 'landscape'],
        deviceOsBoolean = [device.mac(), device.ipad(), device.ipod(), device.iphone(), device.android(), device.androidTablet(), device.blackberryTablet(), device.fxos(), device.fxosPhone(), device.fxosTablet(), device.windows(), device.windowsPhone(), device.windowsTablet()],
        deviceOs = ['Mac', 'ipad', 'ipod', 'iphone', 'android', 'androidTablet', 'blackberryTablet', 'fxos', 'fxosPhone', 'fxosTablet', 'Windows', 'WindowsPhone', 'WindowsTablet'];
    for (var i = 0; i < deviceTypeBoolean.length; i++) {
        if (deviceTypeBoolean[i]) {
            $('#device_type').html(deviceType[i]);
        }
    }
    for (var i = 0; i < orientationBoolean.length; i++) {
        if (orientationBoolean[i]) {
            $('#orientation').html(orientation[i]);
        }
    }
    for (var i = 0; i < deviceOsBoolean.length; i++) {
        if (deviceOsBoolean[i]) {
            $('#device_os').html(deviceOs[i]);
        }
    }
</script>
</html>
