
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

var padding = 100;

var x_zure = 0.95;
var y_zure = 0.95;

var xScale;
var yScale;

var svg;
var dataset;

var humannum;


function first(){

	//結果表示ボタン
    d3.select("#answer_result").style("display","inline");
	d3.select("#rebirth").style("display","none");

	$("#config").css("display","none");

	d3.select("body")
	  .append("div")
	  .attr("id","result")
	  .style("width",w)
	  .style("height",h);

	svg = d3.select("#result")
			.append("svg")
			.attr("width", w)
			.attr("height", h)

	svg.transition()
		.delay(500)
		.transition(1000)
		.style("opacity",1);

	var data = loadJsonFromPHP('get_data.php');
	// var user_pos = loadJsonFromPHP('mds.php');

	// MDS
	var dist_mat = loadJsonFromPHP('dist_mat.php');
	var user_pos = mds.classic(dist_mat);

	console.log(user_pos);

	dataset = [];
	$.each(data, function(index, value)
	{
		user = {};

		user.name = this.name;
		user.sex = this.sex;
		user.age = this.age;
		user.iamas = this.iamas;
		user.type = this.type;
		user.time = this.time;
		user.url = this.url;
		// user.x = Math.random();			// とりあえず乱数で表示する
		// user.y = Math.random();			// とりあえず乱数で表示する
		user.x = user_pos[index][0];
		user.y = user_pos[index][1];
		user.id = index;				// indexの追加
		user.answer = this.question; 	//回答結果

		dataset.push(user);

	});

	//人数
	human_num = dataset.length;
	console.log ("合計人数は: " + human_num + " 人");

	//ちょうどいい感じの大きさで描画するようにする
	xScale = d3.scale.linear()
				   .domain([0,d3.max(dataset, function(d){ return d.x; })])
				   .range([padding,w-padding]);
	yScale = d3.scale.linear()
				   .domain([0,d3.max(dataset, function(d){ return d.y; })])
				   .range([h-padding,padding]);

}

//データセット
var humans;
//選択されたデータを格納するところ
var selectors = [];
var selectors_size = 0;

//開始
first();
start();

function start(){


	humans = svg.selectAll(".human")
				.data(dataset)
				.enter()
				.append("g")
				.attr("class","human");

          humans.append("image")
                .attr("class",sex_class)
          		.attr("xlink:href", icon)
				.attr("x", function(d) { return (xScale(d.x) -20.5)*x_zure})
				.attr("y", function(d) { return (yScale(d.y) -12)*y_zure})
				.attr("width", 40)
				.attr("height", 80)
				.on("click",select)
				.on("mouseover",mouseover)
                .on("mouseout",mouseout);


		  humans.append("circle")
		  		.attr("class","circle")
		  		.attr("r",7)
		  		.attr("cx",function(d) { return xScale(d.x)*x_zure })
		  		.attr("cy",function(d) { return yScale(d.y)*y_zure })	
		  		//最後の点だけ赤
                .attr("id",latest_data)
		  		.on("click",select)
                //.style("fill", sex_color)
                .on("mouseover",mouseover)
                .on("mouseout",mouseout);

          humans.append("text")
          		.attr("class","name")
                .attr("id",latest_data)
				.attr("dx", function(d) { return (xScale(d.x) + 15)*x_zure})
				.attr("dy", function(d) { return (yScale(d.y) + 5)*y_zure})
				.text(function(d) { return d.name });     

				//回答結果を見るボタン
				d3.select("#answer_result")
				  .on("click",answer_result);

}

//最新の人：データの色を変える
function latest_data(d){
	if(d.id == human_num-1){
		return "latest";
	}
}

//性別
function sex_class(d){
	return d.sex == "woman" ? "image woman" : "image man";
}

//画像データ
function icon(d){
	if(d.sex == "woman"){
		return "./img/f.svg";
	}else{
		return "./img/m.svg";
	}
}

/* ----------------------------------------- *
 * human クリック時 選択: .choice             *
 * ------------------------------------------*/

