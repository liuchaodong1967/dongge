// pages/change/change.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex : 1
  },
  changePrice:function(e){
    var dataid = e.currentTarget.dataset.id;
    this.setData({
      activeIndex : dataid
    })
  }
})