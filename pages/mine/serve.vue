<template>
	<view class="dark-bg page-serve">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="服务中心" haveHeight></navigationBar>
		<view class="list flex fs-26">
			<view class="item" @click="goPage('/pages/serve/bannedPost')">
				<image src="../../static/serve-jy.png" mode="widthFix"></image>
				<view>禁言申诉</view>
			</view>
			<view class="item" @click="goPage('/pages/serve/delete')">
				<image src="../../static/serve-sc.png" mode="widthFix"></image>
				<view>删帖回收</view>
			</view>
			<view class="item" @click="goPage('/pages/serve/inform')">
				<image src="../../static/serve-jb.png" mode="widthFix"></image>
				<view>举报投诉</view>
			</view>
		</view>
		<view class="fs-32 title bold">疑问解答</view>
		<view class="list flex fs-26">
			<view class="item">
				<button open-type="contact" class="share">
					<image src="../../static/serve-kf.png" mode="widthFix"></image>
					<view>在线客服</view>
				</button>
			</view>
			<view class="item">
				<button open-type="feedback" class="share">
					<image src="../../static/serve-sc.png" mode="widthFix"></image>
					<view>意见反馈</view>
				</button>
			</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script></script>

<style lang="scss">
.page-serve {
	padding: 0 30rpx;
	.list {
		padding: 50rpx 0;
		.item {
			padding: 0 60rpx;
			text-align: center;
			image {
				width: 80rpx;
				height: auto;
				margin-bottom: 28rpx;
			}
		}
	}
	.title{
		padding: 50rpx 0;
		border-bottom: 2rpx solid rgba(255,255,255,0.1);
	}
}
</style>
