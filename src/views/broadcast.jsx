/**
 * Created by kiny on 16/10/25.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './broadcast.scss';

@cssModules(styles, { errorWhenNotFound: false })
export default class BroadCast extends Component {
  static propTypes = {
    children: PropTypes.string,
  };

  componentDidMount() {
    // this.box
    // TweenLite.to
  }

  render() {
    return (
      <div styleName="broadcast" ref={(ref) => { this.box = ref; }}>
        <div styleName="header" />
        <div styleName="content">{this.props.children}</div>
        <div styleName="tail" />
      </div>
    );
  }
}

