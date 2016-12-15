/**
 * Created by dz on 16/10/15.
 */

import React, { Component, PropTypes } from 'react';
import WReg from '../../vendors/wj/view/user/register/register';
import { insertComponent } from '../../ultils/helper';
import { Cookie } from '../../vendors/wj/service/tools';
import { requestAuthority, successLogin } from '../../model/action';

import UserWrap from './user-wrap';

export default class Reg extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  static show(props = {}) {
    insertComponent(<Reg {...props} />);
  }

  close = () => {
    this.warp.close();
  };

  render() {
    const { dispatch } = this.props;
    return (
      <UserWrap {...this.props} ref={(ref) => { this.warp = ref; }}>
        <WReg
          exitCback={this.close} device="web"
          sucLoginCback={(data) => {
            Cookie.setCookie('token', data.token, { maxAge: 60 * 60 * 24 * 7 });
            dispatch(successLogin(data));
            dispatch(requestAuthority());
            this.close();
          }}
          regCback={() => { this.close(); }}
          resetCback={() => { this.close(); }}
        />
      </UserWrap>);
  }

}
