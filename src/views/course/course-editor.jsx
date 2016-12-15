/**
 * Created by kiny on 16/10/3.
 */
/* eslint react/prop-types: 'off' */
import Datetime from 'react-datetime';
import serialize from 'form-serialize';
import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './course-editor.scss';
import Dialog from '../../components/dialog';
import Tips from '../../components/tips';
import { insertComponent } from '../../ultils/helper';
import { CourseAPI } from '../../server/api/live-video-api';
import { NONE_ID } from '../../server/define';
import validateForm from '../validateForm';

const str2Num = str => (str ? parseInt(str.replace(':', ''), 10) : 0);

class CourseEditor extends React.Component {

  static propsType = {
    title: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
  };

  static defaultProps = {
    title: '课程编辑',
    date: 0,
    courseid: NONE_ID,
  };

  static show(props) {
    insertComponent(<Wrap {...props} />);
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.onClose = this.onClose.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onClose() {
    this.dialog.close();
  }

  onSave() {
    if (!this.vaildate()) return;
    const d = this.formData;

    if (str2Num(d.stime) >= str2Num(d.etime)) {
      Tips.show('结束时间需大于或等于开始时间!', this.box);
      return;
    }

    CourseAPI.addOrupdate(d).then((rs) => {
      console.log(rs);
      if ('status' in rs && rs.status === 0) {
        if (this.props.callback) {
          this.props.callback();
        }
        this.onClose();
      }
    }).catch(e => console.error(e));
  }

  formData = null;

  vaildate() {
    this.formData = serialize(this.form, { hash: true });
    const validOptions = {
      stime: { name: '开始时间', isRequired: true, type: 'time' },
      etime: { name: '结束时间', isRequired: true, type: 'time' },
      coursename: { name: '课程名称', isRequired: true },
      lecturer: { name: '讲师名称', isRequired: true },
      remark: { name: '课程描述', isRequired: true },
    };

    return validateForm(this.formData, validOptions, this.box);
  }

  render() {
    return (
      <Dialog title={this.props.title} ref={(ref) => { this.dialog = ref; }}>
        <form name="editorForm" id="editorForm" ref={(ref) => { this.form = ref; }}>
          <div ref={(ref) => { this.box = ref; }}>
            <input type="hidden" name="courseid" value={this.props.courseid} />
            <ul styleName="editor">
              <li>
                <label htmlFor="date">日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期：</label>
                <select name="date" styleName="weekDay" defaultValue={this.props.date}>
                  <option value="1">星期一</option>
                  <option value="2">星期二</option>
                  <option value="3">星期三</option>
                  <option value="4">星期四</option>
                  <option value="5">星期五</option>
                  <option value="6">星期六</option>
                  <option value="0">星期日</option>
                </select><i styleName="red">*</i></li>
              <li>
                <label htmlFor="stime">课程时间：</label>
                <Datetime
                  viewMode="time" className="time-control"
                  inputProps={{ name: 'stime' }} dateFormat={false}
                  defaultValue={this.props.stime}
                  timeFormat={'H:mm'}
                />
                &nbsp;-&nbsp;
                <Datetime
                  viewMode="time" className="time-control"
                  inputProps={{ name: 'etime' }} dateFormat={false} name="etime"
                  defaultValue={this.props.etime}
                  timeFormat={'H:mm'}
                />
                <i styleName="red">*</i>
              </li>
              <li>
                <label htmlFor="coursename">课程名称：</label>
                <input
                  ref={(ref) => { this.coursename = ref; }}
                  type="text" name="coursename" styleName="input-control"
                  placeholder="如：实盘心得" maxLength="10"
                  defaultValue={this.props.coursename}
                />
                <i styleName="red">*</i></li>
              <li>
                <label htmlFor="date">讲师名称：</label>
                <input
                  ref={(ref) => { this.lecturer = ref; }}
                  type="text" name="lecturer" styleName="input-control"
                  placeholder="如：张雷" maxLength="5"
                  defaultValue={this.props.lecturer}
                />
                <i styleName="red">*</i>
              </li>
              <li>
                <label htmlFor="remark" style={{ verticalAlgin: 'top' }}>课程描述：</label>
                <textarea
                  ref={(ref) => { this.remark = ref; }}
                  name="remark"
                  styleName="input-control"
                  maxLength="40"
                  cols="35" rows="3"
                  placeholder="请勿超过40个字符"
                  defaultValue={this.props.remark}
                />
                <i styleName="red">*</i></li>
              <li styleName="button-bar" className="button-group">
                <input type="button" className="button primary" value="保存" onClick={this.onSave} />
                <input type="button" className="button primary" value="取消" onClick={this.onClose} />
              </li>
            </ul>
          </div>
        </form>
      </Dialog>
    );
  }
}

const Wrap = cssModules(CourseEditor, styles, { errorWhenNotFound: false });
export default Wrap;
