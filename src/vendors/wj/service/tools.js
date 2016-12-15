/**
 * Created by fighter on 2016/9/28.
 */

import cookie from 'cookie';

Date.addSeconds = function (sec) {
  return new Date((new Date()).getTime() + (sec * 1000));
};

export class Cookie {
  static setCookie(name, val, option) {
    const v = (typeof val === 'string') ? val : JSON.stringify(val);
    document.cookie = cookie.serialize(name, v, option);
  }

  static setCookieExpireInSecond(name, val, second, option) {
    Cookie.setCookie(name, val, { expires: Date.addSeconds(second), ...option });
  }

  static getCookie(cName) {
    const p = cookie.parse(document.cookie);
    if (cName in p) {
      return p[cName];
    }
    return null;
  }

  static getJSONCookie(cName) {
    return JSON.parse(Cookie.getCookie(cName));
  }

  static deleteCookie(cName) {
    Cookie.setCookie(cName, '', { maxAge: -1 });
  }
}

// 表单验证
const regs = {
  number: /^(0|[1-9][0-9]*)$/,
  char: /^[A-Za-z]+$/,
  chinese: /^[\u4e00-\u9fa5]+$/gi,
  mobile: /^1[34578]{1}[0-9]{9}$/,
  numChar: /^[A-Za-z0-9]+$/,
  blankSpace: /\s/,
};

export class CheckForm {
  // 验证非空
  static notEmpty(str) {
    return (typeof str !== 'undefined' && str.trim() !== '');
  }

  // 限制长度
  static lengthLimit(str, minLen, maxLen) {
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
  }

  // 包含空格
  static hasBlankSpace(str) {
    return regs.blankSpace.test(str);
  }

  /** 基本格式验证**/
  // 验证数字（非 0 开头）

  static isNumber(str) {
    return regs.number.test(str);
  }

  // 验证字母
  static isChar(str) {
    return regs.char.test(str);
  }

  // 验证汉字
  static isChinese(str) {
    return regs.chinese.test(str);
  }

  // 验证邮箱格式
  // static isEmail(str) {}
  // 验证手机号码格式
  static isMobile(str) {
    return regs.mobile.test(str);
  }

  /** 项目定制**/
  // 验证账号格式（数字，字母）
  static checkUname(str) {
    return regs.numChar.test(str);
  }

  // 验证密码格式（数字，字母）
  static checkPwd(str) {
    return regs.numChar.test(str);
  }
}

// 获取地址栏参数，传入参数名，获取参数值
const GetParamData = () => {
  let str = location.href; // 取得整个地址栏
  const num = str.indexOf('?');
  str = str.substr(num + 1); // 取得所有参数   stringvar.substr(start [, length ]
  const arr = str.split('&'); // 各个参数放到数组里
  const paramData = {};
  for (let i = 0; i < arr.length; i += 1) {
    const n = arr[i].indexOf('=');
    if (n > 0) {
      const name = arr[i].substring(0, n);
      const value = decodeURIComponent(arr[i].substr(n + 1));
      paramData[name] = value;
    }
  }
  return paramData;
};
export const ParamData = new GetParamData();

// 倒计时
export const timer = (id, suc) => {
  let t = 60;
  const btn = document.getElementById(id);
  const timeCount = () => {
    if (t === 0) {
      clearTimeout(timeCount);
      t = 60;
      suc(true);
      btn.innerHTML = '获取验证码';
    } else {
      t -= 1;
      btn.innerHTML = `${t}s后重新获取`;
      suc(false);
      setTimeout(() => {
        timeCount();
      }, 1000);
    }
  };
  return timeCount();
};

// 回车事件
export const enterKey = (event, id) => {
  const e = event || window.event;
  if (e.keyCode === 13) {
    const btn = document.getElementById(id);
    e.preventDefault();
    btn.click();
  }
};
