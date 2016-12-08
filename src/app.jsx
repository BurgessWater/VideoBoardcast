/**
 * Created by kiny on 16/9/7.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './css/main.scss';
import House from './vendors/jr/houses';
import Room from './views/room';

import { requestGuestLoginFromRoom, requestRoomInfo } from './model/action';
import { NONE } from './server/define';

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    myState: PropTypes.object,
    onlinesRobots: PropTypes.array,
  };

  constructor(props) {
    super(props);
    const { roomID } = this.props.myState;
    if (roomID === NONE) {
      this.props.dispatch(requestGuestLoginFromRoom());
    }
  }

  render() {
    const { dispatch, myState, onlinesRobots } = this.props;
    const haveSelectedRoom = myState.roomID !== NONE;
    const len = myState.rooms.length;
    if (haveSelectedRoom) {
      return <Room dispatch={dispatch} myState={myState} onlinesRobots={onlinesRobots} />;
    } else if (len > 1) { // 当房间大于1个，显示选房间
      return (<House
        dispatch={dispatch} rooms={myState.rooms}
        userName={myState.displayUserName}
        isLogin={myState.isLogin}
      />);
    } else if (len === 1) { // 当房间等于1个，直接进入房间
      const roomid = myState.rooms.pop().roomid;
      this.props.dispatch(requestRoomInfo(roomid));
    }
    return (<House
      dispatch={dispatch} rooms={myState.rooms}
      userName={myState.displayUserName}
      isLogin={myState.isLogin}
    />);
  }
}

function mapStateToProps(state) {
  return {
    myState: state.userState,
    onlinesRobots: state.onlineInfo.robots, //TODO: 改为chat获取state
  };
}

export default connect(mapStateToProps)(App);
