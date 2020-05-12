<template>
	<view>
		<navigationBar name="选择音乐" haveHeight white></navigationBar>
		<backCapsule type="normal" white></backCapsule>
		<view class="searchBox">
			<view class="ipt flex">
				<image src="../../static/search.png" mode="widthFix"></image>
				<input class="fs-26" type="text" placeholder="搜索歌曲" />
			</view>
		</view>
		<view class="tabBox fs-30 fc-3">
			<view v-for="(item, index) in 8" :key="index">
				<view :class="{ active: index == 1 }">我的</view>
				<view v-if="index == 1" class="line"></view>
			</view>
		</view>
		<view class="music">
			<view class="item flex-between" v-for="(item, index) in 5" :key="index">
				<view class="flex">
					<view class="imgBox">
						<image class="header" src="../../static/logo.png" mode="aspectFill"></image>
						<image v-if="false" class="play" src="../../static/stop.png" mode="widthFix"></image>
						<image v-else class="play" src="../../static/play.png" mode="widthFix"></image>
					</view>
					<view>
						<view class="fs-30 bold fc-3">猫咪喂养人</view>
						<view class="fs-22 fc-9">BlackDD</view>
						<view class="fs-22 fc-9">03:17</view>
					</view>
				</view>
				<view class="flex">
					<image class="star" src="../../static/star.png" mode="widthFix"></image>
					<view class="right flex-center fs-28 fc-f">使用</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script></script>

<style lang="scss">
.searchBox {
	padding: 30rpx;
	padding-bottom: 0;
	.ipt {
		width: 100%;
		height: 70rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 36rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		image {
			width: 28rpx;
			height: auto;
			margin-right: 30rpx;
		}
		input {
			width: 500rpx;
		}
	}
}
.tabBox {
	display: -webkit-box;
	overflow-x: scroll;
	-webkit-overflow-scrolling: touch;
	border-bottom: 2rpx solid #eee;
	> view {
		position: relative;
		padding: 30rpx;
		.active {
			color: #7364bd;
			font-weight: bold;
		}
		.line {
			width: calc(100% - 60rpx);
			height: 2px;
			background: #7364bd;
			border-radius: 2rpx;
			position: absolute;
			bottom: 0;
			left: 30rpx;
		}
	}
}
.music {
	padding: 0 30rpx;
	.item {
		padding-top: 40rpx;
		.header {
			width: 106rpx;
			height: 106rpx;
			border-radius: 8rpx;
			margin-right: 0;
		}
		.right {
			width: 130rpx;
			height: 60rpx;
			background: #7364bd;
			border-radius: 8rpx;
		}
		.imgBox {
			position: relative;
			margin-right: 24rpx;
			.play {
				position: absolute;
				left: calc(50% - 25rpx);
				top: calc(50% - 25rpx);
				width: 50rpx;
				height: auto;
			}
		}
		.star {
			width: 40rpx;
			height: auto;
			margin-right: 20rpx;
		}
	}
}
</style>
