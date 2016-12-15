/**
 * Created by wenxinfu on 2016/9/27.
 */
import FileUpload from 'simple-ajax-uploader';
import React from 'react';
import cssModules from 'react-css-modules';
import styles from './sendmsg.scss';
import Face from '../face/face';
import FontSet from '../fontset/fontset';
import Cheer from '../cheer/cheer';
import ChatApi from '../../../../server/api/chat-api';
import Alert from '../../../../../src/components/alert';
import { requestRadmonRobot } from '../../../../model/action';
import Tips from '../../../../../src/components/tips';

class SendMsg extends React.Component {
  static defaultProps = {
    bodyClick: true, // 点击页面其他地方
    userId: 0,
    userName: '',
    groupId: 0, // 角色id
    groupName: '', // 角色名称
    groupImg: '', // 角色图标
    qq: [],
    robotList: [],
    purview: false,
    robotPurview: false,
    evtEmitter: {},
    chatSet: true,
    parentListen() {
    },
  };
  static propTypes = {
    bodyClick: React.PropTypes.bool.isRequired,
    userId: React.PropTypes.number.isRequired,
    userName: React.PropTypes.string.isRequired,
    groupId: React.PropTypes.number.isRequired,
    groupName: React.PropTypes.string.isRequired,
    groupImg: React.PropTypes.string.isRequired,
    purview: React.PropTypes.bool.isRequired,
    robotPurview: React.PropTypes.bool.isRequired,
    qq: React.PropTypes.array,
    robotList: React.PropTypes.array,
    evtEmitter: React.PropTypes.object.isRequired,
    parentListen: React.PropTypes.func.isRequired,
    chatSet: React.PropTypes.bool,
    dispatch: React.PropTypes.func,
    // isRegisterUser: React.PropTypes.bool,
  };

  state = {
    // 表情是否显示
    faceIsShow: false,
    // 字体是否显示
    fontIsShow: false,
    // 喝彩是否显示
    cheerIsShow: false,
    // 页面其他地方点击
    bodyClick: this.props.bodyClick,
    // 字体设置
    fontSetting: this.fontSetting,
    robotList: this.props.robotList,
    atUserList: this.atUserList,
    robotPurview: this.props.robotPurview,
    chatSet: this.props.chatSet,
  };

  componentWillMount() {
    this.props.evtEmitter.on('atUser', (userId, userName) => {
      if (this.props.userId === userId) {
        Tips.show('不能@自己', document.getElementById('chat-content'));
        return;
      }
      if (userId || userId === 0) {
        this.addAtUser({ atUserId: userId, atUserName: userName });
      }
    });

    this.props.evtEmitter.on('otherClick', () => {
      if (this.cheerIsShow && this.bodyClick) {
        this.cheerIsShow = !this.cheerIsShow;
      }
      if (this.faceIsShow && this.bodyClick) {
        this.faceIsShow = !this.faceIsShow;
      }
      if (this.fontIsShow && this.bodyClick) {
        this.fontIsShow = !this.fontIsShow;
      }
      this.setState({
        fontIsShow: this.fontIsShow,
        faceIsShow: this.faceIsShow,
        cheerIsShow: this.cheerIsShow,
      });
    });
  }

  componentDidMount() {
    const that = this;
    if (this.fileUpload) {
      this.fileUpload.destroy();
    }
    this.fileUpload = new FileUpload.SimpleUpload({
      button: 'imgUpload',
      url: UPLOAD_IMG_URL,
      name: 'uploadFile',
      responseType: 'json',
      allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
      maxSize: 1024, //
      onComplete(filename, response) {
        if (!response) {
          Tips.show(`${filename}上传失败`, document.getElementById('chat-content'));
        } else if (response.status === 'success') {
          that.imgUpLoad(response.src);
        }
      },
    });
  }

  // 设置滚动
  setScorll = () => {
    this.props.parentListen({ type: this.msgType.scroll, msg: {} });
  };

  // 设置字体
  setFont = (e, isElementClick) => {
    this.fontIsShow = !this.fontIsShow;
    this.setState({
      fontIsShow: this.fontIsShow,
      faceIsShow: this.faceIsShow = false,
      cheerIsShow: this.cheerIsShow = false,
    });
    this.otherBodyClick(isElementClick);
  };

  // 设置表情
  setFace = (e, isElementClick) => {
    this.faceIsShow = !this.faceIsShow;
    this.setState({
      faceIsShow: this.faceIsShow,
      fontIsShow: this.fontIsShow = false,
      cheerIsShow: this.cheerIsShow = false,
    });
    this.otherBodyClick(isElementClick);
  };

