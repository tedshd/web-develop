<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2014-06-01 14:48:07
 * @version $Id$
 */

// var_dump($_POST);
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
// print_r($request);
// exit;
$user = $request->user;
$pwd = $request->pwd;
echo $user;
echo $pwd;

?>