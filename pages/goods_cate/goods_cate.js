var app = getApp();
import requestApi from '../../utils/request.js'; 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navlist: [],
    productList: [],
    navActive: 0,
    parameter: {
      'navbar': '1',
      'return': '0',
      'title':'产品分类'
    },
    navH:app.globalData.navHeight,
    categoryId:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
	
	 this.getPidCate();

  },
	

  tap: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      categoryId: id,
      navActive: index
    });
	
	this.getAllCategory();

  },

  getPidCate:function(){
    var that=this;
	requestApi('mini/index/get_category', 'GET', {}).then((res) => {
			 console.log(res.data);
			 that.setData({
				 navlist:res.data.category,
				 productList: res.data.category_list
			});
	});

	 console.log(that.data.categoryId);
	
  },

  getAllCategory:function(){
    var that = this;
	requestApi('mini/index/get_category2', 'GET', {id:that.data.categoryId}).then((res) => {
			 that.setData({
				 productList: res.data
			});
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

  }
})