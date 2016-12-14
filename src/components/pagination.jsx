/**
 * Created by kiny on 16/10/9.
 */

import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './pagination.scss';
import { pagination } from '../ultils/helper';

@cssModules(styles, { allowMultiple: true, errorWhenNotFound: false })
export default class Pagination extends React.Component {
  static propTypes = {
    maxPageCount: PropTypes.number.isRequired,
    onPageChanged: PropTypes.func.isRequired,
    currentPage: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = { currentPage: this.props.currentPage || 1 };
  }

  onPageClick(idx) {
    this.setState({ currentPage: idx }, () => this.props.onPageChanged(idx));
  }

  get pageIndex() {
    return this.state.currentPage;
  }

  set pageIndex(idx) {
    this.setState({ currentPage: idx });
  }

  render() {
    const { maxPageCount } = this.props;
    const { currentPage } = this.state;
    const arr = pagination(currentPage, maxPageCount).map((i, idx) =>
      <button
        key={idx} disabled={i === '...'} onClick={() => this.onPageClick(i)}
        styleName={i === currentPage ? 'active' : ''}
      >{i}</button>
    );

    return (
      <div styleName="page">
        <ul>
          <button
            disabled={currentPage === 1}
            onClick={() => this.onPageClick(this.state.currentPage - 1)}
          >&lt;</button>
          {arr}
          <button
            disabled={currentPage === maxPageCount}
            onClick={() => this.onPageClick(this.state.currentPage + 1)}
          >&gt;</button>
        </ul>
      </div>
    );
  }
}
