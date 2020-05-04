export default {
	data() {
		return {
			customBar: this.CustomBar,
			tabsFlag: true, //圈子/动态
			topCustomBar: 0, //顶部状态栏高度
		}
	},
	methods: {
		// 切换顶部tab
		changeTabs(flag) {
			this.tabsFlag = flag;
		},
	},
	created() {
		console.log('findCreated');
		//获取顶部状态栏高度
		uni.getSystemInfo({
			success: res => {
				this.topCustomBar = res.statusBarHeight;
			}
		});
	}
}
