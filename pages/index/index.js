var app = getApp();
var Util= require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    itemNew:[],
    activityList:[],
    menus: [],
    bastBanner: [],
    bastInfo: '',
    bastList: [],
    fastInfo: '',
    fastList: [],
    firstInfo: '',
    firstList: [],
    salesInfo: '',
    likeInfo: [],
    lovelyBanner: [],
    benefit:[],
    hotList:[],
    indicatorDots: false,
    circular: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    parameter:{
      'navbar':'0',
      'return':'0'
    },
    window: false,
    page: 1, 
    loadText: '加载更多', 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.spid) app.globalData.spid = options.spid;
    if (options.scene) app.globalData.code = decodeURIComponent(options.scene);
  },
  catchTouchMove: function (res) {
    return false
  },
  onColse:function(){
    this.setData({ window: false});
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getIndexConfig();
    if(app.globalData.isLog && app.globalData.token) this.get_issue_coupon_list();
  },

  get_issue_coupon_list: function () {
    var that = this;
    app.baseGet(app.U({ c: 'coupons_api', a: 'get_issue_coupon_list', q: { limit: 3 } }), function (res) {
      that.setData({ couponList: res.data });
      if (!res.data.length) that.setData({ window: false });
    });
  },
  getIndexConfig:function(){
    var that = this;
    var url = app.U({ c: 'public_api', a: 'indexdata' }, app.globalData.url);
    app.baseGet(url,function(res){
      //console.log(res.data.banner)
      that.setData({ 
        imgUrls: res.data.banner,    //头部banner
        itemNew: res.data.roll, //新闻内容
        activityList: res.data.activity, //广告图片
        chaoliu: res.data.chaoliu,//时尚潮流
        top: res.data.top,  //热门top
        logoUrl: res.data.logoUrl,
        couponList: res.data.couponList
      });
      
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            that.setData({ window: that.data.couponList.length ? true : false});
          }else{
            that.setData({ window: false });
          }
        }
      });
    });
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ window:false});
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getIndexConfig();
    if (app.globalData.isLog && app.globalData.token) this.get_issue_coupon_list();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this;
    var datainfo = that.data.hotList;
    var page = that.data.page; 

    if (that.data.loding === false) {
       return;
    }

    var url = app.U({ c: 'public_api', a: 'index2', q: { page: page+1} }, app.globalData.url);
    app.baseGet(url, function (res) {
      var indata = res.data;
      console.log(indata)
      if (indata.length < 1){
        that.setData({
          loadText: "无数据啦",
          loding: false
        });
      }else{
        that.setData({
          hotList: datainfo.concat(indata), //拼接数据  
          page: that.data.page + 1,
          loding: true
        });
      }
    
    })
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '一个分享赚钱，自买省钱的童装商城，来看看吧！',
      desc: '一个分享赚钱，自买省钱的童装商城，来看看吧！',
      imageUrl: 'https://images.bang114.cn/85ae6201907151739589010.jpg',
      path: 'pages/index/index'
    }
  }
})