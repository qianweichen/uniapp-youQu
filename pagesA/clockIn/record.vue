<template>
	<view>
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="我的战绩"></navigationBar>
		<view class="top flex-center">
			<view>
				<view class="fs-24">总获得积分</view>
				<view class="num">{{ info.integral_count }}</view>
			</view>
		</view>
		<view>
			<view class="info flex-between">
				<view class="item">
					<view>{{ info.baoming_num }}</view>
					<view>报名次数</view>
				</view>
				<view class="item">
					<view>{{ info.chenggong_num }}</view>
					<view>成功次数</view>
				</view>
				<view class="item">
					<view>{{ info.integral_height }}</view>
					<view>最高积分</view>
				</view>
			</view>
			<view class="list" v-for="(item, index) in list" :key="index">
				<view class="title fs-22 flex-between">
					<view>{{ item.createtime }}</view>
					<view v-if="item.state == 1" class="fail">进行中</view>
					<view v-if="item.state == 2" class="success">挑战成功</view>
					<view v-if="item.state == 3" class="fail">挑战失败</view>
				</view>
				<view class="cont flex-between">
					<view class="item">
						<view>{{ item.count_num }}</view>
						<view>总积分</view>
					</view>
					<view class="item">
						<view>{{ item.dabiao_num }}</view>
						<view>达标人数</view>
					</view>
					<view class="item">
						<view>{{ item.carveup_integral || 0}}</view>
						<view>所获积分</view>
					</view>
				</view>
			</view>
			<view v-if="list.length == 0 && status == 'nomore'" style="text-align: center; padding-top: 200rpx; color: #999;">暂无数据</view>
			<loadMore v-else :status="status"></loadMore>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			status: 'loadmore',
			info:'',
			list: [],
			page:1
		};
	},
	methods: {
		getRecord() {
			this.status = 'loading';
			this.request({
				url: this.apiUrl + 'user/my_sign_data',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					page:this.page
				},
				success: res => {
					console.log('战绩', res);
					if(res.data.data.data_list.length<10){
						this.status = 'nomore';
					}else{
						this.status = 'loadmore';
					}
					if(!this.info){
						this.info = res.data.data;
					}
					this.page++;
					this.list.push(...res.data.data.data_list);
				}
			});
		}
	},
	onLoad() {
		this.getRecord();
	},
	onReachBottom() {
		if(this.status == 'loadmore'){
			this.getRecord();
		}
	}
};
</script>

<style lang="scss">
.top {
	height: 512rpx;
	background: #1f1d2b;
	color: #fff;
	text-align: center;
	> view {
		padding-top: 100rpx;
	}
	.num {
		font-size: 78rpx;
		font-weight: 800;
		padding-top: 30rpx;
	}
}
.info {
	width: 690rpx;
	height: 170rpx;
	background: #ffffff;
	box-shadow: 0 12rpx 20rpx 4rpx rgba(238, 238, 238, 0.49);
	border-radius: 10rpx;
	padding: 0 40rpx;
	box-sizing: border-box;
	margin: -56rpx auto 20rpx;
	font-size: 24rpx;
	text-align: center;
	.item {
		view:last-child {
			padding-top: 20rpx;
		}
	}
}
.list {
	width: 690rpx;
	height: 190rpx;
	background: #ffffff;
	box-shadow: 0 12rpx 20rpx 4rpx rgba(238, 238, 238, 0.49);
	border-radius: 10rpx;
	margin: 0 auto 20rpx;
	.title {
		padding: 0 20rpx;
		height: 69rpx;
		border-bottom: 2rpx solid #f6f6f6;
		.ing {
			color: #5f3dd2;
		}
		.success {
			color: red;
		}
		.fail {
			color: #e43853;
		}
	}
	.cont {
		height: calc(100% - 69rpx);
		font-size: 28rpx;
		text-align: center;
		padding: 0 36rpx;
		box-sizing: border-box;
		.item {
			view:last-child {
				font-size: 20rpx;
				color: #cccccc;
				margin-top: 10rpx;
			}
		}
	}
}
</style>
