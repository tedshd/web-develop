<?php
$ua = strtolower($_SERVER['HTTP_USER_AGENT']);
if(stripos($ua,'android') !== false) { // && stripos($ua,'mobile') !== false) {
    echo 'Android!!';
    // header('Location: http://android.davidwalsh.name');
    exit;
}
?>