var app = getApp();
import requestApi from '../../utils/request.js'; //引入

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹窗标题
    title: {          
      type: String,     
      value: '登录提示' // 默认值
    },
    // 弹窗内容
    content :{
      type : String ,
      value : '登录授权才能为您提供更好的服务哦！'
    },

    // 弹窗确认按钮文字
    confirmText :{
      type : String ,
      value : '立即授权'
    },

	// 弹窗确认按钮文字
    hideText :{
      type : String ,
      value : '关闭'
    } 
  },

  /**
   * 组件内私有数据
   */
  data: {
    // 弹窗显示控制
    isShow:false,
	  isLog:false    //ture 就是自动登录，false 就是手动点击登录
  },

	
  attached() {
		 console.log('ssss') 	
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
		if(!app.globalData.isAuth && !app.globalData.isLogin) this.UserInfoStatus();

	},
    hide: function () { },
    resize: function () { },
  },
  /**
   * 组件的公有方法列表
   */
  methods: {
	
   //显示弹窗
	showDialog(){
		this.setData({
			isShow: true
		})
	},

    //隐藏弹框
    hideDialog(){
      this.setData({
        isShow: false
      })
    },

	
	 //ture 就是自动登录
    logDialog(){
      this.setData({
        isLog: true
      })
    },
  
  
	//弹窗授权
    bindGetUserInfo: function(e){
		if (e.detail.userInfo) {
		  console.log("点击了同意授权");
		  this.login();
		} else {
		  console.log("点击了拒绝授权");
		}

    },

	//已授权可直接获得用户信息
    UserInfoStatus: function(e){
		var that=this;	
		//检测是否授权过
		wx.getSetting({
			 success(res) {
				if (res.authSetting['scope.userInfo']) {
						app.globalData.isAuth = true;
						that.login();
				}else{
						console.log('你没有授权过哦') 
				}
			}
		});

    },

	
	//用户登录
	login:function(){
		var that=this;	
		wx.login({
			  success (n) {
				const code  = n.code;
				 
				 wx.getUserInfo({
							success: function (u) {
								  console.log(u.userInfo) 
								  if (code) {
										requestApi('mini/login', 'POST', { code: code})
										.then((res) => {
											app.globalData.token =  res.data.token;
											app.globalData.isLogin = true;
											that.setData({
												isShow: false
											})
										}), 
										function (error) {
										  console.log(error);
										}
								  }
							}
				 });	
				
			   }
		  })
        }



    },
})
