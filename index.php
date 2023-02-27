<?php
//《胡桃日记官网》 - php版本 ; By Zxwy ; 主程序
$urlpath = $_SERVER['PHP_SELF']; //访问路径
$path = str_replace($_SERVER['SCRIPT_NAME'], null, $urlpath); //去除urlpath中的php文件名
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
        $page = $_GET['page']; //页码
        $pagesize = $_GET['pagesize']; //返回数量
        $r1 = $_GET['r1']; //Status
        $id = $_GET['id']; //唯一识别码
        header('Content-type: text/plain; charset=utf-8'); //返回类型
        $papi = 'static/api/beta/' . $p1 . '/'; //Api主目录
        if (file_exists($papi . 'testindex.jht') && $p1) {
            $jht = file_get_contents($papi . 'testindex.jht'); //载入主模板
            if (file_exists($papi . $id . '/setting.php')) {
                include($papi . $id . '/setting.php');
                $jht = str_replace('[$r1]', $r1, $jht); //替换r1参数
                $jht = str_replace('[$page]', $page, $jht); //替换page参数
                $jht = str_replace('[$pagesize]', $pagesize, $jht); //替换pagesize参数
                $jht = str_replace('[$total]', $total, $jht); //替换total参数
                $totalpage = ceil($total / $pagesize); //计算totalpage
                $jht = str_replace('[$totalpage]', $totalpage, $jht); //替换totalpage参数
                $p = $page * $pagesize - $pagesize; //计算翻页相关参数
                for ($i = 0; $i < $pagesize; $i++) {
                    $file = $papi . $id . '/' . ($i + $p) . '.js'; //文件路径
                    if (file_exists($file)) {
                        $result .= file_get_contents($file);
                    }
                }
                $jht = str_replace('[$result]', $result, $jht); //替换result参数
                echo $jht;
            } else {
                if (!$id) {
                    echo $jht; //兼容上报接口
                    //http_response_code(200);
                } else {
                    http_response_code(404);
                }
            }
        } else {
            http_response_code(404);
        }
        break;
    case '/snapi': //文章Api模块（对应官方接口searchNews.php）
        //2023-02-26 重写文章Api，支持拼接数据
        $id = $_GET['id']; //唯一识别码
        header('Content-Type: text/plain; charset=utf-8'); //返回类型
        $psnapi = 'static/api/beta/searchNews/'; //数据主目录
        if (file_exists($psnapi . 'testsnapi.jht') && file_exists($psnapi . 'linklist.jht')) {
            $snapi = file_get_contents($psnapi . 'testsnapi.jht'); //载入模板
            $linklist = file_get_contents($psnapi . 'linklist.jht'); //载入重复列表
            if (file_exists($psnapi . 'data/' . $id . '.js')) {
                $data = file_get_contents($psnapi . 'data/' . $id . '.js'); //载入数据
                $snapi = str_replace('[$data]', $data, $snapi); //替换data参数
                $snapi = str_replace('[$linklist]', $linklist, $snapi); //替换linklist参数
                echo $snapi;
            } else {
                if (file_exists($psnapi . 'nonews.jht') && $id) {
                    $nonews = file_get_contents($psnapi . 'nonews.jht'); //未找到数据模板
                    $snapi = str_replace('[$data]', $nonews, $snapi); //替换data参数
                    $snapi = str_replace('[$linklist]', $linklist, $snapi); //替换linklist参数
                    echo $snapi;
                } else {
                    http_response_code(404);
                }
            }
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
    case '/favicon.ico': //图标重定向
        $picon = 'static/favicon.ico';
        if (file_exists($picon)) {
            header('Content-Type: image/x-icon');
            echo file_get_contents($picon);
        } else {
            http_response_code(404);
        }
        break;
    default: //其它路径
        /*$isimg = strstr($path,'/static/api/img/'); //图片CDN
        if ($isimg) {
            $img = str_replace('/static/api/img/', null, $path);
            header("Location: https://b2eu.zw-cdn.tk/gh/htrj-website/img/$img");
            break;
        }
        $isvod = strstr($path,'/static/api/vod/'); //视频CDN
        if ($isvod) {
            $vod = str_replace('/static/api/vod/', null, $path);
            header("Location: https://b2eu.zw-cdn.tk/gh/htrj-website/vod/$vod");
            break;
        }*/
        http_response_code(404);
        //echo $path;
    //break;
}
?>