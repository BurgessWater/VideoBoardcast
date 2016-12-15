/**
 * Created by wenxinfu on 2016/9/27.
 */
import React from 'react';
import cssModules from 'react-css-modules';
import styles from './chat-record.scss';
import ChatMsg from '../chatmsg/chatmsg';
import ChatApi from '../../../../server/api/chat-api';
import Tips from '../../../../../src/components/tips';

class ChatRecord extends React.Component {
  static defaultProps = {
    userId: 0,
    requestMsgTime: 10,
    purview: false,
    evtEmitter: {},
  };
  static propTypes = {
    userId: React.PropTypes.number.isRequired,
    purview: React.PropTypes.bool.isRequired,
    requestMsgTime: React.PropTypes.number.isRequired,
    evtEmitter: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.setIntervalGetMsg();
  }

  state = {
    msgs: this.msgs,
    msgTimeId: undefined,
  };

  componentWillMount() {
    this.props.evtEmitter.on('useRobot', (robotId) => {
      this.robotId = robotId;
    });
    this.props.evtEmitter.on('setPageIndex', () => {
      this.pageIndex = 1;
      this.getMoreMsgHander();
    });
  }
  componentDidMount() {
    this.getMoreMsgHander();
  }
  setMessage = (msgs) => {
    for (const msg of msgs) {
      const m = {
        id: msg.id,
        custId: msg.custid, // 用户id
        custName: msg.custname, // 用户名称
        custGroupIcon: msg.groupimg, // 角色图标
        createTime: msg.createtime, // 聊天时间
        content: this.showFaceImg(decodeURIComponent(msg.content)),
        isSelf: msg.custid === this.props.userId,
        isAudit: msg.isaudit === 1, // 审核
        purview: this.props.purview, // 权限
        atUserId: msg.atuserid,
        atUserName: msg.atusername,
      };
      this.msgsMap.set(m.id, m);
    }
  }

  // 定时刷消息
  setIntervalGetMsg = () => {
    this.intervalAjax();
    clearInterval(this.msgTimeId);
    this.msgTimeId = setInterval(() => {
      this.intervalAjax();
    }, this.props.requestMsgTime * 1000);
  }

  // 查看更多
  getMoreMsgHander = () => {
    ChatApi.getMessages(this.pageIndex).then((data) => {
      if (data.status === 0) {
        const content = JSON.parse(data.chartcon);
        if (content.length !== 0) {
          this.setMessage(content);
          this.msgSort();
          this.pageIndex += 1;
        } else {
          Tips.show('没有更多消息了', document.getElementById('chatRecords'));
        }
      } else {
        Tips.show('查询出错了', document.getElementById('chat-content'));
      }
    });
  }

  // 占位符转换图片
  showFaceImg = (content) => {
    if (content) {
      const msg =
        content.replace(/\[em_([0-9]*)\]/g, ($1) => {
          const num = $1.split('_')[1].split(']')[0];
          return `<img  draggable="false" 
src="${require(`../../assets/face/${num}.ico`)}" data-name="em_${num}" />`;
        });
      return msg;
    }
    return '';
  }

  // 消息记录
  msgs = [];
  pageIndex = 1;
  msgTimeId = undefined;
  maxId = 0;// 最大id
  hasNewMsg = false;
  isScroll = true;
  msgsMap = new Map();
  robotId = 0;// 机器人id
  msgSort = () => {
    this.msgs = Array.from(this.msgsMap);
    this.msgs = this.msgs.sort((a, b) => a[1].id - b[1].id);
    const maxid = this.msgs.length === 0 ? 0 : this.msgs[this.msgs.length - 1][1].id;
    if (maxid !== this.maxId) {
      this.maxId = maxid;
      this.hasNewMsg = true;
    } else {
      this.hasNewMsg = false;
    }
    this.setState({ msgs: this.msgs });
    if (this.isScroll === true && this.hasNewMsg) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  scrollToBottom = () => {
    const div = document.getElementById('chatRecords');
    div.scrollTop = div.scrollHeight + 200;
  }

  parentAudit = (id) => {
    ChatApi.review(id).then(() => {
      const msg = this.msgsMap.get(id);
      msg.isAudit = false;
      this.msgsMap.set(id, msg);
      this.msgSort();
      // this.msgs = Array.from(this.msgsMap);
      // this.setState({ msgs: this.msgs });
    });
  }

  parentAtUser = (userId, userName) => {
    this.props.evtEmitter.emit('atUser', userId, userName);
  };

  addToMsg = (msgInfo) => {
    const msg = {
      id: msgInfo.msg.id,
      custId: msgInfo.msg.custId, // 用户id
      custName: msgInfo.msg.custName, // 用户名称
      custGroupIcon: msgInfo.msg.custGroupIcon, // 角色图标
      createTime: msgInfo.msg.sendTime, // 聊天时间
      content: this.showFaceImg(decodeURIComponent(msgInfo.msg.content)),
      isSelf: true,
      isAudit: false,
      purview: this.props.purview, // 权限
      atUserId: msgInfo.msg.atuserid,
      atUserName: msgInfo.msg.atusername,
    };
    this.msgsMap.set(msg.id, msg);
    this.msgSort();
  }

  // 同级组件
  listenInfo = (msgInfo) => {
    switch (msgInfo.type) {
      case 1:// 发送消息,添加消息
        this.addToMsg(msgInfo);
        break;
      case 2:// 喝彩
        this.addToMsg(msgInfo);
        break;
      case 3:// 清屏
        this.msgsMap.clear();
        this.msgs.length = 0;
        this.setState({ msgs: this.msgs });
        break;
      case 4:// 滚动
        this.isScroll = !this.isScroll;
        break;
      default:
        break;
    }
  }

  intervalAjax = () => {
    // const uId = this.robotId === 0 ? this.props.userId : this.robotId;
    ChatApi.loopGetMessage(this.maxId).then((data) => {
      if (data.status === 0) {
        const content = JSON.parse(data.chartcon);
        this.setMessage(content);
        this.msgSort();
      } else {
        console.log('查询出错');
      }
    });
  };

  render() {
    return (
      <div className="container" styleName="chatrecord" id="chatRecords">
        <div className="row text-center">
          <p styleName="moreMsg" onClick={this.getMoreMsgHander}>
            查看更多消息
          </p>
        </div>
        <div className="row" styleName="record">
          <div className="col-md-12 col-sm-12">
            {
              this.msgs.map(item =>
                <ChatMsg
                  parentAtUser={this.parentAtUser}
                  parentAudit={this.parentAudit} msg={item[1]}
                  key={item[1].id}
                />
              )
            }
          </div>
        </div>

      </div>
    );
  }
}
export default cssModules(ChatRecord, styles, { allowMultiple: true, errorWhenNotFound: false });
