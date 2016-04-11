<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Examples</title>
<link href="" rel="stylesheet">
</head>
<body>

</body>
<script>
    var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function (data) {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    console.log(xhr.responseText);
    data = JSON.parse(xhr.responseText);
};
xhr.open('POST', 'http://tedshd.io/api/cors/index.php', true);
xhr.send();

</script>
</html>