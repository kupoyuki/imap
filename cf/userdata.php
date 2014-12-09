<?php

class UserData
{
	private $_data = null;

	public function __construct($src)
	{
		$this->_data = json_decode(file_get_contents($src), true);
	}

	/*
	 * ユーザ名を返す
	*/
	public function getUserName()
	{
		return $this->_data['name'];
	}

	/*
	 * 単語配列を返す
	*/
	public function getWords()
	{
		$words = array();

		// 最初の項目は名前が入っているので除外する
		for ($i = 0; $i < count($this->_data['question']); $i++)
		{
			$words[] = $this->_data['question'][$i]['word'];
		}

		return $words;
	}

	/*
	 * 指定した単語の回答を返す
	*/
	public function getAnswer($search_word)
	{
		$words = $this->getWords();
		$words_index = array_search($search_word, $words);

		$answer = $this->_data['question'][$words_index]['answer'];

		return $answer;
	}
}

?>