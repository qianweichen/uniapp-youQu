<template>
	<view class="page-index">
		<view v-if="platform == 'ios'" :class="(isSmallScreen && tabIndex == 'home') || tabIndex == 'find' ? 'full-page' : 'normal-page'">
			<home ref="homePage" v-if="loadTabList[0]" :class="{ hide: tabIndex != 'home' }"></home>
			<find ref="findPage" v-if="loadTabList[1]" :class="{ hide: tabIndex != 'find' }" @showDynamicCommentFun="showDynamicCommentFun"></find>
			<message ref="messagePage" v-if="loadTabList[2]" :class="{ hide: tabIndex != 'message' }"></message>
			<mine ref="minePage" v-if="loadTabList[3]" :class="{ hide: tabIndex != 'mine' }"></mine>
		</view>
		<view v-else-if="platform">
			<view class="page-group" :style="'left:-' + tabIndexList.indexOf(tabIndex) * 375 * 2 + 'rpx;'">
				<view :class="isSmallScreen && tabIndex == 'home' ? 'full-page' : 'normal-page'"><home ref="homePage" v-if="loadTabList[0]"></home></view>
				<view class="normal-page"><find ref="findPage" v-if="loadTabList[1]"></find></view>
				<view class="normal-page"><message ref="messagePage" v-if="loadTabList[2]"></message></view>
				<view class="normal-page"><mine ref="minePage" v-if="loadTabList[3]"></mine></view>
			</view>
		</view>
		<!-- tabbar -->
		<view class="tabbar flex-around" :class="[isSmallScreen && tabIndex == 'home' ? 'lucency' : '', isTabbarShow ? 'go-back' : '']">
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
				<button class="share" @click="getUserInfo">
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
// 在页面中定义插屏广告
let interstitialAd = null;
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
			platform: null, //系统类型
			isAuthorized: false, //授权否
			tabIndex: 'home',
			tabIndexList: ['home', 'find', 'message', 'mine'],
			loadTabList: [true, false, false, false],
			showPublishFlag: false,
			messageNum: '',
			clickTime: 0, //首页点击事件  控制双击
			isSmallScreen: uni.getSystemInfoSync().windowHeight <= 667, //是否开启底部透明
			customBar: this.CustomBar,
			isAddProgramShow: true, //是否显示添加到小程序

			isTabbarShow: false
		};
	},
	methods: {
		showDynamicCommentFun(flag) {
			// console.log('index',flag);
			this.isTabbarShow = flag;
		},
		doubleClick(e) {
			var curTime = e.timeStamp; //本次点击时间
			var lastTime = this.clickTime; //上次点击时间
			if (curTime - lastTime > 0) {
				if (curTime - lastTime < 300) {
					// console.log("双击事件，用了：" + (curTime - lastTime));
					//每次双击触发刷新
					if (this.tabIndex == 'home') {
						this.$refs.homePage.refreshVideo();
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
				}
				if (this.$refs.homePage.$refs.attentionVideo) {
					this.$refs.homePage.$refs.attentionVideo.videoContext.pause();
				}
			}
		},
		//切换底部tabbar
		changeTabIndex(e) {
			// 在适合的场景显示插屏广告
			if (interstitialAd) {
				interstitialAd.show().catch(err => {
					console.error(err);
				});
			}

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
					this.$refs.homePage.$refs.recommendVideo.isAuthorized = this.beAuthorized();
				} else if (this.$refs.homePage.$refs.attentionVideo) {
					this.$refs.homePage.$refs.attentionVideo.videoContext.play();
					this.$refs.homePage.$refs.attentionVideo.isAuthorized = this.beAuthorized();
				}
			}
			
			//切换tab暂停发现页视频
			if (index == 'home' || index == 'message' || index == 'mine') {
				if (this.$refs.findPage) {
					this.$refs.findPage.stopVideo();
				}
			}

			//标记
			this.tabIndex = index;
		},
		//授权
		getUserInfo(e) {
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
					if (res.data.info && res.data.info.message_num) this.messageNum = res.data.info.message_num;
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
		//判断安卓/ios
		uni.getSystemInfo({
			success: res => {
				this.platform = res.platform;
				uni.setStorageSync('platform', res.platform);
				// if (res.platform == 'devtools') {
				// 	PC;
				// } else if (res.platform == 'ios') {
				// 	IOS;
				// } else if (res.platform == 'android') {
				// 	android;
				// }
			}
		});

		//广告
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-f4669b91d9da4f72'
			});
			interstitialAd.onLoad(() => {});
			interstitialAd.onError(err => {});
			interstitialAd.onClose(() => {});
		}
	},
	onShow() {
		// 在适合的场景显示插屏广告
		if (interstitialAd) {
			interstitialAd.show().catch(err => {
				console.error(err);
			});
		}

		// 发布视频后返回检测id
		var publishCircleId = uni.getStorageSync('publishCircleId');
		if (publishCircleId) {
			if (this.$refs.homePage && this.tabIndex == 'home') {
				this.$refs.homePage.refreshVideo(publishCircleId);
			} else {
				//切换tab到首页
				this.tabIndex = 'home';
				this.$refs.homePage.refreshVideo(publishCircleId);
			}
			uni.removeStorageSync('publishCircleId');
		}

		//触发子组件onshow函数
		if (this.$refs.homePage) this.$refs.homePage.onShowFun();
		// if (this.$refs.findPage) this.$refs.findPage.onShowFun();
		// if (this.$refs.messagePage) this.$refs.messagePage.onShowFun();
		if (this.$refs.minePage) this.$refs.minePage.onShowFun();

		//打开小程序时的操作
		if (this.$refs.homePage) {
			if (this.$refs.homePage.$refs.recommendVideo) {
				//解决ios分享按钮动画放大到白屏问题
				this.$refs.homePage.$refs.recommendVideo.isAnimationDataShow = true;
				//载入存储的观看时间
				var nowDate = new Date().toLocaleDateString(),
					oldDate = uni.getStorageSync('saveRecommendVideoWatchTimeDate');
				//如果是当天则载入，第二天的话就默认从0开始
				if (nowDate == oldDate) {
					this.$refs.homePage.$refs.recommendVideo.watchTime = uni.getStorageSync('recommendVideoWatchTime');
				}
			}
			if (this.$refs.homePage.$refs.attentionVideo) {
				this.$refs.homePage.$refs.attentionVideo.isAnimationDataShow = true;
			}
		}
	},
	onHide() {
		this.stopHomeVideo(); //打开其他页面暂停视频

		//关闭小程序时的操作
		if (this.$refs.homePage) {
			if (this.$refs.homePage.$refs.recommendVideo) {
				//解决ios分享按钮动画放大到白屏问题
				this.$refs.homePage.$refs.recommendVideo.isAnimationDataShow = false;
				//存储观看时间和当天日期
				uni.setStorageSync('saveRecommendVideoWatchTimeDate', new Date().toLocaleDateString());
				uni.setStorageSync('recommendVideoWatchTime', this.$refs.homePage.$refs.recommendVideo.watchTime);
			}
			if (this.$refs.homePage.$refs.attentionVideo) {
				this.$refs.homePage.$refs.attentionVideo.isAnimationDataShow = false;
			}
		}
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
	position: relative;
	width: 100%;
	height: 100vh;
	overflow-x: hidden;
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
	.page-group {
		width: 400%;
		height: 100%;
		position: absolute;
		top: 0;
		white-space: nowrap;
		transition: all ease 0.3s;
		> view {
			width: 750rpx;
			display: inline-block;
			position: relative;
			overflow-x: hidden;
		}
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
		&.go-back{
			z-index: -1;
		}
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
