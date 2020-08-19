<template>
	<view class="page-index">
		<view :class="isSmallScreen && tabIndex == 'home' ? 'full-page' : 'normal-page'">
			<home ref="homePage" v-if="loadTabList[0]" :class="{ hide: tabIndex != 'home' }"></home>
			<find ref="findPage" v-if="loadTabList[1]" :class="{ hide: tabIndex != 'find' }"></find>
			<message ref="messagePage" v-if="loadTabList[2]" :class="{ hide: tabIndex != 'message' }"></message>
			<mine ref="minePage" v-if="loadTabList[3]" :class="{ hide: tabIndex != 'mine' }"></mine>
		</view>
		<!-- tabbar -->
		<view class="tabbar flex-around" :class="isSmallScreen && tabIndex == 'home' ? 'lucency' : ''">
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
		<view v-if="isAddProgramShow" class="add-program fs-24" :style="'top:' + (customBar + 10) + 'px;'">点击"添加到我的小程序",下次访问更便捷</view>
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
			clickTime: 0, //首页点击事件  控制双击
			isSmallScreen: true, //是否开启底部透明
			customBar: this.CustomBar,
			isAddProgramShow: true //是否显示添加到小程序
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
						this.$refs.homePage.onShowFun();
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
				if (this.$refs.homePage.$refs.recommendVideo) {
					this.$refs.homePage.$refs.recommendVideo.videoContext.pause();
				} else if (this.$refs.homePage.$refs.attentionVideo) {
					this.$refs.homePage.$refs.attentionVideo.videoContext.pause();
				}
			}
		},
		changeTabIndex(e) {
			var index = e.currentTarget.dataset.name;
			//点击当前页
			if (index == this.tabIndex) {
				this.doubleClick(e);
			}

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
			} else if (this.tabIndex != index) {
				if (this.$refs.homePage.$refs.recommendVideo) {
					this.$refs.homePage.$refs.recommendVideo.videoContext.play();
				} else if (this.$refs.homePage.$refs.attentionVideo) {
					this.$refs.homePage.$refs.attentionVideo.videoContext.play();
				}
			}

			//标记
			this.tabIndex = index;
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
		//接收首页分享的视频id
		if (options.id) {
			uni.setStorageSync('shareVideoId', options.id);
		}
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		if (this.isAuthorized) this.getPersonalInfo(); //获取消息数
		//打开朋友圈分享
		wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] });
		//隐藏添加到小程序
		setTimeout(() => {
			this.isAddProgramShow = false;
		}, 8000);
		//收录小程序的页面信息
		this.submitPages('pages/index/index', '');
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
			// console.log(res);
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
	.add-program {
		position: fixed;
		right: 20rpx;
		background-color: #9470dd;
		color: #fff;
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		&::after {
			content: '';
			width: 0;
			height: 0;
			border-right: 14px solid transparent;
			border-left: 14px solid transparent;
			border-bottom: 14px solid #9470dd;
			position: absolute;
			top: -20rpx;
			right: 90rpx;
		}
	}
	.full-page {
		height: 100vh;
	}
	.normal-page {
		height: calc(100vh - 144rpx);
	}
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
		&.lucency {
			background-color: rgba(0, 0, 0, 0);
		}
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
