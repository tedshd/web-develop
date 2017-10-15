<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2016-07-29 00:36:53
 * @version $Id$
 */
date_default_timezone_set("UTC");
date_default_timezone_set("Asia/Taipei");


print_r(FunctionName(time() + (0*60)));

function timestamp_array($timestamp)
{
    // date('H:i:s', time())
    $timestamp_array = [];
    $timestamp_before_2 = date('H:i:s', $timestamp - (20 * 60));
    $timestamp_before_1 = date('H:i:s', $timestamp - (10 * 60));
    $timestamp_after_1  = date('H:i:s', $timestamp + (10 * 60));
    $timestamp_after_2  = date('H:i:s', $timestamp + (20 * 60));
    $now = time();
    $diff = $timestamp - $now;

    if (0 > $diff) {
        $timestamp_array = [
            // "1--" . date('H:i:s', $timestamp),
            date('H:i:s', $now),
            date('H:i:s', $now + (10 * 60)),
            date('H:i:s', $now + (20 * 60)),
            date('H:i:s', $now + (30 * 60)),
            date('H:i:s', $now + (40 * 60)),
        ];
    } else if (10 * 60 > $diff) {
        $timestamp_array = [
            // "2--" . date('H:i:s', $timestamp),
            date('H:i:s', $timestamp),
            $timestamp_after_1,
            $timestamp_after_2,
            date('H:i:s', $timestamp + (30 * 60)),
            date('H:i:s', $timestamp + (40 * 60)),
        ];
    } else if (20 * 60 > $diff) {
        $timestamp_array = [
            // "3--" . date('H:i:s', $timestamp),
            $timestamp_before_1,
            date('H:i:s', $timestamp),
            $timestamp_after_1,
            $timestamp_after_2,
            date('H:i:s', $timestamp + (30 * 60)),
        ];
    } else {
        $timestamp_array = [
            // "4--" . date('H:i:s', $timestamp),
            $timestamp_before_2,
            $timestamp_before_1,
            date('H:i:s', $timestamp),
            $timestamp_after_1,
            $timestamp_after_2,
        ];
    }
    if ($now ) {
        # code...
    }
    return $timestamp_array;

}