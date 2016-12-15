/**
 * Created by fighter on 2016/10/9.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './userCenter.scss';
import Tips from '../../../../components/tips';

import UserApi from '../../../../server/api/user-api';
import { CheckForm, ParamData } from '../../service/tools';

class UserCenter extends React.Component {
  static defaultProps = {
    sucFunc: ParamData.sucFunc,
    token: ParamData.token || '0',
    regFrom: ParamData.regFrom,
    avatar: './images/photos/1.png',

  };

  static propTypes = {
    sucFunc: PropTypes.string,
    token: PropTypes.string.isRequired,
    regFrom: PropTypes.string,
    avatar: PropTypes.string.isRequired,
    sucCAvatar: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showABtn: true, // for avatar
      showNBtn: false, // for nickName
      showPBtn: false, // for pwd
      avatar: '',
      showAllAvatar: false,
      avatarID: 1,
      userName: '',
      cid: '',
      groupId: '',
      nickname: '',
    };
  }

  // 组件插入前
  componentDidMount() {
    const success = (json) => {
      if (json.status === 0) {
        console.log(json);
        const { uimg = '', uname, cid, groupid, nickname } = json.data;
        this.setState({
          avatar: uimg,
          userName: uname,
          cid,
          groupId: groupid,
          nickName: nickname,
        });
      } else {
        Tips.show(json.msg, this.main);
      }
    };
    UserApi.getUserInfo(this.props.token).then(success);
  }

  // 显示头像栏
  toShowAllAvatar = () => {
    this.setState({
      showAllAvatar: true,
      avatarID: 1,
    });
  };

  // 隐藏头像栏
  toHideAllAvatar = () => {
    this.setState({ showAllAvatar: false });
  };

  // 选择单个头像
  toChooseOne = (aid) => {
    this.setState({ avatarID: aid });
  };

  // 修改头像
  changeAvatar = () => {
    if (!this.state.showABtn) {
      return;
    }
    this.setState({ showABtn: false });
    const avatarData = `${SINGLE_PAGE_DEP}/${this.choose.getAttribute('src')}`;
    if (!CheckForm.notEmpty(avatarData)) {
      Tips.show('请选择头像！', this.main);
      return;
    }
    const reqData = {
      userName: this.state.userName,
      token: this.props.token,
      avatar: avatarData,
    };
    const success = (json) => {
      console.log(json);
      this.setState({
        avatar: avatarData,
        showAllAvatar: false,
        showABtn: true,
      });
      Tips.show('头像修改成功！', this.main);
    };
    UserApi.modify(reqData).then(success).catch((e) => {
      this.setState({ showABtn: true });
      Tips.show(e.message, this.main);
    });
  };

  // 输入昵称
  handleCName = (event) => {
    const nickName = event.target.value;
    this.setState({ nickName, showNBtn: CheckForm.notEmpty(nickName) });
  };

  // 修改昵称
  changeNickName = () => {
    if (!this.state.showNBtn) {
      return;
    }
    this.setState({ showNBtn: false });
    const nickName = this.nickName.value;
    if (!CheckForm.notEmpty(nickName)) {
      Tips.show('请输入昵称', this.main);
      return;
    }
    if (!CheckForm.lengthLimit(nickName, 4, 20)) {
      Tips.show(`昵称限4~20个字符!\n（1个汉字占2个字符）`, this.main);
      return;
    }
    if (CheckForm.hasBlankSpace(nickName)) {
      Tips.show('昵称不能包含空格！', this.main);
      return;
    }

    const reqData = {
      userName: this.state.userName,
      token: this.props.token,
      nickName,
    };
    const success = () => {
      const regFrom = this.props.regFrom;
      this.setState({ showNBtn: true });
      if (regFrom === 'web' && this.props.sucCAvatar) {
        Tips.show('昵称修改成功！', this.main);
        this.props.sucCAvatar();
      } else if (regFrom === 'pc') {
        Tips.show('昵称修改成功,重新登录后生效！', this.main);
        const { sucFunc = 'PersonCenterRsp' } = { sucFunc: this.props.sucFunc };
        window[sucFunc](reqData.nickName); // 调用pc端的方法，传昵称过去
      }
    };
    UserApi.modify(reqData).then(success).catch((e) => {
      this.setState({ showNBtn: true });
      Tips.show(e.message, this.main);
    });
  };

  // 输入密码
  handleCPwd = () => {
    const [empOldPwd, empNewPwd, empConfirmPwd] =
      [this.oldPwd.value, this.newPwd.value, this.confirmPwd.value].map(
        item => CheckForm.notEmpty(item)
      );
    this.setState({ showPBtn: empOldPwd && empNewPwd && empConfirmPwd });
  };
  // 修改密码
  changePwd = () => {
    if (!this.state.showPBtn) {
      return;
    }
    this.setState({ showPBtn: false });

    const [oldPwd = '', newPwd = '', confirmPwd = ''] =
      [this.oldPwd.value, this.newPwd.value, this.confirmPwd.value];

    if (!CheckForm.lengthLimit(oldPwd, 4, 12) || !CheckForm.checkPwd(oldPwd)) {
      Tips.show('原密码输入错误！', this.main);
      return;
    }
    if (!CheckForm.lengthLimit(newPwd, 4, 12)) {
      Tips.show('请设置4~12位新密码！', this.main);
      return;
    }
    if (!CheckForm.checkPwd(oldPwd)) {
      Tips.show('密码限数字和字母组成！', this.main);
      return;
    }
    if (newPwd === oldPwd) {
      Tips.show('新密码不能与原密码相同！', this.main);
      return;
    }
    if (confirmPwd !== newPwd) {
      Tips.show('确认密码与新密码输入不一致！', this.main);
      return;
    }
    const reqData = { oldPwd, newPwd, token: this.props.token };
    const success = (json) => {
      console.log(json);
      this.oldPwd.value = '';
      this.newPwd.value = '';
      this.confirmPwd.value = '';
      this.setState({ showPBtn: true });
      Tips.show('密码修改成功!', this.main);
    };
    UserApi.modifyPassword(reqData).then(success).catch((e) => {
      this.setState({ showPBtn: true });
      Tips.show(e.message, this.main);
    });
  };

  render() {
    // 头像层
    const allAvatar = [];
    for (let i = 1; i <= 20; i += 1) {
      allAvatar.push(
        <div styleName="i-item" key={i}>
          <img
            alt={`avatar${i}`}
            src={require(`./images/photos/${i}.png`)}
            styleName={this.state.avatarID === i ? 'choose' : ''}
            ref={
              this.state.avatarID === i ? (ref) => { this.choose = ref; } : null
            }
            onClick={() => this.toChooseOne(i)}
          />
        </div>);
    }
    const avatarLay =
      (<div styleName="i-layer">
        <div styleName="i-header">
          <i onClick={this.toHideAllAvatar} />
        </div>
        <div styleName="i-content">
          <div styleName="i-box">
            {allAvatar}
          </div>
          <div styleName="i-submit">
            <a
              styleName="btn on"
              onClick={this.changeAvatar}
            >确定</a>
          </div>
        </div>
      </div>);

    return (
      <div styleName="main" ref={(ref) => { this.main = ref; }}>
        <div styleName="header">
          <img
            src={!this.state.avatar ? require(this.props.avatar) : this.state.avatar}
            alt="avatar"
          />
          <span onClick={this.toShowAllAvatar}>修改头像</span>
          {this.state.showAllAvatar ? avatarLay : ''}
        </div>
        <div styleName="content">
          <div styleName="item-text">
            <span>账号：</span><span>{this.state.userName}</span>
          </div>
          <div styleName="item-text">
            <span>ID：</span><span>{this.state.cid}</span>
          </div>
          <div styleName="item-text">
            <span>等级：</span><span>{this.state.groupId}</span>
          </div>
          <div styleName="item">
            <label htmlFor="nickName">
              <span>昵称：</span>
              <input
                autoComplete="off"
                id="nickName"
                type="text"
                ref={(ref) => {
                  this.nickName = ref;
                }}
                value={this.state.nickName}
                onChange={this.handleCName}
                maxLength="20"
              />
            </label>
            <a
              styleName={`btn ${this.state.showNBtn ? 'on' : 'off'}`}
              onClick={this.changeNickName}
            >提交</a>
          </div>
          <div styleName="title">
            <p>修改密码：</p>
          </div>
          <div styleName="item">
            <label htmlFor="oldPwd">
              <span>旧密码：</span>
              <input
                autoComplete="off"
                id="oldPwd"
                type="password"
                maxLength="20"
                onChange={this.handleCPwd}
                ref={(ref) => { this.oldPwd = ref; }}
              />
            </label>
          </div>
          <div styleName="item">
            <label htmlFor="newPwd">
              <span>新密码：</span>
              <input
                autoComplete="off"
                id="newPwd"
                type="password"
                maxLength="20"
                onChange={this.handleCPwd}
                ref={(ref) => { this.newPwd = ref; }}
              />
            </label>
          </div>
          <div styleName="item">
            <label htmlFor="confirmPwd">
              <span>确认密码：</span>
              <input
                autoComplete="off"
                id="confirmPwd"
                type="password"
                maxLength="20"
                onChange={this.handleCPwd}
                ref={(ref) => { this.confirmPwd = ref; }}
              />
            </label>
          </div>
          <div styleName="sub">
            <a
              styleName={`btn ${this.state.showPBtn ? 'on' : 'off'}`}
              onClick={this.changePwd}
            >提交修改</a>
          </div>
        </div>
      </div>
    );
  }
}

export default cssModules(UserCenter, styles, { allowMultiple: true, errorWhenNotFound: true });
