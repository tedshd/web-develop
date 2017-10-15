<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>parse</title>
<meta name="description" content="">
<link href="" rel="stylesheet">
</head>
<body>

<?php
/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2016-09-28 12:01:09
 * @version $Id$
 */

include("simple_html_dom.php");

$html = file_get_html('http://www.inote.tw/sanbenramen');

$con = $html->find('//*[@id="getsocialmain"]/div[1]/p', 0);
// var_dump($con);
echo $con;

//*[@id="getsocialmain"]/div[1]/p

?>


</body>
</html>

