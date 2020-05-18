<template>
	<view class="page-articleDetails dark-bg">
		<backCapsule type="capsule"></backCapsule>
		<navigationBar name="帖子详情" haveHeight></navigationBar>
		<view class="list">
			<view class="item">
				<!-- 头部 -->
				<view class="header flex">
					<image class="circle" src="../../static/logo.png" mode="aspectFill"></image>
					<view class="fs-28">乖乖是只猫</view>
					<view class="fs-26">12分钟前</view>
				</view>
				<!-- 文字 -->
				<view class="content fs-28">#猫 纯干货！养猫3种错误的喂养方式。你是不是也这样？</view>
				<!-- 图片/视频 -->
				<view class="mediaBox">
					<!-- 1 -->
					<view class="one" v-if="false"><image src="../../static/logo.png" mode="aspectFill"></image></view>
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
							<text>分享</text>
						</button>
					</view>
					<image class="more" src="../../static/more.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<!-- 圈子 -->
		<view class="circleName flex-between">
			<view class="flex">
				<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
				<view>
					<view class="fs-26 bold">爱宠俱乐部</view>
					<view class="fs-20" style="color: #9A989E;">关注 1758 | 帖子 474</view>
				</view>
			</view>
			<image class="right" src="../../static/right.png" mode="widthFix"></image>
		</view>
		<!-- 评论 -->
		<view v-for="(item, index) in 3" :key="index">
			<view class="comment flex-between">
				<view class="flex align-star">
					<image class="header circle" src="../../static/logo.png" mode="widthFix"></image>
					<view>
						<view class="fc-9">
							<text class="fs-26">乖乖是只猫</text>
							<text class="fs-22">刚刚</text>
						</view>
						<view class="fs-30">好可爱的小猫咪</view>
					</view>
				</view>
				<view class="right">
					<image class="good" src="../../static/like2.png" mode="widthFix"></image>
					<view class="fs-22 fc-9">187</view>
				</view>
			</view>
		</view>
		<!-- 评论输入框 -->
		<view class="sendBox">
			<view class="box flex-between">
				<input class="fs-26" type="text" value="" placeholder="留下你的精彩评论吧" />
				<image class="send" src="../../static/send.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			customBar: this.CustomBar,
			topCustomBar: this.StatusBar
		};
	},
	onLoad(options) {
		console.log(options.id);
	}
};
</script>

<style lang="scss">
@import './articleDetails.scss';
</style>
