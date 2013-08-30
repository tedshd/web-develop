<?php

$arr = array(
    'val' => 1,
    'str' => 'string',
);
var_dump($arr);
echo '<pre>';
print_r($arr);

echo '<br>';
$to_string = serialize($arr);
echo $to_string;

echo '<br>';
$to_array = unserialize($to_string);
var_dump($to_array);

?>