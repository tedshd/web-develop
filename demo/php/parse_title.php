<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2016-02-09 10:25:25
 *
 */

include("simple_html_dom.php");

$url = json_decode($_POST["url"], true)["url"];

$url = "http://www.minwt.com/mac/14497.html";

$html = file_get_html($url);

$title = $html->find("head title")[0]->innertext;

// print_r($title);

header('Content-Type: application/json; charset=utf-8');

echo $title;

?>