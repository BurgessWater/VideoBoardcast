import { postJSON, videoCMD, wrapWithRoomID } from '../helper';

// 直播间
export class LiveVideoApi {
  // 获得所有直播间信息 001
  static getAllRoomsStatus() {
    return postJSON(
      videoCMD({ fc: '001' }),
      LiveVideoApi.getAllRoomsStatus.name
    );
  }

  // 单个直播间信息 002
  static getRoomInfo(roomid) {
    return postJSON(
      videoCMD({ fc: '002', roomid }),
      LiveVideoApi.getRoomInfo.name
    );
  }

  // 导航栏设置 003
  static getMainNavInfo() {
    return postJSON(
      wrapWithRoomID({ fc: '003' }),
      LiveVideoApi.getMainNavInfo.name
    );
  }

  // 自定义功能按钮 004
  static getCustomNavInfo() {
    return postJSON(
      wrapWithRoomID({ fc: '004' }),
      LiveVideoApi.getCustomNavInfo.name
    );
  }
}

// 课程安排
export class CourseAPI {
  static get() {
    return postJSON(
      wrapWithRoomID({ fc: '005', count: '32' }),
      `${CourseAPI.name}.${CourseAPI.get.name}`
    );
  }

  static addOrupdate(obj) {
    return postJSON(
      wrapWithRoomID({
        fc: '006',
        ...obj,
      }),
      `${CourseAPI.name}.${CourseAPI.addOrupdate.name}`
    );
  }

  static del(id) {
    return postJSON(
      videoCMD({ fc: '007', courseid: id }),
      `${CourseAPI.name}.${CourseAPI.del.name}`
    );
  }
}

// 投资宝典
export class InvestApi {
  static get(pindex = 1) {
    return postJSON(
      wrapWithRoomID({ fc: '008', count: '32', pagesize: 5, pindex }),
      `${InvestApi.name}.${InvestApi.get.name}`
    );
  }

  static addOrUpdate(obj) {
    return postJSON(
      wrapWithRoomID({ fc: '009', ...obj }),
      `${InvestApi.name}.${InvestApi.addOrUpdate.name}`
    );
  }

  static del(id) {
    return postJSON(
      videoCMD({ fc: '010', investid: id }),
      `${InvestApi.name}.${InvestApi.del.name}`
    );
  }
}

// 即时策略
export class StrategyApi {
  static get(pindex = 1) {
    return postJSON(
      wrapWithRoomID({ fc: '011', count: '32', pagesize: 5, pindex }),
      `${StrategyApi.name}.${StrategyApi.get.name}`
    );
  }

  static addOrUpdate(obj) {
    return postJSON(
      wrapWithRoomID({
        fc: '012',
        ...obj,
      }),
      `${StrategyApi.name}.${StrategyApi.addOrUpdate.name}`
    );
  }

  static del(id) {
    return postJSON(
      videoCMD({ fc: '013', strategyid: id }),
      `${StrategyApi.name}.${StrategyApi.del.name}`
    );
  }
}

// 公告
export class NoticeApi {
  static get(pindex = 1, pagesize = 5) {
    return postJSON(
      wrapWithRoomID({ fc: '014', pagesize, pindex }),
      `${NoticeApi.name}.${NoticeApi.get.name}`
    );
  }

  static addOrUpdate(obj) {
    return postJSON(
      wrapWithRoomID({ fc: '015', ...obj }),
      `${NoticeApi.name}.${NoticeApi.addOrUpdate.name}`
    );
  }

  static del(id) {
    return postJSON(
      videoCMD({ fc: '016', noticeid: id }),
      `${NoticeApi.name}.${NoticeApi.del.name}`
    );
  }
}

// 关于我们
export class AboutUsApi {
  static get() {
    return postJSON(
      wrapWithRoomID({ fc: '017' }),
      AboutUsApi.name
    );
  }

  // static addOrUpdate() {
  //   return postJSON(
  //     videoCMD({ fc: '018', aboutId: 33, conent: '' })
  //   );
  // }
}

// 获取随机机器人
export function getRadmonRobot() {
  return postJSON(
    videoCMD({ fc: '020', count: '33' }), getRadmonRobot.name
  );
}

// 获取广播消息
export function getBroadcast(noticeid = 0) {
  return postJSON(
    wrapWithRoomID({ fc: '021', count: '33', noticeid }), getBroadcast.name
  );
}
