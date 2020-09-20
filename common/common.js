import Vue from 'vue';

//小程序名
Vue.prototype.miniProgramName = "友趣短视频";

//请求地址
Vue.prototype.apiUrl = "https://quanyu.udiao.cn/index.php?s=/api/";

//修改http为https
Vue.prototype.httpsUrl = function(url) {
	if (url.indexOf("https") < 0) {
		url = url.replace("http:", "https:");
	}
	return url;
}

//跳转页面
Vue.prototype.goPage = function(url) {
	uni.navigateTo({
		url
	})
}

//返回上一页
Vue.prototype.goBack = function() {
	uni.navigateBack();
}

//返回主页
Vue.prototype.goHome = function() {
	uni.reLaunch({
		url: '/pages/index/index'
	});
}

//判断授权 已授权为true
Vue.prototype.beAuthorized = function() {
	var userInfo = uni.getStorageSync('userInfo');
	if (userInfo) return true;
	return false;
}

//用户登陆 获取token
Vue.prototype.doLogin = function(userInfo, callBack, type) {
	if (this.$refs.loading) {
		this.$refs.loading.open();
	}
	uni.setStorageSync('userInfo', userInfo);
	this.request({
		url: this.apiUrl + 'Login/do_login',
		data: {
			userInfo,
			wx_openid: uni.getStorageSync('openid'),
			uniacid:1
		},
		success: res => {
			if (this.$refs.loading) {
				this.$refs.loading.close();
			}
			// console.log("登陆获取token：",res);
			if (res.data.code == 0) {
				uni.setStorageSync('userId', res.data.id);
				uni.setStorageSync('token', res.data.token);
				if (type != "refresh") {
					uni.showToast({
						title: '登陆成功'
					});
				}
				if (callBack) {
					callBack();
				}
			} else {
				uni.showToast({
					title: '登陆失败，请稍后再试',
					icon: 'none'
				});
			}
		}
	});
}

//request
Vue.prototype.request = function(obj) {
	obj.data.much_id = 1; //平台标识 默认为1
	uni.request({
		url: obj.url || '',
		data: obj.data || {},
		method: obj.method || 'GET',
		responseType: obj.responseType || '',
		header: obj.header || {
			"Content-Type": "application/json"
		},
		success: (res) => {
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			var pageIndex = pages[0];
			if (res.status && res.status == "error") {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
				page.$vm.$refs.loading.close();
				if (pageIndex.$vm.$refs.homePage) {
					pageIndex.$vm.$refs.homePage.$refs.loading.close();
				}
				if (pageIndex.$vm.$refs.findPage) {
					pageIndex.$vm.$refs.findPage.$refs.loading.close();
				}
				if (pageIndex.$vm.$refs.messagePage) {
					pageIndex.$vm.$refs.messagePage.$refs.loading.close();
				}
				if (pageIndex.$vm.$refs.minePage) {
					pageIndex.$vm.$refs.minePage.$refs.loading.close();
				}
				return;
			}
			if (res.data.status && res.data.status == "error") {
				uni.showToast({
					title: res.data.msg,
					icon: 'none'
				});
				page.$vm.$refs.loading.close();
				if (pageIndex.$vm.$refs.homePage) {
					pageIndex.$vm.$refs.homePage.$refs.loading.close();
				}
				if (pageIndex.$vm.$refs.findPage) {
					pageIndex.$vm.$refs.findPage.$refs.loading.close();
				}
				if (pageIndex.$vm.$refs.messagePage) {
					pageIndex.$vm.$refs.messagePage.$refs.loading.close();
				}
				if (pageIndex.$vm.$refs.minePage) {
					pageIndex.$vm.$refs.minePage.$refs.loading.close();
				}
				return;
			}
			typeof obj.success == "function" && obj.success(res);
		},
		fail: (res) => {
			// console.log('request错误：', res);
			uni.showToast({
				title: '网络错误,请稍后再试',
				icon: 'none'
			});
		}
	})
}
//uploadFile
Vue.prototype.uploadFile = function(obj) {
	uni.uploadFile({
		url: obj.url || '',
		filePath: obj.filePath || '',
		name: obj.name || '',
		formData: obj.formData || {},
		success: function(res) {
			typeof obj.success == "function" && obj.success(res);
		},
		fail: function() {
			// console.log('uploadFile错误：', res);
			uni.showToast({
				title: '网络错误,请稍后再试',
				icon: 'none'
			})
		}
	})
}

//浏览图片
Vue.prototype.browseImg = function(urls, current) {
	uni.previewImage({
		urls,
		current,
		// longPressActions: {
		// 	itemList: ['发送给朋友', '保存图片', '收藏'],
		// 	success: function(data) {
		// 		console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
		// 	},
		// 	fail: function(err) {
		// 		console.log(err.errMsg);
		// 	}
		// }
	});
}

//小神推模板消息订阅
Vue.prototype.subscription = function(type) {
	var eventId = '5f34cf2190fcd68beee4d506'; //默认是打卡
	if (type == 'attention') {
		eventId = '5f32100290fcd68beee4d501'; //关注
	}
	wx.aldPushSubscribeMessage({
		eventId,
		success(res) {
			// console.log(res)
		},
		fail(res, e) {
			// console.log(res)
			// console.log(e)
		}
	});
}

// 收录小程序的页面信息
Vue.prototype.submitPages = function(path, query) {
	this.request({
		url: this.apiUrl + 'user/submitPages',
		method: 'POST',
		data: {
			path,
			query
		},
		success: res => {
			// console.log('收录小程序的页面信息:', res);
		}
	});
}
