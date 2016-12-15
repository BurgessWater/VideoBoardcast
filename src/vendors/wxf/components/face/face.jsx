/**
 * Created by wenxinfu on 2016/9/29.
 */
import React from 'react';
import cssModules from 'react-css-modules';
import styles from './face.scss';

class Face extends React.Component {
  static defaultProps = {
    parentFace() {
    },
  }
  static propTypes = {
    parentFace: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.initFace();
  }

  state = {
    faces: this.faces,
  }

  choose = (e, tip) => {
    this.props.parentFace(tip);
  }

  faces = [];

  mHover = (e, item) => {
    for (const face of this.faces) {
      face.hover = false;
      if (face.id === item) {
        face.hover = !item.hover;
      }
    }
    this.setState({ faces: this.faces });
  }

  initFace = () => {
    for (let i = 1; i <= 75; i += 1) {
      const tips = `em_${i}`;
      this.faces.push({
        tip: tips,
        path: require(`../../assets/face/${i}.ico`),
        hover: false,
        id: i,
      });
    }
  };

  render() {
    return (
      <div>
        <div styleName="face-icon">
          <ul className="list-group  list-inline text-left">
            {
              this.faces.map(face =>
                <li
                  key={face.id}
                  styleName={face.hover ? 'current' : ''}
                  onMouseOver={(e) => {
                    this.mHover(e, face.id);
                  }}
                ><img
                  role="presentation"
                  data-name={face.tip}
                  id={face.tip}
                  onClick={(e) => {
                    this.choose(e, face.tip);
                  }}
                  draggable="false" src={face.path}
                />
                </li>
              )
            }
          </ul>
        </div>
      </div>
    );
  }
}
export default cssModules(Face, styles, { allowMultiple: true, errorWhenNotFound: false });
