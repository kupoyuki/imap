<?php
 
  $url = "https://www.googleapis.com/customsearch/v1?q=[検索キーワード]&key=[APIキー]&cx=[検索エンジンID]";  
 
  $json = file_get_contents($url,true);
 
  if ($json == false) {
       echo "JSON取得エラー";
       return;
   } 
 
$jptime = time() + 9*3600;  //GMTとの時差9時間を足す
 
$time = gmdate("Y/m/d H:i:s", $jptime);
 
?>