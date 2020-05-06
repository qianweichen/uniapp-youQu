import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

//跳转页面
Vue.prototype.goPage = function(url){
	uni.navigateTo({
		url
	})
}

//返回上一页
Vue.prototype.goBack = function(){
	uni.navigateBack();
}

//返回主页
Vue.prototype.goHome = function(){
	uni.reLaunch({
		url:'/pages/index/index'
	});
}

//判断授权 已授权为true
Vue.prototype.beAuthorized = function() {
	var userInfo = uni.getStorageSync('userInfo');
	if (userInfo) return true;
	return false;
}

//request
Vue.prototype.request = function(obj) {
	uni.request({
		url: obj.url || '',
		data: obj.data || {},
		method: obj.method || 'GET',
		header: obj.header || {
			"Content-Type": "application/json"
		},
		success: (res) => {
			typeof obj.success == "function" && obj.success(res);
		},
		fail: (res) => {
			console.log('request错误：', res);
			uni.showToast({
				title: '网络错误',
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
				title: '网络错误',
				icon: 'none'
			})
		}
	})
}
