<?php
require_once "cf/userdata.php";
require_once "cf/cf.php";

$realdist = generateRealDistances("data");



echo json_encode($realdist);

// testDistanceMatrix($realdist);

/*
 * 全ユーザの類似距離の対称行列を返す
*/
function generateRealDistances($dirname)
{
	$files = getFileList($dirname);
	$res = array();

	for ($i = 0; $i < count($files); $i++)
	{
		$line = array();

		for ($j = 0; $j < count($files); $j++)
		{
			$src = new UserData($files[$i]);
			$dest = new UserData($files[$j]);

			if ($src->getUserName() === $dest->getUserName())
			{
				$line[] = 0.0;
			}
			else
			{
				// 類似度 -> 距離（0.0に近づくほど類似する）
				// $res[$i * count($files) + $j] = 1.0 - CF::calcSimDistance($src, $dest);
				$line[] = 1.0 - CF::calcSimDistance($src, $dest);
			}
		}

		$res[] = $line;
	}
	return $res;
}

function getFileList($dir)
{
	$files = glob(rtrim($dir, '/') . '/*');
	$list = array();
	foreach($files as $file)
	{
		if (is_file($file))
		{
			$list[] = $file;
		}
		if (is_dir($file))
		{
			$list = array_merge($list, getFileList($file));
		}
	}
	return $list;
}

/*
 * 距離の対称行列を表示する（単体テスト用）
*/
function testDistanceMatrix($dist_mat)
{
	// 1辺の大きさ
	$ary_size = count($dist_mat);
	$html = 'ary_size = '.$ary_size.'<br>';

	$html .= '<style>table {font-size:10px;}</style>';
	$html .= '<table border="1">';

	for ($i = 0; $i < $ary_size; $i++)
	{
		$html .= '<tr>';
		for ($j = 0; $j < $ary_size; $j++)
		{
			$html .= '<td>'.$dist_mat[$j][$i].'</td>';
		}
		$html .= '</tr>';
	}
	$html .= '</table>';

	echo $html;
}

?>