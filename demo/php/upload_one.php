<?php
// header("content-type:text/html; charset=utf-8");
//定義存放上傳檔案的目錄
$upload_dir='upload/';
//如果錯誤代碼為 UPLOAD_ERR_OK, 表示上傳成功
if($_FILES["Upfile"]["error"] > 0) {
  print_r($_FILES["Upfile"]["error"]);
} else {
  //將暫存檔搬移到上傳目錄下, 並且改回原始檔名
  move_uploaded_file(
    $_FILES["Upfile"]["tmp_name"],
    $upload_dir . $_FILES["Upfile"]["name"]
  );

  //顯示上傳檔案的相關訊息
  echo '上傳成功';
  echo '<br />原始檔名：' . $_FILES["Upfile"]["name"];
  echo '<br />檔案大小：' . $_FILES["Upfile"]["size"];
  echo '<br />檔案類型：' . $_FILES["Upfile"]["type"];
  echo '<br />暫存檔名：' . $_FILES["Upfile"]["tmp_name"];
}
?>
