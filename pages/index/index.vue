<template>
	<view class="page-index">
		<view style="height: calc(100vh - 144rpx);">
			<home v-if="loadTabList[0]" :class="{ hide: tabIndex != 'home' }"></home>
			<find v-if="loadTabList[1]" :class="{ hide: tabIndex != 'find' }"></find>
			<message v-if="loadTabList[2]" :class="{ hide: tabIndex != 'message' }"></message>
			<mine v-if="loadTabList[3]" :class="{ hide: tabIndex != 'mine' }"></mine>
		</view>
		<!-- tabbar -->
		<view class="tabbar flex-around">
			<view @click="changeTabIndex('home')">
				<image class="icon" :src="'../../static/tabbar/home'+ (tabIndex == 'home'?'A':'') +'.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'home' }">首页</view>
			</view>
			<view @click="changeTabIndex('find')">
				<image class="icon" :src="'../../static/tabbar/find'+ (tabIndex == 'find'?'A':'') +'.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'find' }">发现</view>
			</view>
			<view><image class="icon publish" src="../../static/tabbar/publish.png" mode="widthFix"></image></view>
			<view @click="changeTabIndex('message')">
				<image class="icon" :src="'../../static/tabbar/message'+ (tabIndex == 'message'?'A':'') +'.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'message' }">站内信</view>
			</view>
			<view @click="changeTabIndex('mine')">
				<image class="icon" :src="'../../static/tabbar/mine'+ (tabIndex == 'mine'?'A':'') +'.png'" mode="widthFix"></image>
				<view :class="{ active: tabIndex == 'mine' }">我的</view>
			</view>
		</view>
	</view>
</template>

<script>
import home from '@/pages/home/home';
import find from '@/pages/find/find';
import message from '@/pages/message/message';
import mine from '@/pages/mine/mine';
export default {
	components: {
		home,
		find,
		message,
		mine
	},
	data() {
		return {
			tabIndex: 'home',
			loadTabList:[true,false,false,false]
		};
	},
	methods: {
		changeTabIndex(index) {
			this.tabIndex = index;
			if(index=="find"&&!this.loadTabList[1]){
				this.loadTabList[1] = true;
			}
			if(index=="message"&&!this.loadTabList[2]){
				this.loadTabList[2] = true;
			}
			if(index=="mine"&&!this.loadTabList[3]){
				this.loadTabList[3] = true;
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
	}
	.hide {
		display: none;
	}
}
</style>
