/*
    20201214.mct.play.v2.js 
    Author:dereksu
    kimi:20191204&20201019&20201211&20210406
    not included 2021-02-26 & 2021-03-01 & 2021-03-02
 */
    var _id = function (id) { //获取dom
        return document.getElementById(id);
    }

    //获取url参数
    function getUrlParam(param) {
        var m = new RegExp("(?:&|/?)" + param + "=([^&$]+)").exec(window.location.search);
        return m ? m[1] : "";
    }

    var loadScript = function (url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function () {
            typeof callback == 'function' && callback();
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    //校验back参数合法性
    function VaildURL(sUrl){
        return (/^(https?:\/\/)?[\w\-.]+\.(qq|taotao)\.com($|\/|\\)/i).test(sUrl)||(/^[\w][\w\/\.\-_%]+$/i).test(sUrl)||(/^[\/\\][^\/\\]/i).test(sUrl) ? true : false;
    }
    if (getUrlParam("turn_off_lowercase").toLowerCase() != "true") { 
        //不关闭小写
        var isBack = getUrlParam("back").toLowerCase(); //下载完成的返回地址,默认返回官网首页
    } else {
        var isBack = getUrlParam("back"); //下载完成的返回地址,默认返回官网首页
    }

    var TGMediaId = getUrlParam("media") ? getUrlParam("media") : 0; //url传过来的渠道id
    window.TGMediaList = typeof TGMediaList == 'undefined' ? {} : TGMediaList;
    window.TGMediaProjectName = (typeof TGMediaProjectName == 'undefined' ? 'proj0' : TGMediaProjectName).replace(/\_/g, '');

    //原有url参数
    var deviceType = getUrlParam("device").toLowerCase(); //指定系统，直接下载，不拉起，auto为自动识别当前手机系统下载。
    var homePageJump = getUrlParam("jump").toLowerCase(); //是否在拉起/下载后跳转到“跳转页”
    var iosSchemeParameter = getUrlParam('ios_scheme_parameter'); //iOS网页拉起，Scheme 参数
    var otherBrowser = getUrlParam("browser").toLowerCase(); //第三方浏览器是否启用拉起，auto启用
    var mqqParams = getUrlParam("mqq").toLowerCase(); //手Q参数， select代表出现两个选择按钮
    var androidSchemeParameter = getUrlParam('android_scheme_parameter'); //Android网页拉起， Scheme 参数
    var iosWechatAppIdParameter = getUrlParam('ios_wechat_appid_parameter'); //ios下微信通过appid拉起游戏时传递给第三方app的参数
    var androidWechatAppIdParameter = getUrlParam('android_wechat_appid_parameter'); //android下微信通过appid拉起游戏时传递给第三方app的参数
    var iosmqqp = getUrlParam("iosmqqp"); //iOS下手Q拉起传递给第三方app的参数
    var jumpToHome = getUrlParam("jumpToHome"); //跳转首页相关参数
    var noDownloadAlert = getUrlParam("noDownloadAlert"); //禁止弹出下载内容alert

    //模板参数自定义
    window.TGMediaProjectCfg = typeof TGMediaProjectCfg !== 'undefined' ? TGMediaProjectCfg : {};
    if(TGMediaProjectCfg.is_show_mqq_tpl_dialog === 1){
        mqqParams = 'select';
    }

    //配置
    var gameName = MCTCFG.gameName; //游戏名称
    var iosURL = MCTCFG.iosURL; //iOS下载地址
    var androidURL = MCTCFG.androidURL; //安卓下载地址
    var androidWechatURL = MCTCFG.androidWechatURL; //Android微信下载地址
    var androidMqqURL = MCTCFG.androidMqqURL; //Android手Q下载地址
    var wechatGameCenterURL = MCTCFG.wechatGameCenterURL; //微信游戏中心，填写后无论iOS还是Android，只要是微信，下载都进入这里
    var iosScheme = MCTCFG.iosScheme.replace(/\s/g, ''); //网页拉起游戏scheme（IOS）
    var androidScheme = MCTCFG.androidScheme; //网页拉起游戏scheme（安卓）
    var homePage = VaildURL(isBack) ? isBack : "/"; //跳转页，默认跳回官网
    var appID = MCTCFG.appID; //微信开放平台的appID
    var scheme = MCTCFG.scheme; //手Q拉起游戏scheme（iOS）
    var packageName = MCTCFG.packageName; //手Q拉起游戏scheme（安卓）

    //如果撞击到渠道表则替换下载地址
    if (TGMediaList.hasOwnProperty(TGMediaId)) {
        console.log("撞击到渠道表:" + TGMediaId);
        //跳转回原渠道落地页
        if(homePage == 'cururl'){
            homePage = MCTCFG.protocol + '://' + window.location.hostname + ((window.location.pathname).replace(/download\.shtml/g, 'index.shtml')) + '?media=' + TGMediaId;
        }
        if(TGMediaList[TGMediaId].ios){
            iosURL = TGMediaList[TGMediaId].ios;
        }
        if(TGMediaList[TGMediaId].android){
            androidURL = TGMediaList[TGMediaId].android;
        }
        if((typeof TGMediaList[TGMediaId].android_wx !== 'undefined') && TGMediaList[TGMediaId].android_wx){
            androidWechatURL = TGMediaList[TGMediaId].android_wx;
        }
        if((typeof TGMediaList[TGMediaId].android_qq !== 'undefined') && TGMediaList[TGMediaId].android_qq){
            androidMqqURL = TGMediaList[TGMediaId].android_qq;
        }
        var mediaType = ''+TGMediaId;
    } else {
        var mediaType = '';//无渠道号
    }

    //PTT初始化
    var setSite = {
        siteType: TGMediaProjectName,
        pageType: 'play' + (mediaType ? ('-' + mediaType) : ''),
        pageName: "渠道拉起下载页" + (mediaType ? ('-' + mediaType) : ''),
        project: 'mct'
    };
    if (typeof (pgvMain) == 'function') pgvMain();

    //统计渠道拉起下载页面pv
    //PTTSendClick("page", "pv", "渠道拉起下载页访问量");
    
    var platform;
    var platformChinese;

    function getPlatform(cb) {
      //获取平台
      var ua = window.navigator.userAgent.toLowerCase();
      platform = "other";
      platformChinese = "其他平台";
      if (ua.indexOf("micromessenger") != -1 && ua.indexOf("wxwork") == -1) {
        platform = "wechat";
        platformChinese = "微信";
      } else if (ua.indexOf("weibo") != -1) {
        platform = "weibo";
        platformChinese = "微博";
      } else if (ua.indexOf("qqmusic") != -1) {
        platform = "qqmusic";
        platformChinese = "QQ音乐";
      }
      mqq.device.isMobileQQ(function (result) {
        if (result == true) {
          platform = "mqq";
          platformChinese = "手Q";
        }
        typeof cb == 'function' && cb();
      });
    }    

    var jumpToHomePage = function () { // 跳转到HomePage
        if (jumpToHome == "back") {
            window.history.back();
            return;
        }
        if (homePageJump != "false") {
            PTTSendClick("jump", "jumpToHomePage", "跳转到首页");
            window.location.href = homePage || window.location.origin;
        }
    }

    var system = function () { //系统
        var re = 'pc';
        if (/iphone|ipod|ipad/i.test(navigator.userAgent)) {
            re = 'iOS';
        } else if (/android/i.test(navigator.userAgent)) {
            re = 'Android';
        }
        return re;
    }();

    var pageStatus = { //设置页面状态
        sto: false,
        other: function () { //其他平台
            _id("w_dialog").style.display = "block";
        },
        disableStart: function () {
            _id("start").className = "start disable";
            _id("w_dialog").style.display = "block";
            _id("downloadPrompt").style.display = "block";
        },
        dialogShow: function () { //选择提示框打开
            _id('w_dialog').style.display = 'block';
        },
        dialogHide: function () { //选择提示框关闭
            _id('w_dialog').style.display = 'none';
        },
        startUp: function () {
            _id("tips-ctx").innerHTML = "正在启动游戏……";
            this.sto = setTimeout(function () {
                jumpToHomePage();
            }, 2000);
        },
        download: function () { //已经开始下载
            clearTimeout(this.sto);
            if (system == 'iOS') {
                _id("tips-ctx").innerHTML = "正在跳转 App Store……";
            } else if (system == 'Android') {
                _id("tips-ctx").innerHTML = '已经开始下载啦，请稍候……<span class="tip">如没有发现下载进度，请注意查看顶部通知栏。或<a href="javascript:uniformDownload();">点此</a>再次尝试</span>';
            }
        },
        browserOpen: function () {
            _id("w_browserOpen").style.display = 'block';
        }
    };

    var getWechatVer = function () {
      //获取微信版本
      var re = false;
      if (platform == "wechat") {
        var MicroMessenger = navigator.userAgent.match(
          /MicroMessenger\/([\d\.]+)/i
        );
        if (MicroMessenger) {
          var verSsource = MicroMessenger[1].split(/\./);
          var num_place = ["", "0", "00", "000", "0000"];
          var r = num_place.reverse();
          for (var i = 0; i < verSsource.length; i++) {
            var len = verSsource[i].length;
            verSsource[i] = r[len] + verSsource[i];
          }
          var curVer = verSsource.join("");
          var ver = curVer > "000600050006";
          re = ver;
        }
      }
      return re;
    };

    var wechatReady = function (callback) {
      //微信接口准备完毕
      if (
        typeof WeixinJSBridge == "object" &&
        typeof WeixinJSBridge.invoke == "function"
      ) {
        callback();
      } else {
        if (document.addEventListener) {
          document.addEventListener("WeixinJSBridgeReady", callback, false);
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", callback);
          document.attachEvent("onWeixinJSBridgeReady", callback);
        }
      }
    };

    var patternStr = /^(https?:\/\/|\/\/)/;//合法url http https
    var patternStr2 = /^(itms-apps?:\/\/|\/\/)/;//合法url itms-apps
    var defaultTips = 'SYSTEM 版本暂未开放，敬请期待！';//默认提示文案

    var uniformDownload = function (options) { //统一下载
        options = options || {};
        var sys = options.system || system;
        if (!options.url) { //如果该函数没有传入下载地址
            if (sys == "iOS") { //ios下载地址
              options.url = iosURL;
            } else { //android下载地址
              if (platform == "wechat" && androidWechatURL) { //android微信下载地址
                options.url = androidWechatURL;
              } else if (platform == "mqq" && androidMqqURL) { //android手Q下载地址
                options.url = androidMqqURL;
              } else { //其他android下载地址，是android微信但是没填android微信专用地址也会在这
                options.url = androidURL;
              }
            }
            if (platform == "wechat" && wechatGameCenterURL) { //如果是微信平台且填写了微信游戏中心，则优先级更高，使用游戏中心地址
              options.url = wechatGameCenterURL;
            }
        }
        var pf = options.platform || platform;
        var pfc = options.platformChinese || platformChinese;
        //判断url是否有效，http:// 或 https:// 或 // 或 itms-apps 开头
        if(patternStr.test(options.url) || patternStr2.test(options.url)){
            //下载地址有效
            if(options.passive){//被动下载统计
                PTTSendClick("passive_download", sys + "_" + pf, "被动下载_" + sys + "_" + pfc);
            }else{//正常下载
                PTTSendClick("download", sys + "_" + pf, "下载_" + sys + "_" + pfc);
            }
            pageStatus.download(); //显示开始下载文案
            if (system == "pc" && patternStr2.test(options.url)) {
                options.url = options.url.replace("itms-apps", "https"); //在PC端下载ios，如果链接为itms-apps协议需替换为https协议
            }
            if (options.download) { //是否自定义了下载方式
                options.download(options);
            } else {
                if(pf == 'pc_browser'){
                    window.open(options.url); //打开新窗口
                }else{
                    window.location.href = options.url;
                }               
            }
            setTimeout(function () {
                if(pf != 'pc_browser'){
                    jumpToHomePage();
                }
            }, 3500);
        }else{
            if (options.url == '' || options.url == '#') {
                //未填URL
                PTTSendClick("download", sys + "_" + pf + "_nourl", "下载_" + sys + "_" + pfc + "_未填url");
                if (noDownloadAlert != "true") {
                    alert(defaultTips.replace(/SYSTEM/g, sys));
                }
                if(pf != 'pc_browser'){
                    jumpToHomePage();
                }
            }else{
                //URL写为提示语的
                PTTSendClick("download", sys + "_" + pf + "_chineseurl", "下载_" + sys + "_" + pfc + "_中文url");
                alert(options.url);
                if(pf != 'pc_browser'){
                    jumpToHomePage();
                }
            }
        }
    }


    var platform_wechat = function () { //微信平台
        var ver = getWechatVer();

        var launchApplication_ok = function () { //拉起成功
            PTTSendClick("play", system + "_wechat", "拉起_" + system + "_微信");
            pageStatus.startUp(); //显示拉起文案
        }

        var launchApplication_fail = function () {
            uniformDownload();
        }

        var callback = function () {
            if (ver) { //版本大于等于6.5.6
                WeixinJSBridge.invoke('launchApplication', { //新拉起接口
                    'appID': appID,
                    'parameter': iosWechatAppIdParameter,
                    'extInfo': androidWechatAppIdParameter
                }, function (res) {
                    if (res.err_msg.indexOf("launchApplication:fail") != -1) {
                        //拉起失败
                        launchApplication_fail();
                    } else if (res.err_msg.indexOf("launchApplication:ok") != -1) {
                        //拉起成功
                        launchApplication_ok();
                    }
                });
            } else { //版本小于等于6.5.6
                PTTSendClick('ver', 'min_6_5_6', '微信版本低于6_5_6'); //上报低版本微信
                WeixinJSBridge.invoke("launch3rdApp", { //尝试拉起游戏
                    "appID": appID
                }, function (res) {
                    if (res.err_msg.indexOf("launch_3rdApp:fail") != -1) {
                        //拉起失败
                        launchApplication_fail();
                    } else {
                        //拉起成功
                        launchApplication_ok();
                    }
                });
            }
        }

        wechatReady(callback);
    }


    var platform_mqq = function () { //手Q平台
        var identifier = system == 'iOS' ? scheme : packageName;

        var launchApplication_ok = function (cb) {
            PTTSendClick("play", system + "_mqq", "拉起_" + system + "_手Q");
            // mqq.app.launchApp({
            //     name: identifier
            // });
            var iosMqqParams = {};
            if (iosmqqp) {
              var arr = iosmqqp.split("|");
              for (var i = 0; i < arr.length; i++) {
                var t = arr[i].split(":");
                iosMqqParams[t[0]] = t[1];
              }
            }
            mqq.app.launchApp(identifier, iosMqqParams);
            if (cb) {//如果ios默认下载存在
                cb();
            } else {
                pageStatus.dialogHide(); //隐藏对话框
                pageStatus.startUp(); //显示拉起文案
            }
        }

        var launchApplication_fail = function (passiveDownload) {
            uniformDownload({ //下载
                passive:passiveDownload,//是否是被动下载
                download: function (p) {
                    pageStatus.dialogHide();//隐藏对话框
                    window.location.href = p.url;
                }
            });
        }

        var isAppInstalled = function () {
            if (system == 'iOS') { //iOS直接拉起不判断是否安装
                launchApplication_ok(function () {
                    setTimeout(function () {
                        launchApplication_fail(true);
                    }, 2000);
                });
            } else {
                mqq.app.isAppInstalled(identifier, function (result) { //判断是否安装
                    if (result) { //已安装
                        launchApplication_ok();
                    } else { //未安装
                        launchApplication_fail();
                    }
                });
            }
        }

        //是否弹层选择
        if (mqqParams == "select") {
            if (identifier) {
                pageStatus.dialogShow(); //显示对话框
                _id('start').addEventListener('touchend', function (e) { //点击拉起游戏
                    isAppInstalled();
                    e.preventDefault();
                });
                _id('download').addEventListener('touchend', function (e) { //点击下载游戏
                    launchApplication_fail();
                    e.preventDefault();
                });
            } else {
                launchApplication_fail();
            }
        } else {
            if (identifier) {
                isAppInstalled();
            } else {
                launchApplication_fail();
            }
        }        
    }


    var platform_weibo = function () { //微博平台
        var startScheme = system == 'iOS' ? iosScheme : androidScheme;
        var downloadUrl = system == 'iOS' ? iosURL : androidURL;
        var iosDownloadTime = 10;
        if (system == 'iOS' && downloadUrl) { //如果是ios并且有下载地址
            iosDownloadTime = 1500;
        }
        if (startScheme) {
            PTTSendClick("play", system + "_weibo", "拉起_" + system + "_微博");
            window.location.href = startScheme;
        }
        setTimeout(function () {
            if (iosDownloadTime != 10) { //如果是ios并且有下载地址
                PTTSendClick("download", system + "_weibo", "下载_" + system + "_微博");
                window.location.href = downloadUrl;
            }
            setTimeout(function () {
                PTTSendClick("browserOpen", system + "_weibo", "显示浏览器打开遮罩_" + system + "_微博");
                pageStatus.browserOpen();
            }, 1500);
        }, iosDownloadTime);
    }


    var platform_qqmusic = function () { //QQ音乐平台
        var launchApplication_ok = function () {
            PTTSendClick("play", system + "_qqmusic", "拉起_" + system + "_QQ音乐");
            pageStatus.startUp();
        }

        var launchApplication_fail = function () {
            uniformDownload({ //下载
                download: function (p) {
                    if (system == 'iOS') {
                        M.client.open('ui', 'openUrl', {
                            url: p.url.replace(/^https?:/i, 'itms-apps:'),
                            target: 'app'
                        });
                    } else if (system == 'Android') {
                        window.location.href = p.url;
                    }
                }
            });
        }

        var startScheme, pn;
        if (system == 'iOS') {
            startScheme = iosScheme;
            pn = true;
        } else if (system == 'Android') {
            startScheme = androidScheme;
            pn = packageName;
        }
        if (startScheme && pn) {
            loadScript('//y.gtimg.cn/music/h5/lib/js/zepto-1.0.min.js?max_age=604800', function () {
                loadScript('//y.gtimg.cn/music/h5/lib/js/music-1.0.min.js?max_age=604800', function () {
                    switch (system) {
                        case 'iOS':
                            M.client.open('ui', 'openUrl', {
                                url: startScheme,
                                target: 'app'
                            }, function (e) {
                                if (e.code == 0) { //拉起成功
                                    launchApplication_ok();
                                } else { //拉起失败或其他错误
                                    launchApplication_fail();
                                }
                            });
                            break;
                        case 'Android':
                            M.client.open("app", "isInstalled", {
                                'android': [packageName]
                            }, function (e) {
                                if (e.data.installed[0] == 1) { //已安装
                                    launchApplication_ok();
                                    window.location.href = startScheme;
                                } else { //未安装
                                    launchApplication_fail();
                                }
                            });
                            break;
                    }
                });
            });
        } else { //未填写拉起相关参数
            if (system == 'iOS') {
                loadScript('//y.gtimg.cn/music/h5/lib/js/zepto-1.0.min.js?max_age=604800', function () {
                    loadScript('//y.gtimg.cn/music/h5/lib/js/music-1.0.min.js?max_age=604800', function () {
                        launchApplication_fail();
                    });
                });
            } else {
                launchApplication_fail();
            }
        }
    }


    var platform_other = function () { //其他平台
        // var startScheme = system == 'iOS' ? iosScheme : androidScheme;

        var startEv = function () { //点击启动
            // if (system == 'iOS' && iosSchemeParameter.length > 0) { //如果存在自定义参数
            //     startScheme += ('?' + iosSchemeParameter.replace(/\|/g, '&'));
            // }
            // if (system == 'Android' && androidSchemeParameter.length > 0) {
            //     startScheme += ('?' + androidSchemeParameter.replace(/\|/g, '&'));
            // }
            pageStatus.dialogHide(); //隐藏对话框
            pageStatus.startUp(); //显示拉起文案
            PTTSendClick("play", system + "_other", "拉起_" + system + "_其他平台");
            window.location.href = startScheme;
        }

        var downloadEv = function () { //点击下载
            uniformDownload({ //下载
                download: function (p) {
                    pageStatus.dialogHide(); //隐藏对话框
                    window.location.href = p.url;
                }
            });
        }

        var getStartScheme = function () { //拼接启动地址
            var scheme = false;
            system == "iOS" ? (scheme = iosScheme) : (scheme = androidScheme);
            if (scheme) {
              if (iosSchemeParameter.length > 0) { //如果存在自定义参数
                scheme = scheme + "?" + iosSchemeParameter.replace(/\|/g, "&");
              }
              if (androidSchemeParameter.length > 0) {
                scheme = scheme + "?" + androidSchemeParameter.replace(/\|/g, "&");
              }
            }
            return scheme;
        }

        var startScheme = getStartScheme();

        if (otherBrowser == "auto") {
            if (startScheme) { //如果当前用户系统填了网页拉起参数
                pageStatus.dialogShow(); //显示对话框
                _id('start').addEventListener('touchend', function (e) { //点击拉起游戏
                    startEv();
                    e.preventDefault();
                });
                _id('download').addEventListener('touchend', function (e) { //点击下载游戏
                    downloadEv();
                    e.preventDefault();
                });
            } else {
                downloadEv();
            }
        } else if (otherBrowser == "start") { //优先拉起
            if (startScheme) {
              startEv();
              setTimeout(function () {
                downloadEv();
              }, 2000)
            } else {
              downloadEv();
            }
        } else {
            downloadEv();
        }        
    }

    var source = function () { //统计来源
        var from = getUrlParam('from');
        if (from) {
            PTTSendClick("from", from, "来源" + from);
        }
    }


    var setPageCode = function () { //往页面里写入一些代码
        if (gameName) { //写入游戏名称
            _id('gameName').innerHTML = '《' + gameName + '》';
            _id('title').innerHTML = gameName + ' ' + _id('title').innerHTML;
        }
    }


    var deviceJudgment = function (cb) { //判断用户指定的设备信息
        var downloadUrl;
        switch (deviceType) {
            case 'ios':
            case 'iphone':
            case 'ipod':
            case 'ipad':
                downloadUrl = iosURL;
                break;
            case 'android':
                downloadUrl = androidURL;
                break;
            case "androidWechat":
                downloadUrl = androidWechatURL;
                break;
            case "wechatGameCenter":
                downloadUrl = wechatGameCenterURL;
                break;
            case 'auto':
                downloadUrl = null; //auto时为null，会自动根据系统获取对应下载地址
                break;
            default: //用户指定了错误的设备
                cb ? cb() : null;
                return false;
        }
        uniformDownload({ //下载
            platform: platform + '_device_' + deviceType, //有可能在ios微信里面下载安卓包，所以需标记deviceType
            platformChinese: platformChinese + '_设备参数_' + deviceType,
            url: downloadUrl
        });
    }


    var platformJudgment = function () {
      //判断平台
      switch (platform) {
        case "wechat":
          platform_wechat();
          break;
        case "mqq":
          platform_mqq();
          break;
        case "weibo":
          platform_weibo();
          break;
        case "qqmusic":
          platform_qqmusic();
          break;
        case "other":
          platform_other();
          break;
      }
    };

    
    var init = function () {
        getPlatform(function () {
            source(); //统计来源from
            setPageCode(); //写入meta
            if (deviceType.length > 0) { //用户指定强制下载不拉起
                deviceJudgment(platformJudgment);
            } else if (system == 'pc') {
                loadScript('//ossweb-img.qq.com/images/js/qrcode/qrcode.min.js', function () {
                    var qrcode = new QRCode(_id("pcQrcode"), {
                        text: window.location.href,//扫码拉起、下载
                        width: 250,
                        height: 250,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                    //PC端二维码生成完毕
                    PTTSendClick("qrcodeShow", 'pc_browser', "显示二维码_PC端浏览器");
                    _id("w_pc").style.display = "block";
                });
            } else {
                platformJudgment();
            }
        });
    }

    window.onload = function () {
        setTimeout(function () {
            init();
        }, 100);
    };