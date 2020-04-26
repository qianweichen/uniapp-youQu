<script>
import Vue from 'vue';
export default {
	onLaunch: function() {
		// console.log('App Launch')
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
				// #ifdef MP-WEIXIN
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
	},
	onShow: function() {
		// console.log('App Show')
	},
	onHide: function() {
		// console.log('App Hide')
	}
};
</script>

<style>
/*每个页面公共css */
.flex {
	display: flex;
	align-items: center;
}
.flex-between {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}
.flex-around {
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>
