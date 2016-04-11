<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2016-02-24 11:21:40
 * @version $Id$
 */

$url = $_GET['u'];

if (!$url) {
    $url = 'http://tedse.0fees.net';
}

header('Location: ' . $url);
// header('Location: http://tedse.0fees.net');
?>