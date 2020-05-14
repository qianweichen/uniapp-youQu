<template>
	<view class="page-msg dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="系统通知" haveHeight></navigationBar>
		<view class="symNote" v-for="(item,index) in 3" :key="index">
			<view class="time fs-22 fc-9">下午 17:30</view>
			<view class="flex align-star">
				<image class="pic" src="../../static/msg-lb.png" mode="aspectFill"></image>
				<view class="infoBox">
					<view class="fs-30 bold">您的圈子消息</view>
					<view class="userBox flex">
						<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
						<view class="fs-26">大圆子</view>
					</view>
					<view class="cont fs-26">
						申请了
						<text>喵星人研究协会</text>
						的
						<text>管理员</text>
						身份
					</view>
					<view class="symNote-btnBox flex fs-24">
						<view class="flex-center">拒绝</view>
						<view class="flex-center agree">同意</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script></script>

<style lang="scss">
@import './message.scss';
</style>
