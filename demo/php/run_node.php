<?php

// exec('node call.js name=Ted msg=test', $output, $return);

// print_r($output);

// print_r($return);

function send() {
    // $cid = $this->input->post('cid');
    // $cdid = $this->input->post('cdid');
    // $uid = $this->input->post('uid');
    // $user_name = $this->input->post('user_name');
    // $msg = $this->input->post('msg');
    // $ts = $this->input->post('ts');
    // check uid
    // handle node
    $cid = '1';
    $cdid = '1';
    $uid = '1';
    $user_name = '1';
    $msg = '1';
    $ts = '1';
    $arg = ' cid=' . $cid . ' cdid=' . $cdid . ' uid=' . $uid . ' user_name=' . $user_name . ' msg=' . $msg . ' ts=' . $ts;
    exec('node saveFirebase.js' . $arg, $output, $return);
    print_r($output);
    print_r($return);
    // send email
    // notifction
}
send();


?>