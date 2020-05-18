<template>
	<view class="page-persionalC dark-bg">
		<backCapsule type="capsule"></backCapsule>
		<navigationBar name="个人主页"></navigationBar>
		<view v-if="personalInfo.bg_img" class="banner" :style="'background-image: url(' + personalInfo.bg_img + ');'">
			<image class="header circle" :src="personalInfo.user_head_sculpture" mode="aspectFill"></image>
			<view class="btnBox flex-between fs-26">
				<view class="flex-center gz" v-if="personalInfo.is_user == 0 && personalInfo.id != uid" @click="attention">关注</view>
				<view class="flex-center gz" v-if="personalInfo.is_user == 1 && personalInfo.id != uid" @click="attention">取消关注</view>
				<!-- <view class="flex-center sx">私信</view> -->
			</view>
		</view>
		<view class="info">
			<view class="fs-46 bold">{{ personalInfo.user_nick_name }}</view>
			<view class="fs-26 fc-9">{{ personalInfo.autograph }}</view>
		</view>
		<view class="myNum flex fs-30">
			<view>
				<text class="bold fs-40">{{ personalInfo.trailing }}</text>
				圈子
			</view>
			<!-- <view>
				<text class="bold fs-40">2</text>
				赞
			</view> -->
			<view>
				<text class="bold fs-40">{{ personalInfo.user_track }}</text>
				关注
			</view>
			<view>
				<text class="bold fs-40">{{ personalInfo.user_fs }}</text>
				粉丝
			</view>
		</view>
		<view class="tabBox flex-around fs-30">
			<view :class="{ active: tabIndex == 0 }" @click="changeTab(0)"><text>作品</text></view>
			<view :class="{ active: tabIndex == 1 }" @click="changeTab(1)"><text>动态</text></view>
			<view :class="{ active: tabIndex == 2 }" @click="changeTab(2)"><text>赞</text></view>
		</view>
		<view v-if="tabIndex == 0" class="list-zp flex">
			<view class="item" v-for="(item, index) in dynamicList" :key="index" @click="goPlayPage(index)">
				<image :src="item.image_part[0]" mode="aspectFill"></image>
				<view class="mask"></view>
			</view>
		</view>
		<view v-if="tabIndex == 1 || tabIndex == 2"><dynamicList type="dynamic" :list="dynamicList" @goodFun="goodFun" @commentFun="commentFun"></dynamicList></view>
		<view v-if="dynamicList.length==0" style="text-align: center; padding-top: 100rpx;">暂无数据</view>
	</view>
</template>

<script>
import dynamicList from '@/components/dynamic/dynamic.vue';
import personalCenterJs from './personalCenter.js';
export default {
	components: {
		dynamicList
	},
	...personalCenterJs
};
</script>

<style lang="scss">
@import './personalCenter.scss';
</style>
