/**
 * Created by kiny on 16/10/3.
 */
/* eslint react/prop-types: 'off' */
import serialize from 'form-serialize';
import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './invest-editor.scss';
import Dialog from '../../components/dialog';
import { insertComponent } from '../../ultils/helper';
import { InvestApi } from '../../server/api/live-video-api';
import { NONE_ID } from '../../server/define';
import UploadButton from '../../components/upload-button';
import validateForm from '../validateForm';

class InvestEditor extends Component {

  static propTypes = {
    dialogTitle: PropTypes.string.isRequired,
    callback: PropTypes.func,
  };

  static defaultProps = {
    title: '投资宝典编辑',
    investid: NONE_ID,
  };

  static show(props) {
    insertComponent(<Wrap {...props} />);
  }

  onClose = () => {
    this.dialog.close();
  };

  onSave = () => {
    if (!this.vaildate()) return;
    InvestApi.addOrUpdate(this.formData).then((rs) => {
      console.log(rs);
      if ('status' in rs && rs.status === 0) {
        if (this.props.callback) {
          this.props.callback();
        }
        this.onClose();
      }
    }).catch(e => console.error(e));
  };

  formData = null;

  vaildate() {
    this.formData = serialize(this.form, { hash: true });

    const obj = {
      tille: { name: '标题', isRequired: true },
      author: { name: '研究员', isRequired: true },
      file: { name: '文件', isRequired: true, type: 'file' },
    };

    return validateForm(this.formData, obj, this.box);
  }

  render() {
    const { dialogTitle, tille, investid, author, file } = this.props;
    const uploadConfig = {
      uploadURL: FILE_UPLOAD_URL,
      allowExtenstions: ['zip', 'rar', '7z', 'cab', 'ios'],
      fileValue: file,
    };

    return (
      <Dialog title={dialogTitle} ref={(ref) => { this.dialog = ref; }}>
        <div ref={(ref) => { this.box = ref; }}>
          <form name="editorForm" id="editorForm" ref={(ref) => { this.form = ref; }}>
            <input type="hidden" name="investid" value={investid} />
            <ul styleName="editor">
              <li>
                <label htmlFor="tille">标题：</label>
                <input
                  ref={(ref) => { this.title = ref; }}
                  type="text" name="tille" styleName="input-control"
                  placeholder="如：实盘心得" defaultValue={tille} autoFocus
                />
                <i styleName="red">*</i>
              </li>
              <li>
                <label htmlFor="author">研究员：</label>
                <input
                  type="text" name="author" styleName="input-control"
                  placeholder="如：张雷" maxLength="10" defaultValue={author}
                />
                <i styleName="red">*</i></li>
              <li>
                <label htmlFor="tille">文件：</label><UploadButton {...uploadConfig} />
                <i styleName="red">* 文件格式支持：zip,rar,7z,cab,ios</i>
              </li>
              <li styleName="button-bar" className="button-group">
                <input type="button" className="button primary" value="保存" onClick={this.onSave} />
                <input type="button" className="button primary" value="取消" onClick={this.onClose} />
              </li>
            </ul>
          </form>
        </div>
      </Dialog>
    );
  }
}

const Wrap = cssModules(InvestEditor, styles, { errorWhenNotFound: false });
export default Wrap;
