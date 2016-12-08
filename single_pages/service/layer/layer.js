/**
 * Created by fighter on 2016/9/29.
 */
/*------弹窗-----*/
;(function() {
  function Layer() {
    this.test = function(){
      var dSetting = {
          single: true,
          showTitle: false,
          title: "sfsdfsafss",
          content: "ssss",
          time: 0, // 0 不消失
          showBtn: false,
          yesVal: "Yes",
          yes: function() {console.log(9)},
          noVal: "No",
          no: null,
          cancel: false,
          mask: false,
        };
        // 重置传入的参数中相关设置
        this.show(dSetting,'userForm');

    };

    this.wait = function(setting) {
      var selfSetting = {
        "mask": true,
      };
      selfSetting = this.extend(selfSetting, setting);
      this.show(selfSetting,'wait');
    };

    this.tips = function(setting) {
      var selfSetting = {
        time: 3000,
      };
      selfSetting = this.extend(selfSetting, setting);
      this.show(selfSetting);
    };

    this.alert = function(setting) {
      var selfSetting = {
        time: 0,
        showTitle: true,
        showBtn: true,
        yesVal: "我知道了",
      };
      selfSetting = this.extend(selfSetting, setting);
      this.show(selfSetting);
    };
  }

  Layer.prototype = {

    defaultSetting: {
      single: true,
      showTitle: true,
      title: "",
      content: "",
      time: 0, // 0 不消失
      showBtn: false,
      yesVal: "Yes",
      yes: null,
      noVal: "No",
      no: null,
      cancel: false,
      mask: false,
    },

    extend: function(sonObj, parentObj) {
      var o = {};
      for(var s in sonObj) o[s] = sonObj[s];
      for(var p in parentObj) o[p] = parentObj[p];
      return o;
    },

    show: function(setting, type) {
      var opts = this.extend(this.defaultSetting, setting),
          parentID = opts.pid || undefined,
          rect,e;

      this.createLayerBox(opts);

      var layMain = document.querySelector(".lay-main");

      if(typeof type !== 'undefined' && type === 'wait'){
        layMain.className = 'lay-main lay-wait';
      } else {
        layMain.className = 'lay-main lay-nowait';
        this.createTitle(opts);
        this.createContent(opts);
        this.createBtn(opts);
      }


      if(parentID === undefined){
        e = document.documentElement;
        rect = { left: 0, top: 0, width: e.clientWidth, height: e.clientHeight };
      } else {
        e = document.getElementById(parentID);
        rect = e.getBoundingClientRect();
      }
      var r = layMain.getBoundingClientRect();
      var left = rect.left + ((rect.width - r.width) / 2);
      var top = rect.top + ((rect.height - r.height) / 2);
      var style = 'top:'+ top +'px; left:'+ left +'px';
      layMain.setAttribute('style', style);


      if(opts.time !== 0){
        if(typeof this.timer !== "undefined"){
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(this.close, opts.time);
      }
    },
    close: function() {
      var layBox = document.querySelector('.lay-box');
        if (layBox && layBox.style.display !== "none") {
        layBox.style.display = "none";
        layBox.parentNode.removeChild(layBox);
      }
    },

    // 创建弹窗div(已存在则替换)
    createLayerBox: function(opts) {
      var layBox = document.querySelector('.lay-box'),
          layMask = document.querySelector('.lay-mask'),
          layMain = document.querySelector('.lay-main');

      if(!layBox) {
        layBox = this.createSelfElement('div', {'class':'lay-box'}, 'body');
      }

      if(opts.mask && !layMask) {
        this.createSelfElement('div', {'class':'lay-mask'}, '.lay-box');
      } else if(!opts.mask && layMask) {
        layMask.parentNode.removeChild(layMask);
      }

      if(!layMain) {
        this.createSelfElement('div', {'class':'lay-main'},'.lay-box');
      } else {
        while(layMain.hasChildNodes()){
          layMain.removeChild(layMain.firstChild);
        }
      }
      return layBox;
    },

    createTitle: function(opts) {
      if(opts.showTitle){
        var layTitle = this.createSelfElement('div', {'class':'lay-title'}, '.lay-main');
        var title = this.createSelfElement('span');
        var tCont = document.createTextNode(opts.title);
        title.appendChild(tCont);
        layTitle.appendChild(title);
      }
    },

    createContent: function(opts) {
      var layContent = this.createSelfElement('div', {'class':'lay-content'}, '.lay-main');
      var content = this.createSelfElement('span');
      var cCont = document.createTextNode(opts.content);
      content.appendChild(cCont);
      layContent.appendChild(content);

    },

    createBtn: function(opts) {
      if(opts.showBtn){
        var btn,btnVal;

        this.createSelfElement('div', {'class':'lay-btn'} , '.lay-main');

        if(typeof opts.yes === 'function') {
          btn = this.createSelfElement('button', '.lay-btn');
          btn.onclick = opts.yes;
          btnVal = document.createTextNode(opts.yesVal);
          btn.appendChild(btnVal);
        }
        if(typeof opts.no === 'function') {
          btn = this.createSelfElement('button', '.lay-btn');
          btn.onclick = opts.no;
          btnVal = document.createTextNode(opts.noVal);
          btn.appendChild(btnVal);
        }
      }
    },

    createSelfElement: function(elName, props, parentEl) {
      var el = document.createElement(elName);

      if(typeof props === 'object') {
        for(var p in props){
          el.setAttribute(p, props[p]);
        }
      }else if(typeof props !== 'undefined') {
        parentEl = props;
      }

      if(typeof parentEl !== 'undefined') {
        var parentElName = document.querySelector(parentEl);
        if(!!parentElName){
          parentElName.appendChild(el);
        }
      }

      return el;
    },


  };

  window.layer = window.layer || new Layer();
}());

/*------弹窗-----*/