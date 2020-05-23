<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="管理员" haveHeight></navigationBar>
		<view>
			<uni-swipe-action>
				<uni-swipe-action-item :options="options" @click="onClick(index)" @change="change" v-for="(item,index) in circleInfo.xiao_qq" :key="index">
					<view class="item flex-between" @click="goPage('/pages/personalCenter/personalCenter?id=' + item.id)">
						<view class="flex">
							<image class="header circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
							<view>
								<view class="fs-32">{{item.user_nick_name}}</view>
								<view class="fs-24">{{item.autograph}}</view>
							</view>
						</view>
						<image class="right" src="../../static/right.png" mode="widthFix"></image>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<!-- 投诉弹窗 -->
		<view v-if="showComplaintFlag" @click="toggleComplaint(false)" class="mask"></view>
		<view v-if="showComplaintFlag" class="complaint">
			<view class="title fs36 bold">
				<text>投诉理由</text>
				<image @click="toggleComplaint(false)" src="../../static/close.png" mode="widthFix"></image>
			</view>
			<textarea class="textarea fs-26" placeholder="请说明投诉理由" v-model="tsContent"/>
			<view class="btn flex-center fc-f" @click="sendTs">提交</view>
		</view>
	</view>
</template>

<script>
import uniSwipeAction from '@/components/uni-swipe/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe/uni-swipe-action-item/uni-swipe-action-item.vue';
export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem
	},
	data() {
		return {
			tsManagerId:'',
			tsContent:"",
			showComplaintFlag: false, //投诉弹窗
			id:'',
			circleInfo:'',
			options: [
				{
					text: '投诉',
					style: {
						backgroundColor: '#7364BD'
					}
				}
			]
		};
	},
	methods: {
		//发送投诉
		sendTs() {
			if (!this.tsContent) {
				uni.showToast({
					title: '请输入投诉内容',
					icon: 'none'
				})
				return;
			}
			uni.showLoading({
				title: '加载中'
			})
			this.request({
				url: this.apiUrl + 'User/add_tc_submit',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
		
					id: this.id, //圈子id
					user_id: this.tsManagerId, //圈子id  或  管理员id	看投诉哪个
					user_type: 1, // 0：投诉圈子 1:投诉用户
					labor: 1, //投诉圈子传空		0：圈主	1：管理员
					get_tc_text: this.tsContent
		
				},
				success: res => {
					// console.log("投诉:", res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.tsContent = '';
					this.toggleComplaint(false);
				},
			});
		},
		//显示隐藏	投诉
		toggleComplaint(flag) {
			this.showComplaintFlag = flag;
		},
		// 圈子信息
		getCircleInfo() {
			this.request({
				url: this.apiUrl + 'User/get_qq_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.id,
				},
				success: res => {
					uni.hideLoading();
					// console.log("圈子信息:", res);
					this.circleInfo = res.data.info;
				},
			});
		},
		onClick(index) {
			this.tsManagerId = this.circleInfo.xiao_qq[index].id;
			this.toggleComplaint(true);
		},
		change(open) {
			// console.log('当前开启状态：' + open);
		}
	},
	onLoad(options) {
		this.id = options.id;
		uni.showLoading({
			title:'加载中'
		})
		this.getCircleInfo();
	}
};
</script>

<style lang="scss">
	.item{
		padding: 30rpx;
		width: 100%;
		background-color: $themeColor;
		.header{
			width: 120rpx;
			height: 120rpx;
			border:2rpx solid #fff;
			margin-right: 20rpx;
		}
		.right{
			width: 20rpx;
			height: auto;
		}
	}
	.complaint{
		z-index: 1;
		color: #000;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 320px;
		background-color: #fff;
		border-radius:8rpx 8rpx 0px 0px;
		padding: 60rpx 50rpx;
		box-sizing: border-box;
		.title{
			text-align: center;
			position: relative;
			image{
				width: 27rpx;
				height: 27rpx;
				position: absolute;
				right: 0;
				top: calc(50% - 18.5rpx);
			}
		}
		.textarea{
			width: 100%;
			height: 334rpx;
			background-color: rgba(0,0,0,0.1);
			border-radius:8rpx;
			margin: 36rpx 0;
			padding: 30rpx;
			box-sizing: border-box;
		}
		.btn{
			height: 90rpx;
			background-color: #7364BD;
			border-radius:8rpx;
		}
	}
</style>
