<?php
// echo 'test<br>';


$array[0]['user'] = 'ted';
$array[0]['tel'] = 'test';

$array[1]['user'] = 'haha';
$array[1]['tel'] = 'test';


// $array['user'] = 'ted';
// $array['tel'] = 'test';
echo json_encode($array);
// echo var_dump($array);

if (isset($_POST['str'])) {
    echo $_POST['str'];
    echo '<br>';
    // $output = array(
    //     'status' => 'ok',
    //     'message' => 'msg');
    // echo json_encode($output);
}
if (isset($_POST['num'])) {
    echo $_POST['num'];
    echo '<br>';
}
?>
