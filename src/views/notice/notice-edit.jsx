/**
 * Created by kiny on 16/9/25.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import serialize from 'form-serialize';
import styles from './notice-edit.scss';
import { NoticeApi } from '../../server/api/live-video-api';
import { insertComponent } from '../../ultils/helper';
import Table from '../../components/table/table';
import Pagination from '../../components/pagination';
import Dialog from '../../components/dialog';
import { requestNewNotice } from '../../model/action';
import SmallAlert from '../../components/small-alert' ;
import Tips from '../../components/tips';

class NoticeEditor extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func,
  };

  static show(props) {
    insertComponent(<Wrap {...props} />);
  }

  static get renderFields() {
    return [
      { key: 'conent', label: '通告内容', render: i => decodeURIComponent(i) },
    ];
  }

  state = { postDisable: true, list: [], delDisable: true, pageCount: 0 };

  componentDidMount() {
    this.loadData();
  }

  onPageChanged = (idx) => {
    this.currSelectedList = [];
    this.loadData(idx);
    this.checkDelButtonState();
  };

  onRowSelected = (ids) => {
    this.currSelectedList = ids;
    this.checkDelButtonState();
  };

  onDelNotice = () => {
    SmallAlert.show('确定要删除吗？', '删除提示', () => {
      const arr = this.currSelectedList.map(i => this.state.list[i].noticeid);
      NoticeApi.del(arr).then(() => {
        Tips.show(`成功删除${arr.length}条记录`, this.box);
        const isLastPage = this.page.pageIndex === this.state.pageCount;
        const p = isLastPage ? this.page.pageIndex - 1 : this.page.pageIndex;
        this.loadData(Math.max(1, p));
        this.props.dispatch(requestNewNotice());
      });
    });
  };

  contentChange = (e) => {
    const v = e.target.value.trim();
    this.setState({ postDisable: v === '' });
  };

  postNotice = () => {
    const d = serialize(this.form, { hash: true });
    NoticeApi.addOrUpdate(d).then(() => {
      this.contentInput.value = '';
      this.setState({ postDisable: true, delDisable: true });
      this.loadData();
      this.props.dispatch(requestNewNotice());
    });
  };

  currSelectedList = [];

  loadData(pageIdx = 1) {
    NoticeApi.get(pageIdx).then((rs) => {
      this.setState({ list: rs.data, pageCount: rs.pagecount }, () => {
        this.page.pageIndex = pageIdx;
        this.table.resetTable();
      });
    });
  }

  checkDelButtonState() {
    this.setState({ delDisable: this.currSelectedList.length === 0 });
  }

  render() {
    const { list, postDisable, delDisable, pageCount } = this.state;
    return (
      <Dialog title="最新通告">
        <div styleName="editor">
          <div styleName="title-bar">
            <form
              ref={(ref) => {
                this.form = ref;
              }}
            >
              <input type="hidden" name="noticeid" value={0} />
              <input
                type="button" className="button primary" value="删除选中通告" disabled={delDisable}
                styleName="button"
                onClick={this.onDelNotice}
              />
              <span styleName="text-wrap">
                <input
                  ref={(ref) => {
                    this.contentInput = ref;
                  }}
                  type="text" name="conent" onChange={this.contentChange}
                  placeholder="请输入通告内容，最多只能输入50个字！" styleName="input-text" autoFocus
                  maxLength="50"
                />
              </span>
              <input
                type="button" className="button primary" value="发布新通告" disabled={postDisable}
                styleName="button"
                onClick={this.postNotice}
              />
            </form>
          </div>
          <Table
            isEditable
            ref={(ref) => { this.table = ref; }} fields={NoticeEditor.renderFields} data={list}
            onRowSelected={this.onRowSelected}
          />
          <Pagination
            ref={(ref) => {
              this.page = ref;
            }} maxPageCount={pageCount}
            onPageChanged={this.onPageChanged}
          />
        </div>
      </Dialog>
    );
  }
}

const Wrap = cssModules(NoticeEditor, styles, { errorWhenNotFound: false });
export default Wrap;
