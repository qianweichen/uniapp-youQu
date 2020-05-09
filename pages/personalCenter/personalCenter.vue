<template>
	<view class="page-persionalC dark-bg">
		<backCapsule type="capsule"></backCapsule>
		<navigationBar name="个人主页"></navigationBar>
		<view class="banner" :style="'background-image: url(' + '../../static/logo.png' + ');'">
			<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
			<view class="btnBox flex-between fs-26">
				<view class="flex-center gz">关注</view>
				<view class="flex-center sx">私信</view>
			</view>
		</view>
		<view class="info">
			<view class="fs-46 bold">猫咪客栈</view>
			<view class="fs-26 fc-9">宠物是我们最好的朋友，不要伤害它...</view>
		</view>
		<view class="myNum flex fs-30">
			<view>
				<text class="bold fs-40">2</text>
				圈子
			</view>
			<view>
				<text class="bold fs-40">2</text>
				赞
			</view>
			<view>
				<text class="bold fs-40">2</text>
				关注
			</view>
			<view>
				<text class="bold fs-40">2</text>
				粉丝
			</view>
		</view>
		<view class="tabBox flex-around fs-30">
			<view :class="{ active: tabIndex == 0 }" @click="changeTab(0)">
				<text>作品 4</text>
			</view>
			<view :class="{ active: tabIndex == 1 }" @click="changeTab(1)">
				<text>动态 2</text>
			</view>
			<view :class="{ active: tabIndex == 2 }" @click="changeTab(2)">
				<text>赞 20</text>
			</view>
		</view>
		<view v-if="tabIndex == 0" class="list-zp flex">
			<view class="item" v-for="(item,index) in 5" :key="index">
				<image src="../../static/logo.png" mode="aspectFill"></image>
				<view class="mask"></view>
			</view>
		</view>
		<view v-if="tabIndex == 1">
			<dynamicList type="dynamic" :list="dynamicList"></dynamicList> 
		</view>
		<view v-if="tabIndex == 2">
			<dynamicList type="dynamic" :list="goodDynamicList"></dynamicList> 
		</view>
	</view>
</template>

<script>
import dynamicList from '@/components/dynamic/dynamic.vue';
export default {
	components:{
		dynamicList
	},
	data() {
		return {
			tabIndex: 0,
			dynamicList:[1,2],
			goodDynamicList:[1]
		};
	},
	methods: {
		changeTab(index) {
			this.tabIndex = index;
		}
	}
};
</script>

<style lang="scss">
@import './personalCenter.scss';
</style>
