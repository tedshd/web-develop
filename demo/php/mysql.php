<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2015-03-03 23:39:12
 * @version $Id$
 */

// $servername = "127.0.0.1";
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "mysql";

// Create connection
$conn = mysql_connect($servername, $username, $password);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// $sql = "select * from user";
$sql = "SHOW TABLES FROM $dbname";
$result = mysql_query($sql);
if (!$result) {
    echo "DB Error, could not list tables\n";
    echo 'MySQL Error: ' . mysql_error();
    exit;
}
while ($row = mysql_fetch_row($result)) {
    echo "Table: {$row[0]}" . "<br>";
}
$sql_1 = "SELECT * FROM user";
$result_1 = mysql_query($sql_1);
var_dump($conn);
echo "<br>";
var_dump(exec("show tables;"));
echo "<br>";
var_dump($result_1);
echo "<br>";

if ($result_1->num_rows > 0) {
    // output data of each row
    while($row = $result_1->fetch_assoc()) {
        echo "id: " . $row[0] . "<br>";
    }
} else {
    echo "0 results";
}
// $conn->close();

?>