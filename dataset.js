
function loadWords(file_path)
{
  var words;
  $.ajax(
  {
        url      : file_path
      , type     : 'GET'
      , async    : false
      , dataType : 'json'
      , cache    : false
      , success  : function(data)
      {
        words = data;
      }
  });
  return words;
}

// --------------------------------------------------------------
// エントリポイント
// --------------------------------------------------------------
$(function()
{
  // 共通の単語を読み込む
  var common_words = loadWords('source/common_keyword.json');
  // 分類単語を読み込む
  var category_words = loadWords('source/category_words.json');

  console.log(common_words);
  console.log(category_words);

  var name  = undefined;
  var sex   = undefined;
  var age   = undefined;
  var iamas = undefined;
  var type  = undefined;
  var time  = undefined;
  var url   = undefined;

  $('input.name') .change(function(e){ name  = $(this).val(); });
  $('input.sex')  .change(function(e){ sex   = $(this).val(); });
  $('input.iamas').change(function(e){ iamas = $(this).val(); });
  $('select.age') .change(function(e){ age   = $(this).val(); });
  $('input.type') .change(function(e)
  { 
    var array = [];

    for(var i = 0; i < 10; i++)
    {
      if($("#" + i).find('input').is(':checked') )
      {
        console.log( $("#" + i).find('input').val() );
        genre.push( $("#" + i).find('input').val() );
      }
    }
    type = array;
  });
  //$('select.type').change(function(e){ type  = $(this).val(); });
  $('input.url')  .change(function(e){ url   = $(this).val(); });


  var data = {};

  $('#start').click(function(e)
  {
    time = $.now();

    data.name  = name;
    data.sex   = sex;
    data.age   = age;
    data.iamas = iamas;
    data.type  = type;
    data.time  = time;
    data.url   = url;

    var b = false;

    if(data.url == undefined)
    {
        data.url = data.name;
    }

    $.each(data, function(key, value)
    {
      if(value == undefined){
        b = true;
      } 
    });

    if(b)
    {
      alert("入力不備！");
      return;
    }

    $('#top').fadeOut('fast', function()
    {
      $('#txt').fadeIn('fast');
    });
    $('#start') .fadeOut('fast', function()
    {
      $('#answer').fadeIn('fast');
    });

    //（属性データ,生成済み問題リスト,全単語）;
    //生成済み問題リストのidを参照し、全単語から選択
    // Start(data, question_list , all_word);

    // 質問数
    var q_data = {
      all_question_num     : 50               // 全質問数
      ,common_question_num : 25               // 共通質問
      ,common_words        : common_words     // 共通の単語
      ,category_words      : category_words   // 分類単語
      ,timeout_sec         : 5             // タイムアウト時間（秒）
    };

    var manager = new QuestionManager(data, q_data);
    manager.startQuestion();
  });
});

