<template>
	<view class="dark-bg page-task">
		<backCapsule type="capsule"></backCapsule>
		<navigationBar name="任务" haveHeight></navigationBar>
		<view class="topBox flex-between">
			<view class="left">
				<view class="flex-center">
					<text class="fs-22">我的余额</text>
					<text class="fs-18">可提现</text>
				</view>
				<view class="flex-center">
					<text class="fs-46">0</text>
					<text class="fs-22 bold tixian" @click="goPage('/pages/task/deposit')">提现</text>
				</view>
			</view>
			<view class="line"></view>
			<view class="right">
				<view class="fs-22">我的积分</view>
				<view class="fs-46">0</view>
			</view>
		</view>
		<view class="title fs-32 bold">
			积分任务
		</view>
		<view class="list">
			<view class="item flex-between">
				<view>
					<view class="fs-26">发布帖子</view>
					<view class="fs-24" style="color: #7364BD;">+5积分</view>
				</view>
				<view class="right fs-22 flex-center">去完成</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-26">点赞</view>
					<view class="fs-24" style="color: #7364BD;">+5积分</view>
				</view>
				<view class="right fs-22 flex-center">去完成</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-26">回帖</view>
					<view class="fs-24" style="color: #7364BD;">+5积分</view>
				</view>
				<view class="right fs-22 flex-center">去完成</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-26">观看视频</view>
					<view class="fs-24" style="color: #7364BD;">+5积分</view>
				</view>
				<view class="right fs-22 flex-center">去完成</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-26">浏览15分钟</view>
					<view class="fs-24" style="color: #7364BD;">+5积分</view>
				</view>
				<view class="right fs-22 flex-center">去完成</view>
			</view>
		</view>
		<button open-type="contact" class="contact share">
			<image class="circle" src="../../static/icon-kf.png" mode="widthFix"></image>
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
@import './task.scss';
</style>
