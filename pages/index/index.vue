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
			<view @click="changeTabIndex('home')">
				<image class="icon" :src="'../../static/tabbar/home' + (tabIndex == 'home' ? 'A' : '') + '.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'home' }">首页</view>
			</view>
			<view @click="changeTabIndex('find')">
				<image class="icon" :src="'../../static/tabbar/find' + (tabIndex == 'find' ? 'A' : '') + '.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'find' }">发现</view>
			</view>
			<view><image @click="togglePublishFlag(true)" class="icon publish" src="../../static/tabbar/publish.png" mode="widthFix"></image></view>
			<view v-if="isAuthorized" @click="changeTabIndex('message')">
				<view class="tip flex-center circle" v-if="messageNum">{{messageNum}}</view>
				<image class="icon" :src="'../../static/tabbar/message' + (tabIndex == 'message' ? 'A' : '') + '.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'message' }">站内信</view>
			</view>
			<view v-else>
				<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
					<image class="icon" :src="'../../static/tabbar/message' + (tabIndex == 'message' ? 'A' : '') + '.png'" mode="widthFix"></image>
					<view :class="{ active: tabIndex == 'message' }">站内信</view>
				</button>
			</view>
			<view @click="changeTabIndex('mine')">
				<image class="icon" :src="'../../static/tabbar/mine' + (tabIndex == 'mine' ? 'A' : '') + '.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'mine' }">我的</view>
			</view>
		</view>
		<publish v-if="showPublishFlag" @togglePublishFlag="togglePublishFlag"></publish>
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
			messageNum:''
		};
	},
	methods: {
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
		changeTabIndex(index) {
			//点击时本身就在首页，则触发刷新首页视频（赋值之前执行）
			if (index == 'home') {
				if(this.tabIndex == 'home'){
					this.$refs.homePage.getHomeList(true);
				}
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
			
			//控制每次点击触发刷新
			if (index == 'home') {
			} else if (index == 'find') {
				if (this.$refs.findPage) this.$refs.findPage.onShowFun();
			} else if (index == 'message') {
				if (this.$refs.messagePage) this.$refs.messagePage.onShowFun();
			} else if (index == 'mine') {
				if (this.$refs.minePage) this.$refs.minePage.onShowFun();
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
			uni.showLoading({
				title: '加载中'
			});
			this.request({
				url: this.apiUrl + 'User/get_user_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid')
				},
				success: res => {
					uni.hideLoading();
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
		if(this.isAuthorized)
			this.getPersonalInfo();	//获取消息数
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
			if(res.target.dataset.type=='video'){	//视频分享，打开首页
				return {
					title: res.target.dataset.content || this.miniProgramName,
					path: '/pages/index/index?id=' + res.target.dataset.id,
					imageUrl: res.target.dataset.img
				};
			}else{	//动态分享，打开详情页
				return {
					title: res.target.dataset.content || this.miniProgramName,
					path: '/pages/articleDetails/articleDetails?id=' + res.target.dataset.id,
					imageUrl: res.target.dataset.img
				};
			}
		}
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
		>view{
			position: relative;
			.tip{
				width: 30rpx;
				height: 30rpx;
				color: #fff;
				background-color: #7364BD;
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
