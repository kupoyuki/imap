<?php

//$ID    = $_POST["ID"];
$input = $_POST["data"];

if(is_null($input)){
	return;
}

$json = json_decode($input);

$myFile = "data/" . $json -> {"time"} . ".txt";
$fh = fopen($myFile, 'w') or die("can't open file");
fwrite($fh, $input);
fclose($fh);

?>
