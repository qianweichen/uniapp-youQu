<template>
	<view class="page-msg dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="赞" haveHeight></navigationBar>
		<view class="good flex-between align-star" v-for="(item,index) in 6" :key="index">
			<view class="flex align-star">
				<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
				<view>
					<view class="fs-26 bold">
						<text style="color: #7364BD;">小镜哥</text>
						<text>...等4个赞过你的作品</text>
					</view>
					<view class="fs-24 fc-9">下午 17:28</view>
					<view class="headerBox">
						<image src="../../static/logo.png" mode="aspectFill"></image>
						<image src="../../static/logo.png" mode="aspectFill"></image>
						<image src="../../static/logo.png" mode="aspectFill"></image>
						<image src="../../static/logo.png" mode="aspectFill"></image>
					</view>
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
