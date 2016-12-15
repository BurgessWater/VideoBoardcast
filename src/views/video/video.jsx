/**
 * Created by kiny on 16/9/25.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './video.scss';
import YYPlayer from './player/yy-player';
import GenseePlayer from './player/gensee-player';
import VOD from './vod';
import YoukuPlayer from './player/youku-player';

@cssModules(styles, { errorWhenNotFound: false })
export default class Video extends React.Component {

  static propTypes = {
    isYYPlayer: PropTypes.bool.isRequired,
    isVOD: PropTypes.bool.isRequired,
    videoURL: PropTypes.string,
    vods: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isVOD: false,
  };

  openVideoSelector = () => {
    VOD.show({ vods: this.props.vods, dispatch: this.props.dispatch });
  };

  renderPlayer() {
    if (this.props.isVOD) {
      return <YoukuPlayer yid={this.props.videoURL} />;
    }
    if (this.props.isYYPlayer) {
      return <YYPlayer topSid="54880976" />;
    }
    return <GenseePlayer />;
  }

  render() {
    return (<div styleName="video">
      <div styleName="title" className="title-bg-color title-text-color">精彩直播
        <span onClick={this.openVideoSelector} styleName="vod-link">点播</span>
      </div>
      <div styleName="player">
        {this.renderPlayer()}
      </div>
    </div>);
  }
}

