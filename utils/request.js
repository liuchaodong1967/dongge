let baseUrl = getApp().globalData.url; //线上
module.exports = function (url, method, data = {}) {
  let meth = method.toUpperCase()
  if (meth != "GET" && meth != "DELETE" && meth != "POST" && meth != "PUT") {
    meth = 'GET' //不传情况下默认'GET'
  }
  if (getApp().globalData.isLog) {	//已登陆情况下必传参数（项目需要看情况而定）
    data['token'] = getApp().globalData.token;
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      header: {
        'content-type': meth == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
      },
      url: baseUrl + url,
      data: data,
      method: meth,
      success: function (res) {
        //返回信息统一处理操作
        //resolve用于具体调用中
        resolve(res)
      },
      fail: function (res) {
        //错误信息统一处理操作
        reject(res)
      }
    })
  })
}

