<template>
	<view class="dark-bg page-wallet">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="钱包"></navigationBar>
		<view class="box">
			<view class="flex-between">
				<view>
					<view class="fs-20">积分余额</view>
					<view class="fraction">{{ personalInfo.fraction }}</view>
				</view>
				<view @click="goPage('/pages/task/deposit')" class="fs-24 tag flex-center">提现</view>
			</view>
			<view class="list flex-between">
				<view class="item">
					<view class="fs-20">总积分</view>
					<view class="fs-28 bold">{{ personalInfo.fraction }}</view>
				</view>
				<view class="item">
					<view class="fs-20">现金</view>
					<view class="fs-28 bold">约{{ (personalInfo.fraction / 1000).toFixed(2) }}元</view>
				</view>
				<view class="item">
					<view class="fs-20">累计提现</view>
					<view class="fs-28 bold">{{ drawalNum }}元</view>
				</view>
			</view>
			<!-- <view>
				<view class="flex-center box-c">
					<view class="fs-22">我的积分</view>
					<view class="fs-18 tag flex-center">可提现</view>
				</view>
				<view class="flex-center">
					<view class="fs-46">
						<view>{{ personalInfo.fraction }}</view>
						<view style="font-size: 22rpx;">(约{{(personalInfo.fraction/1000).toFixed(2)}}元,累计提现{{drawalNum}}元)</view>
					</view>
					<text class="fs-22 bold tixian flex-center" @click="goPage('/pages/task/deposit')">提现</text>
				</view>
			</view> -->
		</view>
		<view class="tabBox flex-around fs-30">
			<view :class="{ active: tabIndex == 'tab2' }" @click="changeTab('tab2')"><text>积分明细</text></view>
			<view :class="{ active: tabIndex == 'tab1' }" @click="changeTab('tab1')"><text>提现记录</text></view>
		</view>
		<view class="record-list">
			<view class="item flex-between" v-for="(item, index) in list" :key="index">
				<view>
					<view class="fs-26 title">{{ item.solution }}</view>
					<view class="fs-24 fc-9">{{ item.ruins_time }}</view>
				</view>
				<view class="fs-36 bold">
					<text v-if="item.finance > 0">+</text>
					<text>{{ item.finance }}</text>
				</view>
			</view>
			<view v-if="list.length == 0" style="text-align: center; padding-top: 200rpx; color: #999;">暂无数据</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabIndex: 'tab2',
			personalInfo: '',
			page: 1,
			list: [],
			drawalNum: ''
		};
	},
	methods: {
		changeTab(index) {
			this.tabIndex = index;
			this.getList(true);
		},
		getList(isFirstPage) {
			if (isFirstPage == true) {
				this.page = 1;
				this.list = [];
			}
			this.request({
				url: this.apiUrl + 'User/get_user_amount',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					page: this.page,
					evaluate: this.tabIndex
				},
				success: res => {
					uni.hideLoading();
					// console.log('获取明细:', res);
					if (res.data.info.length == 0 && this.page > 1) {
						uni.showToast({
							title: '没有更多了',
							icon: 'none'
						});
					}
					this.page++;
					this.list = this.list.concat(res.data.info);
				}
			});
		},
		//获取用户信息
		getPersonalInfo() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_user_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid')
				},
				success: res => {
					this.$refs.loading.close();
					// console.log('获取用户信息:', res);
					this.personalInfo = res.data.info;
				}
			});
		},
		//获取提现总和
		getAllWithdrawal() {
			this.request({
				url: this.apiUrl + 'user/tx_list_count',
				methods: 'POST',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId')
				},
				success: res => {
					// console.log('获取提现总和:', res);
					this.drawalNum = res.data.num;
				}
			});
		}
	},
	onShow() {
		this.getAllWithdrawal();
		this.getPersonalInfo();
		this.getList(true);
	},
	onReachBottom() {
		this.getList();
	}
};
</script>

<style lang="scss">
.page-wallet {
	.box {
		width: 100%;
		padding: 200rpx 40rpx 0;
		box-sizing: border-box;
		background: linear-gradient(0deg, rgba(168, 102, 214, 1), rgba(130, 121, 228, 1));
		border-radius: 4rpx;
		.fraction {
			font-size: 60rpx;
			font-weight: bold;
		}
		.tag {
			width: 100rpx;
			height: 50rpx;
			background: #fff;
			border-radius: 30rpx;
			color: #7364bd;
		}
		.list {
			padding: 0 30rpx 30rpx;
			.item {
				padding-top: 60rpx;
				text-align: center;
				.bold {
					padding-top: 10rpx;
				}
			}
		}
	}
	.tabBox {
		position: sticky;
		top: 0;
		z-index: 2;
		background-color: $themeColor;
		color: rgba(255, 255, 255, 0.6);
		> view {
			width: 220rpx;
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
	.record-list {
		padding: 0 30rpx;
		.item {
			padding-top: 60rpx;
			.title {
				padding-bottom: 17rpx;
			}
		}
	}
}
</style>
