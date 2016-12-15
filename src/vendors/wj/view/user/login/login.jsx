/**
 * Created by fighter on 16/9/23.
 * 登录页面
 */

import 'fetch-ie8';
import { Base64 } from 'js-base64';
import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './login.scss';
import UserBox from '../userBox';
import UserApi from '../../../../../server/api/user-api';
import { CheckForm, ParamData, enterKey, Cookie } from '../../../service/tools';
import Tips from '../../../../../components/tips';

class Login extends React.Component {
  static defaultProps = {
    regURL: ParamData.regURL,
  };

  static propTypes = {
    device: PropTypes.string.isRequired,
    regURL: PropTypes.string,
    exitCback: PropTypes.func,
    regCback: PropTypes.func,
    resetCback: PropTypes.func,
    sucLoginCback: PropTypes.func,
  };

  // 绑定回车
  static onKeyDown = (event) => {
    enterKey(event, 'login');
  };


  static loadNamePassFromCookie() {
    const cookieInfo = Cookie.getJSONCookie('userInfo');
    if (cookieInfo) {
      const name = Base64.decode(cookieInfo.name);
      const pwd = Base64.decode(cookieInfo.pwd);
      const isRmb = true;
      return { name, pwd, isRmb };
    }
    return {};
  }

  constructor(props) {
    super(props);
    const { name = '', pwd = '', isRmb = false } = Login.loadNamePassFromCookie();
    let regFrom;
    try {
      regFrom = (ParamData.regFrom || this.props.device).toLowerCase();
    } catch (e) {
      alert('regFrom参数必须！');
    }
    this.state = {
      regFrom,
      isClickedRmb: false, // 是否点击过记住密码（辨别初加载记住密码与手动选择记住密码）
      name,
      pwd,
      isRmb, // 是否记住密码
    };
  }

  componentDidMount() {
    this.checkEmpty();
  }

  // 点击记住密码
  rmbPwd = () => {
    this.setState({
      isRmb: !this.state.isRmb,
      isClickedRmb: true,
    });
  };
  checkEmpty = () => {
    const name = this.name.value;
    const pwd = this.pwd.value;
    this.loginBtn.disabled = !(CheckForm.notEmpty(name) && CheckForm.notEmpty(pwd));
  };

  // 输入框输入
  handleChange = () => {
    if (!this.state.isClickedRmb && this.state.isRmb) {
      this.setState({ isRmb: false });
    }
    this.checkEmpty();
  };

  // 跳转注册
  toRegPages = () => {
    if (this.props.regCback) {
      this.props.regCback();
    } else {
      window.location = REG_URL;
    }
  };

  // 跳转忘记密码
  toResetPages = () => {
    if (this.props.resetCback) {
      this.props.resetCback();
    } else {
      window.location = RESET_URL;
    }
  };

  // 点击登录
  login = () => {
    const name = this.name.value;
    const pwd = this.pwd.value;
    if (!CheckForm.checkUname(name)) {
      Tips.show('账号必须是数字跟字母', this.box);
      return;
    }
    if (!CheckForm.checkUname(pwd) || !CheckForm.lengthLimit(pwd, 4, 12)) {
      Tips.show('密码输入错误', this.box);
      return;
    }

    this.loginBtn.disabled = true;

    const regFrom = this.state.regFrom;

    // 成功回调
    const success = (json) => {
      Tips.show('登录成功!');
      if (regFrom === 'web') {
        // web端
        this.props.sucLoginCback(json.data);
      } else if (regFrom === 'android' || regFrom === 'ios') {
        // 移动端
        window.location = `${this.props.regURL}?token= ${json.data.token}`;
      }

      // 是否储存cookie
      if (this.state.isRmb) {
        const base64Name = Base64.encode(name);
        const base64Pwd = Base64.encode(pwd);
        Cookie.setCookie('userInfo', {
          name: base64Name,
          pwd: base64Pwd,
        }, { maxAge: 60 * 60 * 24 * 7 });
      } else {
        Cookie.deleteCookie('userInfo');
      }
    };

    // 登录请求
    UserApi.login(name, pwd).then(success).catch((e) => {
      this.loginBtn.disabled = false;
      Tips.show(e.message, this.box);
    });
  };

  render() {
    const source = 0; // 0,登录;1,注册;2,第三方登录
    return (
      <UserBox
        regFrom={this.state.regFrom}
        regURL={this.props.regURL}
        exitCback={this.props.exitCback}
        source={source}
      >
        <div
          ref={(ref) => { this.box = ref; }}
          onKeyDown={Login.onKeyDown}
        >
          <div styleName="title"><span>用户登录</span></div>
          <div styleName="item">
            <label htmlFor="name">
              <i styleName="icon-name" />
              <input
                id="name"
                type="text"
                maxLength="50"
                autoFocus="on"
                ref={(ref) => { this.name = ref; }}
                defaultValue={this.state.name}
                onChange={this.handleChange}
                placeholder="账号/手机号码"
              />
            </label>
            <a styleName="links" id="register" onClick={this.toRegPages}>马上注册</a>
          </div>
          <div styleName="item">
            <label htmlFor="pwd">
              <i styleName="icon-pwd" />
              <input
                id="pwd"
                type="password"
                maxLength="12"
                ref={(ref) => { this.pwd = ref; }}
                defaultValue={this.state.pwd}
                onChange={this.handleChange}
                placeholder="请输入4~12位密码"
              />
            </label>
            <a styleName="links" id="reset" onClick={this.toResetPages}>忘记密码</a>
          </div>
          <div styleName="item">
            <div onClick={this.rmbPwd} styleName="checkBox">
              <i styleName={this.state.isRmb ? 'Rmb' : 'noRmb'} />
              <span>记住密码</span>
            </div>
          </div>
          <button
            id="login"
            styleName="btn"
            ref={(ref) => { this.loginBtn = ref; }}
            onClick={this.login}
          >
            登录
          </button>
        </div>
      </UserBox>
    );
  }
}

const LoginWarp = cssModules(Login, styles, { allowMultiple: true, errorWhenNotFound: true });
export default LoginWarp;
