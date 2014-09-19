<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2014-09-17 15:46:34
 * @version $Id$
 */

echo time();

sleep(3);

echo '<br>';
echo time();

echo '<hr>';
$today = date("F j, Y, g:i a");                 // March 10, 2001, 5:16 pm
echo '<hr>';
echo $today;
$today = date("m.d.y");                         // 03.10.01
echo '<hr>';
echo $today;
$today = date("j, n, Y");                       // 10, 3, 2001
echo '<hr>';
echo $today;
$today = date("Ymd");                           // 20010310
echo '<hr>';
echo $today;
$today = date('h-i-s, j-m-y, it is w Day');     // 05-16-18, 10-03-01, 1631 1618 6 Satpm01
echo '<hr>';
echo $today;
$today = date('\i\t \i\s \t\h\e jS \d\a\y.');   // it is the 10th day.
echo '<hr>';
echo $today;
$today = date("D M j G:i:s T Y");               // Sat Mar 10 17:16:18 MST 2001
echo '<hr>';
echo $today;
$today = date('H:m:s \m \i\s\ \m\o\n\t\h');     // 17:03:18 m is month
echo '<hr>';
echo $today;
$today = date("H:i:s");                         // 17:16:18
echo '<hr>';
echo $today;
$today = date("Y-m-d H:i:s");                   // 2001-03-10 17:16:18 (the MySQL DATETIME format)
echo '<hr>';
echo $today;
?>