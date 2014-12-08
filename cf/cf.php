<?php

require_once "userdata.php";

class CF
{
	private $_user_data = null;
	private $_data_dir = 'data/';

	public function __construct($username)
	{
		$this->changeUserData($username);
	}

	public function changeUserData($username)
	{
		// 全データから指定ユーザのデータを検索する
		$files = $this->getFileList($this->_data_dir);
		for ($i = 0; $i < count($files); $i++)
		{
			$data = new UserData($files[$i]);
			if ($data->getUserName() === $username)
			{
				$this->_user_data = $data;
			}
		}
	}

	public function getMatchUsers()
	{
		$files = $this->getFileList($this->_data_dir);
		$res = array();

		for ($i = 0; $i < count($files); $i++)
		{
			$data = new UserData($files[$i]);
			if ($data->getUserName() !== $this->_user_data->getUserName())
			{
				$container = array();
				$container['user_data'] = $data;
				$container['sim'] = $this->calcSimDistance($this->_user_data, $data);
				$res[] = $container;
			}
		}

		// 類似度でソートする
		foreach ($res as $key => $val)
		{
			$key_id[$key] = $val['sim'];
		}
		array_multisort($key_id, SORT_DESC, $res);

		return $res;
	}

	private function calcSimDistance($src, $dest)
	{
		// 共通の単語を抽出する
		$words = array_intersect($src->getWords(), $dest->getWords());

		// 共通する単語が少ない場合は計算しない！
		// if (count($words) == 0)
		if (count($words) <= 4)
		{
			return 0.0;
		}

		$sum = 0;
		foreach ($words as $word)
		{
			$dest_answer = $dest->getAnswer($word);
			$src_answer = $src->getAnswer($word);

			$sum += pow($dest_answer - $src_answer, 2);
		}

		return 1/(1+sqrt($sum));
	}

	private function getFileList($dir)
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
				$list = array_merge($list, $this->getFileList($file));
			}
		}
		return $list;
	}
}


?>