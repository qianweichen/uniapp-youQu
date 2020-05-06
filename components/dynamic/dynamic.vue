<!-- 动态列表
import dynamicList from '@/components/dynamic/dynamic.vue';

//dynamic:动态  circle:圈子
<dynamicList type="dynamic" :list="dynamicList"></dynamicList> 

 components:{
 	dynamicList
 }
-->
<template>
	<view class="page-dynamic fc-f">
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index">
				<!-- 头部 -->
				<view class="header flex">
					<image class="circle" src="../../static/logo.png" mode="aspectFill"></image>
					<view class="fs-28">乖乖是只猫</view>
					<view class="fs-26">12分钟前</view>
				</view>
				<!-- 文字 -->
				<view class="content fs-28">
					#猫 纯干货！养猫3种错误的喂养方式。你是不是也这样？
				</view>
				<!-- 图片/视频 -->
				<view class="mediaBox">
					<!-- 1 -->
					<view class="one" v-if="false">
						<image src="../../static/logo.png" mode="aspectFill"></image>
					</view>
					<!-- 2 -->
					<view class="two" v-if="false">
						<image src="../../static/logo.png" mode="aspectFill"></image>
						<image src="../../static/logo.png" mode="aspectFill"></image>
					</view>
					<!-- 3-9 -->
					<view class="more">
						<image src="../../static/logo.png" mode="aspectFill"></image>
						<image src="../../static/logo.png" mode="aspectFill"></image>
						<image src="../../static/logo.png" mode="aspectFill"></image>
						<image src="../../static/logo.png" mode="aspectFill"></image>
						<image src="../../static/logo.png" mode="aspectFill"></image>
						<image src="../../static/logo.png" mode="aspectFill"></image>
					</view>
				</view>
				<!-- 底部按钮 -->
				<view class="bottom flex-between">
					<!-- 动态列表 -->
					<view v-if="type=='dynamic'" class="flex-center circleName" @click="goPage('/pages/circle/circle')">
						<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
						<view class="fs-22" style="color: #908E99;">爱宠联盟</view>
					</view>
					<!-- 公共部分 -->
					<view class="flex function fs-22">
						<view class="flex">
							<image src="../../static/like2.png" mode="widthFix"></image>
							<text>320</text>
						</view>
						<view class="flex">
							<image src="../../static/comment.png" mode="widthFix"></image>
							<text>320</text>
						</view>
						<button type="default" class="share flex" open-type="share">
							<image src="../../static/wechat.png" mode="widthFix"></image>
							<text>320</text>
						</button>
					</view>
					<!-- 圈子首页 -->
					<image v-if="type=='circle'" class="more" src="../../static/more.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dynamicJs from './dynamic.js';
	export default {
		...dynamicJs
	}
</script>

<style lang="scss">
@import './dynamic.scss';
</style>
