// pages/cash-withdrawal/index.js
const app = getApp();
import requestApi from '../../utils/request.js'; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '提现',
      'color':true,
      'class':'0'
    },
    navList: [
      { 'name': '微信', 'icon': 'icon-weixin2' },
      { 'name': '支付宝', 'icon': 'icon-icon34' }
      ],
    currentTab: 0,
    index: 0,
    array: [],//提现银行
    minPrice:1,//最低提现金额
    userInfo:[],
    isClone:false
  },
  onLoadFun:function(){
    this.getUserInfo();

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 获取个人用户信息
  */
  getUserInfo: function () {
    var that = this;
	requestApi('mini/user.personal/my_info', 'POST', {id:1}).then((res) => {
			//console.log(res.data);
			that.setData({userInfo:res.data});
	});
  },

  

  bindPickerChange: function (e) {
    this.setData({ index: e.detail.value });
  },

  subCash: function (e) {
    var that = this, value = e.detail.value;
     value.extract_type = 'weixin';

    if (value.money.length == 0) return app.Tips({title:'请填写提现金额'});
    if (value.money < that.data.minPrice) return app.Tips({title:'提现金额最低为1元'});
	
	//操作提款接口
	requestApi('mini/user.Account/cash_money', 'POST', {value:JSON.stringify(value)}).then((res) => {
			if(res.data.code == 200)  that.getUserInfo(); return app.Tips({title:res.data.msg,icon:'success'});
			return app.Tips({title:res.data.msg});
	});
   
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
    if(app.globalData.isLog && this.data.isClone){
        this.getUserInfo();
        this.getUserExtractBank();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({isClone:true});
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})