/**
 * Created by dz on 16/10/17.
 */
/* eslint max-len : off*/
import Tips from '../components/tips';

const Regs = {
  number: {
    regExp: /^[0-9]+(.[0-9]+)?$/,
    name: '数字',
  },
  date: {
    regExp: /^\d{4}[-]([0][1-9]|(1[0-2]))[-]([1-9]|([012]\d)|(3[01]))([ \t\n\x0B\f\r])(([0-1]{1}[0-9]{1})|([2]{1}[0-4]{1}))([:])(([0-5]{1}[0-9]{1}|[6]{1}[0]{1}))$/,
    name: '日期',
  },
  time: {
    regExp: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/,
    name: '时间',
  },
  file: {
    regExp: /[\w+]/,
    name: '文件',
  },
};

const noReg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？]");

export default function validateForm(formData, options, ref = undefined) {
  const keys = Object.keys(options);
  for (let i = 0, len = keys.length; i < len; i += 1) {
    const key = keys[i];
    if (key in formData) { // 如果存在
      const item = options[key];
      if ('type' in item) {
        const reg = Regs[item.type];
        if (reg && !reg.regExp.test(formData[key])) {
          Tips.show(`${options[key].name} 不是有效的${reg.name}!`, ref);
          return false;
        }
      } else if ('valid' in item) { // 自定义验证
        if (!item.valid(formData, key)) {
          return false;
        }
      } else if (noReg.test(formData[key])) {
        Tips.show(`${options[key].name} 不能包含特殊字符!`, ref);
        return false;
      }
    } else if (options[key].isRequired) { // 如果不存在，且为必填
      Tips.show(`${options[key].name} 不能为空!`, ref);
      return false;
    }
  }

  return true;
}

