<?php
header("content-type:text/html; charset=utf-8");
//定義存放上傳檔案的目錄
$upload_dir='upload/';
//如果錯誤代碼為 UPLOAD_ERR_OK, 表示上傳成功
if( $_FILES['UpFile']['error'] == UPLOAD_ERR_OK ) {
  //將暫存檔搬移到上傳目錄下, 並且改回原始檔名
  move_uploaded_file($_FILES['UpFile']['tmp_name'],
                     $upload_dir . $_FILES['UpFile']['name']);

  //顯示上傳檔案的相關訊息
  echo '上傳成功...';
  echo '<br />原始檔名：' . $_FILES['UpFile']['name'];
  echo '<br />檔案類型：' . $_FILES['UpFile']['type'];
  echo '<br />檔案大小：' . $_FILES['UpFile']['size'];
  echo '<br />暫存檔名：' . $_FILES['UpFile']['tmp_name'];
}
else{
  echo "上傳失敗";
}
?>
