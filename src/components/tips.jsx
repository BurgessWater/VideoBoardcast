/**
 * Created by dz on 16/10/18.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './tips.scss';
import { insertComponent, removeComponentByRef } from '../ultils/helper';

@cssModules(styles, { errorWhenNotFound: false })
class TipsWrap extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    parentRef: PropTypes.any,
  };

  componentDidMount() {
    let rect;
    if (this.props.parentRef === undefined) {
      const e = document.documentElement;
      rect = { left: 0, top: 0, width: e.clientWidth, height: e.clientHeight };
    } else {
      rect = this.props.parentRef.getBoundingClientRect();
    }
    const r = this.tips.getBoundingClientRect();
    const left = rect.left + ((rect.width - r.width) / 2);
    const top = rect.top + ((rect.height - r.height) / 2);
    const style = `top: ${top}px; left:${left}px;`;
    this.tips.setAttribute('style', style);

    this.timer = setTimeout(() => {
      this.close();
    }, 1500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  close() {
    removeComponentByRef(this.tips);
  }

  render() {
    return (
      <div ref={(ref) => { this.tips = ref; }} styleName="tips">
        {this.props.content}
      </div>
    );
  }
}

export default class Tips extends TipsWrap {
  static show(content, ref = undefined) {
    insertComponent(<TipsWrap content={content} parentRef={ref} />);
  }
}
