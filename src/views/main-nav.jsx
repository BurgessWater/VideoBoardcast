/**
 * Created by kiny on 16/9/25.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './main-nav.scss';
import Login from './user/login';
import Reg from './user/reg';
import SkinSelector from './skin-selector';
import { addFavorite } from '../ultils/helper';
import { randomID } from '../ultils/random';
import {
  requestLogout,
  requestGuestLoginFromRoom,
  exitRoom,
  successLogin,
  exchangeUser,
} from '../model/action';
// import UserCenter from './user/user-center';
import Overlay from '../components/overlay';
// import UserCenter from '../vendors/wj/view/userCenter/userCenter';
// import AppConfig from '../server/app-config';
import UserCenter from '../views/user/user-center';
@cssModules(styles, { errorWhenNotFound: false })
export default class MainNav extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    userName: PropTypes.string,
    isLogin: PropTypes.bool,
    logopic: PropTypes.string,
    dowloadurl: PropTypes.string,
    openacounturl: PropTypes.string,
    servicetel: PropTypes.string,
    isSingleRoom: PropTypes.bool,
  };

  state = {
    isShowSkin: false,
  };

  onLoginOut = () => {
    this.props.dispatch(requestLogout());
  };

  showLogin = () => {
    // Login.show({
    //   dispatch: this.props.dispatch,
    // });
    Login.show({
      sucLoginCback: (d) => {
        this.props.dispatch(successLogin(d));
        exchangeUser(this.props.dispatch);
      },
    });
  };

  showReg = () => {
    Reg.show({ dispatch: this.props.dispatch });
  };

  showCenter = () => {
    Overlay.show(<UserCenter />);
  };

  toggleSkin = (b) => {
    this.setState({ isShowSkin: b });
  };

  exitRoom = () => {
    this.props.dispatch(exitRoom());
    this.props.dispatch(requestGuestLoginFromRoom());
  };

  renderLogin() {
    return [
      <li key={randomID()} styleName="reg">
        <a href="#" onClick={this.showReg}>注册</a>
      </li>,
      <li key={randomID()} styleName="login">
        <a href="#" onClick={this.showLogin}>登录</a>
      </li>];
  }

  renderLogOut = () => (
    <li key={randomID()} styleName="logout">
      <a href="#" onClick={this.onLoginOut}>退出</a>
    </li>
  );

  renderExitRoom() {
    return this.props.isSingleRoom ? null : (
      <li key={randomID()}><a className="nav-room" href="#" onClick={this.exitRoom}>重选房间</a></li>
    );
  }

  render() {
    const { isShowSkin } = this.state;
    const { logopic, dowloadurl, openacounturl, servicetel, isLogin, userName } = this.props;
    return (
      <div styleName="main-nav" className="main-nav-bg-color title-text-color main-nav-link-color">
        <div href="#" styleName="log">
          <img src={logopic} alt="logo" />
        </div>
        <ul styleName="nav">
          {this.renderExitRoom()}
          <li >
            <a
              className="nav-down" href={dowloadurl} target="_blank"
              rel="noopener noreferrer"
            >软件下载</a>
          </li>
          <li >
            <a
              className="nav-open" href={openacounturl} target="_blank" rel="noopener noreferrer"
            >实盘开户</a>
          </li>
          <li>
            <a
              className="nav-save"
              href={`${SHORTCUT_URL}?name=${encodeURIComponent(document.title)}&url=${window.location.href}`}
              target="_blank" rel="noopener noreferrer"
            >保存到桌面</a>
          </li>
          <li >
            <a className="nav-collect" href="#" onClick={() => addFavorite()}>收藏</a>
          </li>
          <li>
            <a
              className={`nav-skin ${isShowSkin ? 'active' : ''}`} href="#"
              onClick={() => this.toggleSkin(true)}
            >皮肤</a>
            { isShowSkin ? <SkinSelector dismiss={() => this.toggleSkin(false)} /> : null }
          </li>
        </ul>
        <div styleName="info" className="main-nav-info-text-color">
          <div styleName="tel"><span>客服电话: </span><em>{servicetel}</em></div>
          <ul styleName="user">
            <li styleName="hello">你好!&nbsp;&nbsp;{isLogin ?
              <a href="#" onClick={this.showCenter}>{userName}</a> : userName}
            </li>
            { isLogin ? this.renderLogOut() : this.renderLogin() }
          </ul>
        </div>
      </div>
    );
  }
}
