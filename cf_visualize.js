
      //画面サイズ
var w = $(window).width(), //横
    h = $(window).height(); //縦

var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);