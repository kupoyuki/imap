<?php

$files = getFileList("data");

$data_list = array();

foreach ($files as $file)
{
	$data = json_decode(file_get_contents($file), true);

	$data_list[] = $data;
}

echo json_encode($data_list);


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