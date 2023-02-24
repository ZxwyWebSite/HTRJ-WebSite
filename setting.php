<?php
//《胡桃日记官网》 - php版本 ; By Zxwy ; 自定义模块所需变量
//模板自定义元素（没错，就是CMS的基础功能）（请使用支持GBK编码的字符）
$title = '《胡桃日记》官方网站 -元气少女治愈陪伴手游'; //网站标题
$keywords = '胡桃日记,七濑胡桃,menhera,表情包,胡桃日记预约,胡桃日记,表情包少女,胡桃,七濑胡桃,menhera,有病酱,人来疯酱,七濑木实,七濑太一,line,治愈,养成,陪伴,收集,放置,换装,经营,装扮,二次元,美少女,表情包,桃,女儿,养娃,日系,日本,吃货,旅行,旅行青蛙,剑与远征,小森生活，胡桃日记测试，胡桃日记下载'; //网站关键词
$description = '《胡桃日记》风靡全网的表情包少女七濑胡桃（menhera酱）来啦～从现在起，你们将在《胡桃日记》中开启一段奇妙旅程，每天十分钟，快乐又轻松！'; //网站描述
$copyright = 'Copyright &copy;2021-2023 ZxwyWebSite All rights reserved.'; //底部版权信息，支持html语法

//待定义...

//注：如需使用HTML语法，可通过下方模板添加变量
/*
$copyright = <<<EOF
    <a href="https://www.zxwy.tk/" target="_blank">Copyright &copy;2021-2023 ZxwyWebSite All rights reserved.</a>
EOF;
*/

//以下变量不懂不要动...

//《胡桃日记官网》 - php版本 ; By Zxwy ; 网页模块所需变量
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