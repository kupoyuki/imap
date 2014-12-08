

$('#menu').click(function(){
    if ($('#top').css('display') == 'none') {
        $('#top').slideDown('fast');
    } else {
        $('#top').slideUp('fast');
    }
});

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

var dataSet1 = [
  {label:"hoge", value:10},
  {label:"hello", value:20, selected:true},
  {label:"world", value:30},
  {label:"shimizu", value:40}
]

var dataSet2 = [
  {label:"aaaa", value:10},
  {label:"bbbb", value:20},
  {label:"cccc", value:30, selected:true}
]

//option要素の生成
var optionElm = d3.select(".select")
  .selectAll('option')
  .data(dataSet1)
  .enter()
  .append("option")
  .attr("value", function(d){ return d.value})
  .attr("selected", function(d){ if(d.selected) return "selected"})
  .text(function(d){ return d.label });

//option要素を上書き
d3.select("#chgbtn").on("click", function(){
  optionElm.data(dataSet2)
  .attr("value", function(d){ return d.value})
  .attr("selected", function(d){ if(d.selected) return "selected"})
  .text(function(d){ return d.label })
  .exit()
  .remove();    
})