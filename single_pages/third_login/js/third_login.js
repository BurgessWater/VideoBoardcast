/*
 * @Author: fighter
 * @Date:   2016-09-29 13:31:53
 * @Last Modified by:   fighter
 * @Last Modified time: 2016-10-19 15:22:15
 */

;(function(){
  'use strict';

// qq: 121.199.18.234/BIService/QQlogin
// wx: 121.199.18.234/BIService/WXlogin
// 短信地址  http://192.168.0.10:880/home/recordlist

  var Variable = {
    time:60,                                                //短信验证码倒计时时间60s
    mobileInput : document.querySelector('#mobile'),        //手机号码输入框
    verifyInput : document.querySelector('#verify'),        //验证码输入框
    pwdInput : document.querySelector('#pwd'),              //密码输入框
    smsBtn : document.querySelector('#getVerify'),          //获取验证码按钮
    subBtn : document.querySelector('#subBtn'),             //提交按钮
    nextBtn : document.querySelector('#nextBtn'),           //下次再说按钮
    canGetVerify: false,                                    // 是否可以点击获取验证码
    canSubmit: false,                                       // 是否可以点击提交
    isGetVerify: false,                                     // 是否已经获取验证码
    addCode : (ParamData.add || '').toLowerCase(),          // 获取传参add
    regFrom: (ParamData.regFrom || 'PC').toLowerCase(),     // 来源 pc web ios android app 等
    sucFunc: ParamData.sucFunc || 'ThirdLoginRsp',          // 来源 pc web ios android app 等
    typeChannel : (ParamData.type || '').toLowerCase(),     // 获取传参type表示1 微信/2 qq/3 微博
    nickName : ParamData.nickname || '',                    // 获取传参nickname表示昵称
    openID : ParamData.openid || '',                        // 获取传参openid
  };
  var ThirdLogin = {
    init: function () {
      // JPlaceHolder(); // 兼容ie9 PlaceHolder

      // 获取广告信息
      this.getAD();
      // 如果是在客户端里面调用的页面，则传参数add=add
      if (Variable.addCode !== 'add') {
        this.addInfo(); // 首次加载时存储第三方用户信息
        this.hasBind(); // 首次加载页面判断openid对应客户是否已经完成绑定
      }
      // 绑定事件
      this.events();



    },
    // 绑定事件
    events: function() {
      // 禁止粘贴
      Variable.pwdInput.paste = function(){return false;};
      // 输入框非空验证
      Variable.mobileInput.onkeydown = this.handleChangeMobile.bind(this);
      Variable.verifyInput.onkeydown = this.handleChange.bind(this);
      Variable.pwdInput.onkeydown = this.handleChange.bind(this);
      //点击获取验证码
      Variable.smsBtn.onclick = this.getSms.bind(this);
      //点击提交绑定
      Variable.subBtn.onclick = this.bindTel.bind(this);
      //点击下次再说
      Variable.nextBtn.onclick = this.nextTime.bind(this);
    },



    // 获取广告信息
    getAD: function () {
      var data = {
        "en": 0,
        "cmd": {
          "md": "01",
          "fc": "015",
          "mdl": 1
        }
      };
      var success = function (jsonData) {
        if (jsonData.status === 0) {
          var adInfo = jsonData.data;
          document.querySelector('.box').setAttribute('style', 'background-image: url(' + adInfo[2].adpic +')');
          document.querySelector('#adLink').setAttribute('href', '' + adInfo[2].adlink + '');
        }
      };
      Post(data, success)
    },


    //存储第三方信息
    addInfo: function () {
      var data = {
        "en": 0,
        "cmd": {
          "md": "01",
          "fc": "016",
          "nickname": Variable.nickName,
          "uimg": "",
          "loginkey": Variable.openID,
          "channel": Variable.typeChannel,
          "regfrom": Variable.regFrom,
        }
      };

      var success = function (jsonData) {
        if (jsonData.status === 0) {
          //完成信息添加
          console.log("添加信息成功！");
        }
        else {
          layer.tips({ "cont": jsonData.msg ,"pid":"userForm"});
        }
      };

      Post(data, success);
    },

    //首次加载页面的时候判断是否已经完成绑定
    hasBind: function () {
      var data = {
        "en": 0,
        "cmd": {
          "md": "01",
          "fc": "021",
          "loginkey": Variable.openID,
          "channel": Variable.typeChannel,
        }
      };
      var success = function (backData) {
        if (backData.status === 0) {
          if (backData.data.isBind === true) {
            window.ThirdLoginRsp(Variable.typeChannel, Variable.openID);
          }
        }
        else {
          layer.tips({ "content": backData.msg ,"pid":"userForm"});
        }
      };
      Post(data, success);
    },

    // 手机框输入框输入
    handleChangeMobile: function() {
      var $this = this;
      setTimeout(function() {
        Variable.canGetVerify = CheckForm.notEmpty(Variable.mobileInput.value);
        $this.changeBtn("getVerify", Variable.canGetVerify);
      }, 250);
      $this.handleChange();
    },

    // 其他框输入框输入
    handleChange: function() {
      var $this = this;
      setTimeout(function() {
        var cMobileVal = CheckForm.notEmpty(Variable.mobileInput.value);
        var cVerifyVal = CheckForm.notEmpty(Variable.verifyInput.value);
        var cPwdVal = CheckForm.notEmpty(Variable.pwdInput.value);
        Variable.canSubmit = cMobileVal && cVerifyVal && cPwdVal;
        $this.changeBtn("subBtn", Variable.canSubmit);
      }, 250);
      $this.enterKey();
    },

    //点击获取验证码验证 发出请求，后台判断该手机号注册、绑定情况
    getSms: function () {
      if(!Variable.canGetVerify) {
        return;
      }

      var $this = this;
      var mobileVal = Variable.mobileInput.value;
      if (!CheckForm.isMobile(mobileVal)) {
        layer.tips({ "content": "请输入正确的手机号码" ,"pid":"userForm"});
        return;
      }

      Variable.canGetVerify = false;
      $this.changeBtn("getVerify", Variable.canGetVerify);

      var telData = {
        "en": 0,
        "cmd": {
          "md": "01",
          "fc": "017",
          "mobile": mobileVal,
          "channel": Variable.typeChannel,  //1.微信 2.QQ 此处怎么增加判断？
        }
      };
      var success = function (jsonData) {
        if (jsonData.status === 0) {
          var pwdVal = Variable.pwdInput;
          switch (jsonData.data.status) {
            case 1 : //手机号已注册，提示输入密码
              pwdVal.setAttribute("placeholder", "号码已注册，请输原密码");
              $this.hasGetSms();
              break;
            case 2 : //提示手机号已经被绑定过
              pwdVal.setAttribute("placeholder", "号码已绑定，请更换号码");
              layer.tips({ "content": "号码已绑定，请更换号码！","pid":"userForm"});
              break;
            case 3 : //手机号未注册过，提示设置密码
              pwdVal.setAttribute("placeholder", "请设置手机登录密码");
              $this.hasGetSms();
              break;
          }

        } else {
          Variable.canGetVerify = true;
          $this.changeBtn("getVerify", Variable.canGetVerify);
          layer.tips({ "content": jsonData.msg ,"pid":"userForm"});
        }

      };
      Post(telData, success);
    },

    //更改按钮状态、样式  传入按钮、状态信息
    changeBtn: function(id, status){
      if(status){
        CSSClass.removeClass(id, "off");
        CSSClass.addClass(id, "on");
      }
      if(!status){
        CSSClass.removeClass(id, "on");
        CSSClass.addClass(id, "off");
      }
    },

    //获取验证码成功后的处理函数
    hasGetSms: function() {
      var $this = this;
      $this.timer();
      Variable.isGetVerify = true;
      layer.tips({ "content": "短信验证码已发送，请注意查收！" ,"pid":"userForm"});
    },

    //短信验证码倒计时
    timer: function() {
      var $this = this;
      var t = Variable.time;
      var btn = Variable.smsBtn;
      var timeCount = function() {
        if (t === 0) {
          clearTimeout(timeCount);
          t = 60;
          Variable.canGetVerify = true;
          btn.innerHTML = '获取验证码';
          $this.changeBtn("getVerify", Variable.canGetVerify);
        } else {
          t -= 1;
          Variable.canGetVerify = false;
          btn.innerHTML = `${t}s后重新获取`;
          setTimeout(() => {
            timeCount();
          }, 1000);
        }
      };
      return timeCount();
    },

    //注册或者绑定请求
    bindTel: function() {

      if(!Variable.canSubmit){
        return;
      }

      var $this = this;
      if(!Variable.isGetVerify) {
        layer.tips({ "content": "请先获取验证码！" ,"pid":"userForm"});
        return;
      }

      var mobileVal = Variable.mobileInput.value;
      var verifyVal = Variable.verifyInput.value;
      var pwdVal = Variable.pwdInput.value;

      if (!CheckForm.isMobile(mobileVal)) {
        layer.tips({ "content": "请输入正确的手机号码！" ,"pid":"userForm"});
        return;
      }
      if (!CheckForm.isNumber(verifyVal) || !CheckForm.lengthLimit(verifyVal, 4, 4)) {
        layer.tips({ "content": "短信验证码必须为4位数字！" ,"pid":"userForm"});
        return;
      }
      if (!CheckForm.lengthLimit(pwdVal, 4, 12)) {
        layer.tips({ "content": "请输入4~12位密码！" ,"pid":"userForm"});
        return;
      }
      if (!CheckForm.checkPwd(pwdVal)) {
        layer.tips({ "content": "密码限数字和字母组成！" ,"pid":"userForm"});
        return;
      }

      Variable.canSubmit = false;
      $this.changeBtn("getVerify", Variable.canSubmit);

      var pwdMD5 = hex_md5(pwdVal);
      var bindData = {
        "en": 0,
        "cmd": {
          "en": 1,
          "md": "01",
          "fc": "018",
          "mobile": mobileVal,
          "loginkey": Variable.openID,
          "channel": Variable.typeChannel,
          "pwd": pwdMD5,
          "smscode": verifyVal,
          "nickname": Variable.nickName,
          "uimg": "",
          "regfrom": Variable.regFrom,
        }
      };
      var success = function(jsonData) {
        if (jsonData.status == 0) {
          if (Variable.addCode !== "add") {
            layer.tips({ "content": "恭喜您绑定成功！" ,"pid":"userForm"});
            //注册完成后调用pc函数ThirdLoginRsp("类型 1 wx 2 qq 3 wb"，"code(openid)")
            var sucFunc = Variable.sucFunc;
            window[sucFunc](Variable.typeChannel, Variable.openID);
          }
          else {
            layer.alert({
              "title":"重新登录",
              "content":"您已成功完善资料，请重新登录享更多特权！",
              "yes": function() {
                layer.close();
                window.ToLogin();
              },
              "mask": true,
              "pid": "box",
            });
          }
        }
        else {
          layer.tips({ "content": jsonData.msg ,"pid":"userForm"});
        }
        Variable.canSubmit = true;
        $this.changeBtn("getVerify", Variable.canSubmit);
      };

      Post(bindData, success);
    },

    //点击下次再说
    nextTime: function () {
      window.ThirdLoginRsp(Variable.typeChannel, Variable.openID);
    },

    //监听回车事件
    enterKey: function (event){
      var e = event || window.event;
      if(e.keyCode == 13) {
        e.preventDefault();
        Variable.subBtn.click();
      }
    },

  };

  ThirdLogin.init();

}());




