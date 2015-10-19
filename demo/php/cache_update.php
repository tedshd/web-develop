<?php
clearstatcache();
function autoversion($url) {
    $path = pathinfo($url);
    # $ver = stat($_SERVER['DOCUMENT_ROOT'].$url)[mtime];
    $ver = filemtime($_SERVER['DOCUMENT_ROOT'] . $url);
    return  $url . "?v=" .$ver;
}
# example
?>

<html>
<head>
<title></title>
<link href="<?php echo autoversion('/demo/web-develop/demo/reset.css');?>" rel="stylesheet">
</head>
<body>
</body>
</html>
