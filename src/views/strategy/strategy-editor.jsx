/**
 * Created by kiny on 16/10/3.
 */
import Datetime from 'react-datetime';
import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import serialize from 'form-serialize';
import styles from './strategy-editor.scss';
import Dialog from '../../components/dialog';
import Tips from '../../components/tips';
import { insertComponent } from '../../ultils/helper';
import { StrategyApi } from '../../server/api/live-video-api';
import { NONE_ID } from '../../server/define';
import validateForm from '../validateForm';

class StrategyEditor extends React.Component {

  static propTypes = {
    dialogTitle: PropTypes.string.isRequired,
    strategyId: PropTypes.string,
    callback: PropTypes.func,
  };

  static defaultProps = {
    title: '即时策略编辑',
    strategyId: NONE_ID,
  };

  static show(props) {
    insertComponent(<Wrap {...props} />);
  }

  static renderfields = [
    { key: 'variety', label: '品种', placeholder: '必填' },
    {
      key: 'direction',
      label: '方向',
      render: (field, data) => <select name="direction" defaultValue={data}>
        <option value="0">做空</option>
        <option value="1">做多</option>
      </select>,
    },
    {
      key: 'opentime',
      label: '开仓时间',

      render: (field, data) => <Datetime
        className="date-control"
        inputProps={{ name: 'opentime', placeholder: '必填' }}
        defaultValue={data}
        timeFormat={'HH:mm'}
        dateFormat={'YYYY-MM-DD'}
        locale="zh-CN"
      />,
    },
    { key: 'openprice', label: '开仓点位', placeholder: '必填' },
    { key: 'stoplossprice', label: '止损' },
    { key: 'stopprofitprice', label: '止盈' },
    {
      key: 'closetime',
      label: '平仓时间',
      render: (field, data) => <Datetime
        className="date-control"
        inputProps={{ name: 'closetime', placeholder: '必填' }}
        defaultValue={data}
        timeFormat={'HH:mm'}
        dateFormat={'YYYY-MM-DD'}
        locale="zh-CN"
      />,
    },
    { key: 'closeprice', label: '平仓点位' },
    { key: 'profitprice', label: '盈利点' },
    { key: 'analyst', label: '分析师', placeholder: '必填' },
  ];

  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = () => {
    this.dialog.close();
  };

  onSave = () => {
    if (!this.vaildate()) return;
    const { profitprice, openprice, closeprice, opentime, closetime } = this.formData;
    if (openprice && (closeprice || profitprice)) {
      if (parseFloat(profitprice) !== Math.abs(parseFloat(openprice) - parseFloat(closeprice))) {
        Tips.show('盈利点等于开仓价与平仓价之差!', this.box);
        return;
      }
    }

    if (opentime && closetime) {
      try {
        const dOpen = (new Date(opentime)).getTime();
        const dClose = (new Date(closetime)).getTime();
        const dNow = (new Date()).getTime();
        if (dOpen < dNow) {
          Tips.show('开仓日期不能小于当前日期！', this.box);
          return;
        }
        if (dClose < dOpen) {
          Tips.show('平仓日期不能小于开仓日期！', this.box);
          return;
        }
      } catch (e) {
        Tips.show('日期格式不正确！', this.box);
        return;
      }
    }

    StrategyApi.addOrUpdate(this.formData).then((rs) => {
      console.log(rs);
      if ('status' in rs && rs.status === 0) {
        if (this.props.callback) {
          this.props.callback();
        }
        this.onClose();
      }
    }).catch(e => console.error(e));
  };

  getDefaultValue(name) {
    return name in this.props ? this.props[name] : '';
  }

  vaildate() {
    this.formData = serialize(this.form, { hash: true });

    const options = {
      variety: { name: '品种', isRequired: true },
      direction: { name: '方向', isRequired: true },
      opentime: { name: '开仓时间', isRequired: true, type: 'date' },
      openprice: { name: '开仓点位', isRequired: true, type: 'number' },
      stoplossprice: { name: '止损', type: 'number' },
      stopprofitprice: { name: '止盈', type: 'number' },
      closetime: { name: '平仓时间', isRequired: true, type: 'date' },
      closeprice: { name: '平仓点位', type: 'number' },
      profitprice: { name: '盈利点', type: 'number' },
      analyst: { name: '分析师', isRequired: true },
    };

    return validateForm(this.formData, options, this.box);
  }

  formData = null;

  render() {
    const { dialogTitle, strategyId } = this.props;
    console.log(strategyId);

    return (
      <Dialog title={dialogTitle} ref={(ref) => { this.dialog = ref; }}>
        <form name="editorForm" id="editorForm" ref={(ref) => { this.form = ref; }}>
          <div className="editor" ref={(ref) => { this.box = ref; }}>
            <input type="hidden" name="strategyid" value={strategyId} />
            <div styleName="table">
              <div styleName="header">
                { StrategyEditor.renderfields.map(i =>
                  <div styleName="cell" key={i.label}>{i.label}</div>
                )}
              </div>
              <div styleName="row">
                { StrategyEditor.renderfields.map((i, idx) => {
                  let tag = null;
                  if ('render' in i) {
                    tag = i.render(i, this.getDefaultValue(i.key));
                  } else {
                    tag = (<input
                      type="text" styleName="txt" name={i.key.toLowerCase()}
                      placeholder={i.placeholder}
                      defaultValue={this.getDefaultValue(i.key)}
                    />);
                  }
                  return <div styleName="cell" key={idx}>{tag}</div>;
                }) }
              </div>
            </div>
            <div styleName="button-bar" className="button-group">
              <input type="button" className="button primary" value="保存" onClick={this.onSave} />
              <input type="button" className="button primary" value="取消" onClick={this.onClose} />
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}

const Wrap = cssModules(StrategyEditor, styles, { errorWhenNotFound: false });
export default Wrap;
