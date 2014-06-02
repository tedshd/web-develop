<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2014-06-01 17:30:39
 * @version $Id$
 */

// $request = file_get_contents("php://input");
$method = $_SERVER['REQUEST_METHOD'];
switch($method)
{
    case "PUT":
        print_r($method);
        // print_r($_PUT);
        // var_dump(json_decode($_PUT['data']));
        // print_r(json_decode($request, true)['pwd']);
        // exit;
        $obj = json_decode($_PUT['data'], true);
        echo $obj['user'];
    break;
    case "GET":
        print_r($method);
        print_r($_GET);
        print_r($_GET['user']);
    break;
    case "DELETE":
        print_r($method);
        print_r($_DELETE);
        // var_dump(json_decode($_DELETE['data']));
        // print_r(json_decode($request, true));
        // exit;
        $obj = json_decode($_DELETE['data'], true);
        echo $obj['user'];
    break;
    case "POST":
        print_r($method);
        // print_r($_POST);
        // var_dump(json_decode($_POST['data']));
        // print_r($request);
        // print_r(json_decode($request, true));
        // exit;
        $obj = json_decode($_POST['data'], true);
        echo $obj['user'];
    break;
}

// $json_data = array(
//     'status' => 'ok',
//     'msg' => 'HAHAHA',
//     // 'user' => $_GET['user'],
// );
// $request_json = json_encode($json_data, true);
// echo $request_json;


?>