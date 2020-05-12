<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="加入的圈子" haveHeight></navigationBar>
		<view>
			<view class="fans flex-between" v-for="(item,index) in 5" :key="index">
				<view class="flex align-star">
					<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
					<view>
						<view class="fs-28 bold">小镜哥养猫</view>
						<view class="fs-24 fc-9">已有3644人关注</view>
					</view>
				</view>
				<view class="fs-26">
					<view class="gz flex-center">退圈</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script></script>

<style lang="scss">
@import './myCircle.scss';
</style>
