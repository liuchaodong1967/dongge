var app = getApp();
Component({
  properties: {
    sharePacket:{
      type:Object,
      value:{
        isState: false,
        priceName:'',
      }
    }
  },
  data: {

  },
  attached: function () {
  },
  methods: {
    closeShare:function(){
      this.setData({
        "sharePacket.isState": false
      })
    },
    goShare:function(){
      this.triggerEvent('listenerActionSheet');
    },
  }
})