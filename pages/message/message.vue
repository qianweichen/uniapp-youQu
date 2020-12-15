<template>
	<view class="page-msg">
		<navigationBar name="站内信" haveHeight tabbarPage></navigationBar>
		<scroll-view scroll-y="true" @scrolltolower="onBottomFun" style="height: calc(100% - 150rpx);">
			<view class="btnBox flex-around fs-26">
				<view @click="goPage('/pages/message/classesMsg?type=3')">
					<image src="../../static/msg1.png" mode="widthFix"></image>
					<view>粉丝</view>
				</view>
				<view @click="goPage('/pages/message/classesMsg?type=1')">
					<image src="../../static/msg2.png" mode="widthFix"></image>
					<view>赞</view>
				</view>
				<view @click="goPage('/pages/message/classesMsg?type=2')">
					<image src="../../static/msg3.png" mode="widthFix"></image>
					<view>评论</view>
				</view>
				<!-- <view @click="goPage('/pages/message/systemNote')">
					<image src="../../static/msg4.png" mode="widthFix"></image>
					<view>通知</view>
				</view> -->
			</view>
			<view style="padding: 30rpx 0;">
				<ad-custom unit-id="adunit-be40a436865b3778"></ad-custom>
			</view>
			<view class="list">
				<!-- 系统消息 -->
				<!-- <view class="good flex-between align-star comment" @click="goPage('/pages/message/systemNote')">
					<view class="flex align-star">
						<image class="header circle" src="../../static/msg-lb.png" mode="aspectFill"></image>
						<view>
							<view class="fs-26">系统消息</view>
							<view class="cont fs-32" style="padding-bottom: 0;">您有新的通知</view>
						</view>
					</view>
					<view class="fs-24 fc-9">下午 17:28</view>
				</view> -->
				<uni-swipe-action>
					<uni-swipe-action-item :options="options" @click="onClick(item.id,index)" @change="change" v-for="(item, index) in list" :key="index">
						<!-- 赞 -->
						<view v-if="item.type == 1" class="good flex-between align-star bg-theme" @click="goPage('/pagesA/articleDetails/articleDetails?id=' + item.pid.id)">
							<view class="flex align-star">
								<image class="header circle" :src="item.launch_user_id.user_head_sculpture" mode="aspectFill"></image>
								<view>
									<view class="fs-26">
										<!-- <text style="color: #7364BD;">小镜哥</text>
										<text>...等4个赞过你的作品</text> -->
										<text>{{ item.content }}</text>
									</view>
									<view class="fs-24">{{ item.pid.study_content }}</view>
									<view class="fs-24 fc-9">{{ item.add_time }}</view>
									<!-- <view class="headerBox">
										<image :src="item.launch_user_id.user_head_sculpture" mode="aspectFill"></image>
									</view> -->
								</view>
							</view>
							<image class="pic" :src="item.pid.image_part[0]" mode="aspectFill"></image>
						</view>
						<!-- 评价 -->
						<view v-if="item.type == 2" class="good flex-between align-star comment bg-theme" @click="goPage('/pagesA/articleDetails/articleDetails?id=' + item.pid.id)">
							<view class="flex align-star">
								<image class="header circle" :src="item.launch_user_id.user_head_sculpture" mode="aspectFill"></image>
								<view>
									<view class="fs-26">{{item.launch_user_id.user_nick_name}} 评论了你的作品 {{ item.pid.study_content }}</view>
									<view class="cont fs-26">{{item.content}}</view>
									<view class="fs-24 fc-9">{{ item.add_time }}</view>
								</view>
							</view>
							<image class="pic" :src="item.pid.image_part[0]" mode="aspectFill"></image>
						</view>
						<!-- 粉丝 -->
						<view v-if="item.type == 3" class="fans flex-between bg-theme">
							<view class="flex align-star">
								<image class="header circle" :src="item.launch_user_id.user_head_sculpture" mode="aspectFill"></image>
								<view>
									<view class="fs-26">{{ item.launch_user_id.user_nick_name }}</view>
									<view class="fs-26 cont">{{ item.content }}了你</view>
									<view class="fs-24 fc-9">{{ item.add_time }}</view>
								</view>
							</view>
							<!-- <view class="fs-26">
								<view v-if="true" class="gz flex-center">关注</view>
								<view v-else class="gz flex-center active">互相关注</view>
							</view> -->
						</view>
					</uni-swipe-action-item>
					<view v-if="list.length==0" style="text-align: center; padding-top: 200rpx; color: #999;">暂无数据</view>
				</uni-swipe-action>
			</view>
		</scroll-view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import uniSwipeAction from '@/components/uni-swipe/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe/uni-swipe-action-item/uni-swipe-action-item.vue';
import messageJs from './message.js';
export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem
	},
	...messageJs
};
</script>

<style lang="scss">
@import './message.scss';
</style>
