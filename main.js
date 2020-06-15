import Vue from 'vue'
import App from './App'


//小程序名
Vue.prototype.miniProgramName = "友趣短视频";
//请求地址
Vue.prototype.apiUrl = "https://quanyu.udiao.cn/index.php?s=/api/";

//顶部tabbar
import navigationBar from "./components/navigationBar/navigationBar.vue";
Vue.component("navigationBar", navigationBar);

//返回胶囊
import backCapsule from "./components/backCapsule/backCapsule.vue";
Vue.component("backCapsule", backCapsule);

//加载动画
import wLoading from "@/components/loading/w-loading.vue";
Vue.component('w-loading',wLoading);

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
Vue.prototype.doLogin = function(userInfo, callBack) {
	uni.showLoading({
		title: '登陆中'
	});
	uni.setStorageSync('userInfo', userInfo);
	this.request({
		url: this.apiUrl + 'Login/do_login',
		data: {
			userInfo,
			wx_openid: uni.getStorageSync('openid')
		},
		success: res => {
			uni.hideLoading();
			// console.log("登陆获取token：",res);
			if (res.data.code == 0) {
				uni.setStorageSync('userId', res.data.id);
				uni.setStorageSync('token', res.data.token);
				uni.showToast({
					title: '登陆成功'
				})
				callBack();
			} else {
				uni.showToast({
					title: '登陆失败，请稍后再试',
					icon: 'none'
				})
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
			if (res.status && res.status == "error") {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				return;
			}
			if (res.data.status && res.data.status == "error") {
				uni.showToast({
					title: res.data.msg,
					icon: 'none'
				})
				return;
			}
			typeof obj.success == "function" && obj.success(res);
		},
		fail: (res) => {
			console.log('request错误：', res);
			uni.showToast({
				title: '网络错误,请稍后再试',
				icon: 'none'
			})
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
			console.log('uploadFile错误：', res);
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


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()