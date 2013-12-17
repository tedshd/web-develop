<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2013-12-12 09:33:10
 * @version $Id$
 */

// $string = '["aa", "bb"]';
$string = $_POST['str'];
$new = json_decode($string, TRUE);
print_r($new);
foreach ($new as $id)
{

}