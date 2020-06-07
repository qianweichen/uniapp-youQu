<template>
	<view class="page-find">
		<!-- tab -->
		<view class="topTab flex-center" :style="'height:' + (customBar + topCustomBar) + 'px;'">
			<view class="tabs flex-between fs-32">
				<view @click="changeTabs(true)">
					<text :class="{ active: tabsFlag }">圈子</text>
					<view v-if="tabsFlag" class="line"></view>
				</view>
				<view @click="changeTabs(false)">
					<text :class="{ active: !tabsFlag }">动态</text>
					<view v-if="!tabsFlag" class="line"></view>
				</view>
			</view>
			<image @click="goPage('/pages/search/search')" class="search" src="../../static/search.png" mode="widthFix"></image>
		</view>
		<view :style="'height:' + (customBar + topCustomBar) + 'px;'"></view>
		<!-- 我加入的圈子 -->
		<view v-if="tabsFlag">
			<view class="myCircle">
				<view class="title flex-between">
					<view class="left flex">
						<image src="../../static/like-c.png" mode="widthFix"></image>
						<text class="fs-32">我加入的圈子</text>
					</view>
					<view v-if="isAuthorized" class="right flex-center" @click="goPage('/pages/circle/creatCircle')">
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
					<view class="item" v-for="(item, index) in myCircleList" :key="index" @click="goPage('/pages/circle/circle?id=' + item.id)">
						<view class="headerBox circle"><image class="circle" :src="item.realm_icon" mode="aspectFill"></image></view>
						<view class="bold fs-26 name">{{ item.realm_name }}</view>
						<view class="fs-20" style="color: #9A989E;">{{ item.realm_synopsis }}</view>
						<view class="join fs-22 flex-center">去圈子</view>
					</view>
					<view v-if="myCircleList.length == 0" style="padding: 40rpx 0; text-align: center; color: #999;">没有加入任何圈子</view>
				</scroll-view>
			</view>
			<image class="mid-banner" src="../../static/banner.gif" mode="widthFix" @click="goPage('/pages/task/task')"></image>
			<!-- 为我推荐 -->
			<view class="myCircle recommend">
				<view class="title flex-between">
					<view class="left flex">
						<image src="../../static/good-c.png" mode="widthFix"></image>
						<text class="fs-32">为我推荐</text>
					</view>
					<view class="right flex-center">
						<image src="../../static/refresh.png" mode="widthFix"></image>
						<text class="fs-22" @click="getRecommendCircle(true, 1)">换一批</text>
					</view>
				</view>
				<view class="recommend-list">
					<view class="item flex-between" v-for="(item, index) in recommendList" :key="index">
						<view class="flex">
							<image class="header circle" :src="item.realm_icon" mode="aspectFill"></image>
							<view>
								<view class="fs-28 flex">
									<view>{{ item.realm_name }}</view>
									<view class="attention flex-center" v-if="item.attention==1">私</view>
								</view>
								<view class="fs-20" style="color: #9A989E; padding-top: 10rpx; width: 410rpx;">{{ item.realm_synopsis }}</view>
							</view>
						</view>
						<view class="fs-22 join flex-center" @click="goPage('/pages/circle/circle?id=' + item.id)">去圈子</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="dynamic" :style="'height: calc(100% - ' + (customBar + topCustomBar) + 'px);'">
			<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="getDynamic" refresher-enabled @refresherrefresh="refreshDynamic" :refresher-triggered="refreshFlag">
				<swiper class="banner" indicator-dots autoplay>
					<swiper-item v-for="(item, index) in banners" :key="index">
						<image :src="item.playbill_url" mode="aspectFill" style="width: 100%; height: 100%;"></image>
					</swiper-item>
				</swiper>
				<view class="tabBox flex fs-30">
					<view :class="{ active: tabIndex == 0 }" @click="changeMidTab(0)"><text>推荐</text></view>
					<view :class="{ active: tabIndex == 1 }" @click="changeMidTab(1)"><text>关注</text></view>
				</view>
				<dynamicList type="dynamic" :list="dynamicList" @goodFun="goodFun" @commentFun="commentFun" @attentionFun="attentionFun"></dynamicList>
				<view v-if="dynamicList.length == 0" style="text-align: center; padding-top: 200rpx; color: #999;">暂无数据</view>
			</scroll-view>
		</view>
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
