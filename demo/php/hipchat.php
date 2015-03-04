<?php
date_default_timezone_set('Asia/Taipei');

require 'vendor/autoload.php';
use GorkaLaucirica\HipchatAPIv2Client\Auth\OAuth2;
use GorkaLaucirica\HipchatAPIv2Client\Client;
use GorkaLaucirica\HipchatAPIv2Client\API\RoomAPI;
use GorkaLaucirica\HipchatAPIv2Client\API\UserAPI;

// $auth = new OAuth2('689TXdCSib1ePuYMXrcNU8oYlCbM5ZgTeWRfqx72');
$auth = new OAuth2('wKUtUr0n2DJL7hbCVey0HQh8HVtnH0DR2aJj5Jyn');
$client = new Client($auth);

$userAPI = new UserAPI($client);
$user = $userAPI->getUser('@TedShiu');

// print_r($userAPI);

$roomAPI = new RoomAPI($client);
$room = $roomAPI->getRooms(array('max-results' => 30));

// var_dump($room);

$token= "?auth_token=" . "wKUtUr0n2DJL7hbCVey0HQh8HVtnH0DR2aJj5Jyn";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.hipchat.com/v2/room/1273616/notification" . $token);
curl_setopt($ch, CURLOPT_POST, true); // 啟用POST
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query( array( "message"=>"認真工作的 Ted 又 push code 了") )); 
curl_exec($ch); 
curl_close($ch);

?>
