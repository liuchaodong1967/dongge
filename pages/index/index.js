const app = getApp();
import requestApi from '../../utils/request.js'; 

Page({
	data: {
	 menuList: [],
	 tabScroll: 0,
	 currentTab: 0,
	 windowHeight: '',
	 windowWidth: '',
    imgUrls:[],
    hotList: [],
    circular: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    parameter: {
      'navbar': '0',
      'return': '0'
    },
    page: 1,
    loadText: '加载更多',
	sharePacket:{
      isState:false,//分享权限默认不显示
    },//分销商详细
    uid:0,//用户uid
	},
 
	onReady: function () {

	},
  
  onLoad: function (options) {
	 if (options.scene){
		var value =util.getUrlParams(decodeURIComponent(options.scene));
		//记录推广人uid
		if (value.pid) app.globalData.spid = value.pid;
	 }
     if (options.spid) app.globalData.spid = options.spid;

	
	wx.getSystemInfo({  // 获取当前设备的宽高，文档有
	  success: (res) => { 
		  this.setData({
		   windowHeight: res.windowHeight,
		   windowWidth: res.windowWidth
		  })
	  },
	 })
  },


/**
* 登录后加载
* 
*/
onLoadFun:function(e){
	this.getUserInfo();
},

/*
* 获取用户信息
*/
getUserInfo: function(){
	var that=this;
	requestApi('mini/user.personal/my_info', 'POST', {id:1}).then((res) => {
		that.setData({ 
			'sharePacket.isState': res.data.is_promoter ? true : false,
			uid: res.data.uid,
		});
	});


},

 clickMenu: function(e) {
	 var current = e.currentTarget.dataset.current	//获取当前tab的index
	 var tabWidth = this.data.windowWidth / 5	// 导航tab共5个，获取一个的宽度
	 this.setData({
	  tabScroll: (current - 2) * tabWidth	//使点击的tab始终在居中位置
	 }) 
	 if (this.data.currentTab == current) {
	  return false
	 } else {
	  this.setData({currentTab: current })
	 }
 },

 changeContent: function(e) {
	 var current = e.detail.current // 获取当前内容所在index,文档有
	 var tabWidth = this.data.windowWidth / 5 
	 this.setData({
	  currentTab: current,
	  tabScroll: (current - 2) * tabWidth
	 })
 },

  catchTouchMove: function (res) {
    return false
  },

  onColse:function(){
    this.setData({ window: false});
  },

  onShow: function() {
		
	this.getIndexData();
	this.ShareMessageConten();
	
  },


	
	//获取首页数据信息
	getIndexData:function(){
		var that = this;
    requestApi('mini/index', 'GET', { id: 1 })
    .then((res) => {
      console.log(res.data.category);

      that.setData({
        logoUrl: res.data.logo,
        imgUrls: res.data.banner,
        activityList: res.data.activity,
        itemNew: res.data.itemNews,
        chaoliu: res.data.remen,
        top: res.data.huore,
		 menuList:res.data.category
		  })
    })
	},


  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
	 //console.log(app.globalData);
    var that = this;
    var datainfo = that.data.hotList;
    var page = that.data.page;
    requestApi('mini/index/allgoodslist', 'GET', { page: page+1})
      .then((res) => {
        var indata = res.data.data;
        console.log(indata);
        if (indata.length < 1) {
          that.setData({
            loadText: "无数据啦",
            loding: false
          });
        } else {
          that.setData({
            hotList: datainfo.concat(indata), //拼接数据  
            page: that.data.page + 1,
            loding: true
          });
        }
        
      })
  },


ShareMessageConten: function () {
	requestApi('mini/Public_Api/share', 'GET', {id: 1}).then((res) => {
		this.setData({
			share_title: res.data.data.title, 
			share_page: res.data.data.title,
		});
	})
},

 /**
   * 用户点击右上角分享  that.data.sharePacket.isState = ture 代表是代理分享，false 是会员分享
   */
	onShareAppMessage: function () {
		var that = this;
		var s_pid =  that.data.sharePacket.isState==false ? '' : '?spid=' + that.data.uid;
		console.log(s_pid);

		return {
			title: that.data.share_title, 
			imageUrl: that.data.share_page,	
			path:'pages/index/index'+s_pid, 
		}
	
		
	}

	

})
