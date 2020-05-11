<template>
	<view class="page-index">
		<view style="height: calc(100vh - 144rpx);">
			<home ref="homePage" v-if="loadTabList[0]" :class="{ hide: tabIndex != 'home' }"></home>
			<find v-if="loadTabList[1]" :class="{ hide: tabIndex != 'find' }"></find>
			<message v-if="loadTabList[2]" :class="{ hide: tabIndex != 'message' }"></message>
			<mine v-if="loadTabList[3]" :class="{ hide: tabIndex != 'mine' }"></mine>
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
			<view @click="changeTabIndex('message')">
				<image class="icon" :src="'../../static/tabbar/message' + (tabIndex == 'message' ? 'A' : '') + '.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'message' }">站内信</view>
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
			tabIndex: 'find',
			loadTabList: [false, true, false, false],
			showPublishFlag:false
		};
	},
	methods: {
		// 选择发布类型
		togglePublishFlag(flag){
			this.showPublishFlag = flag;
		},
		//暂停视频
		stopHomeVideo() {
			if (this.$refs.homePage) {
				this.$refs.homePage.videoContext.stop();
				this.$refs.homePage.showVideoPlayBtn = true;
			}
		},
		changeTabIndex(index) {
			this.tabIndex = index;
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
			}
		}
	},
	onHide() {
		this.stopHomeVideo(); //打开其他页面暂停视频
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
	}
	.hide {
		display: none;
	}
}
</style>
