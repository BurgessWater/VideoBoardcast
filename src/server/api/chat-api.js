/**
 * Created by kiny on 16/9/28.
 */

import { postIM, wrapWithRoomID } from '../helper';
import AppConfig from '../app-config';
import { Cookie } from '../../vendors/wj/service/tools';

export default class ChatApi {
  // 在线打卡 31
  static onlineCheck() {
    const user = Cookie.getJSONCookie('user');
    const chatGuest = Cookie.getJSONCookie('chat_guest');
    const isLoginUser = user && user.uname !== 'cfkd01';
    const obj = isLoginUser ? user : chatGuest;
    return postIM(
      wrapWithRoomID({ fc: '031', ...obj }),
      'onlineCheck'
    );
  }

  // 发送聊天 32
  static postMessage(obj) {
    return postIM(
      wrapWithRoomID({ fc: '032', ...obj }),
      'postMessage'
    );
  }

  // 分页查询聊天记录 33
  static getMessages(pageindex) {
    return postIM(
      wrapWithRoomID({ fc: '033', pagesize: 5, pageindex }),
      'getMessages'
    );
  }

  // 定时查询聊天记录 34
  static loopGetMessage(maxid) {
    return postIM(
      wrapWithRoomID({ fc: '034', maxid, uid: AppConfig.userID }),
      'loopGetMessage'
    );
  }

  // 聊天审核 35
  static review(id) {
    return postIM(
      wrapWithRoomID({ fc: '035', id }),
      'review'
    );
  }

  // 获取在线用户列表36
  static getUserOnline() {
    return postIM(
      wrapWithRoomID({ fc: '036', custid: AppConfig.userID }),
      'getUserOnline'
    );
  }

  // 获得游客账号38
  static loginWithAnonymousUser() {
    return postIM(
      wrapWithRoomID({ fc: '038' }),
      'loginWithAnonymousUser'
    );
  }
}

