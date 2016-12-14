/**
 * Created by dz on 16/9/26.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './small-alert.scss';
import { insertComponent } from '../ultils/helper';
import Dialog from './dialog';

@cssModules(styles, { errorWhenNotFound: false })
class SmallAlertWrap extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.any.isRequired,
    onConfirm: PropTypes.func,
  };

  static defaultProps = {
    title: '温馨提示',
  };

  onConfirm = () => {
    if (this.props.onConfirm) this.props.onConfirm();
    this.dialog.close();
  };

  renderButtons() {
    if (this.props.onConfirm) {
      return (<div className="button-group" styleName="buttons">
        <button className="button primary blue" onClick={this.onConfirm}>确定</button>
        <button className="button primary" onClick={() => this.dialog.close()}>取消</button>
      </div>);
    }
    return null;
  }

  render() {
    return (
      <Dialog
        title={this.props.title} ref={(ref) => { this.dialog = ref; }}
        styles={styles}
      >
        <div styleName="small-alert">
          <div styleName="content">
            {this.props.content }
          </div>
          {this.renderButtons()}
        </div>
      </Dialog>
    );
  }
}

export default class SmallAlert extends SmallAlertWrap {
  static show(content, title = undefined, onConfirm = undefined, style = undefined) {
    insertComponent(
      <SmallAlertWrap content={content} title={title} onConfirm={onConfirm} style={style} />
    );
  }
}
