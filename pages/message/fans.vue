<template>
	<view class="page-msg dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="粉丝" haveHeight></navigationBar>
		<view class="fans flex-between" v-for="(item,index) in 6" :key="index">
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
	</view>
</template>

<script></script>

<style lang="scss">
@import './message.scss';
</style>
