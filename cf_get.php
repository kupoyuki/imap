<?php


ini_set('log_errors','On');
error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

/* ----------------------------------------- *
 * ファイル名一覧を取得                         *
 * ------------------------------------------*/

function getFileList($dir) {
    $files = glob(rtrim($dir, '/') . '/*.txt');
    $list = array();

    //files を file配列に代入
    foreach ($files as $file) {
        if (is_file($file)) {
            $list[] = basename($file);
        }
        /*ディレクトリを掘り進む
        if (is_dir($file)) {
            $list = array_merge($list, getFileList($file));
        }*/
    }
    return $list;
}

echo $list;

//ファイル名＝タイムスタンプなので、そこから作成日時を取得する

$file_list = getFileList("data");

for($i = 0; $i<count($file_list); $i++){
	//stringを10進数に変換
	$file_list_makefile = intval($list[$i]);
}

//配列の最大値を返す
$latest_file = max($file_list_makefile);

echo $latest_file;

/* ----------------------------------------- *
 * 最新のファイル名を取得(更新時)                *
 * ------------------------------------------*/

/*
function getLatestFile($dir){

	//ファイルの更新日時を保管する配列
	$filedate = array();
	$filelist = array();

	$filelist = getFileList();

	//ファイルごとのタイムスタンプを返す
	for($i = 0; $i<count($filelist); $i++){

		$filename = $filelist[$i]'.txt';
		if (file_exists($filename)) {
		    echo filemtime($filename);
		}
		$filedate[] = filemtime($list[$i]);
	}

	//最大値を返す
	return max($filedate);

}*/


?>