function select(d){

	//クリックされたデータの、"id"のデータを得る
	console.log(d);

	var now_d_index = d.id;
	console.log("このデータの id は: "+now_d_index);

	//datasetを順番にまわす
	humans.each(function(data, index){

    if(data.id == d.id){
      //消す
      if( d3.select(this).select(".choice").size() > 0 ){

            d3.select(this)
              .select(".choice")
              .remove();

			$.each(selectors, function(i, val)
			{
				if (data.id === this.id)
				{
					selectors.splice(i,1);
				}
			});

      }else{
      	//入れる
	      d3.select(this)
		      .append("circle")
		      .attr("class", "choice")
		      .attr("r",9)
		      .attr("cx", function(d){ return xScale(d.x)* x_zure })
		      .attr("cy", function(d){ return yScale(d.y)* y_zure })

	   	   //console.log(this);
	   	   selectors.push(d);
      
      }

	console.log(selectors);							//選択したデータを格納
	console.log("選択人数は: "+Object.keys(selectors).length+" 人");		//選択人数

	selectors_size = Object.keys(selectors).length;

    }

  });
}


/* ----------------------------------------- *
 * human マウスオーバー時: ツールチップの設定     *
 * ------------------------------------------*/


function mouseover(d){

	var x = d3.select(this).attr("x");
	var y = d3.select(this).attr("y");

	if( d3.select(this).select("cx").size() > 0){
		x = d3.select(this).attr("cx");
		y = d3.select(this).attr("cy");
	}

	//タイムスタンプの調整：年、月、日、時、分
	var ts = d.time;
	var name = d.name;

	var d = new Date( ts );
	var year  = d.getFullYear();
	var month = d.getMonth() + 1;
	var day  = d.getDate();
	var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
	var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();


	d3.select("#tip")
		.style("left", x + "px")
		.style("top",  y + "px")
		.select("#tip_name")
		.text(name);

	d3.select("#value")
		.text(function(d){
			return year + '-' + month + '-' + day + '\n' + hour + ':' + min;
		});

	d3.select("#tip").classed("hidden",false);

}

function mouseout(d){
	d3.select("#tip").classed("hidden",true);
}


/* ----------------------------------------- *
 * 回答結果を見るボタン                         *
 * ------------------------------------------*/

//初期化
var node;
var edge;
var edges_count;
var encoded_data;


function answer_result(){

	console.log(selectors);
	console.log(selectors_size);

	//選択していないときの警告
	if(selectors_size　== 0){
		alert("回答結果を見たい人を選択してください");
		return;
	}else{

		//現在の画面の削除
	  	reset();

	  	$.each(selectors,function(i){
	  		encoded_data = encodeData(this,i);
	  	});
	}

  	console.log(encoded_data);
  	force(encoded_data);

}

function force(data){

  	encoded_data.fixed = true;

  	//回答情報の領域
  	text_field();

	//ボタンの切り替え
	d3.select("#answer_result").style("display","none");
	d3.select("#rebirth").style("display","inline");
		$("#config").fadeIn(300);

		$('input.show_change').change(function(e){ 

		var fl_status;	//force layout

		fl_status = $('[class="show_change"]:checked').map(function(){
		  return $(this).val();
		}).get();
		console.log(fl_status);

		//存在しない場合は-1を返すメソッド indexOf
		if(fl_status.indexOf("興味ある") == -1){
			$('.yes').css("display","none");
		}
		if(fl_status.indexOf("興味ない") == -1){
			$('.no').css("display","none")
		}

	});

	var force = d3.layout.force()
	              .nodes(encoded_data.nodes)
	              .links(encoded_data.edges)
	              .size([w,h])
	              .friction([0.6])		//摩擦力　アニメーションの収束速度
	              .gravity([0.3])		//大きいほど中央に寄る
	              .linkDistance([150])	//リンクの長さ
	              .charge([-350])		//反発力 負の値だと離れようとする力
	              .start();


	var	links = svg.selectAll("line")
		          .data(encoded_data.edges)
		          .enter()
		          .append("line")
		          .attr("class",select_line_class)


	var	nodes = svg.selectAll(".node")
	             .data(encoded_data.nodes)
	             .enter()
	             .append("g")
	             .attr("class","node")
	             .call(force.drag);

          nodes.append("text")
                .attr("class",select_text_class)//人のデータだけ,それ以外はword
     			.attr("dx", 18)
				.attr("dy", ".35em")
				.text(c_text);  

	            //点の追加
	      nodes.append("circle")
	            .attr("class",select_class)
	            .attr("r",c_size)
	            .transition()
	         	.duration(2000)
	            .style("stroke","black")
	            .style("stroke-width",0.5);

	    //      svg.selectAll("circle")
	    //         .on("click", function(e)
	    //         {					
					// reset();
	    //         	rebirth();
	    //         });

	    //      svg.selectAll("text")
	    //         .on("click", function(e)
	    //         {
					// reset();
	    //         	rebirth();
	    //         });


		force.on("tick", function() {
		links.attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; });

		nodes.attr("cx", function(d) { return select_class == "first_data" ? w : d.x; })
		  	 .attr("cy", function(d) { return select_class == "first_data" ? h : d.y;});


		nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		});

		//戻るボタン
		d3.select("#rebirth")
	        .on("click", function(e)
	        {
				reset();
	        	rebirth();
	        });

}


