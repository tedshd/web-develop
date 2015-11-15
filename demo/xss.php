<?php
// header('X-XSS-Protection: 1');
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
<title>XSS</title>
</head>
<body>
    <h1>
        Hi
        <span>
            <?php echo $_GET['name'];?>
            <?php // echo htmlspecialchars($_GET['name']);?>
        </span>
    </h1>
</body>
<script>
function getQueryString(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// console.log(getQueryString('name'));
// document.querySelectorAll('span')[0].innerHTML = getQueryString('name');
</script>
</html>