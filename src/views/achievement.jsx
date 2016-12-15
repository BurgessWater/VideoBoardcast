/**
 * Created by kiny on 16/10/7.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './achievement.scss';
import Dialog from '../components/dialog';
import UploadButton from '../components/upload-button';
import { insertComponent } from '../ultils/helper';

class Achievement extends Component {
  static propTypes = {
    isEditable: PropTypes.bool.isRequired,
  };

  static show(editable) {
    insertComponent(<Wrap isEditable={editable} />);
  }

  renderUploadBtn() {
    return (
      <div>
        上传最新的战绩图片：
        <UploadButton
          uploadURL={UPLOAD_ACHIEVEMENT_IMG_URL}
          onSuccess={() => this.forceUpdate()}
        /> 图片支持jpg、png、gif,宽度不超过700px
      </div>
    );
  }

  render() {
    return (
      <Dialog title="战绩回顾">
        <div styleName="achievement">
          {this.props.isEditable ? this.renderUploadBtn() : null}
          <div styleName="image">
            <img
              ref={(ref) => { this.image = ref; }}
              src={`${ACHIEVEMENT_IMG_URL}?t=${(new Date()).getTime()}`}
              alt="战绩回顾"
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

const Wrap = cssModules(Achievement, styles, { errorWhenNotFound: false });
export default Wrap;
