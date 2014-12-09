
function loadJsonFromPHP(phpname)
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

      //画面サイズ
var w = $(window).width(), //横
    h = $(window).height(); //縦

var padding = 50;

var x_zure = 0.66;
var y_zure = 0.94;

var xScale;
var yScale;

var svg;
var dataset;

var humannum;


function first(){

	d3.select("body")
	  .append("div")
	  .attr("id","result")
	  .style("width",w)
	  .style("height",h);

	svg = d3.select("#result")
			.append("svg")
		    .attr("width", w)
		    .attr("height", h);


	// var username = "hoge";
	// var user_dist = loadJsonFromPHP('cf/calc_cf.php?username='+username);

	// console.log(user_dist);

	var data = loadJsonFromPHP('get_data.php');

	dataset = [];
	$.each(data, function()
	{
		user = {};
		user.name = this.name;
		user.sex = this.sex;
		user.age = this.age;
		user.iamas = this.iamas;
		user.type = this.type;
		user.time = this.time;
		user.url = this.url;
		user.x = Math.random();		// とりあえず乱数で表示する
		user.y = Math.random();		// とりあえず乱数で表示する

		dataset.push(user);
	});

	//indexの追加
	for(var i = 0 ; i < dataset.length ; ++ i){
		dataset[i].index = i;
	}

	//人数
	human_num = dataset.length;
	console.log (human_num);

	//ちょうどいい感じの大きさで描画するようにする
	xScale = d3.scale.linear()
				   .domain([0,d3.max(dataset, function(d){ return d.x; })])
				   .range([padding,w-padding]);
	yScale = d3.scale.linear()
				   .domain([0,d3.max(dataset, function(d){ return d.y; })])
				   .range([h-padding,padding]);

	/*
	//ツールチップ
	var tooltip = d3.select("body")
					.append("div")
					.attr("class","tip")
	*/

}

var status = 0;
var humans;
first();
start();

function rebirth(){
	d3.select("svg")
	.transition()
	.duration(500)
	.style("opacity",0)
	.remove();

	first();
	start();

}

function start(){


		humans = svg.selectAll(".human")
					.data(dataset)
					.enter()
					.append("g")
					.attr("class","human")

	          humans.append("image")
	                .attr("class",sex_class)
	          		.attr("xlink:href", icon)
					.attr("x", function(d) { return (xScale(d.x) -30)*x_zure})
					.attr("y", function(d) { return (yScale(d.y) -11)*y_zure})
					.attr("width", 40)
					.attr("height", 80);


			  humans.append("circle")
			  		.attr("class","circle")
			  		.attr("r",7)
			  		.attr("cx",function(d) { return xScale(d.x)*x_zure })
			  		.attr("cy",function(d) { return yScale(d.y)*y_zure })	
			  		//最後の点だけ赤
	                .attr("id",latest_data)
			  		.on("click",select );
	                //.style("fill", sex_color)
	                //.on("mouseover",mouseover)
	                //.on("mouseout",mouseout);

	          humans.append("text")
	          		.attr("class","name")
	                .attr("id",latest_data)
					.attr("dx", function(d) { return (xScale(d.x) + 15)*x_zure})
					.attr("dy", function(d) { return (yScale(d.y) + 5)*y_zure})
					.text(function(d) { return d.name });     

		for(var i=0; i < dataset.length; i++){
		console.log(dataset[i].index);

    $('#answer_result').click(function(){



    });

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


/* ----------------------------------------- *
 * human クリック時 選択： .choice             *
 * ------------------------------------------*/



function select(d){

  d3.select(this)
    .select("text")
    .remove();


	//datasetを順番にまわす
	humans.each(function(data, index){

    if(index == d.index){

      if( d3.select(this).select(".choice").size() > 0 ){

            d3.select(this)
              .select(".choice")
              .remove();

            console.log(this);

      }else{

      d3.select(this)
      .append("circle")
      .attr("class", "choice")
      .attr("r",9)
      .attr("cx", function(d){ return xScale(d.x)* x_zure })
      .attr("cy", function(d){ return yScale(d.y)* y_zure })

	   console.log(this);
      
      }
    }
  });




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

/*
function zoom(d){

	status = 2;

	console.log(d);

	// ユーザデータ読み込み
	var data = loadJsonFromPHP('get_data.php');

	var user_data = undefined;
	$.each(data, function()
	{
		if (this.name === d.name)
		{
			user_data = this;
		}
	});

	var encoded_data = encodeData(user_data);

	console.log(encoded_data);


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
	
  	user_data = encoded_data;


	var force = d3.layout.force()
	              .nodes(user_data.nodes)
	              .links(user_data.edges)
	              .size([w,h])
	              .linkDistance([100])
	              .charge([-100])
	              .start();

	var edges = svg.selectAll("line")
		          .data(user_data.edges)
		          .enter()
		          .append("line")
		          .style("stroke","#000")
		          .style("opacity",0.5)
		          .style("stroke-width",1);

	var nodes = svg.selectAll(".node")
	             .data(user_data.nodes)
	             .enter()
	             .append("g")
	             .attr("class","node")
	             .call(force.drag);

          nodes.append("text")
                .attr("class","word")//人のデータだけ,それ以外はword
     			.attr("dx", 18)
				.attr("dy", ".35em")
				.text(c_text);  

	            //点の追加
	       nodes.append("circle")
	            .attr("class",select_class)
	            .attr("r",10)
	            .transition()
	         	.duration(2000)
	            .style("stroke","black")
	            .style("stroke-width",0.5);

	         svg.selectAll("circle")
	            .on("click", function(e)
	            {
	            	revurse();
	            });

	         svg.selectAll("text")
	            .on("click", function(e)
	            {
	            	rebirth();
	            });


	force.on("tick", function() {
	edges.attr("x1", function(d) { return d.source.x; })
	  .attr("y1", function(d) { return d.source.y; })
	  .attr("x2", function(d) { return d.target.x; })
	  .attr("y2", function(d) { return d.target.y; });

	nodes.attr("cx", function(d,i) { return i == 0 ? w : d.x; })
	  .attr("cy", function(d) { return d.y; });


	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	});


}*/


//最初のデータを取得
function select_class(d){
	if(d.index == 0){
		return "first_data";
	}else if(d.answer == 1){
		return "w_circle yes";
	}else if(d.answer == -1){
		return "w_circle no";
	}else{
		return "w_circle none";
	}
}


function c_text(d,i){
  return (i == 0 ? d.name : d.word);
}

//円の大きさ
function c_size(d,i){
    //return (i % (question_num + 1 )) == 0 ? 10 : d.timeout == true ? 0 : (Math.sqrt(30000 - d.time*10)/15);
}

//force用にデータを書き換える
function encodeData(data)
{
	var nodes = [];

	var n = {};
	n.name = data.name;
	n.sex = data.sex;
	n.age = data.age;
	n.iamas = data.iamas;
	n.type = data.type;
	n.time = data.time;
	n.url = data.url;

	nodes.push(n);

	$.each(data["question"], function()
	{
		n = {};
		n.time = this["time"];
		n.word = this["word"];
		n.answer = this["answer"];
		nodes.push(n);
	});

	var edges = [];

	for (var i = 1; i < nodes.length; i++)
	{
		var q = {};
		q.source = 0;
		q.target = i;

		edges.push(q);
	}

	return {nodes: nodes, edges: edges};
}
