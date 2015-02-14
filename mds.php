<?php

require_once "cf/userdata.php";
require_once "cf/cf.php";
require_once "math.php";

// 学習率
$rate = 0.01;
$lasterror = 0;

// 実際の距離（対称行列）
$realdist = generateRealDistances("data");
$ary_size = sqrt(count($realdist));

$len = count($realdist);

$loc = array();

// 仮座標をランダムに設定する
for ($i = 0; $i < $ary_size; $i++)
{
		$loc[] = array(
			"x" => randomFloat(),
			"y" => randomFloat(),
			);
}

// 試行ループ
for ($num = 0; $num < 1000; $num++)
{
	// 仮座標の距離（対称行列）
	$fakedist = array();
	for ($i = 0; $i < count($loc); $i++)
	{
		$src = $loc[$i];

		for ($j = 0; $j < count($loc); $j++)
		{
			$dest = $loc[$j];

			$fakedist[$i * $ary_size + $j] = distance($src["x"], $src["y"], $dest["x"], $dest["y"]);
		}
	}

	$totalerror = 0;
	$grad = array();
	for ($i = 0; $i < count($loc); $i++)
	{
		$src = $loc[$i];

		for ($j = 0; $j < count($loc); $j++)
		{
			if ($i == $j)
			{
				continue;
			}

			$dest = $loc[$j];

			$rdist = $realdist[$i * $ary_size + $j];
			$fdist = $fakedist[$i * $ary_size + $j];

			// 誤差を計算する
			$errterm = ($fdist - $rdist) / $rdist;

			// 移動量を計算する
			$grad[$i] = array("x" => (($src["x"] - $dest["x"]) / $fdist) * $errterm,
							  "y" => (($src["y"] - $dest["y"]) / $fdist) * $errterm);

			$totalerror += abs($errterm);
		}
	}

	// 誤差が大きくなってしまったら、その時点で終了
	if ($lasterror < $totalerror)
	{
		break;
	}
	$lasterror = $totalerror;
}

// 移動量を仮座標に適用する
for ($i = 0; $i < count($grad); $i++)
{
	$loc[$i]["x"] -= $rate * $grad[$i]["x"];
	$loc[$i]["y"] -= $rate * $grad[$i]["y"];

	echo "(".$loc[$i]["x"].",".$loc[$i]["y"].")";
	echo "<br>";
}


//echo json_encode($loc);

function generateRealDistances($dirname)
{
	$files = getFileList($dirname);
	$res = array();

	for ($i = 0; $i < count($files); $i++)
	{
		$src = new UserData($files[$i]);

		for ($j = 0; $j < count($files); $j++)
		{
			$dest = new UserData($files[$j]);

			if ($src->getUserName() === $dest->getUserName())
			{
				$res[$i * count($files) + $j] = 0.0;
			}
			else
			{
				$res[$i * count($files) + $j] = CF::calcSimDistance($src, $dest);
			}
		}
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

?>