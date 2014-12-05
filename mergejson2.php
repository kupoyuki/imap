<?php


//問題数
$total_question_count = 50;

//ファイル名一覧を取得する
function getFileList($dir) {
    $files = glob(rtrim($dir, '/') . '/*.txt');
    $list = array();

    //files を file配列に代入
    foreach ($files as $file) {
        if (is_file($file)) {
            $list[] = basename($file);
        }
        /*ディレクトリを掘り進む
        if (is_dir($file)) {
            $list = array_merge($list, getFileList($file));
        }*/
    }
    return $list;
}

//順にファイルの内容を読み込む
$list = getFileList("data");

$humandata = [];
$humandata['name'] = [];
$humandata['sex'] = [];
$humandata['age'] = [];
$humandata['iamas'] = [];
$humandata['job'] = [];
$humandata['type'] = [];
$humandata['time'] = [];


$answerdata = [];
$answerdata['nodes'] = [];
$answerdata['edges'] = [];


for($human = 0 ; $human < count($list) ; ++ $human){
    //print_r(getFileList("data"));
    //echo $list[$human]."\n"; //ファイル名の表示
    $fh = fopen( "data/".$list[$human] , "r");
    $str = fgets($fh);
    //jsonに変換
    $json = json_decode($str);
    //print_r($json);
    $humandata['name']  = $json -> {"name"};
    $humandata['sex']   = $json -> {"sex"};
    $humandata['age']   = $json -> {'age'};
    $humandata['iamas'] = $json -> {'iamas'};
    $humandata['job']   = $json -> {'job'};
    $humandata['type']  = $json -> {'type'};
    $humandata['time']  = $json -> {'time'};
/*
    foreach($json -> {'question'} as $key => $value){

        array_push($answerdata['node'], $value);

    }
*/

    //人ー回答間のノード
    $answerdata['nodes'] = array_merge($answerdata['nodes'], $json -> {'question'});

    for($i = 0 ; $i < count($json -> {'question'}) ; ++ $i){
        $source = $human * $total_question_count + $human;
        if($i != 0){
            array_push(
                  $answerdata['edges']
                , array(
                      'source' => $source
                    , 'target' => $source + $i 
                ) 
            );
        }
    }



//回答ー回答間のノード
}

$nodes = $answerdata['nodes'];
for($i = 0 ; $i < count($nodes) - 1 ; ++ $i){
    for($j = $i + 1 ; $j < count($nodes) ; ++$j ){

        if( ! isset($nodes[$i] -> {'word'}) ) continue;
        if( ! isset($nodes[$j] -> {'word'}) ) continue;

        if($nodes[$i] -> {'word'} == $nodes[$j] -> {'word'} ){
            //echo $nodes[$i] -> {'word'};

            array_push(
                  $answerdata['edges']
                , array(
                      'source' => $i
                    , 'target' => $j
                    , 'same'   => true
                )
            );
        }

    }
}

echo json_encode($answerdata);



//print_r($humandata);