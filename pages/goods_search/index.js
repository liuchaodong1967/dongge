// pages/searchGood/index.js
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
      'title': '搜索商品',
      'color': false
    },
    host_product:[],
    searchValue:'',
    focus:true,
    bastList:[],
    hotSearchList:[],
    first: 0,
    limit: 8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
 /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getRoutineHotSearch();
    this.getHostProduct();
  },

 //热门搜索词
  getRoutineHotSearch: function () {
    var that = this;
	requestApi('mini/index/hot_search', 'GET', {}).then((res) => {
		 that.setData({ hotSearchList: res.data.data });
	});
   
  },
  getProductList:function(){
    var that = this;
	requestApi('mini/index/search', 'GET', {keyword: that.data.searchValue}).then((res) => {
		  that.setData({ bastList: res.data.data });
	});
  },

  //猜你喜欢
  getHostProduct: function () {
    var that = this;
	requestApi('mini/index/like_list', 'GET', { offset:1,limit:4})
	.then((res) => {
		 that.setData({ host_product: res.data.data });
	});
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }, 
  setHotSearchValue: function (event) {
    this.setData({ searchValue: event.currentTarget.dataset.item });
    this.getProductList();
  },
  setValue: function (event){
    this.setData({ searchValue: event.detail.value});
  },
  searchBut:function(){
    var that = this;
    if (that.data.searchValue.length > 0){
      that.getProductList();
    }else{
      wx.showToast({
        title: '请输入要搜索的商品',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }
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