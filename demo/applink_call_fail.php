<?php
function browser($value='')
    {
    if ( ! isset($_SERVER['HTTP_USER_AGENT'])) {
       return 'unknown browser';
    }
    $agent = $_SERVER['HTTP_USER_AGENT'];
    if (strpos($agent, 'Edge') > 0) {
        return 'Edge';
    }
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

function is_Android()
{
    $ua = strtolower($_SERVER['HTTP_USER_AGENT']);
    if(stripos($ua,'android') !== false) { // && stripos($ua,'mobile') !== false) {
        return true;
    }
}

function intentHandle($url)
{
    if (is_Android() && browser() === 'Chrome') {
        return 'intent://scan/#Intent;scheme=zxing;package=com.c.a.b.android;S.browser_fallback_url=' . $url . ';end';
    } else {
        return '' . $url;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>call intent fail</title>
<link href="" rel="stylesheet">
</head>
<body>
    <h1>正常 url</h1>
    <a href="https://tw.buy.yahoo.com/gdsale/gdsale.asp?gdid=6339266">Y! 購物中心</a>
    <br>
    <h1>用 intent 處理</h1>
    <a href="intent://scan/#Intent;scheme=zxing;package=com.c.a.b.android;S.browser_fallback_url=https://tw.buy.yahoo.com/gdsale/gdsale.asp?gdid=6339266;end">Y! 購物中心</a>
    <h1>php redirect</h1>
    <a href="<?php echo 'http://tedse.0fees.net/demo/php/redirect.php?u=' . urlencode('https://tw.buy.yahoo.com/gdsale/gdsale.asp?gdid=6339266'); ?>">Y! 購物中心</a>
    <h1>php detect Android chrome use intent</h1>
    <a id="js_click" href="<?php echo intentHandle('https://tw.buy.yahoo.com/gdsale/gdsale.asp?gdid=6339266'); ?>">Y! 購物中心</a>
    <a href="<?php echo intentHandle('http://adcenter.conn.tw/redirect_wa.php?member=af000071066&amp;tourl=http%3A%2F%2Fcrazymike.tw%2Findex.asp%3Fitem_id%3D48852'); ?>">瘋狂賣客</a>
</body>
<script>
</script>
</html>
