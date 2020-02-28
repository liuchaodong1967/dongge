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
      'title': '地址管理'
    },
    addressList:[],
    cartId:'',
    pinkId:0,
    couponId:0,
    loading:false,
    loadend:false,
    loadTitle:'加载更多',
    page:1,
    limit:8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cartId: options.cartId || '',
      pinkId: options.pinkId || 0,
      couponId: options.couponId || 0,
    })
  },
  onShow:function(){
    var that = this;
    if (app.globalData.isLog) that.getAddressList(true);
  },
  onLoadFun:function(){
    this.getAddressList();
  },
  /*
  * 导入微信地址
  */
  getWxAddress: function () {
    var that = this;
    wx.authorize({
      scope: 'scope.address',
      success: function (res) {
        wx.chooseAddress({
          success: function (res) {
            var addressP = {};
            addressP.province = res.provinceName;
            addressP.city = res.cityName;
            addressP.district = res.countyName;
			requestApi('mini/user.address/add_wechat_address', 'POST', {
			  address: JSON.stringify(addressP),
              is_default: 1,
              real_name: res.userName,
              post_code: res.postalCode,
              phone: res.telNumber,
              detail: res.detailInfo,
              id: 0
			}).then((res) => {
				 app.Tips({ title: "添加成功", icon:'success'},function(){
						 that.getAddressList(true);
				  });
			});
          },
          fail: function (res) {
            if (res.errMsg == 'chooseAddress:cancel') return app.Tips({ title:'取消选择'});
          },
        })
      },
      fail: function (res) {
        console.log(res);
      },
    })
  },
 
  /**
   * 获取地址列表
   * 
  */
  getAddressList: function (isPage){
    var that=this;
    if (isPage) that.setData({ loadend: false, page: 1, addressList:[]});
    if (that.data.loading) return;
    if (that.data.loadend) return;
    that.setData({ loading:true,loadTitle:''});
    requestApi('mini/user.address/address_list', 'GET', { page: that.data.page, limit: that.data.limit }).then((res) => {

      var list = res.data.data;
      var loadend = list.length < that.data.limit;
      that.data.addressList = app.SplitArray(list, that.data.addressList);
      that.setData({
        addressList: that.data.addressList,
        loadend: loadend,
        loadTitle: loadend ? '我也是有底线的' : '加载更多',
        page: that.data.page + 1,
        loading: false,
      });
      that.setData({ loading: false, loadTitle: '加载更多' });

    });
    
  },
  /**
   * 设置默认地址
  */
  radioChange:function(e){
    var index = parseInt(e.detail.value),that=this;;
    var address = this.data.addressList[index];
    if (address==undefined) return app.Tips({title:'您设置的默认地址不存在!'});

    requestApi('mini/user.address/set_default_address', 'GET', {  addressId: address.id }).then((res) => {
		
		for (var i = 0, len = that.data.addressList.length;i<len;i++){
        if (i == index) that.data.addressList[i].is_default = true;
        else that.data.addressList[i].is_default = false;
		}

		app.Tips({title:'设置成功',icon:'success'},function(){
			that.setData({ addressList:that.data.addressList});
		});

	 });
  },
  /**
   * 编辑地址
  */
  editAddress:function(e){
    var cartId = this.data.cartId,pinkId = this.data.pinkId,couponId = this.data.couponId;
    this.setData({cartId: '',pinkId: '',couponId: ''})
    wx.navigateTo({ 
      url: '/pages/user_address/index?id=' + e.currentTarget.dataset.id + '&cartId=' + cartId + '&pinkId=' + pinkId + '&couponId=' + couponId
    })
  },
  /**
   * 删除地址
  */
  delAddress:function(e){
    var index = e.currentTarget.dataset.index, that = this, address=this.data.addressList[index];
    if (address == undefined) return app.Tips({ title: '您删除的地址不存在!' });
    
	requestApi('mini/user.address/remove_address', 'GET', {  addressId: address.id }).then((res) => {
	  app.Tips({title:'删除成功',icon:'success'},function(){
        that.data.addressList.splice(index, 1);
        that.setData({ addressList: that.data.addressList });
      });
	});
  },
  /**
   * 新增地址
  */
  addAddress: function () {
    var cartId = this.data.cartId,pinkId = this.data.pinkId,couponId = this.data.couponId;
    this.setData({ cartId: '', pinkId: '', couponId: ''})
    wx.navigateTo({
      url: '/pages/user_address/index?cartId=' + cartId + '&pinkId=' + pinkId + '&couponId=' + couponId
    })
  },

  goOrder:function(e){
    var id = e.currentTarget.dataset.id;
    var cartId = '';
    var pinkId = '';
    var couponId = '';
    if (this.data.cartId && id) {
      cartId = this.data.cartId;
      pinkId = this.data.pinkId;
      couponId = this.data.couponId;
      this.setData({
        cartId: '',
        pinkId: '',
        couponId: '',
      })
      wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
        url: '/pages/order_confirm/index?is_address=1&cartId=' + cartId + '&addressId=' + id + '&pinkId=' + pinkId + '&couponId=' + couponId
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getAddressList();
  }
})