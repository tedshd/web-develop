<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2014-04-29 16:05:10
 * @version $Id$
 */


$dbconn = pg_connect("host=localhost port=5432 dbname=test user=Ted_Shiu ");

$query = 'SELECT * FROM foo';
$result = pg_query($query);
// print_r(pg_fetch_array($result, null, PGSQL_ASSOC));
while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
    $output[$line['_id']] = $line;
    // var_dump($line);
}
echo json_encode($output);



// Printing results in HTML
// echo "<table>\n";
// while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
//     echo "\t<tr>\n";
//     foreach ($line as $col_value) {
//         echo "\t\t<td>$col_value</td>\n";
//     }
//     echo "\t</tr>\n";
// }
// echo "</table>\n";



// echo '<hr>';

$method = $_SERVER['REQUEST_METHOD'];
switch($method) {
case "PUT":
// print($method);
break;
case "GET":
// print($method);
break;
case "DELETE":
// print($method);

$sql = "DELETE FROM foo WHERE _id = 77";

break;
case "POST":
// print($method);
//
$sql = "INSERT INTO foo VALUES ('77')";

break;
}

if (!empty($sql)) {
    echo '<hr>';

    pg_query($dbconn, $sql);

    $query = 'SELECT * FROM foo';
    $result = pg_query($dbconn, $query);
    while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $output[$line['_id']] = $line;
        // var_dump($line);
    }
    echo json_encode($output);
}


// Free resultset
pg_free_result($result);

// Closing connection
pg_close($dbconn);

?>