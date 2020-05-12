<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="我的收藏" haveHeight></navigationBar>
		<view>
			<view class="fans flex-between" v-for="(item,index) in 5" :key="index">
				<view class="flex align-star">
					<image class="header" src="../../static/logo.png" mode="aspectFill"></image>
					<view>
						<view class="fs-28 bold">小镜哥养猫</view>
						<view class="fs-24 fc-9">养猫3种错误的喂养方式，你是不是也这样？</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script></script>

<style lang="scss">
@import './myCircle.scss';
</style>
