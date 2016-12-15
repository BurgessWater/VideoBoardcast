/**
 * Created by dz on 16/10/13.
 */

import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './skin-selector.scss';
import { Cookie } from '../vendors/wj/service/tools';

@cssModules(styles, { allowMultiple: true, errorWhenNotFound: false })
export default class SkinSelector extends Component {
  static propTypes = {
    dismiss: PropTypes.func.isRequired,
  };

  state = { activeSkinName: Cookie.getCookie('skin') };

  componentDidMount() {
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'overlay');
    document.body.appendChild(this.el);
    this.el.addEventListener('click', this.onOverlayClick);
  }

  componentWillUnmount() {
    this.el.removeEventListener('click', this.onOverlayClick);
    this.el.parentNode.removeChild(this.el);
  }

  onOverlayClick = () => {
    this.close();
  };

  close() {
    console.log(this.state.activeSkinName);
    Cookie.setCookie('skin', this.state.activeSkinName);
    this.props.dismiss();
  }

  previewSkin(skinName) {
    this.setState({ activeSkinName: skinName });
    document.body.setAttribute('class', `${skinName}-theme`);
  }

  changeSkin = (skinName) => {
    this.previewSkin(skinName);
    this.close();
  };

  render() {
    return (
      <div styleName="skin-selector">
        {['dark', 'red', 'blue', 'purple'].map(i => (
          <span key={i} styleName={`item ${i === this.state.activeSkinName ? 'active' : ''}`}>
            <button
              styleName={`btn ${i}`}
              onMouseOver={() => this.previewSkin(i)}
              onClick={() => this.changeSkin(i)}
            />
          </span>
        ))}
      </div>
    );
  }
}

