<?php
//《胡桃日记官网》数据Api - PHP版 v1.0 ; By Zxwy ; Build 20230223 ; MIT License
//第一次写php，能用就行，先不考虑其它问题
//执行流程：获取查询字符串中的"id"值→返回对应的JS数据
//由于要验证"r1"中的Status，所以替换本地文件中的变量
//获取传入值
$id = $_GET['id'];
$r1 = $_GET['r1']; //Status
//定义返回类型
//header('Content-type: application/javascript');
header('Content-type: text/plain; charset=utf-8');
//数据拼接(本地文件)
$file = $id . '.js';
//运行
if (file_exists($file)) {
    $str = file_get_contents($file); //将整个文件内容读入到一个字符串中
    //$str = str_replace("\r\n", null, $str); //去除换行符
    $str = str_replace('[$r1]',$r1,$str); //替换Status
    echo $str;
} else {
    echo '此页面暂未收录';
}
//新闻资讯
//胡桃影集
?>