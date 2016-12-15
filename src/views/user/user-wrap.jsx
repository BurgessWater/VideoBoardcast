/**
 * Created by dz on 16/10/17.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './user-wrap.scss';
import { removeComponentByRef } from '../../ultils/helper';

class UserWrap extends Component {
  static propTypes = {
    children: PropTypes.any,
  };

  close = () => {
    removeComponentByRef(this.box);
  };

  render() {
    return (
      <div ref={(ref) => { this.box = ref; }}>
        <div styleName="overlay" onClick={this.close} />
        <div styleName="user-box">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default cssModules(UserWrap, styles, { errorWhenNotFound: false });
