var app = getApp();
import requestApi from '../../utils/request.js'; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '订单详情',
      'color': true,
      'class': '0'
      // 'class': '2' 顶部为灰色
    },
    order_id:'',
    evaluate:0,
    cartInfo:[],//购物车产品
    orderInfo:{},//订单详情
    isGoodsReturn:false,//是否为退款订单
    status:{},//订单底部按钮状态
    isClose:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.order_id) this.setData({ order_id: options.order_id});
    if (options.isReturen){
      this.setData({ 'parameter.class': '2', isGoodsReturn:true });
      this.selectComponent('#navbar').setClass();
    }
  },

  /**
   * 登录授权回调
   * 
  */
  onLoadFun:function(){
    this.getOrderInfo();
  },
  /**
   * 获取订单详细信息
   * 
  */
  getOrderInfo:function(){
    var that=this;
    wx.showLoading({ title: "正在加载中" });
	requestApi('mini/order/get_order_details', 'GET', {order_id:this.data.order_id}).then((res) => {
		console.log(res);
		var _type=res.data.data._status._type;
		wx.hideLoading();
		that.setData({ orderInfo: res.data.data, cartInfo: res.data.data.cartInfo, evaluate: _type==3 ? 3: 0});
		that.getOrderStatus();
	});
  },
  /**
   * 
   * 剪切订单号
  */
  copy:function(){
    var that=this;
    wx.setClipboardData({data: this.data.orderInfo.order_id});
  },
  /**
   * 打电话
  */
  goTel:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.orderInfo.delivery_id
    })
  },

  /**
   * 设置底部按钮
   * 
  */
  getOrderStatus:function(){
    var orderInfo = this.data.orderInfo || {}, _status = orderInfo._status || { _type:0},status={};
    var type = parseInt(_status._type), combination_id = orderInfo.combination_id || 0, delivery_type = orderInfo.delivery_type,
      seckill_id = orderInfo.seckill_id ? parseInt(orderInfo.seckill_id) : 0, 
      bargain_id=orderInfo.bargain_id ? parseInt(orderInfo.bargain_id) : 0,
      combination_id = orderInfo.combination_id ? parseInt(orderInfo.combination_id) : 0;
    status={
      type: type,
      class_status:0
    };
    if (type == 1 && combination_id >0) status.class_status = 1;//查看拼团
    if (type == 2 && delivery_type == 'express') status.class_status = 2;//查看物流
    if (type == 2) status.class_status = 3;//确认收货
    if (type == 4 || type == 0) status.class_status = 4;//删除订单
    if (!seckill_id && !bargain_id && !combination_id && (type == 3 || type == 4)) status.class_status = 5;//再次购买
    this.setData({ status: status});
  },
  /**
   * 去拼团详情
   * 
  */
  goJoinPink:function(){
    wx.navigateTo({
      url: '/pages/activity/goods_combination_status/index?id=' + this.data.orderInfo.pink_id,
    });
  },
  /**
   * 立即付款
   * 
  */
  checkPay:function(){
    var that=this;
    wx.showActionSheet({  //底部弹出插件
       //itemList: ['微信支付', '余额支付'],
	  itemList: ['微信支付'],
      success(res) {
        //var paytype = res.tapIndex ? 'yue' :'weixin';
		var paytype = 'weixin';
        wx.showLoading({ title: '支付中' });

		requestApi('mini/order/wx_pay_order', 'GET', { order_id: that.data.orderInfo.order_id, paytype: paytype}).then((res) => {
			 var jsConfig = res.data.wxConfig;
			 //console.log(jsConfig);
			 if(res.data.code != 200 )return app.Tips({title:res.data.msg},'/pages/order_list/index');
			 wx.requestPayment({
				  timeStamp: jsConfig.timestamp,
				  nonceStr: jsConfig.nonceStr,
				  package: jsConfig.package,
				  signType: jsConfig.signType,
				  paySign: jsConfig.paySign,
				 
				  success: function (res) {
					wx.hideLoading();
					return app.Tips({ title: '支付成功', icon:'success'},function(){
					  that.getOrderInfo();
					});
				  },
				  fail: function (e) {
					wx.hideLoading();
					return app.Tips({ title: '取消支付' });
				  },
				  complete: function (e) {
					wx.hideLoading();
					if (res.errMsg == 'requestPayment:cancel') return app.Tips({ title: '取消支付' });
				  },
			 });
		});

      }
    })  //底部弹出插件结束
  },


  /**
   * 再次购买按钮
   * 
  */
  goOrderConfirm:function(){
    var that=this;
	requestApi('mini/order/again_order', 'GET', {order_id:that.data.orderInfo.order_id}).then((res) => {
			 return wx.navigateTo({ url:'/pages/order_confirm/index?cartId='+res.data.data});	
	});
  },

  //确认收货

  confirmOrder:function(){
    var that=this;
    wx.showModal({
      title: '确认收货',
      content: '为保障权益，请收到货确认无误后，再确认收货',
      success: function (res) {
        if (res.confirm) {
			requestApi('mini/order/received', 'GET', {order_id:that.data.order_id}).then((res) => {
				 if(res.data.code == 200){
					 return app.Tips({title:'操作成功',icon:'success'},function(){
						that.getOrderInfo();
					 });
				 }
			});
        }
      }
    })
  },
  /**
   * 
   * 删除订单
  */
  delOrder:function(){
    var that=this;
	requestApi('mini/order/remove_order', 'GET', {order_id:this.data.order_id}).then((res) => {
		
			 return app.Tips({title:'删除成功',icon:'success'},{tab:3,url:1});

	});
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isLog && this.data.isClose) {
      this.getOrderInfo();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isClose: true });
  },
})