<?php
//《胡桃日记官网》 - php版本 ; By Zxwy ; 网页模块所需变量
include('setting.php'); //引入自定义参数
$pheader = 'public/header.ht'; //header模板路径
$phead = 'public/head.ht'; //head模板路径
$pinclude = 'public/include.ht'; //include模板路径
$pfooter = 'public/footer.ht'; //footer模板路径
//$err = 0; //错误数量统计
if (file_exists($pheader)) {
    $header = file_get_contents($pheader);
} else {
    //$err == $err++;
    echo '缺少header模板';
}
if (file_exists($phead)) {
    $head = file_get_contents($phead);
    $head = str_replace('[$title]', $title, $head); //替换title参数
    $head = str_replace('[$keywords]', $keywords, $head); //替换keywords参数
    $head = str_replace('[$description]', $description, $head); //替换description参数
} else {
    //$err == $err++;
    echo '缺少head模板';
}
if (file_exists($pinclude)) {
    $include = file_get_contents($pinclude);
} else {
    //$err == $err++;
    echo '缺少include模板';
}
if (file_exists($pfooter)) {
    $footer = file_get_contents($pfooter);
    $footer = str_replace('[$copyright]', $copyright, $footer); //替换copyright参数
} else {
    //$err == $err++;
    echo '缺少footer模板';
}

?>