<?php

require_once "cf.php";

$username = $_GET['username'];

$cf = new CF($username);
$match_users = $cf->getMatchUsers();

$res = array();

foreach ($match_users as $user)
{
	$data = array();
	$data['username'] = $user['user_data']->getUserName();
	$data['sim'] = $user['sim'];

	$res[] = $data;
}

echo json_encode($res);

?>