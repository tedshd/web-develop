<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2016-07-30 23:58:14
 * @version $Id$
 */

function FunctionName($val) {
    print_r($value);
    $array = ["a", "b", "c"];
    $new_arr = [];
    foreach ($array as $key => $value) {
        $new_arr[$key] = $value . $val;
    }
    return $new_arr;
}
// FunctionName('haha');
print_r(FunctionName('haha'));