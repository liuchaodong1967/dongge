const app = getApp();

 /**
  * 相册授权
  * @param string successCallback 为成功回调
  * @param int num errorCallback  为失败回调
  * @return array  先检测授权，如果没有授权，发起授权，后期授权弹窗提示
 */
const Authalbum= function (successCallback, errorCallback) {
  	wx.getSetting({
		success(res) {
			if (!res.authSetting['scope.writePhotosAlbum']) {
				wx.authorize({
					scope: 'scope.writePhotosAlbum',
					success() {	//这里是用户同意授权后的回调
						successCallback && successCallback('ok')
					},
					fail() {	//这里是用户拒绝授权后的回调
						 
							  	wx.showModal({
									title: '温馨提示',
									content: '若不打开授权，则无法将图片保存在相册中！',
									confirmText:'去授权',
									cancelText:'取消',
									success(res){
									  if(res.confirm){
											wx.openSetting({
												success(settingdata) {
													if (settingdata.authSetting['scope.writePhotosAlbum']) {
														successCallback && successCallback('ok');
														app.Tips({ title: '授权成功,点击即可保存图片' });
													}else{
														errorCallback && errorCallback('fail');
														app.Tips({ title: '授权失败,无法保存图片' });
													}
												}
											})
									  } 
									}
								})
					}
				})
			}else{
				//console.log('已经收过权了')
				 successCallback && successCallback('ok');
			}
		}
	})
}


 /**
  * 保存图片到相册
  * @param string imgurl 为网络图片
  * @param int num 为单行显示的字节长度
  * @return 先下载文件为微信临时文件，然后在执行保存到相册
 */
const DownloadImage= function (imgurl) {
	if(!imgurl) return app.Tips({ title: '图片错误' });
	wx.showLoading({title: '正在保存中...'})
	wx.downloadFile({
	      url: imgurl,
	      success: function (res) {
			wx.hideLoading();
			wx.saveImageToPhotosAlbum({
				filePath: res.tempFilePath,
				success: function (res) {
					wx.showToast({
						title: '保存成功',
						icon: 'success',
						duration: 2000
					})
				}
			})
	      },
	      fail:function(err){
			 console.log(err);  
			 wx.hideLoading();
			 wx.showToast({
				title: '保存失败',
				duration: 2000
			 })        
	      }
	})
}

module.exports = {
  Authalbum: Authalbum,
  DownloadImage:DownloadImage
}