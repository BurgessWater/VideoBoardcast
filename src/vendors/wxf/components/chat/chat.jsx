/**
 * Created by wenxinfu on 2016/9/26.
 */
import 'fetch-ie8';
import Emitter from 'eventemitter2';
import React from 'react';
import cssModules from 'react-css-modules';
import styles from './chat.scss';
import SendMsg from '../sendmsg/sendmsg';
import ChatRecord from '../chat-record/chat-record';

class Chat extends React.Component {
  static defaultProps = {
    userId: 0,
    userName: '',
    groupId: 1, // 角色id
    groupName: '', // 角色名称
    groupImg: '', // 角色图标
    qq: [],
    QRCode: '', // 手机二维码
    marquee: '', // 跑马灯
    purview: false, // false:无权限，true:有权限
    requestMsgTime: 10000,
    robotPurview: true, // 机器人权限,是否显示机器人
    robotList: [], // 机器人列表
    chatSet: 0, //聊天设置
  };
  static propTypes = {
    userId: React.PropTypes.number.isRequired,
    userName: React.PropTypes.string.isRequired,
    groupId: React.PropTypes.number.isRequired,
    groupName: React.PropTypes.string.isRequired,
    groupImg: React.PropTypes.string.isRequired,
    qq: React.PropTypes.array,
    QRCode: React.PropTypes.string,
    marquee: React.PropTypes.string,
    purview: React.PropTypes.bool.isRequired,
    requestMsgTime: React.PropTypes.number.isRequired,
    robotPurview: React.PropTypes.bool.isRequired,
    robotList: React.PropTypes.array,
    chatToUser: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    isRegisterUser: React.PropTypes.bool,
    chatSet: React.PropTypes.number.isRequired,
  };

  state = {
    isShowQRCode: this.isShowQRCode,
  }
  userId = this.props.userId;
  isShowQRCode = true;
  closeQRCode = () => {
    this.setState({ isShowQRCode: this.isShowQRCode = false });
  }
  evtEmitter = new Emitter();
  /* 子组件调用父组件的这个方法
   *{type:1,msg:""}
   * type:1--消息，
   * type:2--喝彩
   * type:3--清屏,
   * type:4--滚动设置
   */
  parentListen = (msgInfo) => {
    this.chatRecord.listenInfo(msgInfo);
  }

  otherEvent = () => {
    this.evtEmitter.emit('otherClick');
  }

// 从其他地方@用户
  atUser = (userId, userName) => {
    this.evtEmitter.emit('atUser', userId, userName);
  }

  render() {
    let chatSet = true;
    if (this.props.chatSet === 0) {
      chatSet = false;
    } else if (this.props.chatSet === 1) {
      chatSet = true;
    } else if (this.props.isRegisterUser) {
      chatSet = true;
    } else {
      chatSet = false;
    }
    if (this.props.isRegisterUser === true && this.userId !== this.props.userId) {
      setTimeout(() => {
        this.chatRecord.listenInfo({ type: 3, msg: '' });
        this.userId = this.props.userId;
        this.evtEmitter.emit('setPageIndex');
      }, 150);
    }
    const sendMsgPropsData = {
      userId: this.props.userId,
      qq: this.props.qq,
      userName: this.props.userName,
      groupId: this.props.groupId,
      groupName: this.props.groupName,
      groupImg: this.props.groupImg,
      purview: this.props.purview,
      robotPurview: this.props.robotPurview,
      robotList: this.props.robotList,
      dispatch: this.props.dispatch,
      chatToUser: this.props.chatToUser,
      isRegisterUser: this.props.isRegisterUser,
      chatSet,
    };
    const chatRecordPropsData = {
      userId: this.props.userId,
      userName: this.props.userName,
      groupId: this.props.groupId,
      groupName: this.props.groupName,
      groupImg: this.props.groupImg,
      purview: this.props.purview,
      requestMsgTime: this.props.requestMsgTime,
      isRegisterUser: this.props.isRegisterUser,
    };

    if (this.props.chatToUser || this.props.chatToUser === null) {
      const atUserIsNull = this.props.chatToUser !== null;
      const userId = atUserIsNull ? this.props.chatToUser.id : 0;
      const userName = atUserIsNull ? this.props.chatToUser.name : '';
      setTimeout(() => {
        this.evtEmitter.emit('atUser', userId, userName);
      }, 100);
    }
    return (
      <div id="chat-content" onClick={this.otherEvent} styleName="chat">
        <div styleName="chat-record">
          <div styleName="row-title" className="row ">
            <h3 styleName="chat-title">
              <img src={require('../../assets/icon/icon-notice.png')} alt="" />
              <marquee style={{ position: 'absolute' }}>{this.props.marquee}</marquee>
            </h3>
          </div>
          <ChatRecord
            ref={(ref) => {
              this.chatRecord = ref;
            }}
            evtEmitter={this.evtEmitter}
            {...chatRecordPropsData}
          />
          {
            this.isShowQRCode ? <div styleName="QRCode">
              <span onClick={this.closeQRCode}>关闭</span>
              <img src={this.props.QRCode} alt="扫描二维码" />
              <div>
                手机直播
              </div>
            </div> : null
          }
        </div>
        <div styleName="chat-send">
          <SendMsg
            ref={(ref) => {
              this.chatSend = ref;
            }}
            evtEmitter={this.evtEmitter}
            parentListen={this.parentListen}
            {...sendMsgPropsData}
          />
        </div>
      </div>
    );
  }
}
export default cssModules(Chat, styles, { allowMultiple: true, errorWhenNotFound: false });
