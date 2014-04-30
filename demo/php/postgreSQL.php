<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2014-04-29 14:41:41
 * @version $Id$
 */

// echo phpinfo();
// exit();
// connect PostgreSQL
$dbconn = pg_connect("host=localhost port=5432 dbname=test user=Ted_Shiu ");

$query = 'SELECT * FROM foo';
$result = pg_query($query);
print_r($result);

// Printing results in HTML
echo "<table>\n";
while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
    echo "\t<tr>\n";
    foreach ($line as $col_value) {
        echo "\t\t<td>$col_value</td>\n";
    }
    echo "\t</tr>\n";
}
echo "</table>\n";

// Free resultset
pg_free_result($result);

// Closing connection
pg_close($dbconn);

// variant 1: omit localhost
// $link = mysql_connect('localhost', '', '');
// if (!$link) {
//     die('Could not connect: ' . mysql_error());
// }
// echo 'Connected successfully';
// mysql_close($link);

?>