// pages/cash-withdrawal/index.js
const app = getApp();
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
    minPrice:0.00,//最低提现金额
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
    app.baseGet(app.U({ c: 'user_api', a: 'my' }), function (res) {
      that.setData({ userInfo: res.data });
    });
  },
  swichNav: function (e) {
    this.setData({ currentTab: e.currentTarget.dataset.current });
  },
  bindPickerChange: function (e) {
    this.setData({ index: e.detail.value });
  },
  subCash: function (e) {
    var formId = e.detail.formId, that = this, value = e.detail.value;
    app.baseGet(app.U({ c: 'public_api', a: "get_form_id", q: { formId: formId} }), null, null);
    if (that.data.currentTab == 0) {//微信
      value.extract_type = 'weixin';
    } else if (that.data.currentTab == 1) {//支付宝
      value.extract_type = 'alipay';
      if (value.name.length == 0) return app.Tips({title:'请填写姓名'});
      value.name = value.name;
     
      if (value.alipay_code.length == 0) return app.Tips({ title: '请填写账号' });
      value.alipay_code = value.alipay_code;
    }
    if (value.money.length == 0) return app.Tips({title:'请填写提现金额'});
    if (value.money < that.data.minPrice) return app.Tips({title:'提现金额不能低于' + that.data.minPrice});
    app.basePost(app.U({ c: 'user_api', a: 'user_extract'}),value,function (res) {
      that.getUserInfo();
      return app.Tips({title:res.msg,icon:'success'});
    },function(res){
      return app.Tips({title:res.msg});
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