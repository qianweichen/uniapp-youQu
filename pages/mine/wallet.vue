<template>
	<view class="dark-bg page-wallet">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="钱包" haveHeight></navigationBar>
		<view class="box flex-around">
			<!-- <view>
				<view class="flex box-c">
					<view class="fs-22">我的贝壳</view>
					<view class="fs-18 tag flex-center">可兑商品</view>
				</view>
				<view class="fs-46">0</view>
			</view>
			<view class="line"></view> -->
			<view>
				<view class="flex-center box-c">
					<view class="fs-22">我的积分</view>
					<view class="fs-18 tag flex-center">可提现</view>
				</view>
				<view class="flex-center">
					<view class="fs-46">
						<view>{{ personalInfo.fraction }}</view>
						<view style="font-size: 22rpx;">(约{{(personalInfo.fraction/100).toFixed(2)}}元)</view>
					</view>
					<text class="fs-22 bold tixian flex-center" @click="goPage('/pages/task/deposit')">提现</text>
				</view>
			</view>
		</view>
		<view class="tabBox flex-around fs-30">
			<view :class="{ active: tabIndex == 0 }" @click="changeTab(0)"><text>积分明细</text></view>
			<!-- <view :class="{ active: tabIndex == 1 }" @click="changeTab(1)"><text>积分明细</text></view> -->
		</view>
		<view class="list">
			<view class="item flex-between" v-for="(item,index) in list" :key="index">
				<view>
					<view class="fs-26 title">{{item.solution}}</view>
					<view class="fs-24 fc-9">{{item.ruins_time}}</view>
				</view>
				<view class="fs-36 bold">
					<text v-if="item.finance>0">+</text>
					<text>{{item.finance}}</text>
				</view>
			</view>
			<view v-if="list.length==0" style="text-align: center; padding-top: 200rpx; color: #999;">暂无数据</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex: 0,
				personalInfo:'',
				page:1,
				list:[]
			};
		},
		methods: {
			changeTab(index) {
				this.tabIndex = index;
			},
			getList(isFirstPage){
				if(isFirstPage==true){
					this.page = 1;
					this.list = [];
				}
				this.request({
					url: this.apiUrl + 'User/get_user_amount',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						page:this.page,
						// evaluate:"tab2"
					},
					success: res => {
						uni.hideLoading();
						// console.log('获取明细:', res);
						if(res.data.info.length==0&&this.page>1){
							uni.showToast({
								title:'没有更多了',
								icon:'none'
							})
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
		},
		onLoad() {
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
	padding: 0 30rpx;
	.box {
		padding: 0 40rpx;
		text-align: center;
		height: 180rpx;
		background: linear-gradient(0deg, rgba(168, 102, 214, 1), rgba(130, 121, 228, 1));
		border-radius: 4rpx;
		.tag {
			width: 90rpx;
			height: 28rpx;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 4rpx;
			margin-left: 11rpx;
		}
		.box-c {
			padding-bottom: 20rpx;
		}
		.dh {
			width: 74rpx;
			height: 36rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 18rpx;
			color: #7364bd;
			margin-left: 20rpx;
		}
		.line {
			width: 2rpx;
			height: 80rpx;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 2rpx;
		}
		.tixian{
			width:74rpx;
			height:36rpx;
			background:rgba(255,255,255,1);
			border-radius:18rpx;
			color: #7364BD;
			margin-left: 20rpx;
		}
	}
	.tabBox {
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
	.item{
		padding-top: 60rpx;
		.title{
			padding-bottom: 17rpx;
		}
	}
}
</style>
