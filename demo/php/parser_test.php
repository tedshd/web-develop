<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2015-12-14 02:24:26
 * @version $Id$
 */

header('Content-Type: application/json; charset=utf-8');

include("simple_html_dom.php");

$base_url = "http://buy.gamer.com.tw/";

$url = "http://buy.gamer.com.tw/indexList.php";

$page = $_GET["page"];
if(isset($page))
{
    if ($page < 5)
    {
        $url = $url . "?page=" . $page . "&gc1=998";
    }
    else
    {
        $error = [
            "status" => "fail",
            "message" => "argument error"
        ];
        echo json_encode($error);
        exit;
    }
}
else
{
    $url = $url . "?page=1&gc1=998";
}

$html = file_get_html($url);

// Find all images
// foreach($html->find('img') as $element) {
//    echo '<img src="' . $element->src . '">'. '<br>';
// }

// Find all links
// foreach($html->find('a[class=ES-lbox2C]') as $element) {
//     echo '<a href="' . $base_url . $element->href . '" target="_blank">' .
//         $element->innertext . '-' . $element->next_sibling() . '</a>' . '<br>';
// }

$response = [];
foreach($html->find("p[class=ES-lbox2A]") as $element)
{
    $array = [
        "title" => $element->children(1)->innertext,
        "price" => $element->children(2)->innertext,
        "img" => $element->first_child()->first_child()->src,
        "link" => $base_url . $element->first_child()->href

    ];
    array_push($response, $array);
}

echo json_encode($response);