// pages/promoter-order/index.js
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
      'title': '待返佣订单',
      'color':true,
      'class':'0'
    },
    page: 0,
    limit: 8,
    status: false,
    recordList: [],
    recordCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getRecordOrderList();
  },
  getRecordOrderList: function () {
    var that = this;
    var page = that.data.page;
    var limit = that.data.limit;
    var status = that.data.status;
    var recordList = that.data.recordList;
    var recordListNew = [];
    if (status == true) return;
	requestApi('mini/user.agent/wait_order', 'GET', {}).then((res) => {
		
		  var len = res.data.data ? res.data.data.length : 0;
		  var recordListData = res.data.data;
		  recordListNew = recordList.concat(recordListData);
		  that.setData({
			  recordCount: res.data.count || 0, 
			  status: limit > len,
			  page: limit + page, 
			  recordList: recordListNew 
		  });

			  console.log(recordListNew);
	});
  
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})