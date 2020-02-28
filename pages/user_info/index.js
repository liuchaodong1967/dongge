var app = getApp();
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
      'title': '个人资料',
      'color': true,
      'class': '0'
    },
    userInfo:{},
  },
  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getPhoneNumber:function(e){
    var detail = e.detail, cache_key = wx.getStorageSync('cache_key'),that=this;
    if (detail.errMsg =='getPhoneNumber:ok'){
      if (!cache_key){
        app.globalData.token='';
        app.globalData.isLog=false;
        return false;
      }

	  requestApi('mini/user.Personal/bind_iphone', 'POST', {
			iv: detail.iv,
			cache_key: cache_key, 
			encryptedData: detail.encryptedData
	  }).then((res) => {
			 if(res.data.code !=200)  return app.Tips({ title: res.data.msg});
			 that.setData({ 'userInfo.phone': res.data.phone});
			 return app.Tips({ title: res.data.msg, icon: 'success' });
	  });
    }else{
      app.Tips({ title:'取消授权'});
    }
  },

  /**
   * 获取用户信息
  */
  getUserInfo:function(){
    var that=this;
	requestApi('mini/user.Personal/my_info', 'POST', {}).then((res) => {
			console.log(res.data);
			that.setData({userInfo:res.data});
	});
  },

  /**
  * 上传文件 修改头像操作
  * 
 */
  uploadpic: function () {
    var that = this;
    util.uploadImageOne(app.U({ c: 'public_api', a: 'upload' }), function (res) {
      that.setData({ 'userInfo.avatar': app.globalData.url +res.data.url });
    });
  },

  /**
   * 提交修改
  */
  formSubmit:function(e){
    var that = this, value = e.detail.value, formId = e.detail.formId;
    if (!value.nickname) return app.Tips({title:'用户姓名不能为空'});
    value.avatar = that.data.userInfo.avatar;
    
	requestApi('mini/user.Personal/edit_user', 'POST', {value:JSON.stringify(value)}).then((res) => {
			if(res.data.code == 200) return app.Tips({title:res.data.msg,icon:'success'},{tab:3,url:1});
			return app.Tips({title:res.data.msg || '保存失败，您并没有修改'},{tab:3,url:1});
	});

  },

  

})