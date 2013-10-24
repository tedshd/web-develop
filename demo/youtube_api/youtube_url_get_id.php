<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2013-10-24 05:45:45
 * @version $Id$
 */

$url = "https://www.youtube.com/watch?v=5G9pcYAH650";
parse_str( parse_url( $url, PHP_URL_QUERY ), $my_array_of_vars );
echo $my_array_of_vars['v'];
  // Output: C4kxS1ksqtw
  // Easter egg

?>