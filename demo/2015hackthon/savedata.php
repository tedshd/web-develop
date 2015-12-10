<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2015-11-28 23:52:46
 * @version $Id$
 */

$_POST['data'];

$file = 'json.txt';
// Open the file to get existing content
$current = file_get_contents($file);
// Append a new person to the file
$current .= $_POST['data'];
// Write the contents back to the file
file_put_contents($file, $current);

?>