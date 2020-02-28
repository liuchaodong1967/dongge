const app = getApp();
const util = require('../../utils/util.js');
import requestApi from '../../utils/request.js'; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '0',
      'title': '购物车',
      'color': false
    },
    navH: 0,
    cartCount:0,
    goodsHidden:true,
    footerswitch: true,
    host_product: [],
    cartList:[],
    isAllSelect:false,//全选
    selectValue:[],//选中的数据
    selectCountPrice:0.00,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      navH: app.globalData.navHeight
    })
  },
  

  //删除购物车的商品
   subDel:function (event) {
    var formId = event.detail.formId, that = this, selectValue = that.data.selectValue;
    if (selectValue.length > 0) 
		requestApi('mini/Cart/remove_cart','GET',{ids: selectValue.join(',')}).then((res)=>{
			 if(res.data.code=200){
				 that.getCartList();
				 that.getCartNum();
			 }else{
				  return app.tcTips('发生错误了','none');
			 }
		});
    else 
      return app.tcTips('请选择产品','none');
  },

  getSelectValueProductId:function(){
    var that = this;
    var validList = that.data.cartList.valid;
    var selectValue = that.data.selectValue;
    var productId = [];
    if (selectValue.length > 0){ for (var index in validList){if(that.inArray(validList[index].id, selectValue)) { productId.push(validList[index].product_id);}}};
    return productId;
  },

  subCollect: function (event){
    var formId = event.detail.formId, that = this, selectValue = that.data.selectValue;
    app.baseGet(app.U({ c: 'public_api', a: 'get_form_id', q: { formId: formId } }), null, null, true);
    if (selectValue.length > 0) {
      var selectValueProductId = that.getSelectValueProductId();
      app.baseGet(app.U({ c: 'store_api', a: 'collect_product_all', q: { productId: selectValueProductId.join(',') } }), function(res){
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 1000,
          mask: true,
        })
      }, function(res){ 
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      }, true);
    } else {
      wx.showToast({
        title: '请选择产品',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return false;
    }
  },

  //提交订单按钮
  subOrder: function (event){
    var formId = event.detail.formId, that = this, selectValue = that.data.selectValue;
    //app.baseGet(app.U({c:'public_api',a:'get_form_id',q:{formId:formId}}),null,null,true);
	  //console.log(selectValue.join(','));

    if (selectValue.length > 0){
      wx.navigateTo({url:'/pages/order_confirm/index?cartId=' + selectValue.join(',')});
    }else{
      wx.showToast({
        title: '请选择产品',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return false;
    }
  },

  checkboxAllChange: function (event){
    var value = event.detail.value;
    if (value.length > 0) { this.setAllSelectValue(1)}
    else { this.setAllSelectValue(0) }
  },

  setAllSelectValue:function(status){
    var that = this;
    var selectValue = [];
    var valid = that.data.cartList.valid;
    if (valid.length > 0) {
      for (var index in valid) {
        if (status == 1){
          valid[index].checked = true;
          selectValue.push(valid[index].id);
        }else valid[index].checked = false;
      }
      var validData = "cartList.valid";
      that.setData({
        [validData]: valid,
        selectValue: selectValue,
      });
      that.switchSelect();
    }
  },

  checkboxChange: function (event){
    var that = this;
    var value = event.detail.value;
    var valid = this.data.cartList.valid;
    for (var index in valid){
      if (that.inArray(valid[index].id, value)) valid[index].checked = true;
      else valid[index].checked = false;
    }
    var validData = "cartList.valid";
    this.setData({ 
      [validData]: valid,
      isAllSelect: value.length == this.data.cartList.valid.length,
      selectValue: value,
    })
    this.switchSelect();
  },

  inArray:function(search, array){
    for (var i in array) { if (array[i] == search) { return true; } }
    return false;
  },

  switchSelect:function(){
    var that = this;
    var validList = that.data.cartList.valid;
    var selectValue = that.data.selectValue;
    var selectCountPrice  = 0.00;
    if (selectValue.length < 1) { that.setData({ selectCountPrice: selectCountPrice }); }
    else{
      for (var index in validList){
        if (that.inArray(validList[index].id, selectValue)){
          selectCountPrice = Number(selectCountPrice) + Number(validList[index].cart_num) * Number(validList[index].truePrice)
        }
      }
      that.setData({ selectCountPrice: selectCountPrice.toFixed(2) });
    }
  },
	
  //商品数量减
  subCart:function(event){
    var that = this;
    var status = false;
    var index = event.currentTarget.dataset.index;
    var item = that.data.cartList.valid[index];
    //console.log(item);
    item.cart_num = item.cart_num - 1;
    if (item.cart_num < 1) status = true;
    if (item.cart_num <= 1) { 
      item.cart_num = 1;
      item.numSub = true; 
    } else { item.numSub = false;item.numAdd = false; }
    if (false == status) {
	  console.log(item.cart_num);
      that.setCartNum(item.id, item.cart_num, function (data) {
        var itemData = "cartList.valid[" + index + "]";
        that.setData({ [itemData]: item });
        that.switchSelect();
      });
    }
  },
	
  //商品数量加
  addCart: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    var item = that.data.cartList.valid[index];
    item.cart_num = item.cart_num + 1;
    var productInfo = item.productInfo;
    if (productInfo.hasOwnProperty('attrInfo') && item.cart_num >= item.productInfo.attrInfo.stock) {
      item.cart_num = item.productInfo.attrInfo.stock;
      item.numAdd = true;
      item.numSub = false; 
    } else if (item.cart_num >= item.productInfo.stock) {
      item.cart_num = item.productInfo.stock;
      item.numAdd = true;
      item.numSub = false; 
    } else { item.numAdd = false; item.numSub = false; }
    that.setCartNum(item.id, item.cart_num, function (data) {
      var itemData = "cartList.valid[" + index + "]";
      that.setData({ [itemData]: item });
      that.switchSelect();
    });
  },
	
  //更新购物车的购买数量
  setCartNum(cartId, cartNum, successCallback) {
    var that = this;
	requestApi('mini/Cart/change_cart_num', 'GET', {cartId: cartId, cartNum: cartNum})
	.then((res) => {
		successCallback && successCallback(res.data.data);
	});
  },
	

  //获取购物车数量
  getCartNum: function () {
    var that = this;
	requestApi('mini/Cart/get_cart_num', 'GET', {})
	.then((res) => {
		 that.setData({ cartCount: res.data.data});
	});
  },

	//购物车列表
  getCartList: function () {
    var that = this;
	
	requestApi('mini/Cart/get_cart_list', 'GET', { offset:1,limit:4})
	.then((res) => {
    
		  var cartList = res.data.data;
		  var valid = cartList.valid;
		  var numSub = [{ numSub: true }, { numSub: false} ];
		  var numAdd = [{ numAdd: true }, { numAdd: false} ];
   
		  if (valid.length > 0){
			for (var index in valid){
        
				  if (valid[index].cart_num == 1) { valid[index].numSub = true;}
				  else { valid[index].numSub = false; }

				  var productInfo = valid[index].productInfo;
     

				  if (productInfo.hasOwnProperty('attrInfo') && valid[index].cart_num == valid[index].productInfo.attrInfo.stock) {
					valid[index].numAdd = true;;
				  } else if (valid[index].cart_num == valid[index].productInfo.stock) {
					valid[index].numAdd = true;;
				  } else { valid[index].numAdd = false; } 
				  valid[index].checked = false;
			}
         }
		  that.setData({ cartList: cartList, goodsHidden: cartList.valid.length <= 0 ? false : true});
		  that.switchSelect();

	});

  },
	
 //猜你喜欢的列表
  getHostProduct: function () {
    var that = this;
	requestApi('mini/index/like_list', 'GET', { offset:1,limit:4})
	.then((res) => {
		 that.setData({ host_product: res.data.data });
	});
   
  },

  goodsOpen:function(){
     var that = this;
     that.setData({
       goodsHidden: !that.data.goodsHidden
     })
  },

  manage:function(){
    var that = this;
    that.setData({
      footerswitch: !that.data.footerswitch
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onLoadFun: function () {
    this.getHostProduct();
    this.getCartList();
    this.getCartNum();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isLog == true) {
      this.getHostProduct();
      this.getCartList();
      this.getCartNum();
      this.setData({
        goodsHidden: true,
        footerswitch: true,
        host_product: [],
        cartList: [],
        isAllSelect: false,//全选
        selectValue: [],//选中的数据
        selectCountPrice: 0.00,
        cartCount: 0,
      });
    }
  },
  

  //清空失效的商品
  unsetCart:function(){
    var that=this,ids=[];
    for (var i = 0, len = that.data.cartList.invalid.length;i < len;i++){
      ids.push(that.data.cartList.invalid[i].id);
    }
    requestApi('mini/Cart/remove_cart','GET',{ids:ids}).then((res)=>{

		 if(res.data.code=200){
			 app.tcTips('已成功清空','none');
			 that.setData({'cartList.invalid':[]});
		 }else{
			 app.tcTips('发生错误了','none');
		 }

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

})