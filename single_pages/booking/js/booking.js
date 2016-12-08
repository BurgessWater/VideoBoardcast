/*
 * @Author: fighter
 * @Date:   2016-09-29 13:31:53
 * @Last Modified by:   Amg
 * @Last Modified time: 2016-09-29 15:22:15
 */
;(function(){
  'use strict';
  // jQuery.support.cors= true;
  var btn = document.getElementById("button");

  btn.onclick = function () {
    layer.wait({ "pid": "main" });
    var token = ParamData.token || "";
    var funname = ParamData.func || "";
    var bookingData = {
      "en": 0,
      "cmd": { "md": "01", "fc": "027", "funname": funname, "token": token, "en": 1 }
    };
    var success = function (resData) {
      if (resData.status == 0) {
        console.log(resData);
        layer.tips({ "content": "预约成功", "pid": "main" });
      } else {
        layer.tips({ "content": resData.msg, "pid": "main" });
      }
    };
    Post(bookingData, success);
  };
}());


