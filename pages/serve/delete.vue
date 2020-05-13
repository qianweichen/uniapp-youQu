<template>
	<view class="dark-bg page-del">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="回收站" haveHeight></navigationBar>
		<view class="tabBox flex fs-30">
			<view :class="{ active: tabIndex == 0 }" @click="changeTab(0)"><text>系统删帖</text></view>
			<view :class="{ active: tabIndex == 1 }" @click="changeTab(1)"><text>圈主删帖</text></view>
			<view :class="{ active: tabIndex == 2 }" @click="changeTab(2)"><text>楼主删帖</text></view>
			<view :class="{ active: tabIndex == 3 }" @click="changeTab(3)"><text>自己删帖</text></view>
			<view :class="{ active: tabIndex == 4 }" @click="changeTab(4)"><text>系统打回</text></view>
		</view>
		<view class="list">
			<view class="item flex" v-for="(item,index) in 6" :key="index">
				<image class="header" src="../../static/logo.png" mode="aspectFill"></image>
				<view class="right flex-column-between">
					<view class="fs-26">
						楼主
						<text>大圆子</text>
						删除了你
						<text>4-10</text>
						发布在
						<text>爱宠联盟</text>
						“养猫3种错误的喂养方式” 的帖子。
					</view>
					<view class="fs-24 fc-9">04-11 12:30</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabIndex: 0
		};
	},
	methods: {
		changeTab(index) {
			this.tabIndex = index;
		}
	}
};
</script>

<style lang="scss">
.page-del {
	padding: 0 30rpx;
	.tabBox {
		display: -webkit-box;
		overflow-x: scroll;
		-webkit-overflow-scrolling: touch;
		color: rgba(255, 255, 255, 0.6);
		> view {
			width: 180rpx;
			padding-top: 47rpx;
			padding-bottom: 20rpx;
			border-bottom: 4rpx solid transparent;
			text-align: center;
		}
		.active {
			font-size: 34rpx;
			color: #fff;
			border-bottom: 4rpx solid #7364bd;
		}
	}
	.list{
		.item{
			height: 130rpx;
			padding-top: 40rpx;
			.header{
				width:130rpx;
				height:130rpx;
				border-radius:4rpx;
				margin-right: 20rpx;
			}
			.right{
				width: 528rpx;
				height: 100%;
				text{
					color: #7364BD;
					padding: 0 8rpx;
				}
			}
		}
	}
}
</style>