  // 喝彩
  setCheer = (e, isElementClick) => {
    this.cheerIsShow = !this.cheerIsShow;
    this.setState({
      cheerIsShow: this.cheerIsShow,
      faceIsShow: this.faceIsShow = false,
      fontIsShow: this.fontIsShow = false,
    });
    this.otherBodyClick(isElementClick);
  };

  // 父组件表情事件
  parentFace = (faceTip) => {
    const icon = faceTip.split('_')[1];
    const img = document.createElement('img');
    img.setAttribute('src', require(`../../assets/face/${icon}.ico`));
    img.setAttribute('class', 'message-image');
    img.setAttribute('data-name', faceTip);
    this.msgInput.appendChild(img);
    this.setFace();
  };

  // 点击页面其他地方
  otherBodyClick = (isElementClick) => {
    if (isElementClick) {
      this.bodyClick = false;
    }
    setTimeout(() => {
      this.bodyClick = true;
    }, 500);
  };

  // 父组件喝彩
  parentCheer = (cheerType) => {
    this.sendMsgs(() => {
      if (this.props.userId !== 0) {
        this.cheerImgPath.forEach((item) => {
          if (item.type === cheerType) {
            this.sendMsgAjax(encodeURIComponent(`<img src="${item.src}">`));
            return;
          }
        });
      }
    });
  };

  // 添加到@用户列表上
  addAtUser = (user) => {
    if (user.atUserId !== 0) {
      this.atUserMap.set(user.atUserId, user);
    } else {
      this.atUserMap.clear();
    }
    this.sendSetting.atUserId = user.atUserId;
    this.sendSetting.atUserName = user.atUserName;
    this.atUserList = Array.from(this.atUserMap);
    this.setState({
      atUserList: this.atUserList,
    });
    setTimeout(() => {
      for (const o of this.atUser.options) {
        const v = parseInt(o.value.split(':')[0], 10);
        if (v === user.atUserId) {
          o.selected = true;
          break;
        }
      }
    }, 200);
  };

  // @某人
  atOthers = (e) => {
    const value = e.target.value;
    if (value !== '0') {
      const v = value.split(':');
      this.sendSetting.atUserId = v[0];
      this.sendSetting.atUserName = v[1];
    } else {
      this.sendSetting.atUserId = 0;
      this.sendSetting.atUserName = '';
    }
  };

  // 图片上传
  imgUpLoad = (url) => {
    const img = document.createElement('img');
    img.setAttribute('src', url);
    img.setAttribute('class', 'input-image');
    this.msgInput.appendChild(img);
  };

  // 清屏
  clearMsg = () => {
    this.props.parentListen({ type: this.msgType.clear, msg: '' });
  };

  // 父组设置字体
  parentFont = (fontData) => {
    switch (fontData.type) {
      case 1:
        this.fontSetting.fontFamily = fontData.value;
        break;
      case 2:
        this.fontSetting.fontSize = fontData.value;
        break;
      case 3:
        this.fontSetting.fontWeight = fontData.value;
        break;
      case 4:
        this.fontSetting.fontStyle = fontData.value;
        break;
      default:
        break;
    }
    this.setState({ fontSetting: this.fontSetting });
  }

  // 选中机器人
  chooseRobot = (e) => {
    const value = e.target.value;
    const v = value.split('*');

    if (value !== '0') {
      this.sendSetting.robotId = v[0];
      this.sendSetting.robotGroupId = v[1];
      this.sendSetting.robotIcon = v[2];
      this.sendSetting.robotNickName = v[3];
      this.sendSetting.robotGroupName = v[4];
    } else {
      this.sendSetting.robotId = 0;
      this.sendSetting.robotGroupId = 0;
      this.sendSetting.robotIcon = '';
      this.sendSetting.robotNickName = '';
      this.sendSetting.robotGroupName = '';
    }
    this.props.evtEmitter.emit('useRobot', this.sendSetting.robotId);
  };

  // 换一批
  changeNew = () => {
    this.props.dispatch(requestRadmonRobot());
  };

