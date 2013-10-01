<?php
// var_dump($_POST['json']);
// echo $_POST['val'];
var_dump($_POST);
echo '<br>';
echo $_POST['json'];
echo '<br>';
$request_json = json_decode($_POST['json'], true);
var_dump($request_json);
echo '<br>';
echo $request_json['user'];
// echo phpinfo();
// echo $GLOBALS['HTTP_RAW_POST_DATA'];
exit;
// $json = json_decode($json);
// var_dump($json);
?>