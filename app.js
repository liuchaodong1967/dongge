const util = require('utils/util.js');
//app.js
App({

  onLaunch: function (option) {

    var that = this;
    if (option.query.hasOwnProperty('scene')) {
      switch (option.scene) {
        //扫描小程序码
        case 1047:
          that.globalData.code = option.query.scene;
          break;
        //长按图片识别小程序码
        case 1048:
          that.globalData.code = option.query.scene;
          break;
        //手机相册选取小程序码
        case 1049:
          that.globalData.code = option.query.scene;
          break;
        //直接进入小程序
        case 1001:
          that.globalData.spid = option.query.scene;
          break;
      }
    }


    // 获取导航高度；
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 97;
      }, fail(err) {
        console.log(err);
      }
    })


  },

  globalData: {
    navHeight: 0,
    routineStyle: '#ffffff',
    openPages: '',
    token: '',
    isLog: false,
    code: 0,
    spid: 0,
    userInfo: null,
    navHeight: 0,
	url:'https://m.bang114.cn/'
  },

  tcTips: function (title, icon){
    wx.showToast({
      title: title,
      icon: icon,
      duration: 2000
    })
  },

/*
  * 信息提示 + 跳转
  * @param object opt {title:'提示语',icon:''} | url
  * @param object to_url 跳转url 有5种跳转方式 {tab:1-5,url:跳转地址}
  */
  Tips: function (opt, to_url) { 
    return util.Tips(opt, to_url);
  },

  /**
  * 快捷调取助手函数
 */
  help: function () {
    return util.$h;
  },

  /*
* 合并数组
* @param array list 请求返回数据
* @param array sp 原始数组
* @return array
*/
  SplitArray: function (list, sp) { 
	  return util.SplitArray(list, sp) 
  },




})