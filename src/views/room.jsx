/**
 * Created by kiny on 16/9/7.
 */
import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './room.scss';
import MainNav from './main-nav';
import SubNav from './sub-nav';
import UserOnline from './user-online';
import Video from './video/video';
import Notice from './notice/notice';
import Chat from '../vendors/wxf/components/chat/chat';
import {
  requestGuestLogin,
  requestNewNotice,
  requestRefreshToken,
  requestGetBroadcast,
  requestUserOnline,
  requestOnlineCheck,
  exchangeUser,
  requestLogout,
} from '../model/action';
import Timer from '../ultils/timer';
import { safeGetKey } from '../ultils/helper';
import { Cookie } from '../vendors/wj/service/tools';
import AppConfig from '../server/app-config';
import AD from '../components/ad';
import BroadCast from './broadcast';

class Room extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    myState: PropTypes.object,
    onlinesRobots: PropTypes.array,
  };

  constructor(props) {
    super(props);

    if (!props.myState.isLogin) {
      props.dispatch(requestGuestLogin());
    } else {
      exchangeUser(props.dispatch);
    }
  }

  componentWillMount() {
    const skin = Cookie.getCookie('skin');
    if (skin && ['dark', 'blue', 'red', 'purple'].indexOf(skin) !== -1) {
      document.body.setAttribute('class', `${skin}-theme`);
    }
  }

  // 定时检查器
  componentDidMount() {
    this.timeChecker();
  }

  componentWillUnmount() {
    this.timer.clear();
    this.timer = null;
  }

  showGoingTimeOut() {
    AD.show({
      img: safeGetKey('ads.ggbm7.adpic', this.props.myState),
      link: safeGetKey('ads.ggbm7.adlink', this.props.myState),
      isCenter: true,
    });
  }

  timeChecker() {
    this.timer = new Timer();
    const { dispatch } = this.props;
    this.timer.onLoginTimeOut = () => dispatch(requestLogout(true));
    this.timer.onGoingTimeOut = this.showGoingTimeOut.bind(this);
    this.timer.registerTimer(NEW_NOTICE_TIME, () => dispatch(requestNewNotice()));
    this.timer.registerTimer(REFRESH_TOKEN_TIME, () => dispatch(requestRefreshToken()));
    this.timer.registerTimer(CHECK_TIME, () => dispatch(requestOnlineCheck()));
    this.timer.registerTimer(ONLINE_USER_TIME, () => dispatch(requestUserOnline()));
    this.timer.registerTimer(BROADCAST_TIME, () => dispatch(requestGetBroadcast()));
  }

  render() {
    const { dispatch, myState } = this.props;
    const uname = myState.displayUserName;

    const obj = {
      roomId: myState.roomID, // 房间id
      userId: AppConfig.userID,
      userName: uname,
      groupId: myState.user.groupid, // 角色id
      groupName: myState.user.groupname, // 角色名称
      groupImg: myState.user.groupimg, // 角色图标
      token: AppConfig.token, // token
      qq: myState.qqList,
      QRCode: safeGetKey('ads.ggbm10.adpic', myState), // 手机二维码
      marquee: myState.marquee, // 跑马灯
      purview: myState.authority.isChatReviewEnable, // 权限 0:无权限，1：有权限，2：所以的
      requestMsgTime: CHAT_MSG_TIME,
      robotPurview: myState.authority.isRobotEnable, // 机器人权限,是否显示机器人
      robotList: this.props.onlinesRobots,
      chatToUser: myState.chatToUser,
      dispatch,
      isRegisterUser: myState.isLogin,
      chatSet: myState.chatAuthority,
    };
    return (
      <div>
        <MainNav
          dispatch={dispatch}
          userName={uname}
          isLogin={myState.isLogin}
          isSingleRoom={myState.isSingleRoom}
          {...myState.mainNavInfo}
        />
        <div styleName="main-body">
          <div styleName="nav-container">
            <SubNav
              authority={myState.authority}
              noAuthorityTips={myState.noAuthorityTips}
              navs={myState.customNavInfo}
            />
            <UserOnline />
          </div>
          <div styleName="content-container">
            <div styleName="video-box">
              <Video
                dispatch={dispatch}
                isVOD={myState.isVOD}
                isYYPlayer={myState.isYYPlayer} videoURL={myState.videoURL}
                vods={myState.vods}
              />
              <Notice
                dispatch={dispatch} isEditable={myState.authority.isNoticeEditEnable}
                list={myState.newNotices} about={myState.aboutImg}
                ad={safeGetKey('ads.ggbm9', myState)}
              />
            </div>
            <div styleName="chat-box">
              <Chat {...obj} />
            </div>
          </div>
        </div>
        <BroadCast />
      </div>
    );
  }
}
export default cssModules(Room, styles, { allowMultiple: true, errorWhenNotFound: false });