  replaceNode = (childNodes, sMsg) => {
    for (let i = 0; i < childNodes.length; i += 1) {
      const node = childNodes[i];
      if (node.removeAttribute) {
        node.removeAttribute('data-reactid');
        if (node.nodeName !== 'IMG') {
          node.removeAttribute('class');
          node.removeAttribute('style');
        }
      }
      if (node.nodeName === 'IMG') {
        const name = node.getAttribute('data-name');
        if (name != null) {
          const text = document.createTextNode(`[${name}]`);
          sMsg.replaceChild(text, node);
        }
      } else {
        const nodeChild = node.childNodes;
        if (nodeChild.length !== 0) {
          this.replaceNode(nodeChild, node);
        }
      }
    }
  };
  // 发送消息
  sendMsgs = (fun) => {
    if (this.props.chatSet) {
      if (parseInt(this.sendSetting.robotId, 10) !== 0) {
        const name = (<b style={{ color: 'red', fontSize: '16px' }}>
          {this.sendSetting.robotGroupName} {this.sendSetting.robotNickName}
        </b>);
        Alert.show(<p>你当前在以 {name} 的身份发言</p>, '最新通告', () => {
          fun();
        });
      } else {
        fun();
      }
      if(this.cheerIsShow){
        this.cheerIsShow = !this.cheerIsShow;
        this.setState({ cheerIsShow: this.cheerIsShow });
      }
    } else {
      Tips.show('当下不允许发消息', document.getElementById('chat-content'));
    }
  }

  send = () => {
    const msg = this.msgInput;
    const msgText = msg.innerText.replace(/(^\s*)|(\s*$)/g, '');
    const msgHtml = msg.innerHTML.replace(/(&nbsp;)/g, '').replace(/(^\s*)|(\s*$)/g, '');
    let hasMsg = true;
    if (msgText !== '') {
      hasMsg = true;
    } else if (msgHtml !== '') {
      hasMsg = true;
    } else {
      hasMsg = false;
    }
    if (msgText.length > 300) {
      Tips.show('请不要输入太长的字符', document.getElementById('chat-content'));
      return;
    }

    if (hasMsg) {
      const sMsg = this.sendMsgHtml;
      const warpDiv = document.createElement('div');
      this.sendMsgHtml.appendChild(warpDiv);
      this.sendMsgHtml.childNodes[0].innerHTML = this.msgInput.innerHTML;
      const childNodes = sMsg.childNodes;
      this.replaceNode(childNodes, this.sendMsgHtml);
      this.sendMsgHtml.childNodes[0].setAttribute('style', this.msgInput.style.cssText);
      const messageHtml = this.sendMsgHtml.innerHTML;
      const sendMessage = encodeURIComponent(messageHtml);
      this.sendMsgAjax(sendMessage);
      this.msgInput.innerHTML = '';
    } else {
      Tips.show('请输入消息内容', document.getElementById('chat-content'));
    }
  };

  sendMsgAjax = (sendMessage) => {
    const isRobot = this.sendSetting.robotId === 0;// 不是机器人
    const formData = {
      uid: isRobot ? this.props.userId : this.sendSetting.robotId,
      uname: isRobot ? this.props.userName : this.sendSetting.robotNickName,
      groupid: isRobot ? this.props.groupId : this.sendSetting.robotGroupId,
      groupname: isRobot ? this.props.groupName : this.sendSetting.robotGroupName,
      groupimg: isRobot ? this.props.groupImg : this.sendSetting.robotIcon,
      atuserid: this.sendSetting.atUserId,
      atusername: this.sendSetting.atUserName,
      chatcontext: sendMessage,
      isaudit: this.props.purview ? 0 : 1, // 这里判断是否需要审核,1需要，0不需要
    };
    ChatApi.postMessage(formData).then((data) => {
      if (data.status === 0) {
        this.props.parentListen({
          type: this.msgType.msg,
          msg: {
            id: data.id,
            custId: formData.uid,
            sendTime: data.sendtime,
            custName: formData.uname,
            custGroupIcon: formData.groupimg,
            content: sendMessage,
            atuserid: this.sendSetting.atUserId,
            atusername: this.sendSetting.atUserName,
          },
        });
      } else {
        Tips.show('发送消息出错!,请重试', document.getElementById('chat-content'));
      }
    });
  };

  msgInputFocus = () => {
    this.fontSetting.borderColor = '#4f9bff';
    this.setState({ fontSetting: this.fontSetting });
  };
  msgInputBlur = () => {
    this.fontSetting.borderColor = '#999';
    this.setState({ fontSetting: this.fontSetting });
  };
  /*
   字体设置
   */
  fontSetting = {
    fontFamily: 'sans-serif',
    fontSize: '14px',
    fontWeight: '400',
    fontStyle: 'normal',
    marginLeft: '0',
    lineHeight: '1.5em',
    borderWidth: '1px',
    borderColor: 'none',
  };

  atUserMap = new Map();
  atUserList = [];
  msgType = {
    msg: 1, // 发消息
    cheer: 2, // 喝彩
    clear: 3, // 清屏
    scroll: 4, // 滚动
  };
  sendSetting = {
    atUserId: 0,
    atUserName: '',
    robotId: 0,
    robotGroupId: 0,
    robotIcon: '',
    robotNickName: '',
    robotGroupName: '',
  };

