<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2014-01-15 14:48:44
 * @version $Id$
 */

// create a new cURL resource
$ch = curl_init();

// set URL and other appropriate options
curl_setopt($ch, CURLOPT_URL, "http://gdata.youtube.com/feeds/api/videos/DDs5bXh4erM?alt=json");
// curl_setopt($ch, CURLOPT_URL, "http://tw.yahoo.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// grab URL and pass it to the browser

$a = curl_exec($ch);

// close cURL resource, and free up system resources
curl_close($ch);

// echo '<script>document.querySelector(".ylogo").remove(0);</script>';

// echo $a;

echo '<br>';
$arr = json_decode($a, TRUE);

echo $arr['version'];

?>