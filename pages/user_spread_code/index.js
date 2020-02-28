// pages/distribution-posters/index.js
const app = getApp();
import requestApi from '../../utils/request.js'; 
import aibum from '../../utils/aibum.js'; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '分销海报'
    },
    imgUrls: [],
    indicatorDots: false,
    circular: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    swiperIndex: 0,
    spreadList:[],
    userInfo:{},
    poster:'',
  },
  onLoadFun:function(){
    this.getUserInfo();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindchange(e) {
    var spreadList = this.data.spreadList;
    this.setData({
      swiperIndex: e.detail.current,
      poster: spreadList[e.detail.current].poster,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  

  //获取用户信息
  getUserInfo:function(){
    var that=this;
  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.userSpreadBannerList();
  },
  
  //保存推广图片
  savePosterPath: function () {
    var that = this;
	aibum.Authalbum(function(res){
		console.log(res);
		aibum.DownloadImage(that.data.poster);
	},function(erreo){
		console.log(erreo);
	})
  },
	
  //服务端获取推广图片
  userSpreadBannerList: function () {
    var that = this;
    wx.showLoading({
      title: '获取中',
      mask: true,
    })
  
      wx.hideLoading();
	if(that.data.poster){
		return that.setData({poster: res.data.data });

	}
 	requestApi('mini/MakeImages/user_index_code', 'POST', {}).then((res) => {
		
			 console.log( res.data.data);
		that.setData({poster: res.data.data });
			

	})
      
    
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

  },

  //监听用户分享动作，可以给与积分加
  set_user_share: function () {
   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.set_user_share();
    return {
      title: this.data.userInfo.nickname+'-分销海报',
      imageUrl: this.data.spreadList[0],
      path: '/pages/index/index?spid=' + this.data.userInfo.uid,
    };
  }
})