<template>
	<view class="page-index">
		<view style="height: calc(100vh - 144rpx);">
			<home ref="homePage" v-if="loadTabList[0]" :class="{ hide: tabIndex != 'home' }"></home>
			<find ref="findPage" v-if="loadTabList[1]" :class="{ hide: tabIndex != 'find' }"></find>
			<message ref="messagePage" v-if="loadTabList[2]" :class="{ hide: tabIndex != 'message' }"></message>
			<mine ref="minePage" v-if="loadTabList[3]" :class="{ hide: tabIndex != 'mine' }"></mine>
		</view>
		<!-- tabbar -->
		<view class="tabbar flex-around">
			<view @click="changeTabIndex" data-name="home">
				<image class="icon" :src="'../../static/tabbar/home' + (tabIndex == 'home' ? 'A' : '') + '.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'home' }">首页</view>
			</view>
			<view @click="changeTabIndex" data-name="find">
				<image class="icon" :src="'../../static/tabbar/find' + (tabIndex == 'find' ? 'A' : '') + '.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'find' }">发现</view>
			</view>
			<view><image @click="togglePublishFlag(true)" class="icon publish" src="../../static/tabbar/publish.png" mode="widthFix"></image></view>
			<view v-if="isAuthorized" @click="changeTabIndex" data-name="message">
				<view class="tip flex-center circle" v-if="messageNum">{{ messageNum }}</view>
				<image class="icon" :src="'../../static/tabbar/message' + (tabIndex == 'message' ? 'A' : '') + '.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'message' }">站内信</view>
			</view>
			<view v-else>
				<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
					<image class="icon" :src="'../../static/tabbar/message' + (tabIndex == 'message' ? 'A' : '') + '.png'" mode="widthFix"></image>
					<view :class="{ active: tabIndex == 'message' }">站内信</view>
				</button>
			</view>
			<view @click="changeTabIndex" data-name="mine">
				<image class="icon" :src="'../../static/tabbar/mine' + (tabIndex == 'mine' ? 'A' : '') + '.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'mine' }">我的</view>
			</view>
		</view>
		<publish v-if="showPublishFlag" @togglePublishFlag="togglePublishFlag"></publish>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import home from '@/pages/home/home';
import find from '@/pages/find/find';
import message from '@/pages/message/message';
import mine from '@/pages/mine/mine';
import publish from '@/components/publish/publish';
export default {
	components: {
		home,
		find,
		message,
		mine,
		publish
	},
	data() {
		return {
			isAuthorized: false, //授权否
			tabIndex: 'home',
			loadTabList: [true, false, false, false],
			showPublishFlag: false,
			messageNum: '',
			clickTime: 0 //首页点击事件  控制双击
		};
	},
	methods: {
		doubleClick(e) {
			var curTime = e.timeStamp; //本次点击时间
			var lastTime = this.clickTime; //上次点击时间
			if (curTime - lastTime > 0) {
				if (curTime - lastTime < 300) {
					// console.log("双击事件，用了：" + (curTime - lastTime));
					//每次双击触发刷新
					if (this.tabIndex == 'home') {
						this.$refs.homePage.getHomeList(true);
					} else if (this.tabIndex == 'find') {
						if (this.$refs.findPage) this.$refs.findPage.onShowFun();
					} else if (this.tabIndex == 'message') {
						if (this.$refs.messagePage) this.$refs.messagePage.onShowFun();
					} else if (this.tabIndex == 'mine') {
						if (this.$refs.minePage) this.$refs.minePage.onShowFun();
					}
				}
			}
			this.clickTime = curTime;
		},
		// 选择发布类型
		togglePublishFlag(flag) {
			this.showPublishFlag = flag;
		},
		//暂停视频
		stopHomeVideo() {
			if (this.$refs.homePage) {
				this.$refs.homePage.$refs.videoBox.videoContext.pause();
			}
		},
		changeTabIndex(e) {
			var index = e.currentTarget.dataset.name;
			//点击当前页
			if (index == this.tabIndex) {
				this.doubleClick(e);
			}

			this.tabIndex = index;

			//控制第一次点击加载
			if (index == 'home' && !this.loadTabList[0]) {
				this.loadTabList[0] = true;
			}
			if (index == 'find' && !this.loadTabList[1]) {
				this.loadTabList[1] = true;
			}
			if (index == 'message' && !this.loadTabList[2]) {
				this.loadTabList[2] = true;
			}
			if (index == 'mine' && !this.loadTabList[3]) {
				this.loadTabList[3] = true;
			}

			//切换tab暂停视频
			if (index == 'find' || index == 'message' || index == 'mine') {
				this.stopHomeVideo(); //暂停视频
			} else {
				this.$refs.homePage.$refs.videoBox.videoContext.play();
			}
		},
		getUserInfo(e) {
			if (!e.detail.userInfo) return;
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
				//获取消息数
				this.getPersonalInfo();
			});
		},
		//获取用户信息
		getPersonalInfo() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_user_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid')
				},
				success: res => {
					this.$refs.loading.close();
					// console.log('获取用户信息:', res);
					this.messageNum = res.data.info.message_num;
				}
			});
		}
	},
	onLoad(options) {
		if (options.id) {
			uni.setStorageSync('shareVideoId', options.id);
		}
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		if (this.isAuthorized) this.getPersonalInfo(); //获取消息数
		
		wx.showShareMenu({menus: ['shareAppMessage', 'shareTimeline']});
	},
	onShow() {
		// if (this.$refs.findPage) this.$refs.findPage.onShowFun();
		// if (this.$refs.messagePage) this.$refs.messagePage.onShowFun();
		// if (this.$refs.minePage) this.$refs.minePage.onShowFun();
	},
	onHide() {
		this.stopHomeVideo(); //打开其他页面暂停视频
	},
	onShareAppMessage(res) {
		// console.log(res);
		// 系统菜单分享
		if (res.from === 'menu') {
			return {
				title: this.miniProgramName,
				path: '/pages/index/index',
				imageUrl: '/static/logo.png'
			};
		}
		// 页面内分享按钮
		if (res.from === 'button') {
			console.log(res);
			if (res.target.dataset.type == 'video') {
				//视频分享，打开首页
				return {
					title: res.target.dataset.content || this.miniProgramName,
					path: '/pages/index/index?id=' + res.target.dataset.id,
					imageUrl: res.target.dataset.img
				};
			} else {
				//动态分享，打开详情页
				return {
					title: res.target.dataset.content || this.miniProgramName,
					path: '/pagesA/articleDetails/articleDetails?id=' + res.target.dataset.id,
					imageUrl: res.target.dataset.img
				};
			}
		}
	},
	onShareTimeline(res) {
		return {
			title: this.miniProgramName,
			query: '',
			imageUrl: '/static/logo.png'
		};
	}
};
</script>

<style lang="scss">
.page-index {
	.tabbar {
		width: 100%;
		height: 144rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: $themeColor;
		color: rgba(255, 255, 255, 0.7);
		font-size: 22rpx;
		text-align: center;
		.icon {
			width: 60rpx;
			height: auto;
		}
		.publish {
			width: 90rpx;
			height: auto;
		}
		.active {
			color: #7464bd;
		}
		> view {
			position: relative;
			.tip {
				width: 30rpx;
				height: 30rpx;
				color: #fff;
				background-color: #7364bd;
				position: absolute;
				right: 0;
				top: 0;
				font-size: 22rpx;
			}
		}
	}
	.hide {
		display: none;
	}
}
</style>
