
      //画面サイズ
var w = $(window).width(), //横
    h = $(window).height(); //縦

var padding = 50;

var svg = d3.select("body").append("svg")
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

//ツールチップ
var tooltip = d3.select("body")
				.append("div")
				.attr("class","tip")


var humans = svg.selectAll(".human")
				.data(dataset)
				.enter()
				.append("g")
				.attr("class","human")

          humans.append("image")
                .attr("class",sex_class)
          		.attr("xlink:href", icon)
				.attr("x", function(d) { return (xScale(d.x) -30)*0.97})
				.attr("y", function(d) { return yScale(d.y) -11})
				.attr("width", 60)
				.attr("height", 100);


		  humans.append("circle")
		  		.attr("class","circle")
		  		.attr("r",10)
		  		.attr("cx",function(d) { return xScale(d.x)*0.97 })
		  		.attr("cy",function(d) { return yScale(d.y) })	
		  		//最後の点だけ赤
                .attr("id",latest_data)
		  		.on("click",click)
                //.style("fill", sex_color)
                .on("mouseover",mouseover)
                .on("mouseout",mouseout);


          humans.append("text")
          		.attr("class","name")
                .attr("id",latest_data)
				.attr("dx", function(d) { return (xScale(d.x) + 15)*0.97})
				.attr("dy", function(d) { return yScale(d.y) + 5})
				.text(function(d) { return d.name });     

for(var i=0; i < dataset.length; i++){
	console.log(dataset[i].index);
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


/* ----------------------------------------- *
 * human クリック時                            *
 * ------------------------------------------*/

function click(d){

	console.log(d);

	/*  	
	//indexの追加
	for(var i = 0 ; i < now_data.length ; ++ i){
		if(d.index == human_num-1){

			now_data[d.index].x = w/2;
			now_data[d.index].y = h/2;

		}else{
			now_data[i].x = 0;
			now_data[i].y = 0;
		}
	}*/

  	svg.selectAll("circle")
		.attr("r",10)
		.transition()
		.duration(2000)
		.ease("elastic")
  		.attr("cx",function(d) { return w/2 })
  		.attr("cy",function(d) { return h/2 });


  	/*
	var dataset = {nodes:[{"name":"A","sex":"woman","x":9.291,"y":0.828},
						  {"name":"B","sex":"woman","x":9.291,"y":0.828}],
				   edges:[{source:0,target:1}]};


	var force = d3.layout.force()


  	svg.selectAll("circle")
  		.data(dataset)
		.attr("r",10)
		.transition()
		.duration(2000)
		.ease("elastic")
  		.attr("cx",function(d) { return w/2 })
  		.attr("cy",function(d) { return h/2 });
  	*/

	//datasetを順番にまわす
	humans.each(function(data, index){

    if(index == d.index){

      if( d3.select(this).select("text").size() > 0 ){




      }else{

      d3.select(this)
	    .append("text")
	    .attr("class", "text")
	    .attr("dx", function(d){ return d.x >= w/2 ? 15 : - (Math.sqrt(d.name.length)*35)-(d.name.length*1.2)})
	    .attr("dy",".35em")
	    .text(function(d){ return d.name })
	    .style("fill","black");

      }
    }
  });
}

function mouseover(d){
	var data = d3.select(this).datum();
	var x = data.cx;
	var y = data.cy;
	console.log(x);

	tooltip
	.style("left", "100px")
	.style("visibillity","visible")
	.text("aaa")
}

function mouseout(d){
	tooltip.style("visibillity","hidden")
}



