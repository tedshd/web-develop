<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2017-01-09 15:59:36
 * @version $Id$
 */

function httpGet($url)
{
    $ch = curl_init();
    curl_setopt($ch,CURLOPT_URL,$url);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Authorization: key=',
    ));
    $output = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);
    return array(
        'info' => $info,
        'res' => $output
    );
}
echo json_encode(httpGet('https://iid.googleapis.com/iid/info/?details=true'));

?>