<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2015-07-05 15:03:06
 * @version $Id$
 */

/**
 * [distance description]
 * @param  [array] $location [GPS location Longitude, Latitude]
 * @param  [array] $site     [Goal Longitude, Latitude]
 * @return [string]          [distance]
 */
function distance($location, $site)
{
    $distance = sqrt(pow(abs($location[0] - $site[0]), 2) + pow(abs($location[1] - $site[1]), 2));
    return $distance;
}

$a = array(0, 0);
$b = array(3, 4);

echo distance($a, $b);

?>