<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="我管理的圈子" haveHeight></navigationBar>
		<view>
			<view class="fans flex-between" v-for="(item,index) in 5" :key="index">
				<view class="flex align-star">
					<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
					<view>
						<view class="fs-28 bold">小镜哥养猫</view>
						<view class="fs-24 fc-9">关注3644人  |  帖子680</view>
					</view>
				</view>
				<view class="fs-26" style="color: #7364BD;">
					圈主身份
				</view>
			</view>
		</view>
	</view>
</template>

<script></script>

<style lang="scss">
@import './myCircle.scss';
</style>
