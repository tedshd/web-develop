<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2014-09-05 19:00:44
 * @version $Id$
 */

$a1=array("a"=>"red","b"=>"green","c"=>"blue","d"=>"yellow");
$a2=array("e"=>"red","f"=>"green","g"=>"blue","d"=>"black");

$result=array_diff($a1,$a2);
print_r($result);
$result_2=array_diff($a2,$a1);
print_r($result_2);

?>