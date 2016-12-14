/**
 * Created by kiny on 16/10/19.
 */

import React, { PropTypes } from 'react';

export default class Input extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.any,
  };
  state = { value: this.props.value };

  handleChange = (e) => {
    switch (this.props.type) {
      case 'number': {
        const reg = /\d+/;
        if (reg.test(this.input.value)) {
          this.setState({ value: e.target.value });
        }
        break;
      }
      default:
        break;
    }
  };

  render() {
    return (
      <input
        type={this.props.type} value={this.state.value} onChange={this.handleChange}
      />
    );
  }
}
