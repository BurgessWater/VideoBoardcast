/**
 * Created by dell on 2016/10/11.
 */

import React, { PropTypes } from 'react';
import 'fetch-ie8';
import cssModules from 'react-css-modules';
import Login from '../../views/user/login';
import Reg from '../../views/user/reg';
import styles from './houses.scss';
import Alert from '../../components/alert';
import { requestLogout, requestRoomInfo, successLogin } from '../../model/action';
import { randomID } from '../../ultils/random';

class Houses extends React.Component {

  static defaultProps = {
    welcome: '点金财经',
  };

  static propTypes = {
    rooms: PropTypes.array.isRequired,
    welcome: PropTypes.string.isRequired,
    userName: PropTypes.string,
    isLogin: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  componentWillMount() {
    // this.judge();
  }

  componentDidMount() {
    // setInterval(this.dataInfo, this.props.updatatime);
  }

  // 获取地址栏参数
  // UserEearch = () => {
  //   const str = location.href;
  //   const num = str.indexOf('?');
  //   const strs = str.substr(num + 1);
  //   const arr = strs.substr('&');
  //   for (let i = 0; i < arr.length; i++) {
  //     const nums = arr[i].indexOf('=');
  //     if (nums > 0) {
  //       const name = arr[i].substring(0, nums);
  //       const value = arr[i].substr(nums + 1);
  //       this[name] = value;
  //     }
  //   }
  // }

  // 判断PC或web
  // judge = () => {
  // const req = new this.UserEearch();
  // // const reqFrom = req.regFrom || 'WEB';
  // const URLMobile = req.uname;
  // const URLPassword = req.pwd;
  // const URLToken = req.token;
  // if (URLToken) {
  //   this.token = URLToken;
  // } else if (URLMobile && URLPassword) {
  //   fetch('http://192.168.0.11/BIService/BiServlet', {
  //     method: 'post',
  //     body: JSON.stringify({
  //       cmd: {
  //         uname: URLMobile,
  //         pwd: URLPassword,
  //       },
  //     }),
  //   }).then((res) => res.json()).then((json) => {
  //     this.setState({
  //       playState: true,
  //       token: json.data.token,
  //     });
  //   });
  // } else {
  //   this.visitorLogin();
  // }
  // }

  // 注册
  onRegClick = () => {
    Reg.show({
      dispatch: this.props.dispatch,
    });
  };

  // 登录
  onLoginClick = () => {
    Login.show({ sucLoginCback: d => this.props.dispatch(successLogin(d)) });
  };

  // 退出
  onLogout = () => {
    this.props.dispatch(requestLogout());
  };

  // 去直播间
  goPlay = (h) => {
    if (h.isaudit === 0) {
      this.props.dispatch(requestRoomInfo(parseInt(h.roomid, 10)));
    } else {
      Alert.show('抱歉，您没有访问该房间的权限！');
    }
  };

  renderLogin() {
    let arr = [];
    if (this.props.isLogin) {
      arr = [<li key={randomID()} styleName="cursor" onClick={this.onLogout}>退出</li>];
    } else {
      arr = [<li key={randomID()} styleName="cursor" onClick={this.onRegClick}>注册</li>,
        <li key={randomID()} styleName="cursor" onClick={this.onLoginClick}>登录</li>];
    }
    return (
      <ul>
        <li>您好！{this.props.userName}</li>
        {arr}
      </ul>
    );
  }

  renderRoom(idx, h) {
    return (<li key={h.roomid} styleName={`houseOne-${idx}`}>
      {this.props.rooms.length > 1 ? <div styleName="listM" /> : null}
      <div styleName={`logo setBcolor-${idx}`}>
        <b styleName={`logoimg-${idx}`} />
        <p styleName="playName">{h.roomname}</p>
      </div>
      <div className="states" styleName="states">
        {h.status === '1' ? '正在直播...' : '暂无直播'}</div>
      <div styleName="playBox">
        <div styleName={`play setBcolor-${idx}`} onClick={() => this.goPlay(h)}>
          进入直播间
        </div>
      </div>
      <div className="houseBottom" styleName="houseBottom"> {h.roomremark}</div>
    </li>);
  }

  render() {
    return (
      <div styleName="houses">
        <div styleName="houwidth">
          <div styleName="header">
            {this.renderLogin()}
          </div>
          <div styleName="content">
            <div styleName="welcome">欢迎光临
              <i styleName="playName">{this.props.welcome}</i>，请选择直播间
            </div>
            <div styleName="houseList">
              <ul>
                { this.props.rooms.map((h, idx) => this.renderRoom(idx, h)) }
              </ul>
            </div>
            <div styleName="conBottom">直播间嘉宾观点仅供参考，投资有风险，入市需谨慎</div>
          </div>
        </div>
      </div>
    );
  }
}
export default cssModules(Houses, styles, { allowMultiple: true, errorWhenNotFound: false });
