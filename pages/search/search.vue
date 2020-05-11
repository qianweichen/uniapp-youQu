<template>
	<view class="dark-bg page-search">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="搜索" haveHeight></navigationBar>
		<view class="searchBox">
			<view class="search flex-between">
				<view class="left flex">
					<image src="../../static/search.png" mode="widthFix"></image>
					<input class="fs-26" type="text" placeholder="请输入要搜索的内容" placeholder-class="fc-9" />
				</view>
				<view class="right fs-30 fc-f flex-center">搜索</view>
			</view>
		</view>
		<!-- 搜索前 -->
		<view v-if="!searched">
			<view class="history">
				<view class="item flex-between">
					<view class="left flex">
						<image src="../../static/time.png" mode="widthFix"></image>
						<view class="fs-26">中小学开学时间</view>
					</view>
					<view class="right"><image src="../../static/close.png" mode="widthFix"></image></view>
				</view>
			</view>
			<view class="title fs-32 bold">猜你想搜</view>
			<view class="guess flex-between">
				<view v-for="(item,index) in 8" :key="index" class="flex fs-26">
					<view class="cont">giao哥遇上三枝花</view>
					<view class="hot flex-center fs-20">热</view>
					<!-- <view class="new flex-center fs-20">新</view> -->
				</view>
			</view>
		</view>
		<!-- 搜索后 -->
		<view v-else>
			<view class="tabBox flex-around fs-30">
				<view :class="{ active: tabIndex == 0 }" @click="changeTab(0)">
					<text>综合</text>
				</view>
				<view :class="{ active: tabIndex == 1 }" @click="changeTab(1)">
					<text>视频</text>
				</view>
				<view :class="{ active: tabIndex == 2 }" @click="changeTab(2)">
					<text>动态</text>
				</view>
				<view :class="{ active: tabIndex == 3 }" @click="changeTab(3)">
					<text>用户</text>
				</view>
				<view :class="{ active: tabIndex == 4 }" @click="changeTab(4)">
					<text>音乐</text>
				</view>
			</view>
			<!-- 综合 -->
			<view v-if="tabIndex == 0">
				<view class="circleList">
					<view class="item" v-for="(item, index) in 9" :key="index" @click="goPage('/pages/circle/circle')">
						<view class="headerBox circle"><image class="circle" src="../../static/logo.png" mode="aspectFill"></image></view>
						<view class="bold fs-26">爱宠俱乐部</view>
						<view class="fs-20" style="color: #9A989E;">宠物是我们最好的朋友，不要伤害它伤害它伤害它</view>
						<view v-if="false" class="join fs-22 flex-center">已加入</view>
						<view v-else class="join no-join fs-22 flex-center">申请加入</view>
					</view>
				</view>
				<dynamicList type="dynamic" :list="dynamicList"></dynamicList> 
			</view>
			<!-- 视频 -->
			<view v-if="tabIndex == 1">
				<view class="video flex-between">
					<view class="item" v-for="(item,index) in 5" :key="index">
						<image class="pic" src="../../static/logo.png" mode="aspectFill"></image>
						<view class="infoBox">
							<view class="cont fs-28">
								冬季养猫需要注意什么呢？给大家几点建议让猫咪更健康
							</view>
							<view class="flex-between">
								<view class="flex">
									<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
									<view class="fs-28">大圆子</view>
								</view>
								<view class="flex">
									<image class="good" src="../../static/good.png" mode="widthFix"></image>
									<view class="fs-26">2246</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 动态 -->
			<view v-if="tabIndex == 2">
				<dynamicList type="dynamic" :list="imgTextList"></dynamicList> 
			</view>
			<!-- 用户 -->
			<view v-if="tabIndex == 3">
				<view class="user">
					<view class="item flex-between" v-for="(item,index) in 5" :key="index">
						<view class="flex">
							<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
							<view>
								<view class="fs-28 bold">猫咪喂养人</view>
								<view class="fs-22 fc-9">粉丝：236</view>
							</view>
						</view>
						<view class="right flex-center fs-28">关注</view>
					</view>
				</view>
			</view>
			<!-- 音乐 -->
			<view v-if="tabIndex == 4">
				<view class="user music">
					<view class="item flex-between" v-for="(item,index) in 5" :key="index">
						<view class="flex">
							<view class="imgBox">
								<image class="header" src="../../static/logo.png" mode="aspectFill"></image>
								<image v-if="false" class="play" src="../../static/stop.png" mode="widthFix"></image>
								<image v-else class="play" src="../../static/play.png" mode="widthFix"></image>
							</view>
							<view>
								<view class="fs-30 bold">猫咪喂养人</view>
								<view class="fs-22 fc-9">BlackDD</view>
								<view class="fs-22 fc-9">03:17</view>
							</view>
						</view>
						<view class="right flex-center fs-28">使用</view>
					</view>
				</view>
			</view>
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
			searched:true,
			tabIndex: 4,
			dynamicList:[1,2],
			imgTextList:[1,2]
		};
	},
	methods:{
		changeTab(index) {
			this.tabIndex = index;
		}
	}
};
</script>

<style lang="scss">
@import './search.scss';
</style>
