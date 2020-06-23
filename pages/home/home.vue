<template>
	<view class="page-home">
		<!-- tab -->
		<view class="topTab flex-center" :style="'height:' + (customBar + topCustomBar) + 'px;'">
			<view class="tabs flex-between fs-32">
				<view @click="changeTabs(true)">
					<text :class="{ active: tabsFlag }">推荐</text>
					<view v-if="tabsFlag" class="line"></view>
				</view>
				<view v-if="isAuthorized" @click="changeTabs(false)">
					<text :class="{ active: !tabsFlag }">关注</text>
					<view v-if="!tabsFlag" class="line"></view>
				</view>
				<view v-else>
					<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
						<text :class="{ active: !tabsFlag }">关注</text>
						<view v-if="!tabsFlag" class="line"></view>
					</button>
				</view>
			</view>
			<image @click="goPage('/pages/search/search')" class="search" src="../../static/search.png" mode="widthFix"></image>
		</view>
		<!-- <view :style="'height:' + (customBar + topCustomBar) + 'px;'"></view> -->
		<!-- <view  :style="'height:calc(100% - ' + (customBar + topCustomBar) + 'px);'"> -->
		<view style="height: 100%;">
			<videoBox ref="videoBox" :videoList="videoList" @loginFun="refreshList" @getNextPage="getHomeList" @goodFun="goodFun" @commentFun="commentFun" @attentionFun="attentionFun"></videoBox>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import homeJs from './home.js';
import videoBox from '@/components/videoPage/videoPage.vue';
export default {
	...homeJs,
	components:{
		videoBox
	}
};
</script>

<style lang="scss">
@import './home.scss';
</style>
