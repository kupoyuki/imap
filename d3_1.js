

      //画面サイズ
var w = $(window).width(), //横
    h = $(window).height(); //縦

//問題数
var question_num = 50;

var root;

var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

var force = d3.layout.force()
    .gravity(.1)
    .linkDistance(10)
    .charge(-100)
    .size([w, h]);


d3.json("mergejson2.php", function(json) {
  root = json;
  root.fixed = true;
  root.x = w / 2 - 300;
  root.y = h / 2 - 1000;
  make();
});


function make () {

  var ninzu = root.nodes.length % question_num;

  force
      .nodes(root.nodes)
      .links(root.edges)
      .linkDistance([150])
      .start();


  var links = svg.selectAll("line")
                  .data(root.edges)
                  .enter()
                  .append("line")
                  .style("stroke", "#ccc")
                  .style("stroke-width", 1);


  //console.log( svg.select('.humans_' + i + ' .link') );

  var nodes = svg.selectAll(".node")
                 .data(root.nodes)
                 .enter().append("g")  //グループ
                 .attr("class", "node")
                 //.on("click", click)
                 .call(force.drag);

  nodes.selectAll(".node")
       .attr("class", node_class);


  nodes.selectAll(".human")
        /*
       .append("circle")
       .attr("r", r)
       .style("fill", node_color)*/
       .attr("class", human_class)
       .select(".man")
       .append("image")
       .attr("xlink:href","img/m.png")
       .attr("x", -8)
       .attr("y", -8)
       .attr("width", 16)
       .attr("height", 16);

  nodes.append("circle")
       .attr("class", node_class)
       .attr("r", r)
       .style("fill", node_color);
      //.on("click", click)


  nodes.append("image")
       .attr("xlink:href", "https://github.com/favicon.ico")
       .attr("x", -8)
       .attr("y", -8)
       .attr("width", 16)
       .attr("height", 16);

/*
  node.append("image")
      .attr("xlink:href", "https://github.com/favicon.ico")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);
*/

  //---------nodeのファンクション
  function node_class(d,i){
      return (i % (question_num + 1)) == 0 ? "human" : "answer";
  }

  function human_class(d){
      return d.sex == "woman" ? "human woman" : "human man";
  }

  //nodeのsize
  function r(d,i){
          console.log (i % question_num);
      return (i % (question_num + 1 )) == 0 ? 10 : d.timeout == true ? 0 : (Math.sqrt(30000 - d.time*10)/15);
  }

  function node_color(d,i){
     return (i % (question_num + 1 )) == 0 ? "#000000" : "#dc143c" ;
  }

  //----------linkのファンクション
  //edgeのデータの中身：nodeの
  function link_class(d,i){
      return (i > ninzu * question_num) ? "ans_link" : "link";
  }


  nodes.append("text")
      .attr("class",c_text)
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(label);


  function c_text(d,i){
      return (i % question_num + 1) == 0 ? "name" : "word";
  }

  function label(d,i){
    if(d.name == undefined)
      return d.word;
    return d.name;
  }

  force.on("tick", function() {
    links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    nodes.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
}

//リンクの長さを設定するためのファンクション
function link_length(){

}


//エッジを作るためのファンクション
function create_edge(human) {


        console.log("creating edges for: "+ human.name);
        var edges = [];
        var i = 1;
        for(i; i<human.question.length; i++){
            var edge = { "source" : 0, "target" : i};
            edges.push(edge);
        };
        return edges;
}
