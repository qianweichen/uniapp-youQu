<template>
	<view class="wrap">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="早起打卡挑战赛"></navigationBar>
		<image class="bg" src="../../static/clockIn/bg.png" mode="widthFix"></image>
		<view style="height: 416rpx;"></view>
		<view class="info-group">
			<view class="fc-3 fs-28">今日总累计积分</view>
			<view class="num">6355</view>
			<view class="people flex-center">
				<image src="../../static/clockIn/user.png" mode="widthFix"></image>
				<view class="number">6344</view>
				<view>人已参加报名</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.wrap {
	position: relative;
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: auto;
	}
	.info-group {
		width: 690rpx;
		height: 500rpx;
		margin: 0 auto;
		padding: 56rpx 40rpx;
		box-sizing: border-box;
		background: #ffffff;
		border: 8rpx solid #c110fc;
		box-shadow: 0 -10rpx 0 0 #c110fc;
		border-radius: 20rpx;
		text-align: center;
		.num{
			font-size: 68rpx;
			color: #C111FB;
			font-weight: bold;
			padding: 30rpx 0;
		}
		.people{
			font-size: 24rpx;
			image{
				width: 20rpx;
				height: auto;
				font-size: 24rpx;
			}
			.number{
				color: #5F3DD2;
				padding: 0 12rpx;
			}
		}
	}
}
</style>
