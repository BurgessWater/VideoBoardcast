/**
 * Created by kiny on 16/9/25.
 */

import React, { PropTypes, Component } from 'react';
import cssModules from 'react-css-modules';
import styles from './sub-nav.scss';
import Course from './course/course';
import Strategy from './strategy/strategy';
import Invest from './invest/invest';
import Achievement from './achievement';
import Alert from '../components/alert';
import Calendar from './calendar';

@cssModules(styles, { errorWhenNotFound: false })
export default class SubNav extends Component {
  static propTypes = {
    authority: PropTypes.object,
    noAuthorityTips: PropTypes.object.isRequired,
    navs: PropTypes.array,
  };

  static onCalendarClick() {
    Calendar.show();
  }

  static renderAlert(obj) {
    const tags = (<div>
      {obj.tipsimgurl ? <img src={obj.tipsimgurl} alt="" /> : null}
      <div>{obj.tipstitile}</div>
    </div>);
    Alert.show(obj.tipslink ? <a href={obj.tipslink}>{tags}</a> : tags);
  }

  onCourseClick = () => {
    const a = this.props.authority;
    this.check(a.isCourseEditEnable, a.isCourseViewEnable, Course);
  };

  onInvestClick = () => {
    const a = this.props.authority;
    this.check(a.isInvestEditEnable, a.isInvestViewEnable, Invest);
  };

  onAchievementClick = () => {
    const a = this.props.authority;
    this.check(a.isScoreEditEnable, a.isScoreViewEnable, Achievement);
  };

  onStrategyClick = () => {
    const a = this.props.authority;
    this.check(a.isStrategyEditEnable, a.isStrategyViewEnable, Strategy);
  };

  check(editable, viewable, cls) {
    if (editable || viewable) {
      cls.show(editable);
    } else {
      this.renderNoAuthorityTips();
    }
  }

  renderNoAuthorityTips() {
    const id = this.props.authority.currCheckFunID;
    if (id !== -1) {
      let obj = { tipslink: null, tipsimgurl: null, tipstitile: '您暂无该功能权限，请联系客服！' };
      if (id in this.props.noAuthorityTips) {
        obj = this.props.noAuthorityTips[id];
      }
      SubNav.renderAlert(obj);
    }
  }

  render() {
    return (
      <ol
        styleName="sub-nav"
        className="container-bg-color text-color sub-nav-border sub-nav-btn-color"
      >
        <li>
          <a href="#" className="cjrl" onClick={SubNav.onCalendarClick}>
            <span className="sub-nav-icon" /><em>财经日历</em></a>
        </li>
        <li>
          <a href="#" className="ckap" onClick={this.onCourseClick}>
            <span className="sub-nav-icon" /><em>课程安排</em></a>
        </li>
        <li>
          <a href="#" className="tzbd" onClick={this.onInvestClick}>
            <span className="sub-nav-icon" /><em>投资宝典</em></a>
        </li>
        <li>
          <a href="#" className="zjhg" onClick={this.onAchievementClick}>
            <span className="sub-nav-icon" /><em>战绩回顾</em></a>
        </li>
        <li>
          <a href="#" className="jscl" onClick={this.onStrategyClick}>
            <span className="sub-nav-icon" /><em>即时策略</em></a>
        </li>
        {
          this.props.navs.map(i =>
            (<li key={i.fid}>
              <a href={i.furl} target="_blank" rel="noopener noreferrer">
                <span styleName="table">
                  <span styleName="cell">
                    <img
                      src={i.fpic} alt={i.fname}
                      style={{ maxWidth: '44px', maxHeight: '44px' }}
                    />
                  </span>
                </span>
                <em>{i.fname}</em>
              </a>
            </li>)
          )
        }
      </ol>
    );
  }
}

