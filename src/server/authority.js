/**
 * Created by kiny on 16/10/16.
 */

// 授权码
const INVEST_VIEW_CODE = '004';      // 投资宝典浏览权限004
const STRATEGY_VIEW_CODE = '005';    // 即时策略浏览权限005
const SCORE_VIEW_CODE = '006';       // 战机回顾浏览权限006
const COURSE_VIEW_CODE = '007';      // 课程安排浏览权限007
const INVEST_EDIT_CODE = '008';      // 投资宝典编辑权限008
const STRATEGY_EDIT_CODE = '009';    // 即时策略编辑权限009
const SCORE_EDIT_CODE = '010';       // 战绩回顾编辑权限010
const COURSE_EDIT_CODE = '011';      // 课程安排编辑权限011
const NOTICE_EDIT_CODE = '012';      // 最新通告编辑权限012
const ROBOT_CODE = '013';            // 机器人发言   013
const CHAT_REVIEW_CODE = '015';      // 聊天审核 015

export default class Authority {
  currCheckFunID = -1; // 当前检查的功能ID

  constructor(d = null) {
    this.data = d;
  }

  loopCheck(code) {
    if (this.data === null) return false;
    for (let i = 0, len = this.data.length; i < len; i += 1) {
      const item = this.data[i];
      if (item.funcode === code) {
        this.currCheckFunID = item.funid;
        return item.hasfun === 1;
      }
    }
    this.currCheckFunID = -1;
    return false;
  }

  get isNoticeEditEnable() {
    return this.loopCheck(NOTICE_EDIT_CODE);
  }

  get isInvestEditEnable() {
    return this.loopCheck(INVEST_EDIT_CODE);
  }

  get isInvestViewEnable() {
    return this.loopCheck(INVEST_VIEW_CODE);
  }

  get isStrategyViewEnable() {
    return this.loopCheck(STRATEGY_VIEW_CODE);
  }

  get isStrategyEditEnable() {
    return this.loopCheck(STRATEGY_EDIT_CODE);
  }

  get isScoreViewEnable() {
    return this.loopCheck(SCORE_VIEW_CODE);
  }

  get isScoreEditEnable() {
    return this.loopCheck(SCORE_EDIT_CODE);
  }

  get isCourseViewEnable() {
    return this.loopCheck(COURSE_VIEW_CODE);
  }

  get isCourseEditEnable() {
    return this.loopCheck(COURSE_EDIT_CODE);
  }

  get isRobotEnable() {
    return this.loopCheck(ROBOT_CODE);
  }

  get isChatReviewEnable() {
    return this.loopCheck(CHAT_REVIEW_CODE);
  }
}
