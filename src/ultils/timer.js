/**
 * Created by kiny on 16/10/16.
 */


export default class Timer {
  loginTimeOut = LOGIN_TIME_OUT_COUNT;
  goingTimeout = LOGIN_TIME_OUT_COUNT - GOING_TIME_OUT_TIME;
  countTime = 0;
  arr = [];
  onLoginTimeOut = () => {};
  onGoingTimeOut = () => {};

  constructor() {
    this.timer = setInterval(this.onTimeCheck, 1000); // 1s刷新一次

    document.body.addEventListener('click', this.restLoginTimeOut);
    document.body.addEventListener('keypress', this.restLoginTimeOut);
  }

  clear() {
    document.body.removeEventListener('click', this.restLoginTimeOut);
    document.body.removeEventListener('keypress', this.restLoginTimeOut);

    window.clearInterval(this.timer);
    this.timer = null;
    this.arr = [];
    this.onLoginTimeOut = null;
    this.onGoingTimeOut = null;
  }

  registerTimer(sec, callBack) {
    this.arr.push({ sec, callBack });
  }

  checkLogin() {
    if (this.loginTimeOut === 0) {
      this.onLoginTimeOut();
    }
    if (this.loginTimeOut === this.goingTimeout) {
      this.onGoingTimeOut();
    }
    // console.log(this.loginTimeOut);
    this.loginTimeOut -= 1;
  }

  onTimeCheck = () => {
    // 如果登录超时，停止所有检查
    if (this.loginTimeOut >= 0) {
      this.checkLogin();
      this.loopCheck();
    }
  };

  loopCheck() {
    this.arr.forEach((i) => {
      if (this.countTime % i.sec === 0) i.callBack();
    });
    this.countTime += 1;
  }

  reset() {
    this.countTime = 0;
    this.restLoginTimeOut();
  }

  restLoginTimeOut = () => {
    this.loginTimeOut = LOGIN_TIME_OUT_COUNT;
  };

}
