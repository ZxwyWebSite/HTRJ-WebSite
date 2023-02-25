<?php
//《胡桃日记官网》 - php版本 ; By Zxwy ; 数据加载模块
$page = $_GET['page']; //页码
$pagesize = $_GET['pagesize']; //返回数量
$r1 = $_GET['r1']; //Status
$id = $_GET['id']; //唯一识别码

$pjht = 'static/api/beta/searchNewsKeywordsList/testindex.jht'; //主模板路径
if (file_exists($pjht)) {
    $jht = file_get_contents($pjht); //载入
    include('static/api/beta/searchNewsKeywordsList/' . $id . '/setting.php'); //其它设置
    $jht = str_replace('[$r1]', $r1, $jht); //替换r1参数
    $jht = str_replace('[$page]', $page, $jht); //替换page参数
    $jht = str_replace('[$pagesize]', $pagesize, $jht); //替换pagesize参数
    $jht = str_replace('[$total]', $total, $jht); //替换total参数
    $totalpage = ceil($total / $pagesize); //计算totalpage
    $jht = str_replace('[$totalpage]', $totalpage, $jht); //替换totalpage参数
    $p = $page * $pagesize - $pagesize; //计算翻页相关参数
    for ($i = 0; $i < $pagesize; $i++) {
        $file = 'static/api/beta/searchNewsKeywordsList/' . $id . '/' . ($i + $p) . '.js'; //文件
        if (file_exists($file)) {
            $result .= file_get_contents($file);
            //$js .= $file . ' <br> ';
        }
    }
    $jht = str_replace('[$result]', $result, $jht); //替换result参数
    //echo $jht;
    //echo $js;
    //echo $p;
} else {
    //echo '缺少testindex模板';
    http_response_code(404);
}
?>