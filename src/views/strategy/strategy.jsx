/**
 * Created by kiny on 16/10/7.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './strategy.scss';
import { StrategyApi } from '../../server/api/live-video-api';
import { insertComponent } from '../../ultils/helper';
import Dialog from '../../components/dialog';
import Table from '../../components/table/table';
import Pagination from '../../components/pagination';
import StrategyEditor from './strategy-editor';
import Tips from '../../components/tips' ;
import SmallAlert from '../../components/small-alert' ;

class Strategy extends React.Component {
  static propTypes = {
    isEditable: PropTypes.bool.isRequired,
  };

  static show(editable) {
    insertComponent(<Wrap isEditable={editable} />);
  }

  state = { list: [], pageCount: 0, delDisable: true };

  componentDidMount() {
    this.loadData();
  }

  onRowSelected = (ids) => {
    this.currSelectedList = ids;
    this.checkDelButtonState();
  };

  onPageChanged = (idx) => {
    this.currPageIdx = idx;
    this.currSelectedList = [];
    this.loadData(idx);
    this.checkDelButtonState();
  };

  onAddStrategy = () => {
    StrategyEditor.show({
      dialogTitle: '新增即时策略',
      callback: () => this.loadData(),
    });
  };

  onEdit(d) {
    StrategyEditor.show({
      dialogTitle: '编辑即时策略',
      callback: () => this.loadData(this.currPageIdx),
      ...d,
    });
  }

  onDelStrategy = () => {
    SmallAlert.show('确定要删除吗？', '删除提示', () => {
      const arr = this.currSelectedList.map(i => this.state.list[i].strategyid);
      StrategyApi.del(arr).then(() => {
        Tips.show(`成功删除${arr.length}条记录`, this.box);
        const isLastPage = this.page.pageIndex === this.state.pageCount;
        const p = isLastPage ? this.page.pageIndex - 1 : this.page.pageIndex;
        this.loadData(Math.max(1, p));
      });
    });
  };

  currSelectedList = [];
  currPageIdx = 1;

  loadData(pageIdx = 1) {
    StrategyApi.get(pageIdx).then((rs) => {
      this.setState({ list: rs.data, pageCount: rs.pagecount }, () => {
        this.page.pageIndex = pageIdx;
        this.table.resetTable();
      });
    });
  }

  checkDelButtonState() {
    this.setState({ delDisable: this.currSelectedList.length === 0 });
  }

  get renderFields() {
    const arr = [
      { key: 'strategyid', label: '序号' },
      { key: 'direction', label: '方向', render: rs => (rs === 0 ? '做空' : '做多') },
      { key: 'variety', label: '品种' },
      { key: 'opentime', label: '开仓时间' },
      { key: 'openprice', label: '开仓点位', cls: 'blue' },
      { key: 'stoplossprice', label: '止损', cls: 'green' },
      { key: 'stopprofitprice', label: '止盈', cls: 'red' },
      { key: 'closetime', label: '平仓时间' },
      { key: 'closeprice', label: '平仓点位', cls: 'blue' },
      { key: 'profitprice', label: '盈利点' },
      { key: 'analyst', label: '分析师' },
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

  renderToolbar() {
    return (
      <div styleName="toolbar" className="button-group">
        <input
          className="button primary" type="button" value="新增策略"
          onClick={this.onAddStrategy}
        />
        <input
          className="button primary" type="button" value="删除" disabled={this.state.delDisable}
          onClick={this.onDelStrategy}
        />
      </div>
    );
  }

  render() {
    const { list, pageCount } = this.state;
    return (
      <Dialog title="即时策略">
        <div styleName="strategy" ref={(ref) => { this.box = ref; }}>
          { this.props.isEditable ? this.renderToolbar() : null}
          <Table
            isEditable={this.props.isEditable}
            ref={(ref) => { this.table = ref; }} fields={this.renderFields} data={list}
            onRowSelected={this.onRowSelected}
            className="txt-center"
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

const Wrap = cssModules(Strategy, styles, { errorWhenNotFound: false });
export default Wrap;
