<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<style>
		table
		{
			border: 1px solid #000;
		}
		td
		{
			border: 1px solid #000;
		}
		td.category_item
		{
			color: #fff;
			background-color: #4c4c4c;
		}
	</style>
</head>
<body>
<?php

$data = file_get_contents("words.csv");
$lines = explode(chr(13), $data);

$words = array();

foreach ($lines as $line)
{
	$line = str_replace("\"", "", $line);
	$rows = explode(",", $line);

	foreach ($rows as $row)
	{
		if (is_numeric($row))
		{
			$words[$row] .= $line;
		}
	}
}

$categories = array();

foreach ($words as $key => $val)
{
	$ary = explode(",", $val);
	$ary = array_filter($ary, function($val)
	{
		return $val !== '' && !is_numeric($val);
	});
	$ary = array_unique($ary);
	$ary = array_values($ary);
	$categories[$key] = $ary;
}

ksort($categories);

$html = '';

$html .= '<table>';

foreach ($categories as $key => $val)
{
	$html .= '<tr>';
	$html .= '<td class="category_item">'.$key.'</td>';
	for ($i = 0; $i < 5; $i++)
	{
		$html .= '<td>'.$val[rand(0, count($val)-1)].'</td>';
	}
	$html .= '</tr>';
}

$html .= '</table>';
$html .= '<br>';

echo $html;

foreach ($categories as $key => $val)
{
	echo "<strong>".$key."</strong>:<br>";
	$html = '';
	for ($i = 0; $i < count($val); $i++)
	{
		$html .= $val[$i].',';
	}
	$html = rtrim($html, ",");
	echo $html;
	echo "<br><br>";
}
?>
</body>
</html>