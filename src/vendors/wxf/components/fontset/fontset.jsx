/**
 * Created by wenxinfu on 2016/9/29.
 */
import React from 'react';
import cssModules from 'react-css-modules';
import styles from './fontset.scss';

class FontSet extends React.Component {
  static defaultProps = {
    parentFont() {
    },
  }
  static propTypes = {
    parentFont: React.PropTypes.func.isRequired,
  }

  setFontFaimly = (e) => {
    // e.cancelBubble = true;
    e.stopPropagation();
    const value = e.target.value;
    this.setFontStyle(1, value);
  }

  setFontSize = (e) => {
    // e.cancelBubble = true;
    e.stopPropagation();
    const value = e.target.value;
    this.setFontStyle(2, `${value}px`);
  }

  // 设置粗体
  setFontWeight = () => {
    const state = this.fontState.fWeight = !this.fontState.fWeight;
    this.setFontStyle(3, state ? '900' : '400');
  }

  // 设置斜体
  setFontItalic = () => {
    const state = this.fontState.fItalic = !this.fontState.fItalic;
    this.setFontStyle(4, state ? 'italic' : 'normal');
  }

  setFontStyle = (type, value) => {
    this.fontSetting.type = type;
    this.fontSetting.value = value;
    this.props.parentFont(this.fontSetting);
  }
  cancelPropagation = (e) => {
    // e.cancelBubble = true;
    e.stopPropagation();
  }
  fontSetting = {
    type: 0, // 1字体，2，字体大小，3，粗体，4，斜体
    value: '',
  };
  fontFaimly = [
    { value: 'Microsoft YaHei', text: '微软雅黑', type: 1 },
    { value: 'SimSun', text: '宋体', type: 2 },
    { value: 'SimHei', text: '黑体', type: 3 },
    { value: 'KaiTi', text: '楷体', type: 4 },
  ];
  fontSize = [
    { value: '12', text: '12px', type: 1 },
    { value: '13', text: '13px', type: 2 },
    { value: '14', text: '14px', type: 3 },
    { value: '15', text: '15px', type: 4 },
    { value: '16', text: '16px', type: 5 },
  ];
  fontState = {
    fWeight: false,
    fItalic: false,
  };

  render() {
    return (
      <div styleName="fontset">
        <ul
          onClick={(e) => {
            this.cancelPropagation(e);
          }} className="list-inline"
        >
          <li>
            选择字体:
          </li>
          <li>
            <select
              onChange={(e) => {
                this.setFontFaimly(e);
              }}
            >
              {
                this.fontFaimly.map((item, n) => <option
                  data-type={item.type}
                  key={n}
                  value={item.value}
                >{item.text}</option>)
              }

            </select>
          </li>
          <li>
            <select
              onChange={(e) => {
                this.setFontSize(e);
              }}
            >
              {
                this.fontSize.map((item, n) =>
                  <option
                    key={n}
                    value={item.value}
                  >{item.text}</option>)
              }
            </select>
          </li>
          <li><span onClick={this.setFontWeight} styleName="fontWeight">B</span>
          </li>
          <li>
            <span onClick={this.setFontItalic} styleName="fontItalic">I</span>
          </li>
        </ul>
      </div>
    );
  }
}
export default cssModules(FontSet, styles, { errorWhenNotFound: false });
