
/* ======================================= *
 * JSONに変換するプログラム                *
 * ======================================= */
jQuery.extend({
  stringify : function stringify(obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
      // simple data type
      if (t == "string") obj = '"' + obj + '"';
      return String(obj);
    } else {
      // recurse array or object
      var n, v, json = [], arr = (obj && obj.constructor == Array);

      for (n in obj) {
        v = obj[n];
        t = typeof(v);
        if (obj.hasOwnProperty(n)) {
          if      (t == "string")               v = '"' + v + '"';
          else if (t == "object" && v !== null) v = jQuery.stringify(v);
          json.push((arr ? "" : '"' + n + '":') + String(v));
        }
      }
      return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
  }
}); 

function delayCall(callback, scope, time, args)
{
    if (typeof scope === "undefined" || scope === null) {
        scope = this;
    }
  
    if (!Array.isArray(args)) {
        if (typeof args !== "undefined") {
            args = [args];
        } else {
            args = [];
        }
    }
 
    return setTimeout(function () { callback.apply(scope, args); },time);
}

function QuestionManager(data, q_data)
{
	this._data = data;												// 出力データ
	this._q_data = q_data;											// 質問データ

	this._all_question_num = q_data['all_question_num'];			// 全質問数
	this._common_question_num = q_data['common_question_num'];		// 共通の質問数

	// 共通の質問数のほうが全質問数よりも多かったらエラー
	if (this._common_question_num > this._all_question_num)
	{
		alert('error!');
	}

	this._timeout_sec = q_data['timeout_sec'];						// タイムアウト時間（秒）

	if (this._timeout_sec < 1)
	{
		alert('error!');
	}

	this._cur_question_count = 1;									// 現在の回答数
	this._cur_word = '';
	this._timer = null;												// タイムアウトタイマ
	this._start_time = 0;
	this._question_count = 0;
}

QuestionManager.prototype.startQuestion = function()
{
	var SELF = this;

	// データ初期化
	this._data.question = [];
	this._cur_question_count = 1;
	clearTimeout(this._timer);

	this._start_time = $.now();

	this.changeQuestion(this.nextWord());


	// 興味あるをクリックした時の処理
	$('#yes').click(function(e)
	{
		clearTimeout(SELF._timer);
		var time = $.now() - SELF._start_time;

		SELF._data.question.push({
		    time    : time
		  , word    : SELF._cur_word
		  , answer  : 1
		});

		SELF._cur_question_count++;

		if (SELF._cur_question_count > SELF._all_question_num)
		{
			SELF.finishQuestion();
			return;
		}

		SELF.changeQuestion(SELF.nextWord());
		

		// 共通問題の間はタイムアウトさせない
		if (!SELF.isCommonQuestion())
		{
			SELF._timer = delayCall(SELF.countDown, SELF, 1000);
		}
		SELF._start_time = $.now();
	});


	// 興味ないをクリックした時の処理
	$('#no').click(function(e)
	{
		clearTimeout(SELF._timer);
		var time = $.now() - SELF._start_time;

		SELF._data.question.push({
		    time    : time
		  , word    : SELF._cur_word
		  , answer  : -1
		});

		SELF._cur_question_count++;

		if (SELF._cur_question_count > SELF._all_question_num)
		{
			SELF.finishQuestion();
			return;
		}

		SELF.changeQuestion(SELF.nextWord());

		// 共通問題の間はタイムアウトさせない
		if (!SELF.isCommonQuestion())
		{
			SELF._timer = delayCall(SELF.countDown, SELF, 1000);
		}
		SELF._start_time = $.now();
	});


	// パスをクリックした時の処理
	$('#pass').click(function(e)
	{
		SELF.passQuestion();
	});


	// キーバインド
	$("body").keydown(function(e)
	{
		if(e.keyCode == 39)
		{
			//→
			$('#no').click();
		}

		if(e.keyCode == 37 )
		{
			//←
			$('#yes').click();
		}

		// 共通問題中はパスさせない
		if (!SELF.isCommonQuestion())
		{
			if(e.keyCode == 40 )
			{
				//↓
				$('#pass').click();
			}
		}
  });
}

QuestionManager.prototype.isCommonQuestion = function()
{
	if (this._common_question_num < this._cur_question_count)
	{
		return false;
	}

	return true;
}

QuestionManager.prototype.countDown = function()
{
	var count = this._timeout_sec - this._question_count;

	if (count < 0)
	{
		this.passQuestion();
		return;
	}
	$('#countdown').html(count);

	this._question_count++;
	this._timer = delayCall(this.countDown, this, 1000);
}

QuestionManager.prototype.nextWord = function()
{
    // 共通単語から読み込み
    if (this._common_question_num >= this._cur_question_count)
    {
    	return this._q_data['common_words'][this._cur_question_count-1];
    }
    // 分類単語から読み込み
    else
    {
    	var categories = new Array();
    	$.each(this._q_data['category_words'], function(index, val)
    	{
    		categories.push(index);
    	});
    	
    	var category_index = Math.floor(Math.random() * categories.length);
    	var category_words = this._q_data['category_words'][categories[category_index]];
    	var word_num = category_words.length;

    	var word_index = Math.floor(Math.random() * word_num);
    	var word = category_words[word_index];

    	// 重複させないぜ！
    	while(true)
    	{
    		var is_duplicate = false;
    		for (var i = 0; i < this._data.question.length; i++)
    		{
    			if (this._data.question[i]['word'] === word)
    			{
    				is_duplicate = true;
    			}
    		}

    		if (is_duplicate)
    		{
		    	word_index = Math.floor(Math.random() * word_num);
		    	word = category_words[word_index];
    		}
    		else
			{
				break;
			}
    	}
    	return word;
    }
}

QuestionManager.prototype.changeQuestion = function(q_word)
{
	$('.contents').hide();
	$('#answer').hide();
	$('#pagenum').hide();

	// 共通問題はパスさせない！
	if (this.isCommonQuestion())
	{
		$('#pass').hide();
		$('#countdown').hide();
	}
	else
	{
		$('#pass').show();
		$('#countdown').show();
	}

	this._question_count = 0;
	$('#countdown').html(this._timeout_sec - this._question_count);

	this._cur_word = q_word;

	$('#txt')
	.children('p.q_word')
	.remove();

	$('<p></p>')
	.addClass('q_word')
	.html(q_word)
	.appendTo('#txt');

	$('#pagenum').html(this._cur_question_count + '/' + this._all_question_num);

	setTimeout(function()
	{
		$('.contents').fadeIn(100);
		$('#answer').fadeIn(100);
		$('#pagenum').fadeIn(100);
	}, 500);
}

QuestionManager.prototype.passQuestion = function()
{
    clearTimeout(this._timer);

    // パスは何も記録しないで次の質問へ
	this.changeQuestion(this.nextWord());

	if (!this.isCommonQuestion())
	{
		this._timer = delayCall(this.countDown, this, 1000);
	}
	this._start_time = $.now();
	this._question_count = 0;
}

QuestionManager.prototype.finishQuestion = function()
{
	$('div.contents').hide();
	$('#button')     .hide();
	$('#pagenum')    .hide();
	$('#countdown')  .hide();
	$('#result')     .show();

	$('#result').html('送信中……');
	$.ajax({
		url        : 'filewrite.php'
		, type     : 'POST'
		, async    : false
		, dataType : 'text'
		, data     : {
		  data : $.stringify(this._data)
		}
		, success : function(data)
		{
			setTimeout(function()
			{
			  window.location = "thx.html";
			}, 100);
		}
	});
}
