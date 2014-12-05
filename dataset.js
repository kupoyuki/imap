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

var timeouttime = 5000;


$(function(){


  //キーワード一覧の取得
  var question_word;
	$.ajax({
	      url      : 'source/keyword.txt' //キーワードのテキストデータ
	    , type     : 'GET'
	    , async    : false
	    , dataType : 'text'
	    , cache    : false
	    , success : function(data){
	    	question_word = data.split(/\r\n|\r|\n/);  // 改行コードで分割
	    }
	});

  console.log(question_word);

  //ランダムにチョイス
  var num_question = 50; //質問の数
  var question_num = createQuestion( num_question, question_word.length );

  var name  = undefined;
  var sex   = undefined;
  var age   = undefined;
  var iamas = undefined;
  var job   = undefined;
  var type  = undefined;
  var time  = undefined;
  var url   = undefined;

  $('input.name') .change(function(e){ name  = $(this).val(); });
  $('input.sex')  .change(function(e){ sex   = $(this).val(); });
  $('input.iamas').change(function(e){ iamas = $(this).val(); });
  $('select.age') .change(function(e){ age   = $(this).val(); });
  $('select.job') .change(function(e){ job   = $(this).val(); });
  $('select.type').change(function(e){ type  = $(this).val(); });
  $('input.url')  .change(function(e){ url   = $(this).val(); });


  var data = {};

  $('#start').click(function(e){

    time = $.now();

    data.name  = name;
    data.sex   = sex;
    data.age   = age;
    data.iamas = iamas;
    data.job   = job;
    data.type  = type;
    data.time  = time;
    data.url   = url;

    var b = false;

    if(data.url == undefined){
        data.url = data.name;
    }


    $.each(data, function(key, value){
      if(value == undefined){
        b = true;
      } 
    });

    if(b){
      alert("入力不備！");
      return;
    }

    $('#top').fadeOut('fast', function(){
      $('#txt').fadeIn('fast');
    });
    $('#start') .fadeOut('fast', function(){
      $('#answer').fadeIn('fast');
    });

    Start(data, question_num, question_word);

  });


  
});


function Start(data, q_num, q_word){

  ((function(){
    for(var i = 0 ; i < q_num.length ; ++ i){

      $('<p></p>')
        .addClass('q_' + i)
        .html(q_word[ q_num[i] ])
        .css('display', 'none')
        .appendTo('#txt');
    }
  })());

  var timer = setTimeout(timeout, timeouttime);
  var count = 0;
  var start = $.now();

  data.question = [];

  //questionの最初に属性情報を格納する
  data.question.push({
    name :  data.name ,
    sex :   data.sex  ,
    age :   data.age  ,
    iamas : data.iamas,
    job :   data.job  ,
    type :  data.type ,
    time :  data.time ,
    url  :  data.url  ,
  });

  $('#txt').children('p.q_' + count).fadeIn('fast');
  $('#pagenum').html((count + 1) + '/' + q_num.length);

  //var timebar = document.getElementByld("timebar").getContexr("2d");
  /*
  $function(){
    ctx2.fillRect(0,0,100,30); 
  }*/



/* ----------------------------------------- *
 * 興味あるをクリックした時の処理                 *
 * ------------------------------------------*/

  $('#yes').click(function(e){

    clearTimeout(timer);
    var time = $.now() - start;

    data.question.push({
        time    : time
      , word    : q_word[ q_num[count] ]
      , answer  : true
      , q_num   : q_num[count]
      , timeout : false
    });

    changeQuestion();
    if( isFinish(count) ) return;

    timer = setTimeout(timeout, timeouttime);
    start = $.now();

  });




/* ----------------------------------------- *
 * 興味ないをクリックした時の処理                 *
 * ------------------------------------------*/

  $('#no').click(function(e){

    clearTimeout(timer);
    var time = $.now() - start;
   

    data.question.push({
        time    : time
      , word    : q_word[ q_num[count] ]
      , answer  : false
      , q_num   : q_num[count]
      , timeout : false
    });

    changeQuestion();
    if( isFinish(count) ) return;
    
    timer = setTimeout(timeout, timeouttime);
    start = $.now();

    
  });


/* ----------------------------------------- *
 * キーボードを使用した回答　　　　　　           *
 * ------------------------------------------*/
  $("body").keydown(function(e){
    console.log (e.keyCode);
      if(e.keyCode == 78){
        $('#no').click();
      }if(e.keyCode == 89 ){
        $('#yes').click();
      }
  });


/* ----------------------------------------- *
 * 時間オーバーの時の処理                       *
 * ------------------------------------------*/
  function timeout(){

    var time = $.now() - start;

    data.question.push({
        time    : time
      , word    : q_word[ q_num[count] ]
      , answer  : false
      , q_num   : q_num[count]
      , timeout : true
    });

    changeQuestion();
    if(isFinish(count) ) return;

    timer = setTimeout(timeout, timeouttime);
    start = $.now();

  }




/* ----------------------------------------- *
 * 全問終了？                                 *
 * ------------------------------------------*/

  function isFinish(count){

    if(count < q_num.length) return false;


    $('div.contents').hide();
    $('#button')     .hide();
    $('#pagenum')    .hide();
    $('#result')     .show();

    $('#result').html('送信中……');
    $.ajax({
      url      : 'filewrite.php'
        , type     : 'POST'
        , async    : false
        , dataType : 'text'
        , data     : {
          data : $.stringify(data)
        }
      , success : function(data){

        setTimeout(function(){
          window.location = "thx.html";
        }, 100);

      }
    });

    return true;

  }

  
/* ----------------------------------------- *
 * 問題チェンジ                                *
 * ------------------------------------------*/

  function changeQuestion(){
    
    $('.contents').hide();
    $('#answer').hide();
    $('#pagenum').hide();
    setTimeout(function(){
      $('.contents').fadeIn(50);
      $('#answer').fadeIn(50);
      $('#pagenum').fadeIn(50);
    }, 500);


    $('#txt').children('p.q_' + count).hide();
    $('#txt').children('p.q_' + (++ count) ).show();
    $('#pagenum').html( (count + 1) + '/' + q_num.length);
  }

}


//問題生成
function createQuestion(num_question, num_word){

  var question = [];

	for(var i = 0 ; i < num_question ; i++){

		do {
			select = Math.floor(Math.random() * num_word);
		} while( checkDuplicate(question, select) );
		
		question.push(select);
		
	}

  return question;
}

// 配列array 内に 変数str と同じ値が存在するかを確認	
// 同じ値が存在したら true, 存在しなかったら false を返す

function checkDuplicate(array, str){
    for(var i = 0 ; i < array.length ; i++){
        if(str == array[i]){
            return true;
        }
    }
    return false;
};

