<template>
	<view class="dark-bg page-bannedPost">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="禁言申诉" haveHeight></navigationBar>
		<view class="list">
			<view class="item flex" v-for="(item, index) in list" :key="index">
				<view class="date circle flex-center">{{ item.realm_name.substr(0, 1) }}</view>
				<view class="right fs-26">
					<view class="flex-between top">
						<view>圈子：{{ item.realm_name }}</view>
						<view class="fs-24 tag flex-center" v-if="item.user_is_mutter == 0 && item.refer_time != 0" @click="toggleTwoLevComment(true, index)">申诉</view>
						<view class="fs-24 tag flex-center ycl" v-if="item.user_is_mutter == 1 && item.refer_time != 0">已申诉</view>
						<!-- <view class="fs-24 tag flex-center">申诉中</view> -->
						<!-- <view class="fs-24 tag flex-center ycl">已处理</view> -->
					</view>
					<view class="fc-9">禁言原因：{{ item.beget || '管理员未填写' }}</view>
					<view class="fc-9">禁言解除时间：{{ item.refer_time }}</view>
					<view v-for="(items,indexs) in item.user_mutter_list" :key="indexs" class="fc-9">
						<view>申诉理由：{{items.beget}}</view>
						<view>审核回复：{{items.reason_refusal||'暂未回复'}}</view>
					</view>
				</view>
			</view>
			<view v-if="list.length == 0" style="text-align: center; padding-top: 400rpx; color: #999;">暂无数据</view>
		</view>
		<!-- 二级评论 -->
		<view class="twoComment" v-if="showTwoLevCommentFlag">
			<view class="mask" @click="toggleTwoLevComment(false)"></view>
			<view class="inputAlt-cont">
				<view class="inputAlt-cont-head flex-between">
					<view @click="toggleTwoLevComment(false)">取消</view>
					<view @click="mutter">确认</view>
				</view>
				<view class="inputAlt-cont-ipt">
					<view style="text-align:right; font-size:24rpx;">{{ twoComment.length }}/200</view>
					<textarea fixed="true" placeholder="请说明原因" v-model="twoComment" auto-focus maxlength="200"></textarea>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			showTwoLevCommentFlag: false, //控制二级评论box
			twoComment: '',
			muterIndex: ''
		};
	},
	methods: {
		//控制二级评论box
		toggleTwoLevComment(flag, index) {
			if (index || index == 0) {
				this.muterIndex = index;
			}
			this.showTwoLevCommentFlag = flag;
		},
		getBanned() {
			uni.showLoading({
				title: '加载中'
			});
			this.request({
				url: this.apiUrl + 'User/get_user_banned',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId')
				},
				success: res => {
					console.log('禁言:', res);
					uni.hideLoading();
					this.list = res.data.info;
				}
			});
		},
		mutter() {
			if (!this.twoComment) {
				uni.showToast({
					title: '请输入申诉原因',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '加载中'
			});
			this.request({
				url: this.apiUrl + 'User/do_user_mutter',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					id: this.list[this.muterIndex].id,
					tory_id: this.list[this.muterIndex].tory_id,
					beget: this.twoComment
				},
				success: res => {
					console.log('申诉:', res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.twoComment = '';
					this.toggleTwoLevComment(false);
					setTimeout(() => {
						this.getBanned();
					}, 1500);
				}
			});
		}
	},
	onLoad() {
		this.getBanned();
	}
};
</script>

<style lang="scss">
.page-bannedPost {
	padding: 0 30rpx;
	.list {
		.item {
			padding-bottom: 60rpx;
			.date {
				width: 106rpx;
				height: 106rpx;
				background: #7364bd;
				margin-right: 20rpx;
			}
			.right {
				width: 560rpx;
				.tag {
					width: 100rpx;
					height: 38rpx;
					background: #7f3239;
					border-radius: 4rpx;
				}
				.ycl {
					background-color: #4a4853;
				}
				.top {
					padding-bottom: 14rpx;
				}
			}
		}
	}
	.twoComment {
		.inputAlt-cont {
			z-index: 1;
			background-color: #13111f;
			color: #f2f2f2;
			position: fixed;
			left: 0;
			bottom: 0;
			border-radius: 20rpx 20rpx 0 0;
			width: 100%;
			height: 500rpx;
			font-size: 30rpx;
		}
		.inputAlt-cont-head {
			padding: 20rpx;
			border-bottom: 2rpx solid #eee;
		}
		.inputAlt-cont-ipt {
			padding: 20rpx;
		}
	}
}
</style>
