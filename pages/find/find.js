export default {
	data() {
		return {
			customBar: this.CustomBar,
			topCustomBar: this.StatusBar, //顶部状态栏高度
			tabsFlag: true, //圈子/动态
			dynamicList: [1, 2, 3]
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
	}
}
