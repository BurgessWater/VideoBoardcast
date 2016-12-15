/**
 * Created by kiny on 16/9/28.
 */
import md5 from 'md5';
import { postJSON, commonCMD } from '../helper';

export default class UserApi {

  // 登录 001
  static login(name, pwd) {
    return postJSON(
      commonCMD({ fc: '001', uname: name, pwd: md5(pwd), en: 1 }),
      UserApi.login.name   //这个方法的名字  login
    );
  }

  // 游客登录
  static loginWithGuest() {
    return UserApi.login(GUEST_NAME, GUEST_PWD);
  }

  // 刷新token 003
  static refreshToken() {
    return postJSON(
      commonCMD({ fc: '003' }),
      UserApi.refreshToken.name
    );
  }

  // 登出 004
  static logout() {
    return postJSON(
      commonCMD({ fc: '004' }),
      UserApi.logout.name
    );
  }

  // 注册 005
  static register(d) {
    const { regFrom: regfrom = 'web', mobile, verify: smscode, pwd, nickName: nickname = '' } = d;
    return postJSON(
      commonCMD({ fc: '005', mobile, smscode, nickname, pwd: md5(pwd), regfrom, en: 1 }),
      UserApi.register.name
    );
  }

  // 注册获取手机验证码 006
  static requestRegisterPhoneCode(mobile) {
    return postJSON(
      commonCMD({ fc: '006', mobile }),
      UserApi.requestRegisterPhoneCode.name
    );
  }

  // 修改用户信息 008
  static modify(d) {
    const { userName: uname = '', nickName: nickname = '', avatar = '', token } = d;
    return postJSON(
      commonCMD({
        fc: '008',
        uname,
        nickname,
        qq: '',
        email: '',
        uimg: { type: 2, format: 'png', data: avatar },
        token,
      }),
      UserApi.modify.name
    );
  }

  // 获取用户信息 009
  static getUserInfo(token) {
    return postJSON(
      commonCMD({ fc: '009', token }),
      UserApi.getUserInfo.name
    );
  }

  // 获取权限 012
  static authority() {
    return postJSON(
      commonCMD({ mdl: '04', fc: '012', ptype: 2 }),
      UserApi.authority.name
    );
  }

  // 无权限提示内容 013
  static getNoAuthorityTips() {
    return postJSON(
      commonCMD({ mdl: '04', fc: '013' }),
      UserApi.getNoAuthorityTips.name
    );
  }

  // 修改密码 014
  static modifyPassword(d) {
    const { oldPwd, newPwd, token } = d;
    return postJSON(
      commonCMD({ fc: '014', pwd: md5(oldPwd), npwd: md5(newPwd), token }),
      UserApi.modifyPassword.name
    );
  }

  // 获取广告 015
  static getAD() {
    return postJSON(
      commonCMD({ fc: '015', mdl: '04' }),
      UserApi.getAD.name
    );
  }

  // 获取忘记密码手机验证码 019
  static requestRetrievePhoneCode(mobile) {
    return postJSON(
      commonCMD({ fc: '019', mobile }),
      UserApi.requestRegisterPhoneCode.name
    );
  }

  // 忘记密码修改密码 020
  static modifyPasswordFromRetrieve(d) {
    const { mobile, verify: smscode, pwd } = d;
    return postJSON(
      commonCMD({ fc: '014', pwd, mobile, smscode }),
      UserApi.modifyPasswordFromRetrieve.name
    );
  }

}
