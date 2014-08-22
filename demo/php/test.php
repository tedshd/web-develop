<?php
    echo 'test<br>';
    if (isset($_POST['str'])) {
        // echo $_POST['str'];
        // echo '<br>';
        $output = array(
            'status' => 'ok',
            'message' => 'msg');
        echo json_encode($output);
    }
?>