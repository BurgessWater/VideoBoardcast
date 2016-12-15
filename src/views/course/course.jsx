/**
 * Created by kiny on 16/9/30.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './course.scss';
import Dialog from '../../components/dialog';
import { insertComponent } from '../../ultils/helper';
import { CourseAPI } from '../../server/api/live-video-api';
import CourseEditor from './course-editor';
import SmallAlert from '../../components/small-alert' ;

class Course extends React.Component {
  static show(editable) {
    insertComponent(<CourseWrap isEditable={editable} />);
  }

  static propTypes = {
    isEditable: PropTypes.bool.isRequired,
  };

  state = { daySelected: 0, courses: [], courseSelected: -1, disableEditBtn: true };

  componentDidMount() {
    this.loadData();
  }

  onCourseClick(idx) {
    this.setState({ courseSelected: idx, disableEditBtn: false });
  }

  onDayClick(idx) {
    this.setState({
      daySelected: idx,
      courses: this.filterCourseByDay(idx + 1),
      courseSelected: -1,
      disableEditBtn: true,
    });
  }

  filterCourseByDay(day) {
    const d = day === 7 ? 0 : day;
    return this.dataList.filter(i => parseInt(i.date, 10) === d);
  }

  loadData() {
    CourseAPI.get().then((rs) => {
      this.dataList = rs.data;
      const filter = this.filterCourseByDay(this.state.daySelected + 1);
      console.log(this.dataList, filter, this.state.daySelected);
      this.setState({ courses: filter });
    });
  }

  dataList = [];

  get selectedCourse() {
    return this.state.courses[this.state.courseSelected];
  }

  addCourse = () => {
    CourseEditor.show({
      title: '新增课程',
      date: this.state.daySelected + 1,
      callback: () => {
        this.loadData();
      },
    });
  };

  editCourse = () => {
    CourseEditor.show({
      title: '修改课程',
      callback: () => {
        this.loadData();
      },
      ...this.selectedCourse,
    });
  };

  deleteCourse = () => {
    SmallAlert.show('确定要删除吗？', '删除提示', () => {
      CourseAPI.del(this.selectedCourse.courseid).then(() => {
        this.loadData();
      });
    });
  };

  renderToolBar() {
    const { disableEditBtn } = this.state;
    return (
      <div styleName="toolbar" className="button-group">
        <input
          className="button primary" type="button" value="新增课程" onClick={this.addCourse}
        />
        <input
          className="button primary" type="button" value="编辑"
          disabled={disableEditBtn}
          onClick={this.editCourse}
        />
        <input
          className="button primary" type="button" value="删除"
          disabled={disableEditBtn}
          onClick={this.deleteCourse}
        />
      </div>
    );
  }

  renderCourse() {
    const selected = this.state.courseSelected;
    return this.state.courses.map((i, idx) => (
      <div
        styleName={`entry ${selected === idx ? 'selected' : ''}`} key={i.courseid}
        onClick={() => this.onCourseClick(idx)}
      >
        <div styleName="time">{i.stime} - {i.etime}</div>
        <h3>{i.coursename}</h3>
        <div styleName="leture">{i.lecturer}</div>
        <div styleName="courseInfo">
          <div styleName="table">
            <div styleName="cell">{i.remark}</div>
          </div>
        </div>
      </div>)
    );
  }

  render() {
    return (
      <Dialog title="课程安排">
        <div styleName="curse">
          {this.props.isEditable ? this.renderToolBar() : null}
          <div styleName="day-selector">
            <ul>
              {
                ['一', '二', '三', '四', '五', '六', '日'].map((i, idx) => (
                  <li
                    key={idx} styleName={this.state.daySelected === idx ? 'active' : ''}
                    onClick={() => this.onDayClick(idx)}
                  >星期{i}</li>)
                )
              }
            </ul>
          </div>
          <div styleName="content">
            { this.state.courses.length > 0 ? this.renderCourse() :
              <div styleName="no-course">抱歉，这天没有课程安排！</div> }
          </div>
        </div>
      </Dialog>
    );
  }
}

const CourseWrap = cssModules(Course, styles, { errorWhenNotFound: false, allowMultiple: true });
export default CourseWrap;
