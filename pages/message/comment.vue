<template>
	<view class="page-msg dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="评论" haveHeight></navigationBar>
		<view class="good flex-between align-star comment" v-for="(item,index) in 6" :key="index">
			<view class="flex align-star">
				<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
				<view>
					<view class="fs-26">
						小镜哥铲屎官
					</view>
					<view class="cont fs-32">
						这只猫咪太可爱了.
					</view>
					<view class="fs-24 fc-9">下午 17:28</view>
				</view>
			</view>
			<image class="pic" src="../../static/logo.png" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script></script>

<style lang="scss">
@import './message.scss';
</style>
