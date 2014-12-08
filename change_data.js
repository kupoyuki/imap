


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
  {label:"性別",value:1, selected:true},
  {label:"男性", value:2},
  {label:"女性", value:3},
]

var dataSet2 = [
  {label:"属性", value:4, selected:true},
  {label:"bbbb", value:5},
  {label:"cccc", value:6}
]

var count = 1;

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

  //countでどちらのデータセットか判断
  count == 1 ? count += 1 : count -= 1; 
  
  optionElm.data(change(count))
  .attr("value", function(d){ return d.value})
  .attr("selected", function(d){ if(d.selected) return "selected"})
  .text(function(d){ return d.label })
  .exit()
  .remove(); 

  console.log(count);

})

function change(count){

  if( count == 1 ) {
    return "dataSet1";
  }else{ return "dataSet2";}

}
