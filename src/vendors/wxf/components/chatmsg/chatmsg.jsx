/**
 * Created by wenxinfu on 2016/9/28.
 */
import React from 'react';
import cssModules from 'react-css-modules';
import styles from './chatmsg.scss';

class ChatMsg extends React.Component {
  static defaultProps = {
    msg: {},
    parentAtUser() {
    },
    parentAudit() {
    },
  }
  static propTypes = {
    msg: React.PropTypes.object.isRequired,
    parentAtUser: React.PropTypes.func.isRequired,
    parentAudit: React.PropTypes.func.isRequired,
  }

  // @用户
  chooseAtUser = (e, userId, userName) => {
    this.props.parentAtUser(userId, userName);
  }

  // 审核
  audit = (e, id) => {
    this.props.parentAudit(id);
  }

  render() {
    const msg = this.props.msg;
    const isAudit = msg.isAudit; // 是否需要审核
    const isPurview = msg.purview; // 是否有权限
    const isSelf = msg.isSelf; // 是否是自己
    const atUser = msg.atUserId ? `<span>@${msg.atUserName}</span>` : '';
    const isShowAudit = isSelf === false && isAudit && isPurview;
    let isShow = false;
    if (isSelf && isAudit === false) { // 如果是自己，并且不需要审核，发消息的时候
      isShow = true;
    } else if (isSelf && isAudit && isPurview) { // 如果是自己并且需要审核跟有权限
      isShow = true;
    } else if (isSelf === false && isAudit && isPurview) { // 如果不是自己并且需要审核并且有权限
      isShow = true;
    } else if (isSelf === false && isAudit === false) { // 如果不是自己并不需要审核
      isShow = true;
    } else {
      isShow = false;
    }
    if (isShow) {
      return (
        isSelf ?
          <div className="row text-right" styleName="selfMsg msgs">
            <div className="col-md-11 col-sm-11 col-lg-11">
              <div styleName="msgTime">
                <span>{msg.createTime} </span> <span> {msg.custName}</span>
              </div>
              <div
                styleName="msgContent"
                dangerouslySetInnerHTML={{ __html: atUser + msg.content }}
              />
            </div>
            <div className="col-md-1 col-sm-1 col-lg-1">
              <img src={msg.custGroupIcon} alt="" />
            </div>
          </div> : <div className="row" styleName="otherMsg msgs">
            <div className="col-md-1 col-sm-1 col-lg-1">
              <img
                onClick={(e) => {
                  this.chooseAtUser(e, msg.custId, msg.custName);
                }}
                src={msg.custGroupIcon} alt=""
              />
            </div>
            <div className="col-md-10 col-sm-10 col-lg-10">
              <div styleName="msgTime">
                <span>{msg.custName} </span>
                <span> {msg.createTime}</span>
              </div>
              <div
                styleName="msgContent"
                dangerouslySetInnerHTML={{ __html: atUser + msg.content }}
              />
            </div>
            <div className="col-md-1 col-sm-1 col-lg-1" styleName="audit">
              { isShowAudit ?
                <span onClick={e => this.audit(e, msg.id)}>审核</span> : null
            }
            </div>
          </div>);
    }
    return (<div />);
  }
}
export default cssModules(ChatMsg, styles, { allowMultiple: true, errorWhenNotFound: false });
