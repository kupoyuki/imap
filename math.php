<?php

/*-------------------------------------------------------------
 * 実数のランダム値を返す
-------------------------------------------------------------*/
function randomFloat($min = 0, $max = 1)
{
	return $min + mt_rand() / mt_getrandmax() * ($max - $min);
}

/*-------------------------------------------------------------
 * ユークリッド距離を返す
-------------------------------------------------------------*/
function distance($x1, $y1, $x2, $y2)
{
	return sqrt(pow($x1 - $x2, 2) + pow($y1 - $y2, 2));
}

/*-------------------------------------------------------------
 * コサイン類似度を返す
-------------------------------------------------------------*/
function cosSim($vec1, $vec2)
{
	// ベクトルの内積から余弦を求める
	return dotProductVectors($vec1, $vec2) / (vectorMagnitude($vec1) * vectorMagnitude($vec2));
}

/*-------------------------------------------------------------
 * n次元ベクトル（行列）の内積（ドット積）を返す
-------------------------------------------------------------*/
function dotProductVectors($vec1, $vec2)
{
	if (count($vec1) != count($vec2))
	{
		return null;
	}

	$product = 0;
	for ($i = 0; $i < count($vec1); $i++)
	{
		$product += $vec1[$i] * $vec2[$i];
	}

	return $product;
}

/*-------------------------------------------------------------
 * 正規化（ベクトル長で要素を除算）したベクトルを返す
-------------------------------------------------------------*/
function normalizeVector($vec)
{
	$res = array();

	$vec_length = vectorMagnitude($vec);
	if ($vec_length == 0)
	{
		return $vec;
	}

	foreach ($vec as $key => $num)
	{
		$res[$key] = $num / $vec_length;
	}

	return $res;
}

/*-------------------------------------------------------------
 * n次元ベクトルの長さを返す
-------------------------------------------------------------*/
function vectorMagnitude($vec)
{
	$mag = 0;
	foreach ($vec as $num)
	{
		$mag += pow($num, 2);
	}
	return sqrt($mag);
}

?>