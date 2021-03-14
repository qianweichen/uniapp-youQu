import Vue from 'vue';

//小程序名
Vue.prototype.miniProgramName = "友趣短视频";

//请求地址
Vue.prototype.apiUrl = "https://quanyu.udiao.cn/index.php?s=/api/";
// Vue.prototype.apiUrl = "http://vlog.ime123.com/index.php?s=/api/";

//修改http为https
Vue.prototype.httpsUrl = function(url) {
	if (url && url.indexOf("https") < 0) {
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

//获取code
Vue.prototype.getCode = function() {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success: res => {
				resolve(res.code);
			}
		});
	});
}

//获取openid
Vue.prototype.getOpenid = function(code) {
	return new Promise((resolve, reject) => {
		this.request({
			url: this.apiUrl + 'Login/index',
			data: {
				code: code
			},
			success: res => {
				if (res.data.code == 0) {
					uni.setStorageSync('openid', res.data.info.openid);
					uni.setStorageSync('session_key', res.data.info.session_key);
					wx.aldstat.sendOpenid(res.data.info.openid); //阿拉丁
					resolve(res.data.info.openid);
				} else {
					uni.showToast({
						title: '登陆失败，请稍后再试',
						icon: 'none'
					});
				}
			}
		});
	});
}

//获取微信用户信息
Vue.prototype.getWxUserInfo = function() {
	return new Promise((resolve, reject) => {
		if(!wx.getUserProfile){
			reject('版本库不支持此接口');
			return;
		}
		wx.getUserProfile({
			desc:'在动态中展示',
			success:(res)=>{
				console.log(res);
				resolve(res);
			},
			fail:function(err){
				console.log(err);
				reject('获取失败');
			}
		});
	});
}

//用户登陆 获取token
Vue.prototype.doLogin = async function(userInfo, callBack, type) {
	//没有openid则获取openid
	if (!uni.getStorageSync('openid')) {
		var code = await this.getCode();
		await this.getOpenid(code);
	}
	if (this.$refs.loading) {
		this.$refs.loading.open();
	}
	uni.setStorageSync('userInfo', userInfo);
	this.request({
		url: this.apiUrl + 'Login/do_login',
		data: {
			userInfo,
			wx_openid: uni.getStorageSync('openid'),
			uniacid: 1
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
				console.log('错误信息：', res);
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
				page.$vm.$refs.loading.close();
				if (pageIndex.$vm.$refs.homePage) {
					pageIndex.$vm.$refs.homePage.$refs.loading.close();
					if (pageIndex.$vm.$refs.homePage.$refs.recommendVideo) {
						pageIndex.$vm.$refs.homePage.$refs.recommendVideo.$refs.loading.close();
					}
					if (pageIndex.$vm.$refs.homePage.$refs.attentionVideo) {
						pageIndex.$vm.$refs.homePage.$refs.attentionVideo.$refs.loading.close();
					}
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
				console.log('错误信息：', res);
				uni.showToast({
					title: res.data.msg,
					icon: 'none'
				});
				page.$vm.$refs.loading.close();
				if (pageIndex.$vm.$refs.homePage) {
					pageIndex.$vm.$refs.homePage.$refs.loading.close();
					if (pageIndex.$vm.$refs.homePage.$refs.recommendVideo) {
						pageIndex.$vm.$refs.homePage.$refs.recommendVideo.$refs.loading.close();
					}
					if (pageIndex.$vm.$refs.homePage.$refs.attentionVideo) {
						pageIndex.$vm.$refs.homePage.$refs.attentionVideo.$refs.loading.close();
					}
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


/*
    时间格式化
    var time1 = new Date().Format("yyyy-MM-dd");
    var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
*/
Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"h+": this.getHours(), // 小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), // 秒
		"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
		"S": this.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}
