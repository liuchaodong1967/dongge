// pages/bargain-list/index.js
var app = getApp();
import requestApi from '../../../utils/request.js'; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topList:[],
    bargainList:[],
    offset:0,
    limit:20,
    status:false,
    userInfo:[],
    navH:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    console.log(app.globalData.navHeight+'aa');
  },

  goBack:function(){
    wx.navigateBack({ delta: 1 })
  },

  onLoadFun: function () {
    this.getBargainList();
   // this.getUserInfo();
  },

  getUserInfo: function () {
    var that = this;
    app.baseGet(app.U({ c: 'user_api', a:'get_my_user_info'}),function(res){
      that.setData({ userInfo:res.data });
    },function(res){ console.log(res) });
  },


  getBargainList:function(){
    var that = this;
    if (that.data.status) return;
    var offset = that.data.offset;
    var limit = that.data.limit;
	requestApi('mini/bargain.index/bargain_list', 'GET', {  offset: offset, limit:limit}).then((res) => {
		console.log(res.data.data);
	  that.setData({ 
			bargainList: res.data.data,
			offset: Number(offset) + Number(limit),
			status: limit > res.data.data.length,
      });

	})
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getBargainList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})