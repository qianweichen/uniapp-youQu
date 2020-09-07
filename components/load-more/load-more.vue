<template>
	<view class="fs-26 fc-9" style="padding: 20rpx 0;">
		<view v-if="status == 'loadmore'" class="flex-center">
			<view class="line"></view>
			<view>上拉加载更多</view>
			<view class="line"></view>
		</view>
		<view v-if="status == 'loading'" class="flex-center">
			<view class="donut"></view>
			<view>努力加载中</view>
		</view>
		<view v-if="status == 'nomore'" class="flex-center">
			<view class="line"></view>
			<view>没有更多内容了</view>
			<view class="line"></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		status: {
			type: String,
			default: 'loadmore'
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.line {
	width: 70rpx;
	height: 2rpx;
	background-color: #555;
	margin: 10rpx;
}
@keyframes donut-spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
.donut {
	display: inline-block;
	border: 4rpx solid rgba(0, 0, 0, 0.1);
	border-left-color: #999;
	border-radius: 50%;
	width: 22rpx;
	height: 22rpx;
	animation: donut-spin 1.2s linear infinite;
	margin-right: 10rpx;
}
</style>
