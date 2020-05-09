<template>
	<view class="page-deposit dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="圈子资料" :haveHeight="true"></navigationBar>
		<view class="fs-24 title">提现到微信零钱</view>
		<view class="btnBox flex-between fs-36">
			<view class="item flex-center" :class="{ active: item.active }" v-for="(item, index) in moneyList" :key="index" @click="changeMoney(index)">
				<view>{{ item.num }}元</view>
				<view class="first flex-center fs-24 fc-f" v-if="index == 0">首次专享</view>
			</view>
		</view>
		<view class="btn-big fs-26 flex-center">立即提现</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			moneyList: [
				{ num: 0.3, active: true },
				{ num: 1, active: false },
				{ num: 3, active: false },
				{ num: 10, active: false },
				{ num: 20, active: false },
				{ num: 30, active: false }
			]
		};
	},
	methods: {
		changeMoney(index) {
			for (var i = 0; i < this.moneyList.length; i++) {
				this.moneyList[i].active = false;
			}
			this.moneyList[index].active = true;
		}
	}
};
</script>

<style lang="scss">
.page-deposit {
	padding: 0 30rpx;
	.btnBox {
		flex-wrap: wrap;
		padding-top: 50rpx;
		padding-bottom: 80rpx;
		.item {
			position: relative;
			width: 216rpx;
			height: 86rpx;
			background-color: #fff;
			border-radius: 8rpx;
			color: #7364bd;
			margin-bottom: 20rpx;
			.first {
				position: absolute;
				right: -10rpx;
				top: -20rpx;
				width: 130rpx;
				height: 40rpx;
				border-radius: 10rpx;
				background: rgba(250, 82, 35, 1);
			}
		}
		.item.active {
			background-color: #7364bd;
			color: #fff;
		}
	}
}
</style>
