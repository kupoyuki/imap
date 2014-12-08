<?php

//エラーログ
ini_set('log_errors', 1);
error_reporting(E_ALL);

/* ----------------------------------------- *
 * ファイル名一覧を取得                         *
 * ------------------------------------------*/

function getFileList($dir)
{
    $files = glob(rtrim($dir, '/') . '/*.txt');
    $list = array();
    //files を file配列に代入
    foreach ($files as $file) {
        if (is_file($file)) {
            $list[] = basename($file);
        }
    }
    return $list;
}

/* ----------------------------------------- *
 * 最新のファイル名を取得(更新時m作成時c)          *
 * ------------------------------------------*/


function getLatestFile($dir){

	//ファイルの更新日時を保管する配列
	$file_date = array();

	$file_list = getFileList($dir);

	//ファイルごとのタイムスタンプを返す
	for($i = 0 ; $i < count($file_list) ; $i ++){

		$file_name = $dir . '/' . $file_list[$i];
		if ( file_exists($file_name) ) {
		   	array_push( $file_date, filectime($file_name) );
		}

	}

	print_r($file_date);

	//最大値を返す
	return max($file_date);
}


echo getLatestFile("data");


?>

