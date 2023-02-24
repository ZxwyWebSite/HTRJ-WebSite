var amsCommon={
	qqConfig: {
		appid: "1107876280" //手QAPPID
	},
	wxConfig:{
		appid: "wx8b048cb88ea98f1d", //挂靠并使用了公众号wx_txyxzs的微信登录，该公众号的微信APPID
		ams_targetappid: "wxb99e30505fc0eda8", //业务的微信APPID
		sServiceType: "htrj", //业务简写
		sAMSTrusteeship: 1 //如果为1则走微信/QQ托管，为0则不走微信/QQ托管。默认为0(不走托管)
	},
	sDataConfig: {},
	isLogin:false,
	isBind:false,
	loginType:'',
	iPlatId:'',
	isReceive:0,//奖励是否领取
	loginByQQ:function(){
		need('biz.login', function (LoginManager) {
			LoginManager.login();
		})
	},
	//注销登录
	loginOut:function(){
		LoginManager.logout(function () {
			window.location.reload();
		});
		return false;
	},
	loginByWX:function(){
		need('biz.login', function (LoginManager) {
			LoginManager.init({
				needReloadPage: true
			});
			LoginManager.loginByWx({
				gameDomain: 'awp.qq.com',
				appId: amsCommon.wxConfig.appid,
				serviceType: 'wx_txyxzs'
			});
		});
	},
	//领取奖励
	getReward:function(){
		if (!amsCommon.isLogin) {
			openDialog('pop1');
			return false;
		}
		if(!amsCommon.isBind){
			openDialog('pop4')
			return false;
		}
		amsCfg_753786.sData=amsCommon.sDataConfig;
		amsCfg_753786.sData['sArea'] = amsCommon.loginType;
		amsCfg_753786.sData['sPlatId'] =  amsCommon.iPlatId;
		amsSubmit(371890,753786);
	},
	//查询奖励是否领取
	queryReward:function(){
		if (!amsCommon.isLogin) {
			openDialog('pop1');
			return false;
		}
		if(!amsCommon.isBind){
			openDialog('pop4')
			return false;
		}
		amsCfg_753787.sData=amsCommon.sDataConfig;
		amsCfg_753787.sData['sArea'] = amsCommon.loginType;
		amsCfg_753787.sData['sPlatId'] =amsCommon.iPlatId;
		amsSubmit(371890,753787);
	},
	//查询是否绑定
	selectBind:function(){
		amsCfg_753895.sData = amsCommon.sDataConfig;
		amsInit(371890, 753895);
	},
	//初始化绑定大区
	initPage: function () {
        need(["biz.roleselector"],function(Roleselector){
            var roleobj = cloneClass(Roleselector);
			var openToOpen = {
				"ams_targetappid": amsCommon.wxConfig.ams_targetappid,   //要转的游戏业务appid
				"ams_appname": "wx_txyxzs",
				"sAMSTrusteeship": 1 ,// 如果为1则走微信/QQ托管，为0则不走微信/QQ托管。默认为0(不走托管)
				"oGopenidParams":{
					needGopenid:1
				}
			};
			roleobj.init({
				'type': 'html', //可选值:float?? html
				'gameId': 'htrj',
				'isQueryRole': true,
				'systemContentId': 'ulinkSystemSelect', // 系统android，ios
				'channelContentId': 'ulinkChannelSelect', // 渠道 手Q，微信
				'areaContentId': 'ulinkAreaSelect', // 服务器
				'area1ContentId': 'sel_area1', //端游用到的二级大区
				'roleContentId': 'ulinkRoleSelect', // 角色
				'confirmButtonId': 'ulinkConfirmBtn', //确认按钮，会触发submitEvent
				// 'openToOpen': amsCommon.loginType==1?openToOpen:null,
				'openToOpen': openToOpen,
				'submitEvent': function (roleObj) {
					closeDialog();
					amsCommon.iPlatId=roleObj.submitData.sPlatId;
					// 绑定角色
					amsCfg_753894.roleInfo = roleObj.submitData;
					amsCfg_753894.sData = amsCommon.sDataConfig;
					amsInit(371890, 753894);
				}
			})
			roleobj.show();
		})
	},
	//绑定大区
	bindArea:function(){
		if (!amsCommon.isLogin) {
			openDialog('pop1')
			return false;
		}
		openDialog('pop2');
		return
	},
	checkLogin:function(){
		need("biz.login", function (LoginManager) {
			LoginManager.checkLogin(function (userinfo) {
					if (userinfo.logtype == 'wx') {
						milo.cookie.clear('p_skey', 'qq.com', '/');
						milo.cookie.clear('p_uin', 'qq.com', '/');
						milo.cookie.clear('uin', 'qq.com', '/');
						milo.cookie.clear('skey', 'qq.com', '/');
						milo.cookie.clear("IED_LOG_INFO2");
						milo.cookie.clear('IED_LOG_INFO2', 'qq.com', '/');
						milo.cookie.clear('lg_source', 'qq.com', '/');
						milo.cookie.clear('ams_game_appid', 'qq.com', '/');
						// wx
						openid = milo.cookie.get('openid');
						LoginManager.getUserInfoByWxOpenId({
							"openid": openid,
							'access_token': milo.cookie.get('access_token')
						}, function (data) {
							amsCommon.sDataConfig = amsCommon.wxConfig;
							amsCommon.loginType = 1;
							var nickName = data.nickname;
							$('#login_qq_span').html(decodeURIComponent(nickName));

						});
					} else {
						milo.cookie.clear("openid");
						milo.cookie.clear("access_token");
						milo.cookie.clear("acctype");
						milo.cookie.clear("appid");
						milo.cookie.clear("openid", 'qq.com', '/');
						milo.cookie.clear("access_token", 'qq.com', '/');
						milo.cookie.clear("acctype", 'qq.com', '/');
						milo.cookie.clear("appid", 'qq.com', '/');
						var nickName = userinfo.nickname == '' ? LoginManager.getUserUin() : userinfo.nickname;
						amsCommon.sDataConfig = amsCommon.qqConfig;
						amsCommon.loginType = 2;
						$('#login_qq_span').html(decodeURIComponent(nickName));
					}
					amsCommon.selectBind();
					amsCommon.isLogin = true;
					$('#unlogin').hide();
					$('#logined').show();
				},
				function () {
					amsCommon.isLogin = false;
					// openDialog('pop1');
				}
			);
		})

	},
}
//查询是否绑定的配置
amsCfg_753895={
	type : "query",
	iQueryFlowID:753894,
	'_everyRead':true,
	'sData': {},
	success : function(bindedInfo){
		//已绑定时的扩展处理
		amsCommon.iPlatId=bindedInfo.jData.data.FplatId;
		amsCommon.isBind = true;
	},
	failure : function(){
		//未绑定时的扩展处理
		// amsCommon.bindArea();
		amsCommon.isBind=false;
	}
};
//提交绑定的配置
amsCfg_753894={
	type : "comit",
	needPopupRole:false,//是否弹默认角色框选角色
	roleInfo:null,//如果needPopupRole为false，需要自定义传入角色信息，roleInfo需要传角色信息对象
	iQueryFlowID:753895,
	service:"htrj",
	'_everyRead':true,
	'sData': {},
	success : function(bindedInfo){
		//已绑定时的扩展处理
		amsCommon.isBind = true;
	},
	failure : function(){
		//未绑定时的扩展处理
		amsCommon.bindArea();
	}
};
/**
 * 查询奖励是否领取
 * @type {{fFlowSubmitFailed: amsCfg_753787.fFlowSubmitFailed, iFlowId: number, fFlowSubmitEnd: amsCfg_753787.fFlowSubmitEnd, iActivityId: number, _everyRead: boolean}}
 */
