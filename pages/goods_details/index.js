// pages/product-con/index.js
var app = getApp();
var wxh = require('../../utils/wxh.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
import requestApi from '../../utils/request.js'; 
import aibum from '../../utils/aibum.js'; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '商品详情'
    },
    attribute:{'cartAttr':false},//属性是否打开
    coupon: {
      'coupon': false,
      list:[],
    },
    attr:'请选择',//属性页面提示
    attrValue:'',//已选属性
    animated: false,//购物车动画
    id:0,//商品id
    replyCount: 0,//总评论数量
    reply: [],//评论列表
    storeInfo: {},//商品详情
    productAttr: [],//组件展示属性
    productValue: [],//系统属性
    productSelect: {}, //属性选中规格
    cart_num: 1,//购买数量
    isAuto: false,//没有授权的不会自动弹窗授权
    iShidden:true,//是否隐藏授权弹窗
    isOpen:false,//是否打开属性组件
    isLog:app.globalData.isLog,//是否登录
    actionSheetHidden:true,
    posterImageStatus:false,
    storeImage: '',//海报产品图
    PromotionCode: '',//二维码图片
    canvasStatus: false,//海报绘图标签
    posterImage: '',//海报路径
    posterbackgd:'/images/posterbackgd.png',
    sharePacket:{
      isState:false,//分享权限默认不显示
    },//分销商详细
    uid:0,//用户uid
	flag: true,
    flag1: true,
	flag2: true,
	UrlImage:'',
  },
  /**
   * 登录后加载
   * 
  */
  onLoadFun:function(e){
    this.setData({ isLog:true});
    this.getCartCount();
    this.getUserInfo();
   //this.get_product_collect();
  },
  
  /*
  * 获取用户信息
  */
  getUserInfo: function(){
    var that=this;

	requestApi('mini/user.personal/my_info', 'POST', {id:1}).then((res) => {
			console.log(res.data);
			that.setData({ 
				'sharePacket.isState': res.data.is_promoter ? true : false,
				uid: res.data.uid,
				vip_picer :util.$h.Mul(this.data.productSelect.price ,res.data.level.discount/100)
			});
	});
  
  
  },

  //规则显示隐藏
  showup1: function(){  
    this.setData({flag: false}),
    this.setData({flag1: false})
  }, 
  showup2: function(){  
    this.setData({flag: false}),
    this.setData({flag2: false})
  }, 
  
  hideup: function(){  
    this.setData({flag: true}),
    this.setData({flag1: true}),
    this.setData({flag2: true})
  },

  /**
   * 购物车数量加和数量减
   * 
  */
  ChangeCartNum:function(e){
    //是否 加|减
    var changeValue = e.detail;
    //获取当前变动属性
    var productSelect = this.data.productValue[this.data.attrValue];
    //如果没有属性,赋值给商品默认库存
    if (productSelect === undefined && !this.data.productAttr.length) productSelect = this.data.productSelect;
    //不存在不加数量
    if (productSelect===undefined) return;
    //提取库存
    var stock = productSelect.stock || 0;
    //设置默认数据
    if (productSelect.cart_num == undefined) productSelect.cart_num = 1;
    //数量+
    if (changeValue){
      productSelect.cart_num++;
      //大于库存时,等于库存
      if (productSelect.cart_num > stock) productSelect.cart_num = stock;
      this.setData({
        ['productSelect.cart_num']: productSelect.cart_num,
        cart_num: productSelect.cart_num
      });
    }else{
      //数量减
      productSelect.cart_num--;
      //小于1时,等于1
      if (productSelect.cart_num < 1) productSelect.cart_num=1;
      this.setData({
        ['productSelect.cart_num']: productSelect.cart_num,
        cart_num: productSelect.cart_num
      });
    }
  },
  /**
   * 属性变动赋值
   * 
  */
  ChangeAttr:function(e){
    var values = e.detail;
    var productSelect = this.data.productValue[values];
    var storeInfo = this.data.storeInfo;
    if (productSelect){
      this.setData({
        ["productSelect.image"]: productSelect.image,
        ["productSelect.price"]: productSelect.price,
        ["productSelect.stock"]: productSelect.stock,
        ['productSelect.unique']: productSelect.unique,
        ['productSelect.cart_num']: 1,
        attrValue: values,
        attr:'已选择'
      });
    }else{
      this.setData({
        ["productSelect.image"]: storeInfo.image,
        ["productSelect.price"]: storeInfo.price,
        ["productSelect.stock"]: 0,
        ['productSelect.unique']:'',
        ['productSelect.cart_num']: 0,
        attrValue:'',
        attr:'请选择'
      });
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //扫码携带参数处理
    if (options.scene){
      var value =util.getUrlParams(decodeURIComponent(options.scene));
      if (value.id) options.id = value.id;
      //记录推广人uid
      if (value.pid) app.globalData.spid = value.pid;
    }
    
	  if (!options.id) return app.Tips({ title: '缺少参数无法查看商品' }, { tab: 3, url: 1 });
	  this.setData({ id: options.id});

    
	//记录推广人uid
    if (options.spid) app.globalData.spid=options.spid;
    this.getGoodsDetails();


  },

  onShow: function () {

    
   
  },

  /**
   * 获取产品详情
   * 
  */
  getGoodsDetails:function(){
    var that=this;
    requestApi('mini/Details', 'GET', { id: that.data.id }).then((res) => {
		var storeInfo = res.data.storeInfo;
        that.setData({
          storeInfo: storeInfo,
          reply: res.data.reply,
          replyCount: res.data.replyCount,
          description: storeInfo.description,
          replyChance: res.data.replyChance,
          productAttr: res.data.productAttr,
          productValue: res.data.productValue,
          ["sharePacket.priceName"]: res.data.priceName
        });
	  console.log(res.data.reply);
      that.DefaultSelect(); //默认选中
      //html转wxml
      WxParse.wxParse('description', 'html', that.data.description, that, 0);

    }),
    function (error) {
      console.log(error);
    }
  },
  /**
   * 默认选中属性
   * 
  */
  DefaultSelect:function(){
    var productAttr = this.data.productAttr, storeInfo = this.data.storeInfo;
    for (var i = 0, len = productAttr.length;i < len; i++){
      if (productAttr[i].attr_value[0]) productAttr[i].checked = productAttr[i].attr_value[0]['attr'];
    }
    var value=this.data.productAttr.map(function (attr) {
      return attr.checked;
    });
    var productSelect = this.data.productValue[value.sort().join(',')];
	    //console.log(productSelect);
    if (productSelect){
      this.setData({
        ["productSelect.store_name"]: storeInfo.store_name,
        ["productSelect.image"]: productSelect.image,
        ["productSelect.price"]: productSelect.price,
        ["productSelect.stock"]: productSelect.stock,
        ['productSelect.unique']: productSelect.unique,
        ['productSelect.cart_num']: 1,
        attrValue: value,
        attr: '已选择'
      });
    }else{
      this.setData({
        ["productSelect.store_name"]:storeInfo.store_name,
        ["productSelect.image"]: storeInfo.image,
        ["productSelect.price"]: storeInfo.price,
        ["productSelect.stock"]: this.data.productValue.length ? 0 : storeInfo.stock ,
        ['productSelect.unique']:  '',
        ['productSelect.cart_num']: 1,
        attrValue: '',
        attr: '请选择'
      });
    }
    this.setData({ productAttr: productAttr});
  },
  /**
   * 获取是否收藏
  */
  get_product_collect:function(){
    var that=this;
 
  },
  
  /** 
   * 
   * 
  * 收藏商品
  */
  setCollect:function(){
    if (app.globalData.isLog === false) {
      this.setData({
        isAuto: true,
        iShidden: false,
      });
    } else {
     
     
    }
  },

  /**
   * 打开属性插件
  */
  selecAttr:function(){
    if (app.globalData.isLog===false){
      this.setData({ isAuto: true,iShidden:false})
    }else{
      this.setData({ 
        'attribute.cartAttr': true,
        isOpen:true
      })
	}
  },

  onMyEvent: function (e) {
    this.setData({ 
      'attribute.cartAttr': e.detail.window, 
      isOpen:false
    })
  },
  /**
   * 打开属性加入购物车
   * 
  */
  joinCart:function(){
    //是否登录
    if (app.globalData.isLog === false)
		  this.setData({isAuto: true,iShidden: false,});
    else
       this.goCat();
  },
  /*
  * 加入购物车  ispay 为true 代表直接购物 ，为undefined就是购物车操作
  */
  goCat:function(isPay){

    var that=this;
    var productSelect = this.data.productValue[this.data.attrValue];
	var Apiurls= isPay == undefined ? 'mini/Cart/add_cart' : 'mini/Cart/go_buy'
    //打开属性
    if (this.data.attrValue){
      //默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
      this.setData({ 'attribute.cartAttr': !that.data.isOpen ? true : false }) 
    }else{
      if (this.data.isOpen) 
        this.setData({ 'attribute.cartAttr': true }) 
      else 
        this.setData({ 'attribute.cartAttr': !this.data.attribute.cartAttr});
    }
    //只有关闭属性弹窗时进行加入购物车
    if (this.data.attribute.cartAttr === true && this.data.isOpen == false) return this.setData({ isOpen: true }); 
    //如果有属性,没有选择,提示用户选择
    if (this.data.productAttr.length && productSelect === undefined && this.data.isOpen==true)    return app.tcTips('请选择属性','none');
    requestApi(Apiurls, 'GET', {
		  productId: that.data.id,
		  cartNum: that.data.cart_num,
		  uniqueId: productSelect !== undefined ? productSelect.unique : '',
     }).then((res) => {
       that.setData({ isOpen: false, 'attribute.cartAttr': false });
       if (isPay) {
		     if (res.data.code != 200) return app.tcTips(res.data.msg, 'none');	 
			//如果是点击的立即购买则直接跳转
			 wx.navigateTo({ url: '/pages/order_confirm/index?cartId=' + res.data.cartId });
       } else {
         //加入购物车
			if(res.data.code != 200) return app.tcTips(res.data.msg, 'none');
           app.tcTips(res.data.msg, 'none');
           that.getCartCount(true);
       }
        
      }) 
  },
  /**
   * 获取购物车数量
   * @param boolean 是否展示购物车动画和重置属性
  */
  getCartCount: function (isAnima) {
    var that = this;
    requestApi('mini/cart/get_cart_num', 'GET', {}).then((res) => {
      //console.log(res.data.data);
      that.setData({ CartCount: res.data.data });
      //加入购物车后重置属性
      if (isAnima) {
        that.setData({
          animated: true,
          attrValue: '',
          attr: '请选择',
          ["productSelect.image"]: that.data.storeInfo.image,
          ["productSelect.price"]: that.data.storeInfo.price,
          ["productSelect.stock"]: that.data.storeInfo.stock,
          ['productSelect.unique']: '',
          ['productSelect.cart_num']: 1,
        });
        that.selectComponent('#product-window').ResetAttr();
        setTimeout(function () {
          that.setData({
            animated: false
          });
        }, 500);
      }

    })
  },
  /**
   * 立即购买
  */
  goBuy:function(){
    var that = this;
    //没有登录则先授权
    if (app.globalData.isLog === false)
      this.setData({ isAuto: true, iShidden: false });
    else
      this.goCat(true);
  },
  /**
   * 分享打开和关闭
   * 
  */
  listenerActionSheet: function () {
    if (app.globalData.isLog === false)
      this.setData({ isAuto: true, iShidden: false });
    else
      this.setData({ actionSheetHidden: !this.data.actionSheetHidden })
  },


  //隐藏海报
  posterImageClose: function () {
    this.setData({posterImageStatus: false,})
  },

 
//在服务端生成海报
  MakeImage: function (successFn, errorFn) {
	    var that = this, data={};
	    //console.log(app.globalData.userInfo);
	    //console.log(that.data.productSelect);
	    data={
		   	id :that.data.storeInfo.id,
			image :that.data.storeInfo.image,
			store_info : that.data.storeInfo.store_info,
			ficti :that.data.storeInfo.ficti,
			price:that.data.productSelect.price,
			unique:that.data.productSelect.unique,
			username:app.globalData.userInfo[0],
			userhead:app.globalData.userInfo[1]
	   };

	   requestApi('mini/MakeImages/user_goods_code', 'GET', {value:JSON.stringify(data)}).then((res) => {
			 console.log('生成了海报这里');
			 console.log( res.data.data);
			 successFn && successFn(res.data.data);

		})
  },



  /**
   * 展示海报
  */
  goPoster:function(){
    var that = this;
    that.setData({ canvasStatus: true});
	wx.showLoading({title: '图片生成中...'})
	
	if(that.data.posterImage){
		wx.hideLoading();
		that.setData({
			  posterImage: that.data.posterImage,
			  posterImageStatus: true,
			  canvasStatus: false,
			  actionSheetHidden: !that.data.actionSheetHidden
		})
		console.log(22222222222222);		
		return false; 
	}

	that.MakeImage(function(res){
		console.log('wwwwwwwwwwww');
		wx.hideLoading();
		that.setData({
					  posterImage: res,
					  posterImageStatus: true,
					  canvasStatus: false,
					  actionSheetHidden: !that.data.actionSheetHidden
		})
	},function(erreo){
		wx.hideLoading();
		console.log(erreo);
 				that.setData({
					  posterImageStatus: false,
					  canvasStatus: false,
					  actionSheetHidden: !that.data.actionSheetHidden
				})        
	})

  },

  /*
  * 保存到手机相册
  */
  savePosterPath: function () {
    var that = this;
	aibum.Authalbum(function(res){
		console.log(res);
		aibum.DownloadImage(that.data.posterImage);
	},function(erreo){
		console.log(erreo);
	})
  },
	
 

 

  set_user_share:function(){
    
  },
  /**
   * 用户点击右上角分享  that.data.sharePacket.isState = ture 代表是代理分享，false 是会员分享
   */
  onShareAppMessage: function () {
    var that = this;
console.log(that.data.sharePacket);
    that.setData({actionSheetHidden: !that.data.actionSheetHidden});
    that.set_user_share();
    return {
      title: that.data.productSelect.store_name,
      imageUrl: that.data.productSelect.image,
      path: '/pages/goods_details/index?id=' + that.data.id + (that.data.sharePacket.isState==false ? '' : '&spid=' + that.data.uid),
    }
  }
})