/**
 * Created by fighter on 2016/9/27.
 */

import 'fetch-ie8';
import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './userBox.scss';
import UserAPI from '../../../../server/api/user-api';
import { ParamData } from '../../service/tools';

class UserBox extends React.Component {

  static propTypes = {
    source: PropTypes.number.isRequired,
    device: PropTypes.string,
    regFrom: PropTypes.string.isRequired,
    exitCback: PropTypes.func,
    regURL: PropTypes.string,
    children: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      regFrom: ParamData.regFrom || this.props.device,
      onExit: false,
      onAd: false,
      adLink: '',
      adPic: '',
    };
  }

  componentWillMount() {
    const regFrom = this.props.regFrom;
    if (regFrom !== 'ios' && regFrom !== 'android') {
      this.setState({ onAd: true });
      const success = (json) => {
        const adInfo = json.data[this.props.source];
        this.setState({
          adLink: adInfo.adlink,
          adPic: adInfo.adpic,
        });
      };
      UserAPI.getAD().then(success);
    }
    if (regFrom !== 'pc') {
      this.setState({ onExit: true });
    }
  }

  exit = () => {
    if (this.props.exitCback) {
      this.props.exitCback();
    } else if (this.props.regURL) {
      window.location = `${this.props.regURL}`;
    }
  };

  render() {
    return (
      <div styleName={`main ${this.state.onAd ? 'main-ad' : 'main-mobile'}`}>
        {/* 左侧广告*/}
        {this.state.onAd ? (
          <div styleName="userAd">
            <a href={this.state.adLink}>
              <img src={this.state.adPic} alt="广告" />
            </a>
          </div>
        ) : ''
        }
        <div styleName="userForm">
          <div styleName="header">
            <img styleName="logo" alt="logo" src={require('./images/logo.jpg')} />
            <span>大宗商品一站式营销服务平台</span>
            <button
              style={{ display: this.state.onExit ? 'inline-block' : 'none' }}
              styleName="close-btn"
              onClick={this.exit}
            />
          </div>
          <div styleName="content">
            {this.props.children}
          </div>
        </div>
        <div id="lay" />
      </div>
    );
  }
}

export default cssModules(UserBox, styles, { allowMultiple: true, errorWhenNotFound: true });
