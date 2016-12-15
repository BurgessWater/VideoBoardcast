/**
 * Created by dz on 16/9/27.
 */

import UserApi from '../server/api/user-api';
import Alert from '../components/alert';
import {
  NoticeApi,
  LiveVideoApi,
  getRadmonRobot,
  getBroadcast,
} from '../server/api/live-video-api';
import ChatApi from '../server/api/chat-api';
import AppConfig from '../server/app-config';
import { Cookie } from '../vendors/wj/service/tools';
import * as ActionTypes from './action-types';
import Tips from '../components/tips';

export function playYouKuVod(yid) {
  return {
    type: ActionTypes.PLAY_YOU_KU_VOD,
    yid,
  };
}

export function exitRoom() {
  return {
    type: ActionTypes.EXIT_ROOM,
  };
}

export function chatToUser(user) {
  return {
    type: ActionTypes.CHAT_TO_USER,
    user,
  };
}

export function successLogin(obj) {
  return {
    type: ActionTypes.SUCCESS_LOGIN,
    data: obj,
  };
}

export function successGetAuthority(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_AUTHORITY,
    obj,
    data: json,
  };
}

export function requestAuthority(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return UserApi.authority()
      .then(json => dispatch(successGetAuthority(obj, json.data)));
  };
}

export function successLogout() {
  return {
    type: ActionTypes.LOGOUT_SUCCESS,
  };
}

export function successGetNewNotice(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_NEW_NOTICE,
    obj,
    data: json,
  };
}

export function requestNewNotice(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return NoticeApi.get()
      .then(json => dispatch(successGetNewNotice(obj, json.data)));
  };
}
//
// export function successGetAbout(obj, json) {
//   return {
//    type: ActionTypes. SUCCESS_GET_ABOUT,
//     obj,
//     data: json,
//   };
// }
//
// export function requestAbout(obj) {
//   return function wrap(dispatch) {
//     // dispatch(requestLogin(obj));
//     return AboutUsApi.get()
//       .then(json => dispatch(successGetAbout(obj, json.data.conent)));
//   };
// }

export function successGetMainNav(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_MAIN_NAV,
    obj,
    data: json,
  };
}

export function requestMainNav(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return LiveVideoApi.getMainNavInfo()
      .then(json => dispatch(successGetMainNav(obj, json.data)));
  };
}

export function successGetCustomNavInfo(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_CUSTOM_NAV_INFO,
    obj,
    data: json,
  };
}

export function requestCustomNavInfo(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return LiveVideoApi.getCustomNavInfo()
      .then(json => dispatch(successGetCustomNavInfo(obj, json.data)));
  };
}

export function successGetUserOnline(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_USER_ONLINE,
    obj,
    data: json,
  };
}

export function requestUserOnline(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return ChatApi.getUserOnline().then(json =>
      dispatch(successGetUserOnline(obj, JSON.parse(json.custonlineinfo)))); // TODO:2次 parse
  };
}

export function successGetRadmonRobot(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_RADMON_ROBOT,
    obj,
    data: json,
  };
}

export function requestRadmonRobot(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return getRadmonRobot()
      .then(json => dispatch(successGetRadmonRobot(obj, json.data)));
  };
}

export function successGetAD(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_AD,
    obj,
    data: json,
  };
}

export function requestAD(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return UserApi.getAD()
      .then(json => dispatch(successGetAD(obj, json.data)));
  };
}

export function successGetBroadcast(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_BROADCAST,
    obj,
    data: json,
  };
}

export function requestGetBroadcast(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return getBroadcast()
      .then(json => dispatch(successGetBroadcast(obj, json.data)));
  };
}

export function successGetRoomInfo(roomID, json) {
  return {
    type: ActionTypes.SUCCESS_GET_ROOM_INFO,
    roomID,
    data: json,
  };
}

export function requestRoomInfo(id = AppConfig.roomid) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return LiveVideoApi.getRoomInfo(id)
      .then(json => dispatch(successGetRoomInfo(id, json.data[0])));
  };
}

export function successGetAllRooms(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_ALL_ROOMS,
    obj,
    data: json,
  };
}

