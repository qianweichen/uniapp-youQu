<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="关于" haveHeight></navigationBar>
		<view class="logoBox flex-center">
			<view>
				<image class="logo" src="../../static/logo.png" mode="widthFix"></image>
				<view class="fs-36 name">圈遇</view>
			</view>
		</view>
		<view class="list">
			<view class="item flex-between">
				<view>
					<view class="fs-28">圈遇官方邮箱</view>
					<view class="fs-24 fc-9">quanyu@163.com</view>
				</view>
				<view class="flex">
					<view class="fs-28 fc-9">复制邮箱</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-28">客服微信号</view>
					<view class="fs-24 fc-9">400-991-8976</view>
				</view>
				<view class="flex">
					<view class="fs-28 fc-9">复制微信</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-28">小程序版本</view>
					<view class="fs-24 fc-9">v1.0.0</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script></script>

<style lang="scss">
.logoBox {
	text-align: center;
	padding: 90rpx 0;
	.logo {
		width: 166rpx;
		height: auto;
	}
	.name {
		padding-top: 20rpx;
	}
}
.list {
	padding: 0 30rpx;
	.item {
		padding-top: 74rpx;
		.right {
			width: 30rpx;
			height: auto;
		}
	}
}
</style>
