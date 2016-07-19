#!/usr/bin/php -q
<?php
/* document: https://api.ccu.akamai.com/ccu/v2/docs/index.html */

define('AKAMAI_CDN_USER_NAME', 'ts.ung.hao@gmail.com');
define('AKAMAI_CDN_PASSWORD',  'devCDN168');

if (!isset($argv[1])) {
    echo "\nPlease input a url in sitemaji.com!\n\n";
    exit;
}

$paths = trim($argv[1]);
if (!$paths) {
    echo "\nPlease input a url in sitemaji.com!\n\n";
    exit;
}

if ($argc >= 1) {
    for ($i = 1; $i < $argc; $i++) {
        $paths = trim($argv[$i]);
        if ($a = purge_akamai_ccu_rest(array($paths))) {
            echo "\n$paths, cdn flush finish ... $a \n";
        } else {
            echo "\n$paths, cdn flush fail ... $a \n";
        }
    }
}

// {{{ function purge_akamai_ccu_rest($urls, $username = AKAMAI_CDN_USER_NAME, $password = AKAMAI_CDN_PASSWORD)
function purge_akamai_ccu_rest($urls, $username = AKAMAI_CDN_USER_NAME, $password = AKAMAI_CDN_PASSWORD)
{
    if (empty($urls) || $username == '' || $password == '')
        return false;

    $akamai_ccu_rest_api_url = 'https://api.ccu.akamai.com/ccu/v2/queues/default';
    $data = stripslashes(json_encode(array('objects' => $urls)));

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $akamai_ccu_rest_api_url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $r = curl_exec($ch);
    $r = json_decode($r);

    curl_close($ch);

    $purge_status_string = 'Check the progress by => curl https://api.ccu.akamai.com' . $r->{'progressUri'} . ' -u ' . "$username:$password\n";

    return $purge_status_string;
}
// }}}

// 範例
// $urls = array('http://ad.sitemaji.com/ysm_feebee.js', 'http://ad.sitemaji.com/maji_feebee.js');
// echo purge_akamai_ccu_rest($urls);
?>