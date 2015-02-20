
/* ----------------------------------------- *
 * メニューの表示／非表示　　　　　　　　           *
 * ------------------------------------------*/

$('#menu').click(function(){
  $('#top').slideToggle('fast');
  console.log($('#top').css('display'));
});

// $('#menu').click(function(){
//     if ($('#top').css('display') == 'none') {
//         console.log($('#top').css('display'));
//         $('#top').slideDown('fast');

//     } else {
//         $('#top').slideUp('fast');
//     }
// });

/* ----------------------------------------- *
 * configウィンドウの表示　　　　　　　           *
 * ------------------------------------------*/

$().ready(function() { 
  $('#show_change').jqDrag(); 
  $('#size_change').jqDrag();

});

$('.config_close').click(function()
     {
      // alert($(this).parent("div").attr("id"));
      var config_id = $(this).parent("div").attr("id"); 
        $('#'+config_id).css("display","none");
});

/* ----------------------------------------- *
 * 初期状態　　　　　　　　　　　　　　　           *
 * ------------------------------------------*/




/* ----------------------------------------- *
 * 回答結果によるソート　　　　　　　　　　　　      *
 * ------------------------------------------*/

function status_change(e){

  //alert( $(this).val() ); //クリックされた要素

  switch($(this).val() ){
    case '興味ある':
      if( $(this).is(':checked') ){
        $('.node').css("display","inline");
        $('.line').css("display","inline");
        $('.no').css("display","none");         
        $('.yes').css("display","inline");
        $(':checkbox[class="show_change"][value="共通項のみ"]').prop('checked',false);
      }
      else{
        $('.yes').css("display","none");
      }
    break;
    case '興味ない':
      if( $(this).is(':checked') ){ 
        $('.node').css("display","inline");
        $('.line').css("display","inline"); 
        $('.yes').css("display","none");      
        $('.no').css("display","inline");       
        $(':checkbox[class="show_change"][value="共通項のみ"]').prop('checked',false);
      }
      else{
        $('.no').css("display","none");
      } 
    break;
    case '共通項のみ':
      if( $(this).is(':checked') ){
        $(':checkbox[class="show_change"][value="興味ある"]').prop('checked',false);
        $(':checkbox[class="show_change"][value="興味ない"]').prop('checked',false);
        $(':checkbox[class="show_change"][value="共通項のみ"]').prop('checked',true);
        $('.node').css("display","none");
        $('.line').css("display","none");　//一旦全部消して
        $('.first_data').css("display","inline");
        $('.same').css("display","inline");
        $('.sameword').css("display","inline");

      }
      else{
        $(':checkbox[class="show_change"][value="興味ある"]').prop('checked',true);
        $(':checkbox[class="show_change"][value="興味ない"]').prop('checked',true);
        $(':checkbox[class="show_change"][value="共通項のみ"]').prop('checked',false);
        $('.node').css("display","inline");
        $('.line').css("display","inline");
        $('.first_data').css("display","inline");
        $('.yes').css("display","inline");
        $('.no').css("display","inline");       
      }   
    break;
  }

  fl_status = $('[class="show_change"]:checked').map(function(){
    return $(this).val();
  }).get();
  console.log(fl_status);

}

/* ----------------------------------------- *
 * menuバーのボタンによる再呼び出し　　　　　　    *
 * ------------------------------------------*/

  $('#show_change_show').click(function(){
    //offのとき再表示
    if($(this).hasClass("imgChange_off") == true){
      $('#show_change').css("display","inline");
    }
  })
  $('#size_change_show').click(function(){
    //offのとき再表示
    if($(this).hasClass("imgChange_off") == true){
      $('#size_change').css("display","inline");
    }
  })

/* ----------------------------------------- *
 * （スイッチ）画像のonoff切り替え　　　　　　　　　*
 * ------------------------------------------*/

//onからoffへ
$(function(){

    $(".imgChange").click(function(){
        var imgSrc = $(this).attr("src");

        if($(this).attr("class") == "imgChange_off"){
            $(this).attr("class", "imgChange_on")
            $(this).attr("value", "on")
            imgSrc = imgSrc.replace(/(_off)/, '')
            $(this).attr("src", imgSrc)

            return;
        }

        $(this).attr("class", "imgChange_off")
        $(this).attr("value", "off")
        $(this).attr("src", imgSrc.replace(/(\.gif|\.svg|\.png)/g, '_off$1'))

    });
});


/* ----------------------------------------- *
 * 表示切り替え時・チェックボックスのリセット　　    *
 * ------------------------------------------*/

function configreset(){

  console.log("reset");
  $(':checkbox[class="show_change"][value="興味ある"]').prop('checked',true);
  $(':checkbox[class="show_change"][value="興味ない"]').prop('checked',true);
  $(':checkbox[class="show_change"][value="共通項のみ"]').prop('checked',false);

  size_status = "fast";

  $('input.size_change[value="回答時間の速かったものを大きく"]').prop('checked',true);
  $('input.size_change[value="回答時間の遅かったものを大きく"]').prop('checked',false);


  $(".config").fadeOut(300);

}

/*
var cursor;

function MouseMoveFunc(e){

  // クライアント座標系を基点としたマウスカーソルの座標を取得
  var cursor = e.clientY;
  console.log(cursor);

  var foo = function(){
      alert("OK");
  };

  if(cursor <= "20"){
    $('#top').show();

    $('#top').hide(4000);
  }

}

if(document.addEventListener){
  cursor = document.addEventListener("mousemove" , MouseMoveFunc);

// アタッチイベントに対応している
}else if(document.attachEvent){
  cursor = document.attachEvent("onmousemove" , MouseMoveFunc);
}

*/

// var dataSet1 = [
//   {label:"性別",value:1, selected:true},
//   {label:"男性", value:2},
//   {label:"女性", value:3},
// ]

// var dataSet2 = [
//   {label:"属性", value:4, selected:true},
//   {label:"bbbb", value:5},
//   {label:"cccc", value:6}
// ]

// var count = 1;

// //option要素の生成
// var optionElm = d3.select(".select")
//   .selectAll('option')
//   .data(dataSet1)
//   .enter()
//   .append("option")
//   .attr("value", function(d){ return d.value})
//   .attr("selected", function(d){ if(d.selected) return "selected"})
//   .text(function(d){ return d.label });

// //option要素を上書き
// d3.select("#chgbtn").on("click", function(){

//   //countでどちらのデータセットか判断
//   count == 1 ? count += 1 : count -= 1; 
  
//   optionElm.data(change(count))
//   .attr("value", function(d){ return d.value})
//   .attr("selected", function(d){ if(d.selected) return "selected"})
//   .text(function(d){ return d.label })
//   .exit()
//   .remove(); 

//   console.log(count);

// })

// function change(count){

//   if( count == 1 ) {
//     return "dataSet1";
//   }else{ return "dataSet2";}

// }
