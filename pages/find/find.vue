<template>
	<view class="page-find">
		<!-- tab -->
		<view class="topTab flex-center" :style="'height:' + customBar + 'px;' + 'padding-top:' + topCustomBar + 'px;'">
			<view class="fs-32">圈子</view>
			<image
				@click="goPage('/pages/search/search')"
				class="search"
				src="../../static/search.png"
				mode="widthFix"
				:style="'top: calc(50% - 20rpx + ' + topCustomBar / 2 + 'px);'"
			></image>
		</view>
		<view :style="'height:' + customBar + 'px;'"></view>

		<view class="dynamic" :style="'height: calc(100% - ' + customBar + 'px);'">
			<!-- <scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="getDynamic" refresher-enabled @refresherrefresh="refreshDynamic" :refresher-triggered="refreshFlag"> -->
			<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="getDynamic" :scroll-top="scrollTop" scroll-with-animation @scroll="pageScrollFun" enable-back-to-top scroll-anchoring>
				<view>
					<!-- 我加入的圈子 -->
					<view class="myCircle">
						<view class="title flex-between">
							<view class="left flex">
								<image src="../../static/like-c.png" mode="widthFix"></image>
								<text class="fs-32">我加入的圈子</text>
							</view>
							<view v-if="isAuthorized" class="right flex-center" @click="goPage('/pagesA/circle/creatCircle')">
								<image src="../../static/add.png" mode="widthFix"></image>
								<text class="fs-22">创建我的圈子</text>
							</view>
							<view v-else class="right flex-center">
								<button open-type="getUserInfo" class="share flex-center" @getuserinfo="getUserInfo">
									<image src="../../static/add.png" mode="widthFix"></image>
									<text class="fs-22">创建我的圈子</text>
								</button>
							</view>
						</view>
						<scroll-view class="list" scroll-x="true" @scrolltolower="getMyCircle">
							<view class="item item-new" v-for="(item, index) in myCircleList" :key="index" @click="goPage('/pagesA/circle/circle?id=' + item.id)">
								<view class="headerBox circle"><image class="circle" :src="item.realm_icon" mode="aspectFill"></image></view>
								<view class="fs-24 name">{{ item.realm_name }}</view>
							</view>
							<view v-if="myCircleList.length == 0" style="padding: 40rpx 0; text-align: center; color: #999;">没有加入任何圈子</view>
						</scroll-view>
					</view>
					<!-- 玩转圈子享好礼 -->
					<view class="myCircle gift">
						<view class="title flex-between">
							<view class="left flex">
								<image src="../../static/like-c.png" mode="widthFix"></image>
								<text class="fs-32">玩转圈子享好礼</text>
							</view>
							<view v-if="isAuthorized" class="flex gift-right" @click="goPage('/pages/task/task')">
								<image class="icon-gift" src="../../static/gift-c.png" mode="widthFix"></image>
								<view class="fs-22">完成任务兑好礼</view>
								<image class="icon-right" src="../../static/right.png" mode="widthFix"></image>
							</view>
							<button v-else open-type="getUserInfo" class="share flex gift-right" @getuserinfo="getUserInfo">
								<image class="icon-gift" src="../../static/gift-c.png" mode="widthFix"></image>
								<view class="fs-22">完成任务兑好礼</view>
								<image class="icon-right" src="../../static/right.png" mode="widthFix"></image>
							</button>
						</view>
						<view class="banner-group flex-between">
							<view class="banner" @click="goPage('/pagesA/clockIn/clockIn')">
								<image class="cover" src="../../static/banner-clock.png" mode="aspectFill"></image>
								<view class="cont">
									<view class="name">早起打卡</view>
									<view class="info">早起打卡赚积分</view>
									<view class="go flex-center">GO＞</view>
								</view>
							</view>
							<view class="banner" @click="goPage('/pagesA/game/ComposeWatermelon')">
								<image class="cover" src="../../static/banner-game.png" mode="aspectFill"></image>
								<view class="cont">
									<view class="name">合成大西瓜</view>
									<view class="info">全民合成大西瓜</view>
									<view class="go flex-center">GO＞</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 广告 -->
					<view style="padding: 30rpx;"><ad-custom unit-id="adunit-be40a436865b3778"></ad-custom></view>
				</view>
				<view class="dynamic-group" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">
					<dynamicList
						ref="dynamicList"
						closeFullScreen
						type="dynamic"
						:list="dynamicList"
						@goodFun="goodFun"
						@commentFun="commentFun"
						@attentionFun="attentionFun"
						@playVideoFun="playVideoFun"
						@toggleAllText="toggleAllText"
						@exitFullScreen="exitFullScreen"
						@showDynamicCommentFun="showDynamicCommentFun"
					></dynamicList>
				</view>
				<view v-if="dynamicList.length == 0 && loadStatus == 'nomore'" style="text-align: center; padding-top: 200rpx; color: #999;">暂无数据</view>
				<loadMore v-else :status="loadStatus"></loadMore>
				<view v-if="platform == 'ios'" style="height: 144rpx;"></view>
			</scroll-view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import dynamicList from '@/components/dynamic/dynamic.vue';
import findJs from './find.js';
export default {
	...findJs,
	components: {
		dynamicList
	}
};
</script>

<style lang="scss">
@import '../home/home.scss';
@import './find.scss';
</style>
