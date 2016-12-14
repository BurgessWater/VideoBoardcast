/**
 * Created by dz on 16/10/17.
 */

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import cssModules from 'react-css-modules';
import styles from './ad.scss';
import { insertComponent, removeComponentByRef } from '../ultils/helper';

@cssModules(styles, { errorWhenNotFound: false })
class ADWrap extends Component {

  static propTypes = {
    isCenter: PropTypes.bool,
    img: PropTypes.string,
    link: PropTypes.string,
  };

  static defaultProps = {
    isCenter: false,
  };

  componentDidMount() {
    if (this.props.isCenter) window.addEventListener('resize', this.layout);
  }

  componentWillUnmount() {
    if (this.props.isCenter) window.removeEventListener('resize', this.layout);
  }

  onImgLoad = () => {
    if (this.props.isCenter) this.layout();
  };

  layout = () => {
    if (!this.img) return;

    const e = document.documentElement;
    const rect = { left: 0, top: 0, width: e.clientWidth, height: e.clientHeight };
    const r = this.img.getBoundingClientRect();
    const left = rect.left + ((rect.width - r.width) / 2);
    const top = rect.top + ((rect.height - r.height) / 2);
    const style = `top: ${top}px; left:${left}px;visibility: visible;width:${r.width}px;`;
    this.ad.setAttribute('style', style);
  };

  close = () => {
    removeComponentByRef(this.ad);
  };

  render() {
    const img = (
      <img
        src={this.props.img} alt="" onLoad={this.onImgLoad}
        ref={(ref) => { this.img = ref; }}
      />
    );
    const tag = this.props.link ? <a href={this.props.link}>{img}</a> : img;
    return (
      <div
        styleName={classNames({ ad: this.props.isCenter, 'ad-bottom-right': !this.props.isCenter })}
        ref={(ref) => { this.ad = ref; }}
      >
        <a href="#" onClick={this.close} styleName="close">&nbsp;</a>
        {tag}
      </div>
    );
  }
}

export default class AD extends ADWrap {
  static show(props) {
    if (props.img) { // 有图片才显示广告
      insertComponent(<ADWrap {...props} />);
    }
  }
}