amsCfg_753787 = {
	"_everyRead":true,//_everyRead参数用于控制缓存，设为true表示每次发请求都会读取amsCfg参数的值，建议加上
	"iActivityId": 371890, //活动id
	"iFlowId":    753787, //流程id
	"fFlowSubmitEnd": function(res){
		if(+res.sOutValue1===1){
			alert("你已经领取过该奖励了哦，请不要重复领取")
		}else{
			amsCommon.getReward();
		}
	},
	"fFlowSubmitFailed":function(res){
		//失败会走到这个函数
		//条件不满足，ame返回大于0是后走到这里
		alert(res.sMsg);
	}
};
/**
 * 领取奖励
 * @type {{activityId: string, iAMSActivityId: string, onGetGiftSuccessEvent: amsCfg_753786.onGetGiftSuccessEvent, onGetGiftFailureEvent: amsCfg_753786.onGetGiftFailureEvent, onBeginGetGiftEvent: (function(): number)}}
 */
amsCfg_753786 = {
	"_everyRead":true,//_everyRead参数用于控制缓存，设为true表示每次发请求都会读取amsCfg参数的值，建议加上
	'iAMSActivityId' : '371890', // AMS活动号
	'activityId' : '400777', // 模块实例号
	"sData":{},
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		if(callbackObj.sMsg=='已领取'){
			alert("你已经领取过该奖励了哦，请不要重复领取")
			return;
		}else{
			alert(callbackObj.sMsg);
			return
		}
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		openDialog('pop3')
		return;
	}
};

milo.ready(function () {
	amsCommon.checkLogin();
	amsCommon.initPage();
});