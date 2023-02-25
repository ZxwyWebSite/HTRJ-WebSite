<?php
//《胡桃日记官网》 - php版本 ; By Zxwy ; 主程序
$urlpath = $_SERVER['PHP_SELF']; //访问路径
$path = str_replace('/index.php', null, $urlpath); //去除urlpath中的php文件名
header('Content-type: text/html;charset=gbk'); //定义返回类型

//2023-02-24 重写模块，重构逻辑，优化执行效率
switch ($path) {
    case '': //主页模块
    case '/':
        include('setting.php'); //引入网页变量
        $pindex = 'public/newindex.ht'; //index模板路径
        if (file_exists($pindex)) {
            $index = file_get_contents($pindex); //载入
            $index = str_replace('[$head]', $head, $index); //替换head模板
            $index = str_replace('[$footer]', $footer, $index); //替换footer模板
            $index = str_replace('[$include]', $include, $index); //替换include模板
            echo $index;
        } else {
            echo '缺少index模板';
        }
        break;
    case '/news': //新闻模块
        include('setting.php'); //引入网页变量
        $pnews = 'public/news.ht'; //news模板路径
        if (file_exists($pnews)) {
            $news = file_get_contents($pnews); //载入
            $news = str_replace('[$head]', $head, $news); //替换head模板
            $news = str_replace('[$header]', $header, $news); //替换header模板
            $news = str_replace('[$footer]', $footer, $news); //替换footer模板
            $news = str_replace('[$include]', $include, $news); //替换include模板
            echo $news;
        } else {
            echo '缺少news模板';
        }
        break;
    case '/list': //列表模块
        include('setting.php'); //引入网页变量
        $plist = 'public/list.ht'; //list模板路径
        if (file_exists($plist)) {
            $list = file_get_contents($plist); //载入
            $list = str_replace('[$head]', $head, $list); //替换head模板
            $list = str_replace('[$header]', $header, $list); //替换header模板
            $list = str_replace('[$footer]', $footer, $list); //替换footer模板
            $list = str_replace('[$include]', $include, $list); //替换include模板
            echo $list;
        } else {
            echo '缺少list模板';
        }
        break;
    case '/videos': //视频模块
        include('setting.php'); //引入网页变量
        $pvideos = 'public/videos.ht'; //videos模板路径
        if (file_exists($pvideos)) {
            $videos = file_get_contents($pvideos); //载入
            $videos = str_replace('[$head]', $head, $videos); //替换head模板
            $videos = str_replace('[$header]', $header, $videos); //替换header模板
            $videos = str_replace('[$footer]', $footer, $videos); //替换footer模板
            $videos = str_replace('[$include]', $include, $videos); //替换include模板
            echo $videos;
        } else {
            echo '缺少videos模板';
        }
        break;
    case '/api': //Api模块
        //2023-02-25 重写Api模块，修改数据存储结构
        $p1 = $_GET['p1']; //检索类型
        header('Content-type: text/plain; charset=utf-8'); //返回类型
        $psetting = 'static/api/beta/' . $p1 . '/load.php'; //配置文件路径
        if (file_exists($psetting)) {
            include($psetting); //载入配置文件
            echo $jht;
        } else {
            http_response_code(404);
        }
        /*$papi = 'static/api/' . $p1 . '/' . $id . '.js'; //数据路径（一般为相对路径，兼容好）
        if (file_exists($papi)) {
            $api = file_get_contents($papi); //载入
            $api = str_replace('[$r1]', $r1, $api); //替换r1变量
            echo $api;
        } else {
            http_response_code(404);
        }*/
        break;
    case '/snapi': //文章Api模块（对应官方接口searchNews.php）
        $p0 = $_GET['p0']; //???
        $id = $_GET['id']; //ID
        header('Content-Type: text/plain; charset=utf-8'); //返回类型
        $psnapi = 'static/api/searchNews/' . $id . '.js'; //数据路径
        if (file_exists($psnapi)) {
            $snapi = file_get_contents($psnapi); //载入
            echo $snapi;
        } else {
            http_response_code(404);
        }
        break;
    case '/m': //手机访问
        $pm = 'public/m.ht'; //mobile模板路径
        if (file_exists($pm)) {
            $m = file_get_contents($pm); //载入
            echo $m;
        } else {
            echo '缺少m模板';
        }
        break;
    default: //其它路径
        http_response_code(404);
    //break;
}
?>