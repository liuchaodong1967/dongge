// pages/coupon-list/index.js
const app=getApp();
import requestApi from '../../utils/request.js'; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '我的优惠券',
      'color': false
    },
	type:0,
    couponsList:[],
    loading:false,
  },

  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUseCoupons();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 获取我的优惠券列表
  */
  getUseCoupons:function(){
    var that = this;
	requestApi('mini/user.Coupons/my_coupon_list', 'GET', {type:that.data.type}).then((res) => {
		that.setData({ loading: true, couponsList:res.data.data});
	})

  },

  chektab:function(e){
			this.setData({type:e.target.id});
			this.getUseCoupons();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})