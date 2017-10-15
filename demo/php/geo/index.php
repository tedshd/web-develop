<?php
include_once('geoip.inc');

// set an IPv6 address for testing
// $ip='2601:8:be00:cf20:ca60:ff:fe09:35b5';

if ($_SERVER['HTTP_CLIENT_IP']) { // check ip from share internet
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif ($_SERVER['HTTP_X_FORWARDED_FOR']) { // to check ip is pass from proxy
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}

/*
test if $ip is v4 or v6 and assign appropriate .dat file in $gi
run appropriate function geoip_country_code_by_addr() vs geoip_country_code_by_addr_v6()
*/
if((strpos($ip, ":") === false)) {
    //ipv4
    $gi = geoip_open("/usr/share/GeoIP/GeoIP.dat",GEOIP_STANDARD);
    $country = geoip_country_code_by_addr($gi, $ip);
    $ip_type = "IPv4";
}
else {
    //ipv6
    $gi = geoip_open("/usr/share/GeoIP/GeoIPv6.dat",GEOIP_STANDARD);
    $country = geoip_country_code_by_addr_v6($gi, $ip);
    $ip_type = "IPv6";
}
$data = [
    "ip" => $ip,
    "ip_type" => $ip_type,
    "country" => $country
];
$request_json = json_encode($data, true);
header('Content-Type: application/json; charset=utf-8');
echo $_GET['callback'] . "(" . $request_json . ");";
// echo $ip . "<br>" . $country;
?>
