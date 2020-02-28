//index.js
//获取应用实例
const app = getApp()
import requestApi from '../../../utils/request.js'; 
Page({
  data: {
	parameter: {
		'navbar': '1',
		'return': '0',
		'title': '我为自己种颗数',
	},
    animalNum:0,
    collectNum : 10,
    tipsNum: 1,
    sunActive : '',
    activeBottom : '',
    sunshineArr :[],
    sunshineAccount : 0,
    scaleNum : '',
    taskBoxState: 'none',
	isAuto: true,//没有授权的不会自动弹窗授权
	iShidden:false,//是否隐藏授权弹窗
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
			console.log(res.data);
			uid: res.data.uid
		});
	},

  onLoad:function(){
    let that = this;
    let animalRandom = Math.ceil(Math.random() * 2)
    that.setData({
      animalNum: animalRandom
    })
    setInterval(function(){
      if (that.data.sunshineAccount > 20){
        return false;
      }else{
        that.data.sunshineAccount++
      }
      let bottomRandom = Math.ceil(Math.random() * 400);
      let leftRandom = Math.ceil(Math.random() * 650) + 50;
      let posObj = {
        bottom: bottomRandom,
        left: leftRandom,
        scaleNum : 1
      }
      that.data.sunshineArr.push(posObj)
      that.setData({
        sunshineArr: that.data.sunshineArr
      })
    },5000)
    
  },
  sunMove(e) {
    this.data.sunshineAccount -= 1
    let dataid = e.currentTarget.dataset.id;
    this.data.sunshineArr[dataid].bottom = 500
    this.data.sunshineArr[dataid].left = 108
    this.data.sunshineArr[dataid].scaleNum = 0
    this.setData({
      sunshineArr: this.data.sunshineArr,
      sunshineAccount: this.data.sunshineAccount
    })
  },
  collectAll(){
    for (let i = 0; i < this.data.sunshineArr.length; i++){
      this.data.sunshineArr[i].bottom = 500
      this.data.sunshineArr[i].left = 108
      this.data.sunshineArr[i].scaleNum = 0
    }
    this.setData({
      sunshineArr: this.data.sunshineArr,
      sunshineAccount: 0
    })
  },
  closeTaskBox:function(){
    this.setData({
      taskBoxState:"none"
    })
  },
  openTaskBox: function () {
    this.setData({
      taskBoxState: "block"
    })
  },
})
