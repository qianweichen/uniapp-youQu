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
					<image class="circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
					<view class="fs-28">{{item.user_nick_name}}</view>
					<view class="fs-26">{{item.adapter_time}}</view>
				</view>
				<!-- 文字 -->
				<view class="content fs-28">
					{{item.study_content}}
				</view>
				<!-- 图片/视频 -->
				<view v-if="item.study_type==2" class="mediaBox">
					<video :src="item.study_video" controls :poster='item.image_part[0]'></video>
				</view>
				<view v-else class="mediaBox">
					<!-- 1 -->
					<view class="one" v-if="item.image_part.length==1">
						<image :src="item.image_part[0]" mode="aspectFill"></image>
					</view>
					<!-- 2 -->
					<view class="two" v-if="item.image_part.length==2">
						<image :src="item.image_part[0]" mode="aspectFill"></image>
						<image :src="item.image_part[1]" mode="aspectFill"></image>
					</view>
					<!-- 3-9 -->
					<view class="more" v-if="item.image_part.length>2">
						<image v-for="(item,index) in item.image_part" :key="index" :src="item" mode="aspectFill"></image>
					</view>
				</view>
				<!-- 底部按钮 -->
				<view class="bottom flex-between">
					<!-- 动态列表 -->
					<view v-if="type=='dynamic'" class="flex-center circleName" @click="goPage('/pages/circle/circle')">
						<image class="header circle" :src="item.realm_icon" mode="aspectFill"></image>
						<view class="fs-22" style="color: #908E99;">{{item.realm_name}}</view>
					</view>
					<!-- 公共部分 -->
					<view class="flex function fs-22">
						<view class="flex">
							<image :src="'../../static/like' + (item.is_info_zan?'':'2')+'.png'" mode="widthFix"></image>
							<text>{{item.info_zan_count}}</text>
						</view>
						<view class="flex">
							<image src="../../static/comment.png" mode="widthFix"></image>
							<text>{{item.study_repount}}</text>
						</view>
						<button type="default" class="share flex" open-type="share">
							<image src="../../static/wechat.png" mode="widthFix"></image>
							<text>分享</text>
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
