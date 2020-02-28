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
      'title': '领取优惠券',
      'color': false
    },
    couponsList:[],
    loading:false,
    loadend:false,
    page:1,
    limit:20,
  },

  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUseCoupons();
  },

  getCoupon:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var list = that.data.couponsList;
    //领取优惠券
	requestApi('mini/user.Coupons/give_coupons', 'POST', { couponId: id}).then((res) => {
			 list[index].is_use = true;
			 console.log(list);
			  that.setData({
				couponsList: list
			  });
			 app.Tips({ title: '领取成功' });
			 //return app.Tips({title:res.msg});
	});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 获取领取优惠券列表
  */
  getUseCoupons:function(){
    var that=this
    if(this.data.loadend) return false;
    if(this.data.loading) return false;
	requestApi('mini/user.Coupons/receive_coupon', 'GET', {page:this.data.page,limit:this.data.limit}).then((res) => {
			  var list=res.data.data,loadend=list.length < that.data.limit;
			  var couponsList = app.SplitArray(list, that.data.couponsList);
			  console.log(couponsList);
			  that.setData({ 
				loading: true, 
				couponsList: couponsList,
				page:that.data.page+1,
				loadend: loadend
			  });
			//that.setData({ loading:false});
	});
   

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getUseCoupons();
  },


})