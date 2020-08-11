<template>
	<view class="page-deposit dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="圈子资料" :haveHeight="true"></navigationBar>
		<view class="fs-24 title">提现到微信零钱</view>
		<view class="btnBox flex-between fs-36">
			<view class="item flex-center" :class="{ active: item.active }" v-for="(item, index) in moneyList" :key="index" @click="changeMoney(index)">
				<view>{{ item.num }}元</view>
				<view class="first flex-center fs-24 fc-f" v-if="index == 0 && item.num == 0.3">首次专享</view>
			</view>
		</view>
		<view class="btn-big fs-26 flex-center" @click="withdraw">立即提现</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
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
			],
			index: 0
		};
	},
	methods: {
		withdraw() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/withdraw',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					withdraw_money: this.moneyList[this.index].num,
					withdraw_number: ''
				},
				success: res => {
					// console.log('提现:', res);
					uni.showToast({
						title: res.data.msg,
						duration:3000
					});
					this.$refs.loading.close();
					setTimeout(()=>{
						this.getTxCs();
					},3000)
				}
			});
		},
		changeMoney(index) {
			for (var i = 0; i < this.moneyList.length; i++) {
				this.moneyList[i].active = false;
			}
			this.moneyList[index].active = true;
			this.index = index;
		},
		getTxCs() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'user/user_with_num',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId')
				},
				success: res => {
					// console.log('提现次数:', res);
					this.$refs.loading.close();
					if (res.data.num >= 1) {
						this.moneyList[0].num = 0.7;
					}
				}
			});
		}
	},
	onLoad() {
		this.getTxCs();
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
