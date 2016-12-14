/**
 * Created by kiny on 16/10/5.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './table.scss';

class Row extends React.Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    checked: PropTypes.bool,
    callback: PropTypes.func,
    index: PropTypes.number,
    isEditable: PropTypes.bool,
  };

  checkIt = () => {
    this.props.callback(this.props.index, !this.props.checked);
  };

  renderCheckCell() {
    return (
      <div styleName="cell" style={{ width: '30px' }}>
        <input type="checkbox" checked={this.props.checked} onChange={this.checkIt} />
      </div>
    );
  }

  render() {
    const { fields, data } = this.props;
    return (
      <div styleName="row">
        {this.props.isEditable ? this.renderCheckCell() : null}
        {
          fields.map((field, cellIdx) => {
            let cell = data[field.key];
            if ('render' in field) {
              if (typeof field.render === 'function') {
                cell = field.render(data[field.key], data);
              }
            }
            return <div styleName="cell" className={field.cls} key={cellIdx}>{cell}</div>;
          })
        }
      </div>
    );
  }
}

const RowWrap = cssModules(Row, styles, { errorWhenNotFound: false });
export default RowWrap;
