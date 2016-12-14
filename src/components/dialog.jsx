/**
 * Created by dz on 16/9/26.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './dialog.scss';
import { insertComponent, removeComponentByRef } from '../ultils/helper';

@cssModules(styles, { errorWhenNotFound: false })
class DialogWrap extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.any,
    style: PropTypes.object,
  };

  close = () => {
    removeComponentByRef(this.box);
  };

  render() {
    return (
      <div ref={(ref) => { this.box = ref; }}>
        <div styleName="overlay" onClick={this.close} />
        <div styleName="dialog" style={this.props.style}>
          <div styleName="title" className="main-nav-bg-color">
            {this.props.title}
            <input type="button" styleName="close" onClick={this.close} />
          </div>
          <div styleName="content">
            <div styleName="cell">{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default class Dialog extends DialogWrap {
  static show(title, content, style = undefined) {
    insertComponent(<DialogWrap title={title} style={style}>{content}</DialogWrap>);
  }
}
