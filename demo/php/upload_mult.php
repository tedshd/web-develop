<?php
//定義存放上傳檔案的目錄
$upload_dir='upload/';

var_dump($_FILES['Upfile']);
exit;
if($_FILES["Upfile"]["error"] > 0) {
  echo $_FILES["Upfile"]["error"];
} else {
  //將暫存檔搬移到上傳目錄下, 並且改回原始檔名
  move_uploaded_file(
    $_FILES["Upfile"]["tmp_name"][i],
    $upload_dir . $_FILES["Upfile"]["name"][i]
  );

  //顯示上傳檔案的相關訊息
      echo '上傳成功';
      echo '<br />原始檔名：' . $_FILES["Upfile"]["name"][i];
      echo '<br />檔案大小：' . $_FILES["Upfile"]["size"][i];
      echo '<br />檔案類型：' . $_FILES["Upfile"]["type"][i];
      echo '<br />暫存檔名：' . $_FILES["Upfile"]["tmp_name"][i];

}
?>