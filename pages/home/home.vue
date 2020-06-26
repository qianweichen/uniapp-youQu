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
		
		<!-- 公告 -->
		<view v-if="isShowNotice">
			<view class="mask">
				<view class="notice">
					<image src="../../static/notice.png" mode="widthFix"></image>
					<view class="concat">
						<view class="title">友趣短视频小程序正式上线啦！</view>
						<view class="info">新版福利：发布的视频或动态点赞量达到1000，奖励100元。点赞量达到10000，奖励1000元。联系客服即可领取奖励，快来体验吧！</view>
						<view class="btn-big flex-center" @click="closeNotice">立即探索</view>
					</view>
				</view>
			</view>
		</view>
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
