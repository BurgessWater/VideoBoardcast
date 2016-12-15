/**
 * Created by dz on 16/10/15.
 */

import React, { Component, PropTypes } from 'react';
import WLogin from '../../vendors/wj/view/user/login/login';
import { insertComponent } from '../../ultils/helper';
import UserWrap from './user-wrap';
import Reg from './reg';
import Reset from './reset';

export default class Login extends Component {
  static propTypes = {
    sucLoginCback: PropTypes.func.isRequired,
  };

  static show(props) {
    insertComponent(<Login {...props} />);
  }

  close = () => {
    this.warp.close();
  };

  render() {
    return (
      <UserWrap {...this.props} ref={(ref) => { this.warp = ref; }}>
        <WLogin
          exitCback={this.close} device="web"
          sucLoginCback={(data) => {
            this.close();
            this.props.sucLoginCback(data);
          }}
          regCback={() => {
            this.close();
            Reg.show();
          }}
          resetCback={() => {
            this.close();
            Reset.show();
          }}
        />
      </UserWrap>);
  }

}
