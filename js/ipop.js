// ipop.js ポップアップウインドウ
//
// 使い方：
// <div id="ipop">
//   <div id="ipop_title">タイトル</div>
//   <div id="ipop_close">閉じるボタン</div>
//   中身
// </div>
//
// 上記のようなHTMLを作り、$.ipop() で呼び出す。

$(function()
{
    var wx, wy;    // ウインドウの左上座標

    $('#ipop_close_button').hide();
    $('#1').show();
    $('#2').hide();
    $('#3').hide();
    $('#4').hide();
    $('#5').hide();
    $('#6').hide();
    $('#7').hide();


    // ウインドウの座標を画面中央にする。

    wx = $(document).scrollLeft() + ($(window).width() - $('#ipop').outerWidth()) / 2;
    if (wx < 0) wx = 0;
    wy = $(document).scrollTop() + ($(window).height() - $('#ipop').outerHeight()) / 2;
    if (wy < 0) wy = 0;

    // ポップアップウインドウを表示する。
    $('#ipop').css({top: wy, left: wx}).fadeIn(100);
    $('#ipop').fadeIn(100);

    $('#call').click(function(){
      $('#ipop').css({top: wy, left: wx}).fadeIn(100);
      $('#ipop').fadeIn(100);
    });

    var i = 1;
    $('#next').click(function(){

          $("#"+i).fadeOut(500);
          if(i==6){
            $('#next').hide();
            $('#ipop_close_button').show();
          }
          console.log(i);
          i++;
          $("#"+i).fadeIn(500);
    });

    // 閉じるボタンを押したとき
    $('.ipop_close').click(function()
      {
        $('#ipop').fadeOut(300);
      });

    // タイトルバーをドラッグしたとき
    $('#ipop_title').mousedown(function(e)
    {
      var mx = e.pageX;
      var my = e.pageY;
      $(document).on('mousemove.ipop', function(e)
      {
        wx += e.pageX - mx;
        wy += e.pageY - my;
        $('#ipop').css({top: wy, left: wx});
        mx = e.pageX;
        my = e.pageY;
        return false;
      }).one('mouseup', function(e)
      {
        $(document).off('mousemove.ipop');
      });
      return false;
    });

});

