<script>
import Vue from 'vue';
var timer = '';
export default {
	onLaunch: async function() {
		//小程序版本更新
		const updateManager = uni.getUpdateManager();
		updateManager.onCheckForUpdate(function(res) {
			// 请求完新版本信息的回调
			// console.log(res.hasUpdate);
		});
		updateManager.onUpdateReady(function(res) {
			uni.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			});
		});
		updateManager.onUpdateFailed(function(res) {
			// 新的版本下载失败
			uni.showModal({
				title: '更新提示',
				content: '新的版本下载失败，请稍后重试'
			});
		});
	},
	onShow: function() {
		//屏幕长亮
		uni.setKeepScreenOn({
			keepScreenOn: true
		});

		//自定义导航栏高度封装CustomBar
		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				}
				// #endif
				// #ifdef MP-WEIXIN || MP-QQ
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif
				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		});

		// 开始计算浏览时间
		// let inAppTime = Date.now(); //进入的时间
		// uni.setStorageSync('inAppTime', inAppTime); //存一下
		// clearInterval(timer); //重置下，防止多次触发
		// timer = setInterval(() => {
		// 	let nowTime = Date.now(); //当前时间
		// 	let oldTime = uni.getStorageSync('playAppTime'); //之前累计的时间（不到15分钟存一下，累计起来）
		// 	if ((nowTime + (oldTime || 0) - inAppTime) / 1000 / 60 >= 15) {
		// 		//累计的时间加上这次看的时间是否到达15分钟
		// 		uni.removeStorageSync('playAppTime'); //到15分钟后删除累计的时间

		// 		uni.request({
		// 			url: this.apiUrl + 'User/user_jf_add',
		// 			data: {
		// 				token: uni.getStorageSync('token'),
		// 				openid: uni.getStorageSync('openid'),
		// 				uid: uni.getStorageSync('userId'),
		// 				type: 2,
		// 				version: 1
		// 			},
		// 			success: res => {
		// 				if (res.data.msg != '今日已奖励过') {
		// 					uni.showToast({
		// 						title: res.data.msg,
		// 						icon: 'none'
		// 					});
		// 				}
		// 				clearInterval(timer);
		// 			}
		// 		});
		// 	} else {
		// 		// console.log('正在看');
		// 	}
		// }, 10000);
	},
	onHide: function() {
		//离开时存储这次的时间
		// let inAppTime = uni.getStorageSync('inAppTime');
		// let outAppTime = Date.now();
		// let playAppTime = outAppTime - inAppTime;
		// if (playAppTime / 1000 / 60 < 15) {
		// 	uni.setStorageSync('playAppTime', playAppTime);
		// }
	}
};
</script>

<style>
/*每个页面公共css */
@import '@/common/common.scss';
</style>
