/**
 * Created by kiny on 16/10/1.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './invest.scss';
import Dialog from '../../components/dialog';
import { insertComponent } from '../../ultils/helper';
import { InvestApi } from '../../server/api/live-video-api';
import Table from '../../components/table/table';
import Pagination from '../../components/pagination';
import InvestEditor from './invest-editor';
import SmallAlert from '../../components/small-alert' ;
import Tips from '../../components/tips' ;

class Invest extends React.Component {

  static show(editable) {
    insertComponent(<Wrap isEditable={editable} />);
  }

  static propTypes = {
    isEditable: PropTypes.bool.isRequired,
  };

  state = { list: [], pageCount: 0, delDisable: true };

  componentDidMount() {
    this.loadData();
  }

  onEdit(d) {
    InvestEditor.show({
      dialogTitle: '编辑投资宝典',
      callback: () => {
        this.loadData(this.currPageIdx);
      },
      ...d,
    });
  }

  onAddInvest = () => {
    InvestEditor.show({
      dialogTitle: '新增投资宝典',
      callback: () => {
        this.loadData();
      },
    });
  };

  onDelInvest = () => {
    SmallAlert.show('确定要删除吗？', '删除提示', () => {
      const arr = this.currSelectedList.map(i => this.state.list[i].investid);
      InvestApi.del(arr).then(() => {
        Tips.show(`成功删除${arr.length}条记录`, this.box);
        const isLastPage = this.page.pageIndex === this.state.pageCount;
        const p = isLastPage ? this.page.pageIndex - 1 : this.page.pageIndex;
        this.loadData(Math.max(1, p));
      });
    });
  };

  onPageChanged = (idx) => {
    this.currPageIdx = idx;
    this.currSelectedList = [];
    this.loadData(idx);
    this.checkDelButtonState();
  };

  onRowSelected = (ids) => {
    this.currSelectedList = ids;
    this.checkDelButtonState();
  };

  loadData(pageIdx = 1) {
    InvestApi.get(pageIdx).then((rs) => {
      this.setState({ list: rs.data, pageCount: rs.pagecount }, () => {
        this.page.pageIndex = pageIdx;
        this.table.resetTable();
      });
    });
  }

  currPageIdx = 1;
  currSelectedList = [];

  checkDelButtonState() {
    this.setState({ delDisable: this.currSelectedList.length === 0 });
  }

  get renderFields() {
    const arr = [
      { key: 'tille', label: '标题' },
      { key: 'author', label: '研究员' },
      { key: 'file', label: '文件下载', render: rs => <a href={rs}>点击下载</a> },
      { key: 'modifytime', label: '更新时间' },
    ];
    if (this.props.isEditable) {
      arr.push(
        {
          key: '',
          label: '动作',
          render: (rs, d) => <a href="#" onClick={() => this.onEdit(d)}>编辑</a>,
        }
      );
    }
    return arr;
  }

  renderToolBar() {
    return (
      <div styleName="toolbar" className="button-group">
        <input
          className="button primary" type="button" value="新增宝典"
          onClick={this.onAddInvest}
        />
        <input
          className="button primary" type="button" value="删除" disabled={this.state.delDisable}
          onClick={this.onDelInvest}
        />
      </div>);
  }

  render() {
    const { list, pageCount } = this.state;
    return (
      <Dialog title="投资宝典">
        <div styleName="invest">
          {this.props.isEditable ? this.renderToolBar() : null}
          <Table
            isEditable={this.props.isEditable} ref={(ref) => { this.table = ref; }}
            fields={this.renderFields} data={list} onRowSelected={this.onRowSelected}
            className="txt-center"
          />
          <Pagination
            ref={(ref) => { this.page = ref; }}
            maxPageCount={pageCount}
            onPageChanged={this.onPageChanged}
          />
        </div>
      </Dialog>
    );
  }
}
const Wrap = cssModules(Invest, styles, { errorWhenNotFound: false });
export default Wrap;
