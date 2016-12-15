/**
 * Created by dz on 16/10/11.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './vod.scss';
import { insertComponent } from '../../ultils/helper';
import Dialog from '../../components/dialog';
import Tips from '../../components/tips';
import { playYouKuVod } from '../../model/action';

const youkuIdReg = /id_(.*?)\.html/;

class VOD extends Component {
  static propTypes = {
    vods: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static show(props) {
    insertComponent(<Wrap {...props} />);
  }

  onVodClick = (url) => {
    const match = url.match(youkuIdReg);
    if (match) {
      this.props.dispatch(playYouKuVod(match.pop()));
      this.dialog.close();
    } else {
      Tips.show(`${url} 不是有效的优酷视频地址!`, this.box);
    }
  };

  render() {
    return (
      <Dialog title="视频点播" ref={(ref) => { this.dialog = ref; }}>
        <div styleName="vod" ref={(ref) => { this.box = ref; }}>
          {this.props.vods.map((i, idx) =>
            <div styleName="item" key={idx}>
              <button
                className="button primary" styleName="btn"
                onClick={() => this.onVodClick(i.value)}
              >{i.name}</button>
            </div>
          )}
        </div>
      </Dialog>
    );
  }
}

const Wrap = cssModules(VOD, styles, { errorWhenNotFound: false });
export default Wrap;
