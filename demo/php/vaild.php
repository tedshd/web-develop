<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2016-11-14 18:13:52
 * @version $Id$
 */

if (!empty($_POST['id'])) {
    $response = [
        "status" => "ok",
        "val" => "ok"
    ];
    echo json_encode($response);
} else {
    $response = [
        "status" => "fail"
    ];
    echo json_encode($response);
}