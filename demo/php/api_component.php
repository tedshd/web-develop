<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2013-12-24 11:28:02
 * @version $Id$
 */

// var_dump($_GET);
// var_dump($_POST);
// echo '<br>';
// echo $_GET['user'];
// echo '<br>';
// echo $_GET['password'];
// echo '<br>';
$json_data = array(
    'w' => $_GET['w'],
    'h' => $_GET['h'],
    'id' => $_GET['id'],
);
$request_json = json_encode($json_data, true);
// echo $request_json;
// echo $_GET['callback'] . '(' . $request_json . ');';
echo 'if(!component) {var component = {}};component.' . $_GET['id'] .'=' . $request_json;
// echo '<br>';
// echo $request_json['user'];

?>
