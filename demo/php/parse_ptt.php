<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2015-12-23 22:15:05
 * @version $Id$
 */

include("simple_html_dom.php");

$base_url = "https://www.ptt.cc";
$url = "https://www.ptt.cc/bbs/Gamesale/index3533.html";

$html = file_get_html($url);

// var_dump($html);
$next_url = $html->find("a[class=wide]")[1]->href;
$next_url = $base_url . $next_url;
echo $next_url;
foreach($html->find("a[class=wide]") as $element)
{
    echo $element->href;
}
?>