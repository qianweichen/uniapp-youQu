<template>
	<view class="dark-bg page-wallet">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="钱包" haveHeight></navigationBar>
		<view class="box flex-around">
			<!-- <view>
				<view class="flex box-c">
					<view class="fs-22">我的贝壳</view>
					<view class="fs-18 tag flex-center">可兑商品</view>
				</view>
				<view class="fs-46">0</view>
			</view>
			<view class="line"></view> -->
			<view>
				<view class="flex box-c">
					<view class="fs-22">我的积分</view>
					<view class="fs-18 tag flex-center">可兑贝壳</view>
				</view>
				<view class="flex-center">
					<view class="fs-46">0</view>
					<view class="dh fs-22 flex-center">兑换</view>
				</view>
			</view>
		</view>
		<view class="tabBox flex-around fs-30">
			<view :class="{ active: tabIndex == 0 }" @click="changeTab(0)"><text>积分明细</text></view>
			<!-- <view :class="{ active: tabIndex == 1 }" @click="changeTab(1)"><text>积分明细</text></view> -->
		</view>
		<view class="list">
			<view class="item flex-between" v-for="(item,index) in 10" :key="index">
				<view>
					<view class="fs-26 title">积分增加</view>
					<view class="fs-24 fc-9">2020-04-20  08:25:24</view>
				</view>
				<view class="fs-36 bold">+0.44</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex: 0,
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
.page-wallet {
	padding: 0 30rpx;
	.box {
		padding: 0 40rpx;
		text-align: center;
		height: 180rpx;
		background: linear-gradient(0deg, rgba(168, 102, 214, 1), rgba(130, 121, 228, 1));
		border-radius: 4rpx;
		.tag {
			width: 90rpx;
			height: 28rpx;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 4rpx;
			margin-left: 11rpx;
		}
		.box-c {
			padding-bottom: 20rpx;
		}
		.dh {
			width: 74rpx;
			height: 36rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 18rpx;
			color: #7364bd;
			margin-left: 20rpx;
		}
		.line {
			width: 2rpx;
			height: 80rpx;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 2rpx;
		}
	}
	.tabBox {
		color: rgba(255, 255, 255, 0.6);
		> view {
			width: 220rpx;
			padding-top: 47rpx;
			padding-bottom: 20rpx;
			border-bottom: 4rpx solid transparent;
			text-align: center;
		}
		.active {
			font-size: 34rpx;
			color: #fff;
			border-bottom: 4rpx solid #7364bd;
		}
	}
	.item{
		padding-top: 60rpx;
		.title{
			padding-bottom: 17rpx;
		}
	}
}
</style>