//最初のデータを取得
function select_class(d){
	//無回答・タイムアウトは0
	if(d.name != undefined){
		return "first_data";
	}else if(d.answer == 1 || d.answer == true){
		return "w_circle yes";
	}else if(d.answer == -1 || d.answer == false){
		return "w_circle no";
	}else{
		return "w_circle none";	//パス、またはタイムアウト
	}
}

function c_text(d,i){
	return (d.name != undefined ? d.name : d.word);
}

function select_text_class(d){
	//無回答・タイムアウトは0
	if(d.name != undefined){
		return "name";
	}else if(d.answer == 1 || d.answer == true){
		return "w_text yes";
	}else if(d.answer == -1 || d.answer == false){
		return "w_text no";
	}else{
		return "w_text none";	//パス、またはタイムアウト
	}
}

function select_line_class(d){
	if(d.same == true){
		return "same_word";
	}else if(d.target.answer == 1 || d.target.answer == true){
		return "line yes";
	}else if(d.target.answer == -1 || d.target.answer == false){
		return "line no";
	}
}

//円の大きさ
function c_size(d,i){
	//人のとき固定
	if(d.name != undefined){
		return 10;
	}else if(d.answer == true || d.answer == false){
		
		return (i % (Math.sqrt(30000 - d.time*10)/15));

	}else if(d.answer != 0){
		//回答の大きさ
    	return (i % (Math.sqrt(30000 - d.time*10)/15));
    }
}


/* ----------------------------------------- *
 * node edge の形式に変換　　                   *
 * ------------------------------------------*/

function encodeData(data,select){

	var n = {};
	n.name = data.name;
	n.sex = data.sex;
	n.age = data.age;
	n.iamas = data.iamas;
	n.type = data.type;
	n.time = data.time;
	n.url = data.url;

	node.push(n);

	for(var i in data.answer){

		var n = {};
		n.time = data.answer[i].time;
		n.word = data.answer[i].word;
		n.answer = data.answer[i].answer;
		if(('timeout' in data.answer) == true){
			n.timeout = data.timeout[i].timeout;
		}
		if(data.answer[i] != 0 || data.timeout[i] != true){
			node.push(n);
		}
	}


	var root = edges_count;
	console.log(root);


	for(var i in node){

		if(edges_count == node.length - 1){
			break;
		}

		edges_count++;
		var q = {}
		q.source = parseInt(root);
		q.target = parseInt(edges_count);

		edge.push(q);

	}

	//console.log(edge);

	edges_count++; //root用


	console.log(node);

	//最後の人まで来たら同一回答間のedge処理
	if(select == selectors_size-1){
		edge = same_answer(node);
	}

	return {nodes: node, edges: edge};
}


/* ----------------------------------------- *
 * 同一回答間のedgeを追加　　                   *
 * ------------------------------------------*/

