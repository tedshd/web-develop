<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Examples</title>
<script src="/lib/jquery-2.1.1.js"></script>
</head>
<body>
    <form action="test.php">
        <button type="submit">Submit</button>
    </form>
</body>
<script>
var test = false;
    $('form').on('submit', function(e) {
        if (!test) {
            e.preventDefault();
            console.log('hihihi');
        }
    })
</script>
</html>