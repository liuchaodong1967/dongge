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
  },

  /**
   * 组件内私有数据
   */
  data: {
    isHide:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
   
  },

	
  attached() {
	 console.log('加载1次')
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
	},
    hide: function () { },
    resize: function () { },
  },
  /**
   * 组件的公有方法列表
   */
  methods: {

    bindGetUserInfo: function(e){
		if (e.detail.userInfo) {
		  console.log("点击了同意授权");
		  this.login();
		} else {
		  console.log("点击了拒绝授权");
		}
		
		//console.log(e.detail.userInfo); //获取到了用户的信息
     
    },


	login:function(){
			var that=this;
			//检测是否授权过
			wx.getSetting({
				 success(res) {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称
						wx.getUserInfo({
							success: function (res) {
								console.log(res.userInfo)  //得到用户的信息
								
								wx.login({
								  success (res) {
									const code  = res.code;
									 console.log(code)
									 if (code) {
										requestApi('mini/login', 'POST', { code: code})
										.then((res) => {
											app.globalData.token =  res.data.token;
											app.globalData.isLogin = true
											that.setData({
											  isShow: false
											})

										}), 
										function (error) {
										  console.log(error);
										}
									 }
								   }
								})
							}
						 })
					}else{
						// 没有授权，弹出授权框
						
					}
				 }
			})  //授权检测end
		

        }



    },
})