function same_answer(node){
	for(var i = 0; i < node.length - 1 ; i++){
		for(var j = i + 1; j < node.length; j++){
			if( 'word' in node[i] == false ) { continue; }
			if( 'word' in node[j] == false ) { continue; }

			if( node[i].word == node[j].word ){
				if( node[i].answer == node[j].answer){
					var q = {}
					q.source = i;
					q.target = j;
					q.same = true;
					console.log(q);
					edge.push(q);
				}
			}

		}
	}
	return edge;
}


/* ----------------------------------------- *
 * forceレイアウト表示非表示切り替え　　　　　      *
 * ------------------------------------------*/

function status_change(){


}

/* ----------------------------------------- *
 * 文字情報領域の表示　　　　　                   *
 * ------------------------------------------*/

function text_field(){

  	//回答結果の文字表示部分
  	d3.select("body")
	  .append("div")
	  .attr("id","answer_words")

	console.log(selectors);

	//回答者情報
	$("#answer_words").html(function(){

		var personal_text = [];

		//一時
		var sex;


		for(var i = 0 ; i < selectors_size; i++){

			//表記の処理
			if(selectors[i].type == 0){
				selectors[i].type = "回答なし";
			}
			if(selectors[i].sex == "man" ? sex = "男" : sex = "女");

			//基本情報
			personal_text.push(
				"<h3>"+ (i+1) +"人目　"+ selectors[i].name +
				"</h3><span class='parsonal_data'>年齢 : <b>" + selectors[i].age +
				"</b>代　性別 : <b>"+ sex +
				"</b>　属性 : <b>" + selectors[i].type +
				"</b>　iamas関係者 <b>: " + selectors[i].iamas + "</b><br/></span>"
			);

			//回答を文字列にぶちこむ
			var answer_text_yes = "";	//初期化
			var answer_text_no = "";	//初期化
			var answer_text_pass = "";

			for(var j in selectors[i].answer){
				//最初のデータにwordが無い時無視
				if(('word' in selectors[i].answer[j]) == false ){
					continue;
				}
				//興味ある
				if(selectors[i].answer[j].answer == 1 || selectors[i].answer[j].answer == true){
					answer_text_yes += (selectors[i].answer[j].word+"　");
				//興味ない
				}else if(selectors[i].answer[j].answer == -1 || selectors[i].answer[j].answer == false){
					answer_text_no += (selectors[i].answer[j].word+"　");
				}else{
					answer_text_pass += (selectors[i].answer[j].word+"　");
				}

				if(j == 25){
					answer_text_yes += "<br/>";
					answer_text_no += "<br/>";
					answer_text_pass += "<br/>";
				}
				//answer_text += (selectors[i].answer[j].word+"　");
			}

			personal_text.push(
				"<span class='answer_data'>"+
				"<span class='yes'><li>興味ある</li>"+ answer_text_yes +"</span>"+
				"<span class='no'><li>興味ない</li>"+ answer_text_no +"</span>"+
				"<span class='pass'><li>パス</li>"+ answer_text_pass + "</span>"+
				"</span>"
			);

		}

		return personal_text;
	});


}


//リセット
function reset(){

	//初期化
	edges_count = 0;
	encoded_data = [];
	node = [];
	edge = [];

	$("#config").fadeOut(300);

	//削除する（画面を切り替える）
  	d3.selectAll("circle")
		.attr("r",10)
		.transition()
		.duration(3000)
		.ease("elastic")
  		// .attr("cx",function(d) { return w/2 })
  		// .attr("cy",function(d) { return h/2 })
  		.style("opacity",0)
  		.remove();
  		
  	d3.selectAll("image")
  		.transition()
  		.duration(2000)
  		.style("opacity",0)
  		.remove();

  	d3.selectAll("text")
  		.transition()
  		.duration(2000)
  		.style("opacity",0)
  		.remove();

  	d3.selectAll("line")
  	  .transition()
  	  .duration(2000)
  	  .style("opacity",0)
  	  .remove();

}


//最初の画面に戻る
function rebirth(){

	selectors = [];
	selectors_size = 0;

	d3.selectAll("svg")
		.transition()
		.duration(600)
		.style("opacity",0)
		.remove();

	first();
	start();

}

