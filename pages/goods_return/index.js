// pages/apply-return/index.js
const app=getApp();
const util = require('../../utils/util.js');
import requestApi from '../../utils/request.js'; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '申请退货',
      'color': false
    },
    refund_reason_wap_img:[],
    orderInfo:{},
    RefundArray: [],
    index: 0,
    orderId:0,
  },
  /**
   * 授权回调
   * 
  */
  onLoadFun:function(){
    this.getOrderInfo();
    this.getRefundReason();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.orderId) return app.Tips({title:'缺少订单id,无法退款'},{tab:3,url:1});
    this.setData({orderId:options.orderId});
  },
  /**
   * 获取订单详情
   * 
  */
  getOrderInfo:function(){
    var that=this;
	requestApi('mini/order/get_order_details', 'GET', {order_id:this.data.orderId}).then((res) => {
		that.setData({orderInfo:res.data.data});
	});
   
  },
  /**
   * 获取退款理由
  */
  getRefundReason:function(){ 
    var that=this;
	requestApi('mini/public_api/get_refund_reason', 'GET', {}).then((res) => {
		that.setData({ RefundArray:res.data.data});
	});
   
  },

  /**
   * 删除图片
   * 
  */
  DelPic:function(e){
    var index = e.target.dataset.index, that = this, pic = this.data.refund_reason_wap_img[index];
	requestApi('mini/public_api/delete_image', 'GET', { pic: pic.replace(app.globalData.url, '')  }).then((res) => {
      that.data.refund_reason_wap_img.splice(index,1);
      that.setData({ refund_reason_wap_img: that.data.refund_reason_wap_img });
    });
  },

  /**
   * 上传图片
   * 
  */
  uploadpic:function(){
	  var that=this;
	  util.uploadImageOne(function(res){
		that.data.refund_reason_wap_img.push(app.globalData.url+res.data);
		that.setData({ refund_reason_wap_img: that.data.refund_reason_wap_img});
	 });
  },


  /**
   * 申请退货按钮
  */
  subRefund:function(e){
    var that = this, formId = e.detail.formId, value = e.detail.value;
    //收集form表单
    // if (!value.refund_reason_wap_explain) return app.Tips({title:'请输入退款原因'}); 
    //app.baseGet(app.U({ c: 'public_api', a: 'get_form_id', q: { formId: formId}}),null,null,true);//formId表单
	requestApi('mini/order/apply_order_refund', 'POST', {
		text: that.data.RefundArray[that.data.index] || '',
		refund_reason_wap_explain: value.refund_reason_wap_explain,
		refund_reason_wap_img: that.data.refund_reason_wap_img.join(','),
		order_id: that.data.orderId
	}).then((res) => {
			if(res.data.code ==200) return app.Tips({ title: '退款提交成功', icon: 'success' },{tab:3,url:3});
			return app.Tips({title:res.data.msg});

	});
  },

  bindPickerChange: function (e) {
    this.setData({index: e.detail.value});
  },

})