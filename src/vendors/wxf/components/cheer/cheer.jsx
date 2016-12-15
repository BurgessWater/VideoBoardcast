/**
 * Created by wenxinfu on 2016/9/29.
 */
import React from 'react';
import cssModules from 'react-css-modules';
import styles from './cheer.scss';

class Cheer extends React.Component {
  static defaultProps = {
    parentCheer() {
    },
  }
  static propTypes = {
    parentCheer: React.PropTypes.func.isRequired,
  }

  state = {
    cheers: this.cheers,
  };

  setCheers = (e, type) => {
    this.props.parentCheer(type);
  }

  cheers = [
    { type: 1, name: '顶一个', hover: false },
    { type: 2, name: '赞一个', hover: false },
    { type: 3, name: '掌声', hover: false },
    { type: 4, name: '鲜花', hover: false }];

  mHover = (e, type) => {
    for (const cheer of this.cheers) {
      cheer.hover = false;
      if (cheer.type === type) {
        cheer.hover = !cheer.hover;
      }
    }
    this.setState({ cheers: this.cheers });
  }

  render() {
    return (
      <div styleName="cheer">
        <ul>
          {
            this.cheers.map((item, n) =>
              <li
                key={n}
                styleName={item.hover ? 'current' : ''}
                onClick={(e) => {
                  this.setCheers(e, item.type);
                }}
                onMouseOver={(e) => {
                  this.mHover(e, item.type);
                }}
              >{item.name}</li>)
          }
        </ul>
      </div>
    );
  }
}
export default cssModules(Cheer, styles, { errorWhenNotFound: false });
