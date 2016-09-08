<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2016-09-06 10:22:23
 * @version $Id$
 */

function encodeId($value = "")
{
    $confuse_value = "";
    $confuse = array(
        "0" => "o",
        "1" => "i",
        "2" => "c",
        "3" => "a",
        "4" => "l",
        "5" => "s",
        "6" => "z",
        "7" => "d",
        "8" => "m",
        "9" => "n",
        "," => "x",
    );
    $value = str_split($value);
    for ($i = 0; count($value) > $i; $i++) {
        if (!isset($confuse[$value[$i]])) {
            return "confuse error";
        }
        $confuse_value = $confuse_value . $confuse[$value[$i]];
    }
    return $confuse_value;
}

// encodeId("3456");

function decodeId($value='')
{
    $decode_value = "";
    $decode = array(
        "o" => "0",
        "i" => "1",
        "c" => "2",
        "a" => "3",
        "l" => "4",
        "s" => "5",
        "z" => "6",
        "d" => "7",
        "m" => "8",
        "n" => "9",
        "x" => ",",
    );
    $value = str_split($value);
    for ($i = 0; count($value) > $i; $i++) {
        if (!isset($decode[$value[$i]])) {
            return "decode error";
        }
        $decode_value = $decode_value . $decode[$value[$i]];
    }
    return $decode_value;
}

echo encodeId("12,35") . "\n";

echo decodeId(encodeId("12,35")) . "\n";

?>