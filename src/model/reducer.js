/**
 * Created by dz on 16/9/27.
 */
/* eslint no-unused-vars:off */
import { combineReducers } from 'redux';
import Authority from '../server/authority';
import { Cookie } from '../vendors/wj/service/tools';
import { combineArray, safeGetKey } from '../ultils/helper';
import { NONE } from '../server/define';
import AD from '../components/ad';
import * as ActionTypes from './action-types';

const user = Cookie.getJSONCookie('user');
const chatGuest = Cookie.getJSONCookie('chat_guest');

const isLoginUser = user && user.uname !== 'cfkd01';

function getUserNameFromCookie() {
  if (isLoginUser) {
    return user.nickname || user.uname;
  }
  if (chatGuest) {
    return chatGuest.uname;
  }
  return '未知用户';
}

const initState = {
  displayUserName: getUserNameFromCookie(),
  isLogin: isLoginUser,
  // 聊天游客，一次获取，7天保持
  chatGuest: chatGuest || {},
  // 游客 、正常用户
  user: user || {},
  authority: new Authority(),
  newNotices: [],
  aboutImg: '',
  mainNavInfo: {},
  noAuthorityTips: {},
  customNavInfo: [],
  isYYPlayer: false,
  vods: [],
  qqList: [],
  videoURL: '',
  marquee: '投资有风险，入市需谨慎！',
  ads: {},
  rooms: [],
  roomID: parseInt(Cookie.getCookie('roomID') || NONE, 10),
  chatAuthority: 0,
  maxonline: 0,
  chatToUser: {},
  isSingleRoom: true,
};

console.log('initState', initState);

const tokenTime = 30 * 60;
const longTime = 60 * 60 * 24 * 7; // 7天过期

function onlineInfo(state = {}, action) {
  switch (action.type) {
    // 机器人在线信息
    case ActionTypes.SUCCESS_GET_RADMON_ROBOT:
      return { ...state, robots: action.data };
    // 用户在线信息
    case ActionTypes.SUCCESS_GET_USER_ONLINE:
      return { ...state, users: action.data };
    default:
      return state;
  }
}

export function userState(state = initState, action) {
  switch (action.type) {
    // 用户登录
    case ActionTypes.SUCCESS_LOGIN: {
      const { token, ui } = action.data;
      Cookie.setCookie('token', token, { maxAge: tokenTime });
      Cookie.setCookie('user', ui, { maxAge: tokenTime });
      return {
        ...state,
        user: ui,
        isLogin: true,
        displayUserName: ui.nickname || ui.uname,
      };
    }
    // 普通游客登录
    case ActionTypes.SUCCESS_LOGIN_WITH_GUEST: {
      const { token, ui } = action.data;
      Cookie.setCookie('token', token, { maxAge: tokenTime });
      Cookie.setCookie('user', ui, { maxAge: tokenTime });
      return { ...state, user: ui, isLogin: false };
    }
    // 聊天游客登录, 长期保存
    case ActionTypes.SUCCESS_LOGIN_CHAT_GUEST_USER: {
      Cookie.setCookie('chat_guest', action.data, { maxAge: longTime });
      return { ...state, chatGuest: action.data, displayUserName: action.data.uname };
    }
    // 登出
    case ActionTypes.LOGOUT_SUCCESS:
      Cookie.deleteCookie('token');
      Cookie.deleteCookie('user');
      // 清空所有权限
      return {
        ...state,
        authority: new Authority(),
        displayUserName: state.chatGuest.uname,
        chatToUser: null, // 重置@用户
      };
    // 权限
    case ActionTypes.SUCCESS_GET_AUTHORITY:
      return { ...state, authority: new Authority(action.data) };
    // 无权限提示
    case ActionTypes.SUCCESS_GET_NO_AUTHORITY_TIPS: {
      const noAuthorityTips = {};
      action.data.forEach((i) => {
        noAuthorityTips[i.funid] = i;
      });
      return { ...state, noAuthorityTips };
    }
    // 最新公告
    case ActionTypes.SUCCESS_GET_NEW_NOTICE:
      return { ...state, newNotices: action.data };
    // 主导航条信息
    case ActionTypes.SUCCESS_GET_MAIN_NAV:
      return { ...state, mainNavInfo: action.data[0] };
    // 侧边导航栏
    case ActionTypes.SUCCESS_GET_CUSTOM_NAV_INFO:
      return { ...state, customNavInfo: action.data };
    // 房间信息
    case ActionTypes.SUCCESS_GET_ROOM_INFO: {
      Cookie.setCookie('roomID', action.roomID);
      const {
        demandname,
        demandurl,
        marquee,
        qqno,
        qqtitle,
        videotype,
        video: videoURL,
        comanypic: aboutImg,
        charset: chatAuthority,
        maxonline = 0,
      } = action.data;
      const vods = combineArray(demandname, demandurl);
      const qqList = combineArray(qqno, qqtitle);
      return {
        ...state,
        vods,
        qqList,
        isYYPlayer: videotype === 1,
        videoURL,
        marquee,
        aboutImg,
        chatAuthority,
        maxonline,
        roomID: action.roomID,
      };
    }
    // 点击播放优酷视频
    case ActionTypes.PLAY_YOU_KU_VOD:
      return { ...state, isVOD: true, videoURL: action.yid };
    // @用户
    case ActionTypes.CHAT_TO_USER:
      return { ...state, chatToUser: action.user };
    // 获取广告
    case ActionTypes.SUCCESS_GET_AD: {
      const ads = {};
      action.data.forEach((i) => {
        if (i.status === '1') ads[i.adcode] = i;
      });
      // AD.show({
      //   img: safeGetKey('ggbm8.adpic', ads),
      //   link: safeGetKey('ggbm8.adlink', ads),
      //   isCenter: false,
      // });
      // AD.show({
      //   img: safeGetKey('ggbm6.adpic', ads),
      //   link: safeGetKey('ggbm6.adlink', ads),
      //   isCenter: true,
      // });
      return { ...state, ads };
    }
    // 获取所有房间状态
    case ActionTypes.SUCCESS_GET_ALL_ROOMS: {
      const rooms = action.data.filter(i => i.status === '1' || i.status === 1);
      return { ...state, rooms, isSingleRoom: rooms.length <= 1 };
    }
    // 退出房间
    case ActionTypes.EXIT_ROOM:
      Cookie.deleteCookie('roomID');
      return { ...state, roomID: NONE };
    // 刷新Token
    case ActionTypes.SUCCESS_REFRESH_TOKEN: {
      try {
        const token = Cookie.getCookie('token');
        Cookie.setCookieExpireInSecond('token', token, tokenTime);
        const userCookie = Cookie.getCookie('user');
        Cookie.setCookieExpireInSecond('user', userCookie, tokenTime);
      } catch (e) {
        console.error(e, '更新Token时间失败!');
      }
      return state;
    }

    default:
      return state;
  }
}

export default combineReducers({ onlineInfo, userState });
