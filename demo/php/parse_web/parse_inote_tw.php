<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>parse</title>
<meta name="description" content="">
<link href="" rel="stylesheet">
</head>
<body>
<ol>
<?php

include("simple_html_dom.php");

for ($i=0; $i < 27; $i++) {
    $html = file_get_html('http://www.inote.tw/category/%E8%94%AC%E9%A3%9F%E7%94%9F%E6%B4%BB/page/' . $i);
    $articles = $html->find("article");
    foreach ($articles as $article) {
        $a = $article->find("h1", 0)->find("a", 0);
        $href = $a->href;
        $con = $a->innertext;
        $html = file_get_html($href);
        $shop = $html->find('//*[@id="getsocialmain"]/div[1]/p', 0);
        echo '<li><a href="' . $href . '" target="_blank">' . $con . '</a>' . $shop . '</li>';
        sleep(1);
    }
    // flush();
    // ob_flush();
    sleep(1);
}
echo 'END';


?>
</ol>
</body>
</html>

