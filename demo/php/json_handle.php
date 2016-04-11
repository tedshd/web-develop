<?php
// print_r($_POST);
// var_dump($_POST);
// exit;
// echo $_POST['user'];
$response = array(
    'name' => $_POST['user'],
    'password' => $_POST['pwd'],
);
echo json_encode($response, true);
header('Content-Type: application/json; charset=utf-8');
?>
