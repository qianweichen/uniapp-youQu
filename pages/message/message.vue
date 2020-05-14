<template>
	<view class="page-msg">
		<navigationBar name="站内信" haveHeight></navigationBar>
		<view class="btnBox flex-around fs-26">
			<view @click="goPage('/pages/message/fans')">
				<image src="../../static/msg1.png" mode="widthFix"></image>
				<view>粉丝</view>
			</view>
			<view @click="goPage('/pages/message/good')">
				<image src="../../static/msg2.png" mode="widthFix"></image>
				<view>赞</view>
			</view>
			<view @click="goPage('/pages/message/comment')">
				<image src="../../static/msg3.png" mode="widthFix"></image>
				<view>评论</view>
			</view>
			<view @click="goPage('/pages/message/systemNote')">
				<image src="../../static/msg4.png" mode="widthFix"></image>
				<view>通知</view>
			</view>
		</view>
		<view class="list">
			<uni-swipe-action>
				<uni-swipe-action-item :options="options" @click="onClick" @change="change">
					<!-- 赞 -->
					<view class="good flex-between align-star bg-theme">
						<view class="flex align-star">
							<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
							<view>
								<view class="fs-26 bold">
									<text style="color: #7364BD;">小镜哥</text>
									<text>...等4个赞过你的作品</text>
								</view>
								<view class="fs-24 fc-9">下午 17:28</view>
								<view class="headerBox">
									<image src="../../static/logo.png" mode="aspectFill"></image>
									<image src="../../static/logo.png" mode="aspectFill"></image>
									<image src="../../static/logo.png" mode="aspectFill"></image>
									<image src="../../static/logo.png" mode="aspectFill"></image>
								</view>
							</view>
						</view>
						<image class="pic" src="../../static/logo.png" mode="aspectFill"></image>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>

			<uni-swipe-action>
				<uni-swipe-action-item :options="options" @click="onClick" @change="change">
					<!-- 粉丝 -->
					<view class="fans flex-between bg-theme">
						<view class="flex align-star">
							<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
							<view>
								<view class="fs-32 bold">小镜哥养猫</view>
								<view class="fs-26 cont">哈喽！很高兴你关注我。....</view>
								<view class="fs-24 fc-9">下午 17:28</view>
							</view>
						</view>
						<view class="fs-26">
							<view v-if="true" class="gz flex-center">关注</view>
							<view v-else class="gz flex-center active">互相关注</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			
			<uni-swipe-action>
				<uni-swipe-action-item :options="options" @click="onClick" @change="change">
					<!-- 评价 -->
					<view class="good flex-between align-star comment bg-theme">
						<view class="flex align-star">
							<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
							<view>
								<view class="fs-26">小镜哥铲屎官</view>
								<view class="cont fs-32">这只猫咪太可爱了.</view>
								<view class="fs-24 fc-9">下午 17:28</view>
							</view>
						</view>
						<image class="pic" src="../../static/logo.png" mode="aspectFill"></image>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			<!-- 系统消息 -->
			<view class="good flex-between align-star comment" @click="goPage('/pages/message/systemNote')">
				<view class="flex align-star">
					<image class="header circle" src="../../static/msg-lb.png" mode="aspectFill"></image>
					<view>
						<view class="fs-26">系统消息</view>
						<view class="cont fs-32" style="padding-bottom: 0;">您有新的通知</view>
					</view>
				</view>
				<view class="fs-24 fc-9">下午 17:28</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniSwipeAction from '@/components/uni-swipe/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe/uni-swipe-action-item/uni-swipe-action-item.vue';
export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem
	},
	data() {
		return {
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#7364BD'
					}
				}
			]
		};
	},
	methods: {
		onClick(e) {
			console.log('当前点击的是第' + e.index + '个按钮，点击内容是' + e.content.text);
		},
		change(open) {
			// console.log('当前开启状态：' + open);
		}
	},
	created() {
		console.log('messageCreated');
	}
};
</script>

<style lang="scss">
@import './message.scss';
</style>
