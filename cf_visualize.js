
function loadJsonFromPHP($phpname)
{
	var json = null;
	$.ajax(
	{
		url       : phpname
		,type     : 'GET'
		,async    : false
		,dataType : 'json'
		,cache    : false
		,success  : function(data)
		{
			json = data;
		}
	});
	return json;
}

// ユーザデータ読み込み
var user_data = loadJsonFromPHP('get_data.php');



      //画面サイズ
var w = $(window).width(), //横
    h = $(window).height(); //縦

var padding = 50;

	d3.select("body")
	  .append("div")
	  .attr("id","result")
	  .style("width",w)
	  .style("height",h);

var svg = d3.select("#result")
			.append("svg")
		    .attr("width", w)
		    .attr("height", h);


//ダミーデータ
var dataset = 
[{"name":"A","sex":"woman","x":9.291,"y":0.828},
{"name":"B","sex":"man","x":2.646,"y":9.642},
{"name":"C","sex":"woman","x":0.265,"y":2.085},
{"name":"D","sex":"woman","x":9.735,"y":6.575},
{"name":"E","sex":"man","x":4.213,"y":4.293},
{"name":"F","sex":"man","x":8.799,"y":0.793},
{"name":"G","sex":"woman","x":7.941,"y":6.323},
{"name":"H","sex":"man","x":7.291,"y":5.748},
{"name":"I","sex":"woman","x":2.629,"y":1.828},
{"name":"J","sex":"woman","x":1.239,"y":0.926}];



//indexの追加
for(var i = 0 ; i < dataset.length ; ++ i){
	dataset[i].index = i;
}

//人数
var human_num = dataset.length;
console.log (human_num);

//ちょうどいい感じの大きさで描画するようにする
var xScale = d3.scale.linear()
			   .domain([0,d3.max(dataset, function(d){ return d.x; })])
			   .range([padding,w-padding]);
var yScale = d3.scale.linear()
			   .domain([0,d3.max(dataset, function(d){ return d.y; })])
			   .range([h-padding,padding]);

/*
//ツールチップ
var tooltip = d3.select("body")
				.append("div")
				.attr("class","tip")
*/

var status = 0;
first();


function first(){

	status = 1;

	var humans = svg.selectAll(".human")
					.data(dataset)
					.enter()
					.append("g")
					.attr("class","human")

	          humans.append("image")
	                .attr("class",sex_class)
	          		.attr("xlink:href", icon)
					.attr("x", function(d) { return (xScale(d.x) -30)*0.97})
					.attr("y", function(d) { return (yScale(d.y) -11)*0.95})
					.attr("width", 60)
					.attr("height", 100);


			  humans.append("circle")
			  		.attr("class","circle")
			  		.attr("r",9)
			  		.attr("cx",function(d) { return xScale(d.x)*0.97 })
			  		.attr("cy",function(d) { return yScale(d.y)*0.95 })	
			  		//最後の点だけ赤
	                .attr("id",latest_data)
			  		.on("click",click);
	                //.style("fill", sex_color)
	                //.on("mouseover",mouseover)
	                //.on("mouseout",mouseout);


	          humans.append("text")
	          		.attr("class","name")
	                .attr("id",latest_data)
					.attr("dx", function(d) { return (xScale(d.x) + 15)*0.97})
					.attr("dy", function(d) { return (yScale(d.y) + 5)*0.95})
					.text(function(d) { return d.name });     

	for(var i=0; i < dataset.length; i++){
		console.log(dataset[i].index);


	}
}



//最新の人：データの色を変える
function latest_data(d){
	if(d.index == human_num-1){
		return "latest";
	}
}

function sex_class(d){
	return d.sex == "woman" ? "image woman" : "image man";
}

function icon(d){
	if(d.sex == "woman"){
		return "./img/f.svg";
	}else{
		return "./img/m.svg";
	}
}


function mouseover(d){
	var x = d3.select(this).attr("cx");
	var y = d3.select(this).attr("cy");

	d3.select("#tip");

	tooltip
	.style("left", x + "px")
	.style("top",  y + "px")
	.select("#name")
	.text(d);

	d3.select("#tip").classed("hidden","false");

}

function mouseout(d){

	d3.select("#tip".classed("hidden",true));
}

//ダブルクリック
function dbclick(d){

}

/* ----------------------------------------- *
 * human クリック時                            *
 * ------------------------------------------*/

function click2(d){
	console.log(d);
}

