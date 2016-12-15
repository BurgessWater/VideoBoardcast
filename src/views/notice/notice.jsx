/**
 * Created by kiny on 16/9/25.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './notice.scss';
import NoticeEditor from './notice-edit';

function activeClass(b) {
  return b === true ? 'active' : '';
}

class Notice extends React.Component {

  static propTypes = {
    isEditable: PropTypes.bool.isRequired,
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    dispatch: PropTypes.func.isRequired,
    about: PropTypes.string,
    ad: PropTypes.shape({
      adlink: PropTypes.string,
      adpic: PropTypes.string,
      adname: PropTypes.string,
    }),
  };

  state = { isNotice: null, isRenderAd: true };

  onNotice = () => {
    this.setState({ isNotice: true });
  };

  onAbout = () => {
    this.setState({ isNotice: false });
  };

  onEdit = () => {
    NoticeEditor.show({ dispatch: this.props.dispatch });
  };

  combineRener() {
    if (this.state.isNotice === null) {
      return this.renderAD();
    }
    return this.state.isNotice ? this.renderNotice() : this.renderAbout();
  }

  renderNotice() {
    let t = <div>暂无通告</div>;
    if (this.props.list.length > 0) {
      t = (
        <ul>
          { this.props.list.map(i => <li key={i.noticeid}>{decodeURIComponent(i.conent)}</li>)}
        </ul>
      );
    }
    return <div styleName="content" className="container-bg-color text-color">{t}</div>;
  }

  renderAbout() {
    return <div styleName="ad"><img src={this.props.about} alt="" /></div>;
  }

  renderAD() {
    if (!this.props.ad) return null;
    const t = (
      <div styleName="ad">
        <img src={this.props.ad.adpic} alt={this.props.ad.adname} />
      </div>);
    if (this.props.ad.adlink) {
      return <a href={this.props.ad.adlink}>{t}</a>;
    }
    return t;
  }

  render() {
    const { isNotice } = this.state;
    return (
      <div styleName="notice">
        <div styleName="title" className="title-bg-color title-text-color">
          <span styleName={`notice-tab ${activeClass(isNotice)}`} onClick={this.onNotice}>
            最新通告
          </span>
          <span
            styleName={`about-tab ${activeClass(isNotice !== null ? !isNotice : isNotice)}`}
            onClick={this.onAbout}
          >关于我们</span>
          {this.props.isEditable ? <span styleName="edit-button" onClick={this.onEdit} /> : null}
        </div>
        {this.combineRener()}
      </div>
    );
  }
}

export default cssModules(Notice, styles, { allowMultiple: true, errorWhenNotFound: false });
