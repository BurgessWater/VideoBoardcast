import { Cookie } from '../vendors/wj/service/tools';
// import { safeGetKey } from '../ultils/helper';
/**
 * Created by kiny on 16/10/1.
 */

// // 20分钟
// export const LOGIN_TIME_OUT_COUNT = 20 * 60;
//
// // 10分钟 刷新token
// export const REFRESH_TOKEN_TIME = 10 * 60;
// // 50秒(特殊) 打卡
// export const CHECK_TIME = 50;
// // 10秒  聊天记录
// export const CHAT_MSG_TIME = 10;
// // 30秒  广播
// export const BROADCAST_TIME = 30;
// // 10秒 最新公告
// export const NEW_NOTICE_TIME = 10;
// // 100秒 在线用户
// export const ONLINE_USER_TIME = 100;

// export const SHORTCUT_URL = `http://${NORMAL_SERVER}/BIService/DeskTopServlet?
// name=${encodeURIComponent('视频直播')}&url=${window.location.href}`; // 快捷方式
// 聊天区域上传图片地址
// export const UPLOAD_IMG_URL = `http://${NORMAL_SERVER}/ImService/ImageUpLoad`;

export default class AppConfig {

  static get token() {
    return Cookie.getCookie('token');
  }

  static get roomid() {
    return parseInt(Cookie.getCookie('roomID'), 10);
  }

  static get userID() {
    const user = Cookie.getJSONCookie('user');
    if (user && user.uname !== 'cfkd01') {
      return user.cid;
    }

    const guest = Cookie.getJSONCookie('chat_guest');
    if (guest) {
      return guest.cid;
    }

    throw new Error('错误，无用户');
  }

}