  fileUpload = undefined;
  cheerImgPath = [
    { type: 1, src: require('../../assets/icon/dyg.gif') },
    { type: 2, src: require('../../assets/icon/zyg.gif') },
    { type: 3, src: require('../../assets/icon/zs.gif') },
    { type: 4, src: require('../../assets/icon/xh.gif') },
  ];

  render() {
    return (
      <div styleName="sendmsg" className="container">
        {
          this.state.faceIsShow ?
            <div className="faces"><Face parentFace={this.parentFace} /></div> : null
        }
        {
          this.state.fontIsShow ?
            <div className="fontSet"><FontSet parentFont={this.parentFont} /></div> : null }
        {
          this.state.cheerIsShow ?
            <div className="cheerSet"><Cheer parentCheer={this.parentCheer} /></div> : null
        }
        <div className="row row-1" styleName="qq-counsellor">
          <div className="col-md-12 row-10">
            <ul className="list-inline" styleName="msg-list">
              {
                this.props.qq.map((item, n) =>
                  <li key={n}><a
                    href={`tencent://message/?uin=${item.name}&amp;Site=qq&amp;Menu=yes`}
                  ><img
                    src={require('../../assets/icon/icon-qq.png')} alt=""
                  />{item.value}</a></li>)
              }
            </ul>
          </div>
        </div>
        <div className="row row-1" styleName="msg-setting">
          <div className="col-md-12 ">
            <ul className="list-inline" styleName="msg-list">
              <li styleName="font">
                <span
                  onClick={(e) => {
                    this.setFont(e, true);
                  }}
                >字体
                </span>
              </li>
              <li styleName="face"><span
                onClick={(e) => {
                  this.setFace(e, true);
                }}
              >表情 </span>
              </li>
              <li styleName="image">
                <span id="imgUpload">图片
                </span>
              </li>
              <li styleName="cheer"><span
                onClick={(e) => {
                  this.setCheer(e, true);
                }}
              >喝彩
              </span>
              </li>
              <li styleName="clear"><span
                onClick={this.clearMsg}
              >清屏
              </span>
              </li>
              <li styleName="arrow">
                <span
                  onClick={this.setScorll}
                >滚动
                </span>
              </li>
              <li>对 <select
                ref={(ref) => {
                  this.atUser = ref;
                }}
                onChange={(e) => {
                  this.atOthers(e);
                }}
                styleName="select-box send-target"
              >
                <option value="0">所有人</option>
                {
                  this.atUserList.map(item =>
                    <option
                      key={item[1].atUserId}
                      value={`${item[1].atUserId}:${item[1].atUserName}`}
                    >{item[1].atUserName}</option>)
                }
              </select> 说
              </li>
            </ul>
          </div>
        </div>
        <div className="row row-6" styleName="textMsg">
          <div className="col-md-12 row-10">
            <div
              className="input-box"
              style={Object.assign({}, this.fontSetting)}
              ref={(ref) => {
                this.msgInput = ref;
              }}
              styleName="msgInput"
              contentEditable={this.props.chatSet ? 'true' : 'false'}
              onFocus={this.msgInputFocus}
              onBlur={this.msgInputBlur}
            />
            {this.props.chatSet ? null : <div styleName="input-mask">当前不允许发消息</div> }
          </div>
        </div>
        <div className="row row-2">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-8 col-sm-8">
                {
                  this.props.robotPurview ? <div styleName="robot-list">
                    选择机器人：
                    <select
                      onChange={(e) => {
                        this.chooseRobot(e);
                      }}
                      styleName="select-box robot-box"
                    >
                      <option value="0">选择机器人</option>
                      {
                        this.props.robotList.map(item =>
                          <option
                            key={item.robotid}
                            value={
                              `${item.robotid}*${item.groupid}*${item.groupimg}*${item.nikename}*${item.groupname}`}
                          >{`${item.groupname}:${item.nikename}`}</option>
                        )
                      }</select>
                    <span onClick={this.changeNew} style={{ cursor: 'pointer' }}> 换一批</span>
                  </div> : null
                }

              </div>
              <div className="col-md-4 col-sm-4 text-right">
                <button
                  onClick={() => {
                    this.sendMsgs(this.send);
                  }}
                  styleName="send-message"
                  className="btn"
                >发送
                </button>

              </div>
              <div
                style={{ display: 'none' }}
                ref={(ref) => {
                  this.sendMsgHtml = ref;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default cssModules(SendMsg, styles, { allowMultiple: true, errorWhenNotFound: false });
