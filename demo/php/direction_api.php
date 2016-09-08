<?php
function multiple_threads_request($nodes){
        $mh = curl_multi_init();
        $curl_array = array();
        foreach($nodes as $i => $node)
        {
            $curl_array[$i] = curl_init($node["url"]);
            curl_setopt($curl_array[$i], CURLOPT_RETURNTRANSFER, true);
            curl_multi_add_handle($mh, $curl_array[$i]);
        }
        $running = NULL;
        do {
            usleep(10000);
            curl_multi_exec($mh,$running);
        } while($running > 0);

        $res = array();
        foreach($nodes as $i => $node)
        {
            $res[$node["ts"]] = curl_multi_getcontent($curl_array[$i]);
        }

        foreach($nodes as $i => $node){
            curl_multi_remove_handle($mh, $curl_array[$i]);
        }
        curl_multi_close($mh);
        return $res;
}
?>

<?php

function timestamp_array($timestamp)
{
    // date('H:i:s', time())
    $timestamp_array = [];
    $timestamp_before_2 = $timestamp - (20 * 60);
    $timestamp_before_1 = $timestamp - (10 * 60);
    $timestamp_after_1  = $timestamp + (10 * 60);
    $timestamp_after_2  = $timestamp + (20 * 60);
    $now = time();
    $diff = $timestamp - $now;

    if (0 > $diff) {
        $timestamp_array = [
            // "1--" . date('H:i:s', $timestamp),
            $now,
            $now + (10 * 60),
            $now + (20 * 60),
            $now + (30 * 60),
            $now + (40 * 60),
        ];
    } else if (10 * 60 > $diff) {
        $timestamp_array = [
            // "2--" . date('H:i:s', $timestamp),
            $timestamp,
            $timestamp_after_1,
            $timestamp_after_2,
            $timestamp + (30 * 60),
            $timestamp + (40 * 60),
        ];
    } else if (20 * 60 > $diff) {
        $timestamp_array = [
            // "3--" . date('H:i:s', $timestamp),
            $timestamp_before_1,
            $timestamp,
            $timestamp_after_1,
            $timestamp_after_2,
            $timestamp + (30 * 60),
        ];
    } else {
        $timestamp_array = [
            // "4--" . date('H:i:s', $timestamp),
            $timestamp_before_2,
            $timestamp_before_1,
            $timestamp,
            $timestamp_after_1,
            $timestamp_after_2,
        ];
    }
    if ($now ) {
        # code...
    }
    return $timestamp_array;

}

?>

<?php

$origin = "25.0414375+121.5314411";// 地址、地點 ID 或文字型緯度/經度值。
$destination = "25.0491747+121.5407537";

$mode = "driving";
// driving (預設) 指出行駛公路網的標準開車路線。
// walking 要求行經 (可用) 人行道的步行路線。
// bicycling 要求行經 (可用) 單車道與偏好街道的單車路線。
// transit 要求行經 (可用) 大眾運輸路線的路線。如果您將模式設定為 transit，您可以選擇性指定 departure_time 或 arrival_time。如果未指定任一時間，departure_time 會預設為現在 (也就是將出發時間預設為目前時間)。您也可以選擇性包括 transit_mode 和/或 transit_routing_preference。
$alternatives = "false";
$units = "metric";
$departure_time = time();
$transit_mode = "rail";
// bus 指出計算的路線應該偏好搭乘公車。
// subway 指出計算的路線應該偏好搭乘地下鐵。
// train 指出計算的路線應該偏好搭乘火車。
// tram 指出計算的路線應該偏好搭乘有軌電車或輕軌。
// rail 指出計算的路線應該偏好搭乘火車、有軌電車、輕軌及地下鐵。這相當於 transit_mode=train|tram|subway。

$direction_api = "https://maps.googleapis.com/maps/api/directions/json?origin=" . $origin .
    "&destination=" . $destination .
    "&mode=" . $mode .
    "&alternatives=" . $alternatives .
    "&units=" . $units .
    "&departure_time=" . $departure_time .
    "&key=";

date_default_timezone_set("UTC");
// echo "UTC:".time();
// echo "<br>";

date_default_timezone_set("Asia/Taipei");
// echo "Europe/Helsinki:".time();
// echo "<br>";

// echo date('H:i:s', time());


function gen_apis($value='') {
    $direction_api_array = [];
    $apis = [];
    // print_r(timestamp_array(time()));
    $ts_array = timestamp_array(time());
    foreach ($ts_array as $i => $ts) {
        $origin = "25.0414375+121.5314411";// 地址、地點 ID 或文字型緯度/經度值。
        $destination = "25.0491747+121.5407537";

        $mode = "driving";
        // driving (預設) 指出行駛公路網的標準開車路線。
        // walking 要求行經 (可用) 人行道的步行路線。
        // bicycling 要求行經 (可用) 單車道與偏好街道的單車路線。
        // transit 要求行經 (可用) 大眾運輸路線的路線。如果您將模式設定為 transit，您可以選擇性指定 departure_time 或 arrival_time。如果未指定任一時間，departure_time 會預設為現在 (也就是將出發時間預設為目前時間)。您也可以選擇性包括 transit_mode 和/或 transit_routing_preference。
        $alternatives = "false";
        $units = "metric";
        $departure_time = time();
        $transit_mode = "rail";
        // bus 指出計算的路線應該偏好搭乘公車。
        // subway 指出計算的路線應該偏好搭乘地下鐵。
        // train 指出計算的路線應該偏好搭乘火車。
        // tram 指出計算的路線應該偏好搭乘有軌電車或輕軌。
        // rail 指出計算的路線應該偏好搭乘火車、有軌電車、輕軌及地下鐵。這相當於 transit_mode=train|tram|subway。
        $direction_api = "https://maps.googleapis.com/maps/api/directions/json?origin=" . $origin .
            "&destination=" . $destination .
            "&mode=" . $mode .
            "&alternatives=" . $alternatives .
            "&units=" . $units .
            "&departure_time=" . $ts .
            "&key=";
        $direction_api_array[$i] = $direction_api;
        $apis[$i] = [
            "url" => $direction_api_array[$i],
            "ts" => $ts
        ];
    }
    // print_r($apis);
    return $apis;
}
gen_apis();

$apis = [
    [
        "url" => $direction_api,
        "ts" => $departure_time
    ],
    [
        "url" => $direction_api,
        "ts" => $departure_time + 10
    ],
];
// print_r($apis);
// print_r(multiple_threads_request($apis));
print_r(multiple_threads_request(gen_apis()));

// header('Content-Type: application/json; charset=utf-8');
// echo json_encode(multiple_threads_request(array($direction_api)));

?>
