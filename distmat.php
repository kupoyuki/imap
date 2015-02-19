<?php
require_once "cf/userdata.php";
require_once "cf/cf.php";

$dirname = 'data';

$cache = new DistmatCache($dirname);

if ($cache->isUseCache())
{
	echo $cache->getCacheData();
}
else
{
	$realdist = generateRealDistances($dirname);
	$json_data = json_encode($realdist);

	$cache->updateCache($json_data);
	echo $json_data;
}


class DistmatCache
{
	private $_data_dir;

	private $_filelist_cache = 'userlist_cache.txt';
	private $_distmat_cache = 'distmat_cache.txt';

	public function __construct($dirname)
	{
		$this->_data_dir = $dirname;
	}

	public function isUseCache()
	{
		$filenames = getFileList($this->_data_dir);
		$filenames_cache = $this->getCacheFileList($this->_filelist_cache);

		if (count(array_diff($filenames, $filenames_cache)) == 0)
		{
			return true;
		}
		return false;
	}

	public function updateCache($data)
	{
		// ユーザリストの更新
		if (!file_exists($this->_filelist_cache))
		{
			touch($this->_filelist_cache);
		}
		$filenames = getFileList($this->_data_dir);
		file_put_contents($this->_filelist_cache, implode("\n", $filenames));

		// キャッシュデータ
		if (!file_exists($this->_distmat_cache))
		{
			touch($this->_distmat_cache);
		}
		file_put_contents($this->_distmat_cache, $data);
	}

	public function getCacheData()
	{
		$cache_name = $this->_distmat_cache;

		if (!file_exists($cache_name))
		{
			return null;
		}
		return file_get_contents($cache_name);
	}

	public function getCacheFileList($filename)
	{
		if (!file_exists($filename))
		{
			touch($filename);
		}
		return explode("\n", file_get_contents($filename));
	}
}

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
		$src = new UserData($files[$i]);

		for ($j = 0; $j < count($files); $j++)
		{
			$dest = new UserData($files[$j]);

			if ($src->getUserName() === $dest->getUserName())
			{
				// $res[$i * count($files) + $j] = 0.0;
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