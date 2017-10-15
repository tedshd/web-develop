<?php
include("simple_html_dom.php");

function filterHTMLTag($content)
{
    $content = preg_replace('/<[^>]*>/', '', $content);
    $content = preg_replace('/\s/', '', $content);
    return $content;
}

$url = "http://www.mol.gov.tw/topic/3070/";

$html = file_get_html($url);

$ap = $html->find(".ap", 0);

$title = $ap->find("h1", 0)->innertext;

$article = $ap->find("article", 0)->innertext;

$items = $ap->find(".ac-container", 0)->find("div");

$itemsArray = array();

foreach($items as $item)
{
        $tempArray = array();
        foreach($item->find('label') as $list)
        {
            $listTitle = $list->innertext;
            $tempArray['cat'] = $listTitle;
            $tempArray['content'] = array();
            foreach($list->next_sibling("article") as $listTitleItem)
            {
                if ($listTitleItem->innertext !== null) {
                    $tempArray2 = array();
                    foreach($listTitleItem->find('li') as $li)
                    {
                        $a = $li->find('a', 0);
                        if ($a) {
                            $tempArray3 = array($a->innertext, $a->href);
                            array_push($tempArray2, $tempArray3);
                        } else {
                            array_push($tempArray2, $li->innertext);
                        }
                    }
                    array_push($tempArray['content'], $tempArray2);
                }
            }
        }
        array_push($itemsArray, $tempArray);
}


header('Content-Type: application/json; charset=utf-8');

$response = array();

$response["title"] = filterHTMLTag($title);
$response["article"] = filterHTMLTag($article);
$response["items"] = $itemsArray;

// print_r($items);
// print_r(json_encode($itemsArray));

print_r(json_encode($response));

// print_r(json_encode($response));

// print_r(preg_replace('/<[^>]*>/', '', $article));


// var_dump($title);

?>