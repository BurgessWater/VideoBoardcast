/**
 * Created by dz on 16/10/24.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './overlay.scss';
import { insertComponent, removeComponentByRef } from '../ultils/helper';

@cssModules(styles, { errorWhenNotFound: false })
class OverlayWrap extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    dismiss: PropTypes.func,
  };

  onOverlayClick = () => {
    this.close();
  };

  close() {
    if (this.props.dismiss) this.props.dismiss();
    removeComponentByRef(this.box);
  }

  render() {
    return (
      <div ref={(ref) => { this.box = ref; }}>
        <div styleName="overlay" onClick={this.onOverlayClick} />
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default class Overlay extends OverlayWrap {
  static show(el) {
    insertComponent(<OverlayWrap>{el}</OverlayWrap>);
  }
}
