/**
 * Created by kiny on 16/9/25.
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import cssModules from 'react-css-modules';
import styles from './user-online.scss';
import { chatToUser } from '../model/action';
// import ChatApi from '../server/api/chat-api';

@cssModules(styles, { errorWhenNotFound: false })
class UserOnline extends React.Component {

  static propTypes = {
    onlines: PropTypes.object,
    dispatch: PropTypes.func,
    onlineNum: PropTypes.number,
  };

  onUserClick({ name, id }) {
    this.props.dispatch(chatToUser({ name, id }));
  }

  render() {
    const { users = [], robots = [] } = this.props.onlines;
    const usersArr = users.map((i) => {
      const { groupimg: icon, groupname, custname: name, custid: id } = i;
      return { icon, groupname, name, id };
    });
    const onlineRobots = robots.map((i) => {
      const { groupimg: icon, groupname, nikename: name, robotid: id } = i;
      return { icon, groupname, name, id };
    });
    const arr = [...onlineRobots, ...usersArr];
    return (
      <div styleName="online">
        <h3 styleName="title" className="title-bg-color title-text-color user-online-bg ">
          在线用户人数<span styleName="count">({this.props.onlineNum + arr.length})</span>
        </h3>
        <div styleName="content" className="container-bg-color text-color">
          <ol>
            {arr.map((i, idx) => (
              <li key={`${i.id}|${idx}`} onClick={() => this.onUserClick(i)}>
                <span styleName="icon"><img src={i.icon} alt="lv" /></span>
                <span styleName="name">{i.name}</span>
                <span styleName="lv">{i.groupname}</span>
              </li>)
            )}
          </ol>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    onlines: state.onlineInfo,
    onlineNum: state.userState.maxonline,
  };
}

export default connect(mapStateToProps)(UserOnline);
