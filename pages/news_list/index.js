// pages/newsList/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '文章中心',
      'color': false
    },
    imgUrls: [],
    articleList:[],
    indicatorDots: false,
    circular: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    navList:[],
    active:0,
    first:0,
    limit:8,
    scrollLeft: 0
  },


  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.getArticleCate(); //分类
    
    if(this.data.active == 0){
      this.getArticleHot();
    }else{
      this.getCidArticle();
    }

    //this.getArticleBanner();

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  getArticleHot: function () {
    var that = this;
    app.baseGet(app.U({ c: 'article_api', a: 'get_article_hot' }), function(res){
      that.setData({ articleList: res.data });
    }, function(res){ console.log(res); }, true);
  },

  getArticleBanner: function () {
    var that = this;
    app.baseGet(app.U({ c: 'article_api', a: 'get_article_banner' }), function (res) {
      that.setData({ imgUrls: res.data });
    }, function (res) { console.log(res); }, true);
  },

  getCidArticle: function () {
    var that = this;
    var limit = that.data.limit;
    var first = that.data.first;
    var active = that.data.active;
    var articleListNew = [];
    console.log(active)
    app.baseGet(app.U({ c: 'article_api', a: 'get_cid_article', q: { cid: active, first: first, limit: limit} }), function (res) {
      console.log(res)
      var len = res.data.length;
    //  console.log(res.data)
       var articleListNew = res.data;
      //articleListNew = articleList.concat(res.data);
      that.setData({ 
        articleList: articleListNew, 
        status: limit > len, 
        //first: first + limit
      });
    }, function (res) { 
        console.log(res); 
      }, 
      true
    );
  },

  getArticleCate:function(){
    var that = this;
    app.baseGet(app.U({ c: 'article_api', a: 'get_article_cate' }), function (res) {
      that.setData({ navList: res.data });
    }, function (res) { console.log(res); }, true);
  },

  tabSelect(e) {
    this.setData({
      active: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 50
    })
    if (this.data.active == 0){
      this.getArticleHot();
    }else{
      this.getCidArticle();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.getCidArticle();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})