export function requestAllRooms(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return LiveVideoApi.getAllRoomsStatus()
      .then(json => dispatch(successGetAllRooms(obj, json.data)));
  };
}

export function successGetNoAuthorityTips(obj, json) {
  return {
    type: ActionTypes.SUCCESS_GET_NO_AUTHORITY_TIPS,
    obj,
    data: json,
  };
}

export function requestNoAuthorityTips(obj) {
  return function wrap(dispatch) {
    return UserApi.getNoAuthorityTips()
      .then(json => dispatch(successGetNoAuthorityTips(obj, json.data)));
  };
}

export function successLoginWithGuest(json) {
  return {
    type: ActionTypes.SUCCESS_LOGIN_WITH_GUEST,
    data: json,
  };
}

function successLoginWithAnonymousUser(json) {
  return {
    type: ActionTypes.SUCCESS_LOGIN_CHAT_GUEST_USER,
    data: json,
  };
}

function requestLoginWithAnonymousUser() {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return ChatApi.loginWithAnonymousUser()
      .then(json => dispatch(successLoginWithAnonymousUser(json)));
  };
}

export function requestLoginWithAnonymousUserWrap(dispatch) {
  // 如果本地已经有cookie，永不重新获取聊天游客
  if (Cookie.getCookie('chat_guest') === null) {
    dispatch(requestLoginWithAnonymousUser());
  }
}

export function successRefreshToken(obj, json) {
  return {
    type: ActionTypes.SUCCESS_REFRESH_TOKEN,
    obj,
    data: json,
  };
}

export function requestRefreshToken(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return UserApi.refreshToken()
      .then(json => dispatch(successRefreshToken(obj, json)));
  };
}

export function successOnlineCheck(obj, json) {
  return {
    type: ActionTypes.SUCCESS_ONLINE_CHECK,
    obj,
    data: json,
  };
}

export function requestOnlineCheck(obj) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return ChatApi.onlineCheck()
      .then(json => dispatch(successOnlineCheck(obj, json)));
  };
}

// 更改用户登录状态后，刷新APP
export function exchangeUser(dispatch) {
  dispatch(requestRoomInfo());
  dispatch(requestAD());
  dispatch(requestMainNav());
  dispatch(requestCustomNavInfo());
  dispatch(requestNewNotice());
  dispatch(requestUserOnline());
  dispatch(requestRadmonRobot());
  dispatch(requestNoAuthorityTips());
  dispatch(requestAuthority());
  dispatch(requestGetBroadcast());
  dispatch(requestAllRooms());
}

// 以游客方式登录，刷新APP
export function requestGuestLogin() {
  return function wrap(dispatch) {
    return UserApi.loginWithGuest().then((rs) => {
      dispatch(successLoginWithGuest(rs.data));
      requestLoginWithAnonymousUserWrap(dispatch);
      exchangeUser(dispatch);
    });
  };
}

// 以游客方式登录房间选择，简化API请求
export function requestGuestLoginFromRoom() {
  return function wrap(dispatch, getState) {
    console.log('state', getState());
    if (getState().userState.isLogin) { // TODO: 修改变量名
      requestLoginWithAnonymousUserWrap(dispatch);
      dispatch(requestAllRooms());
      return Promise.resolve();
    }
    return UserApi.loginWithGuest().then((rs) => {
      dispatch(successLoginWithGuest(rs.data));
      requestLoginWithAnonymousUserWrap(dispatch);
      dispatch(requestAllRooms());
    });
  };
}

// 用户登出
export function requestLogout(isTimeOut = false) {
  return function wrap(dispatch) {
    // dispatch(requestLogin(obj));
    return UserApi.logout()
      .then(() => {
        if (isTimeOut) {
          let t = '';
          if (LOGIN_TIME_OUT_COUNT > 60) {
            t = `${parseInt(LOGIN_TIME_OUT_COUNT / 60, 10)}分钟`;
          } else {
            t = `${LOGIN_TIME_OUT_COUNT} 秒`;
          }
          Alert.show(`你已经超过${t}未做操作，请重新登录！`);
        } else {
          Tips.show('登出成功!');
        }
        dispatch(successLogout());
        dispatch(requestGuestLogin()); // 立马登录游客帐号
      });
  };
}

