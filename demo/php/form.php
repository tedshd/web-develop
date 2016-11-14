<?php
/**
 *
 * @authors Your Name (you@example.org)
 * @date    2016-11-14 18:12:00
 * @version $Id$
 */
$n1 = 'd4';
$n2 = 'd4';
if(isset($_POST['name_1'])){
$n1 = $_POST['name_1'];
}
if(isset($_POST['test'])){
$n2 = $_POST['test'];
}

echo $n1;
echo '<br>';
echo $n2;

?>