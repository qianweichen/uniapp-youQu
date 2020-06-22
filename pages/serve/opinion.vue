<template>
	<view class="dark-bg page-opinion">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="意见反馈" haveHeight></navigationBar>
		<view class="list">
			<view class="item flex-between" v-for="(item,index) in 5" :key="index" @click="goPage('/pages/serve/opinionDetail')">
				<view class="fs-26">无法打开小程序</view>
				<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
			</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
</script>

<style lang="scss">
.page-opinion{
	padding: 0 30rpx;
	.item{
		padding-bottom: 60rpx;
	}
	.right{
		width: 30rpx;
		height: auto;
	}
}
</style>
