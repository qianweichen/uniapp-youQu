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
					<view class="right flex-center">
						<image src="../../static/add.png" mode="widthFix"></image>
						<text class="fs-22">创建我的圈子</text>
					</view>
				</view>
				<view class="list">
					<view class="item" v-for="(item, index) in 9" :key="index" @click="goPage('/pages/circle/circle')">
						<view class="headerBox circle"><image class="circle" src="../../static/logo.png" mode="aspectFill"></image></view>
						<view class="bold fs-26">爱宠俱乐部</view>
						<view class="fs-20" style="color: #9A989E;">宠物是我们最好的朋友，不要伤害它伤害它伤害它</view>
						<view class="join fs-22 flex-center">已加入</view>
					</view>
				</view>
			</view>
			<image class="mid-banner" src="../../static/banner.gif" mode="widthFix"></image>
			<!-- 为我推荐 -->
			<view class="myCircle recommend">
				<view class="title flex-between">
					<view class="left flex">
						<image src="../../static/good-c.png" mode="widthFix"></image>
						<text class="fs-32">为我推荐</text>
					</view>
					<view class="right flex-center">
						<image src="../../static/refresh.png" mode="widthFix"></image>
						<text class="fs-22">换一批</text>
					</view>
				</view>
				<view class="recommend-list">
					<view class="item flex-between" v-for="(item, index) in 9" :key="index">
						<view class="flex">
							<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
							<view>
								<view class="fs-28">爱宠大作战</view>
								<view class="fs-20" style="color: #9A989E; padding-top: 10rpx;">宠物日常，生活交流</view>
							</view>
						</view>
						<view class="fs-22 join flex-center" @click="goPage('/pages/circle/circle')">去圈子</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="dynamic">
			<image class="banner" src="../../static/banner.gif" mode="aspectFill"></image>
			<view class="tabBox flex fs-30">
				<view :class="{ active: tabIndex == 0 }" @click="changeMidTab(0)"><text>推荐</text></view>
				<view :class="{ active: tabIndex == 1 }" @click="changeMidTab(1)"><text>关注</text></view>
			</view>
			<dynamicList type="dynamic" :list="dynamicList"></dynamicList>
		</view>
	</view>
</template>

<script>
import dynamicList from '@/components/dynamic/dynamic.vue';
import findJs from './find.js';
export default {
	...findJs,
	components:{
		dynamicList
	}
};
</script>

<style lang="scss">
@import '../home/home.scss';
@import './find.scss';
</style>