function click(d){

	status = 2;

	console.log(d);


  	svg.selectAll("circle")
		.attr("r",10)
		.transition()
		.duration(3000)
		.ease("elastic")
  		.attr("cx",function(d) { return w/2 })
  		.attr("cy",function(d) { return h/2 })
  		.style("opacity",0)
  		.remove();
  		
  	svg.selectAll("image")
  		.transition()
  		.duration(2000)
  		.style("opacity",0)
  		.remove();

  	svg.selectAll("text")
  		.transition()
  		.duration(2000)
  		.style("opacity",0)
  		.remove();

  	data_length = d.length;
  		
  	for(var i = 0; i<data_length; i++){
  		dataset.shift();
  	}

  	/*
	var dataset = {nodes:[{"name":"A","sex":"woman","x":9.291,"y":0.828},
						  {"name":"B","sex":"woman","x":9.291,"y":0.828}],
				   edges:[{source:0,target:1}]};
	*/

	var dataset = {
	            nodes: [
	                  { name: "you" },
	                  { name: "uchida seira" , sex: "f"},
	                  { name: "oishi yoshitaka" , sex: "m"},
	                  { name: "obata yoichi" , sex: "m"},
	                  { name: "sakai ryo" , sex:"m"},
	                  { name: "nuermaimaiti adilijiang" , sex: "m"},
	                  { name: "yamada so" , sex: "m"},
	                  { name: "asaba shoji" , sex: "m"},
	                  { name: "ishikawa takuya" , sex: "m"},
	                  { name: "ishizuka chiaki" , sex: "f"},
	                  { name: "campana jose maria" , sex: "m"},
	                  { name: "nadezda kozulina" , sex: "f"},
	                  { name: "koyama tomoe" , sex: "f"},
	                  { name: "takahata satoshi" , sex: "m"},
	                  { name: "tomita hiroki" , sex: "m"},
	                  { name: "nakamura shinya" , sex: "m"},
	                  { name: "nabetani mika" , sex: "f"},
	                  { name: "han joung min" , sex: "m"},
	                  { name: "furugori yuki" , sex: "f"},
	                  { name: "maruyama toru" , sex: "m"},
	                  { name: "mizuno yuta" , sex: "m"},
	                  { name: "miyake yuriko" , sex: "f"},
	                  { name: "miyasaka kotaro" , sex: "m"},
	                  { name: "miyatake takayuki" , sex: "m"},
	                  { name: "murakami hiroshi" , sex: "m"},
	                  { name: "yamaguchi aina" , sex: "f"}
	            ],
	            edges: [
	                  { source: 0, target: 1},
	                  { source: 0, target: 2},
	                  { source: 0, target: 3},
	                  { source: 0, target: 4},
	                  { source: 0, target: 5},
	                  { source: 0, target: 6},
	                  { source: 0, target: 7},
	                  { source: 0, target: 8},
	                  { source: 0, target: 9},
	                  { source: 0, target: 10},
	                  { source: 0, target: 11},
	                  { source: 0, target: 12},
	                  { source: 0, target: 13},
	                  { source: 0, target: 14},
	                  { source: 0, target: 15},
	                  { source: 0, target: 16},
	                  { source: 0, target: 17},
	                  { source: 0, target: 18},
	                  { source: 0, target: 19},
	                  { source: 0, target: 20},
	                  { source: 0, target: 21},
	                  { source: 0, target: 22},	 
	                  { source: 0, target: 23},
	                  { source: 0, target: 24},
	                  { source: 0, target: 25}	  	                                   
	            ]
	          };


	var force = d3.layout.force()
	              .nodes(dataset.nodes)
	              .links(dataset.edges)
	              .size([w,h])
	              .linkDistance([100])
	              .charge([-100])
	              .start();

	var edges = svg.selectAll("line")
		          .data(dataset.edges)
		          .enter()
		          .append("line")
		          .style("stroke","#000")
		          .style("stroke-width",1);

	var nodes = svg.selectAll(".node")
	             .data(dataset.nodes)
	             .enter()
	             .append("g")
	             .attr("class","node")
	             .call(force.drag);

	            //点の追加
	       nodes.append("circle")
	            .attr("class","w_circle")
	            .attr("r",9)
	            .transition()
	         	.duration(2000)
                .attr("class",first_data)//人のデータだけ
	            .style("stroke","black")
	            .style("stroke-width",0.5);

	            svg.selectAll("circle")
	            .on("click", function(e)
	            {
	            	/* ここに処理を書く */
	            });

          nodes.append("text")
                .attr("class","word")//人のデータだけ,それ以外はword
     			.attr("dx", function(d){ return d.x >= w/2 ? 15 : - (Math.sqrt(d.name.length)*5)-(d.name.length)})
				.attr("dy", ".35em")
				.text(function(d) { return d.name });  

	force.on("tick", function() {
	edges.attr("x1", function(d) { return d.source.x; })
	  .attr("y1", function(d) { return d.source.y; })
	  .attr("x2", function(d) { return d.target.x; })
	  .attr("y2", function(d) { return d.target.y; });

	nodes.attr("cx", function(d,i) { return i == 0 ? w : d.x; })
	  .attr("cy", function(d) { return d.y; });


	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	});


}

//最初のデータを取得
function first_data(d){
	if(d.index == 0){
		return "first";
	}else{return "w_circle"}
}




