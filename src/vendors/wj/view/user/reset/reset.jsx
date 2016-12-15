/**
 * Created by fighter on 2016/10/8.
 * 重置密码页面
 */

import 'fetch-ie8';
import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './reset.scss';
import UserBox from '../userBox';
import UserApi from '../../../../../server/api/user-api';
import { CheckForm, timer, ParamData, enterKey } from '../../../service/tools';
import Tips from '../../../../../components/tips';


class Reset extends React.Component {
  static defaultProps = {
    sucFunc: ParamData.sucFunc,
    regURL: ParamData.regURL,
  };
  static propTypes = {
    sucFunc: PropTypes.string,
    device: PropTypes.string.isRequired,
    regURL: PropTypes.string,
    exitCback: PropTypes.func,
    sucResetCback: PropTypes.func,

  };

  // 绑定回车
  static onKeyDown(event) {
    enterKey(event, 'register');
  }

  constructor(props) {
    super(props);
    let regFrom;
    try {
      regFrom = (ParamData.regFrom || this.props.device).toLowerCase();
    } catch (e) {
      alert('regFrom参数必须！');
    }
    this.state = {
      regFrom,
      hasGetVerify: false, // 是否已经获取验证码
    };
  }

  componentDidMount() {
    this.verifyBtn.disabled = true;
    this.resetBtn.disabled = true;
  }

  // 点击获取验证码
  getVerify = (e) => {
    const mobile = this.mobile.value;
    if (!CheckForm.isMobile(mobile)) {
      Tips.show('手机号码格式不正确', this.box);
      return;
    }
    this.verifyBtn.disabled = true;
    const eid = e.target.id;
    const success = () => {
      this.setState({ hasGetVerify: true });
      this.verifyBtn.disabled = false;
      // 启动倒计时
      this.time(eid);
      Tips.show('短信验证码已发送，请注意查收！', this.box);
    };

    UserApi.requestRegisterPhoneCode(mobile).then(success).catch((err) => {
      this.setState({ hasGetVerify: false });
      this.verifyBtn.disabled = false;
      Tips.show(err.message, this.box);
    });
  };

  // 倒计时
  time = (eid) => {
    const suc = (onGetVerify) => {
      this.verifyBtn.disabled = !onGetVerify;
    };
    timer(eid, suc);
  };

  // 手机框输入框输入
  handleChangeMobile = () => {
    const mobile = this.mobile.value;
    console.log(99);
    this.verifyBtn.disabled = !CheckForm.notEmpty(mobile);
    this.handleChange();
  };

  // 其他输入框输入
  handleChange = () => {
    const cMobile = CheckForm.notEmpty(this.mobile.value);
    const cVerify = CheckForm.notEmpty(this.verify.value);
    const cPwd = CheckForm.notEmpty(this.pwd.value);
    this.resetBtn.disabled = !(cMobile && cVerify && cPwd);
  };

  // 点击提交相关check
  check(opts) {
    if (!this.state.hasGetVerify) {
      Tips.show('请先获取验证码', this.box);
      return false;
    }
    if (!CheckForm.isMobile(opts.mobile)) {
      Tips.show('手机号码格式不正确', this.box);
      return false;
    }
    if (!CheckForm.isNumber(opts.verify) || !CheckForm.lengthLimit(opts.verify, 4, 4)) {
      Tips.show('验证码必须为4位数字!', this.box);
      return false;
    }
    if (!CheckForm.checkPwd(opts.pwd) || !CheckForm.lengthLimit(opts.pwd, 4, 12)) {
      Tips.show('密码必须为4~12数字、字母', this.box);
      return false;
    }
    return true;
  }

  // 点击提交
  reset = () => {
    const opts = {
      mobile: this.mobile.value,
      verify: this.verify.value,
      pwd: this.pwd.value,
    };

    if (!this.check(opts)) {
      return;
    }

    this.regBtn.disabled = true;

    const success = () => {
      Tips.show('密码修改成功,请重新登录！', this.box);

      const regFrom = this.state.regFrom;
      if (regFrom === 'web' && this.props.sucResetCback) {
        this.props.sucResetCback();
      } else if (regFrom === 'pc') {
        // pc 端登录页面
        const { sucFunc = 'ToLogin' } = { sucFunc: this.props.sucFunc };
        window[sucFunc]();
      } else if (regFrom === 'ios' || regFrom === 'android') {
        // 移动端登录页面
        setTimeout(() => {
          window.location = LOGIN_URL;
        }, 2000);
      }
    };

    UserApi.modifyPasswordFromRetrieve(opts).then(success).catch((e) => {
      this.regBtn.disabled = false;
      Tips.show(e.message, this.box);
    });
  };

  render() {
    const source = 1; // 0,登录;1,注册;2,第三方登录
    return (
      <UserBox
        regFrom={this.state.regFrom}
        regURL={this.props.regURL}
        exitCback={this.props.exitCback}
        source={source}
      >
        <div
          ref={(ref) => { this.box = ref; }}
          onKeyDown={Reset.onKeyDown}
        >
          <div styleName="title"><span>找回密码</span></div>
          <div styleName="item">
            <label htmlFor="mobile">
              <i styleName="icon-mobile" />
              <input
                type="tel"
                id="mobile"
                ref={(ref) => { this.mobile = ref; }}
                autoFocus="on"
                maxLength="11"
                onChange={this.handleChangeMobile}
                placeholder="请输入您的手机号码"
              />
            </label>
          </div>
          <div styleName="item">
            <label htmlFor="verify">
              <i styleName="icon-verify" />
              <input
                styleName="verify"
                autoComplete="off"
                type="text"
                id="verify"
                ref={(ref) => { this.verify = ref; }}
                maxLength="4"
                onChange={this.handleChange}
                placeholder="验证码"
              />
            </label>
            <button
              id="getVerify"
              styleName="verifyBtn"
              ref={(ref) => { this.verifyBtn = ref; }}
              onClick={this.getVerify}
            >
              获取验证码
            </button>
          </div>
          <div styleName="item">
            <label htmlFor="pwd">
              <i styleName="icon-pwd" />
              <input
                type="text"
                autoComplete="off"
                maxLength="12"
                id="pwd"
                ref={(ref) => { this.pwd = ref; }}
                onChange={this.handleChange}
                onFocus={(e) => { const ele = e.target; ele.type = 'password'; }}
                placeholder="请输入4~12位密码"
              />
            </label>
          </div>
          <button
            id="reset"
            styleName="btn"
            ref={(ref) => { this.resetBtn = ref; }}
            onClick={this.reset}
          >提交
          </button>
        </div>
      </UserBox>
    );
  }
}
export default cssModules(Reset, styles, { allowMultiple: true, errorWhenNotFound: true });
