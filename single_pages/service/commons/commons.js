/*
* @Author: fighter
* @Date:   2016-09-21 10:15:59
* @Last Modified by:   fighter
* @Last Modified time: 2016-09-29 15:24:14
* Ajax 请求
* type: GET/POST
* url: 
* async: true/false
* options: 
*/

'use strict';

/*=========== Ajax请求 ==========*/


var createAjax = {
	createXHR: function() {
		var xmlHttp;
		// if('XDomainRequest' in window && window.XDomainRequest !== null){
		// 	console.log(99)
		// 	xmlHttp = new XDomainRequest();
		// }
		if(window.XMLHttpRequest){
			xmlHttp = new window.XMLHttpRequest();
		}else if(window.ActiveXObject){
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}else{
			return false;
		}
		return xmlHttp;
	},
	request: function(options) {
		var xmlHttp = this.createXHR() || null;

		if(xmlHttp == null){
			alert("您的电脑不支持AJAX！");
			return;
		};

		var opts = options || {};

		opts.type = opts.type.toUpperCase() || "GET";
		opts.url = opts.url || "";
		opts.async = opts.async || true;
		opts.data = this.param(opts.data) || null;
		opts.success = opts.success || function() {};
		opts.error = opts.error || function() {};

		var stateChange = this.xhrStateChange;

		xmlHttp.onreadystatechange = function() {
			stateChange(xmlHttp, opts.success, opts.error);
		};

		if(opts.type === "POST") {
			// alert(xmlHttp.open)
			xmlHttp.open("POST", opts.url, opts.async);
			xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=utf-8');
			xmlHttp.send(opts.data);
		}else if(opts.type === "GET") {
			xmlHttp.open("get", opts.utl + "?" + opts.data, opts.async);
			xmlHttp.send(null);
		}
	}, 
	param: function(data) {
		if(!data){
			return false;
		}

		if(typeof data !== "object"){
			return data;
		}

		var requestData = [];
		for(var key in data){
			requestData.push(key+"="+data[key]);
		}

		return requestData.join("&");

	},
	xhrStateChange: function(xhr,success,error) {
		if(xhr.readyState == 4 && xhr.status == 200){
			success(xhr.responseText)
		}
	}
};

var Post = function(data,suc,err){
	createAjax.request({
		type: "post",
		url: AJAX_URL,
		data: JSON.stringify(data),
		success: function(response){
			var json = JSON.parse(response);
			if(suc && typeof suc ==="function") {
				suc(json)
			}else{
				console.log("json", json)
			}
		},
		error: function(response){
			if(err && typeof err ==="function") {
				err(response)
			}else{
				console.log(response)
			}
		},
	})
};

/*=========== Ajax请求 ==========*/



//获取地址栏参数，传入参数名，获取参数值
var GetParamData = function(){
	var str = location.href; //取得整个地址栏
	var num = str.indexOf("?");
	str = str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
	var arr = str.split("&"); //各个参数放到数组里
	var paramData = {};
	for(var i=0;i < arr.length;i++){
		var n = arr[i].indexOf("=");
		if(n > 0){
			var name = arr[i].substring(0,n);
			var value = decodeURIComponent(arr[i].substr(n+1));
			paramData[name]=value;
		}
	}
	return paramData;
};
var ParamData = GetParamData();


// css-class操作
var CSSClass = {
	hasClass: function(ele, cls="") {
		var el = document.getElementById(ele);
		if(cls.replace(/\s/g, '').length == 0){
			return false;
		}
		return el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	},

	addClass: function(ele, cls="") {
		var el = document.getElementById(ele);
		if(!CSSClass.hasClass(ele, cls)){
			el.className += el.className.length == 0 ? cls : " " + cls ;
		}
	},

	removeClass: function(ele, cls="") {
		var el = document.getElementById(ele);
		if(CSSClass.hasClass(ele, cls)) {
			el.className = el.className.replace(new RegExp('(\\s|^)'+cls), "")
		}
	}
};


// 表单验证
var CheckForm = {
	regs: {
		number: /^(0|[1-9][0-9]*)$/,
		char: /^[A-Za-z]+$/,
		chinese: /^[\u4e00-\u9fa5]+$/gi,
		mobile: /^1[34578]{1}[0-9]{9}$/,
		numChar: /^[A-Za-z0-9]+$/,
		blankSpace: /\s/,
	},

	// 验证非空
	notEmpty: function(str) {
		return (typeof str !== 'undefined' && str !== '');
	},

	// 限制长度
	lengthLimit: function(str, minLen, maxLen) {
		let len = 0;
		const strLen = str.length;
		for (let i = 0; i < strLen; i += 1) {
			if (str[i].match(/[^x00-xff]/ig) != null) { // 全角
				len += 2;
			} else {
				len += 1;
			}
		}
		return (len >= minLen && len <= maxLen);
	},

	// 包含空格
	hasBlankSpace: function(str) {
		return this.regs.blankSpace.test(str);
	},

	/** 基本格式验证**/
	// 验证数字（非 0 开头）

	isNumber: function(str) {
		return this.regs.number.test(str);
	},

	// 验证字母
	isChar: function(str) {
		return this.regs.char.test(str);
	},

	// 验证汉字
	isChinese: function(str) {
		return this.regs.chinese.test(str);
	},

	// 验证邮箱格式
	// static isEmail(str) {}
	// 验证手机号码格式
	isMobile(str) {
		return this.regs.mobile.test(str);
	},

	/** 项目定制**/
	// 验证账号格式（数字，字母）
	checkUname: function(str) {
		return this.regs.numChar.test(str);
	},

	// 验证密码格式（数字，字母）
	checkPwd: function(str) {
		return this.regs.numChar.test(str);
	},
};




// //placeholder兼容ie
// var JPlaceHolder = {
// 	//检测
// 	_check: function() {
// 		return 'placeholder' in document.createElement('input');
// 	},
// 	//初始化
// 	init: function() {
// 		if (!this._check()) {
// 			this.fix();
// 		}
// 	},
// 	//修复
// 	fix: function() {
// 		var InputPlaceHoder = document.querySelectorAll('input[placeholder]');
// 		InputPlaceHoder.each(function(index, element) {
// 			var self = this,
// 				txt = self.getAttribute('placeholder');
// 				self.wrap($('<span></span>').css({
// 				position: 'relative',
// 				zoom: '1',
// 				border: 'none',
// 				background: 'none',
// 				padding: 'none',
// 				margin: 'none'
// 				// lineHeight:"30px",
// 			}));
// 			var pos = self.position(),
// 				h = self.outerHeight(true),
// 				paddingleft = self.css('padding-left');
// 			var holder = $('<span></span>').text(txt).css({
// 				position: 'absolute',
// 				left: pos.left,
// 				top: pos.top,
// 				height: h,
// 				lineHeight:"28px",
// 				paddingLeft: paddingleft,
// 				color: '#aaa'
// 			}).appendTo(self.parent());
// 			self.focusin(function(e) {
// 				holder.hide();
// 			}).focusout(function(e) {
// 				if (!self.val()) {
// 					holder.show();
// 				}
// 			});
// 			holder.click(function(e) {
// 				holder.hide();
// 				self.focus();
// 			});
// 		});
// 	}
// };
// //执行
// jQuery(function() {
// 	JPlaceHolder.init();
// });