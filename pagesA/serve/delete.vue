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
			<view class="item flex" v-for="(item, index) in list" :key="index">
				<image class="header" src="../../static/logo.png" mode="aspectFill"></image>
				<view class="right flex-column-between">
					<view class="fs-26">
						<!-- 楼主
						<text>大圆子</text> -->
						<text>删除了你</text>
						<text v-if="item.apter_time">{{ item.apter_time + '发布' }}</text>
						<text v-if="item.realm_name">{{ '在' + item.realm_name }}</text>
						<text>的帖子。</text>
						<view class="content">{{ item.study_content }}</view>
					</view>
					<view class="fs-24 fc-9 flex-between">
						<view></view>
						<view class="huifu" @click="toggleTwoLevComment(true, index)">申请恢复</view>
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
					<textarea fixed="true" placeholder="请说明恢复原因" v-model="twoComment" auto-focus maxlength="200"></textarea>
				</view>
			</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabIndex: 0,
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
		mutter() {
			if (!this.twoComment) {
				uni.showToast({
					title: '请输入申诉原因',
					icon: 'none'
				});
				return;
			}
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/do_paper_mutter',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					id: this.list[this.muterIndex].id,
					tory_id: this.list[this.muterIndex].tory_id,
					is_reply: this.list[this.muterIndex].is_reply,
					tale_content: this.twoComment
				},
				success: res => {
					// console.log('申诉:', res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.$refs.loading.close();
					this.twoComment = '';
					this.toggleTwoLevComment(false);
					setTimeout(() => {
						this.getDel();
					}, 1500);
				}
			});
		},
		changeTab(index) {
			this.tabIndex = index;
			this.getDel();
		},
		getDel() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_user_paper_del',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					del_type: 'tab' + (this.tabIndex + 1)
				},
				success: res => {
					// console.log('禁言:', res);
					this.$refs.loading.close();
					this.list = res.data.info;
				}
			});
		}
	},
	onLoad() {
		this.getDel();
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
	.list {
		.item {
			height: 130rpx;
			padding-top: 40rpx;
			.header {
				width: 130rpx;
				height: 130rpx;
				border-radius: 4rpx;
				margin-right: 20rpx;
			}
			.right {
				width: 528rpx;
				height: 100%;
				text {
					color: #7364bd;
					padding: 0 8rpx;
				}
			}
			.content {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding-top: 10rpx;
			}
			.huifu {
				color: #7364bd;
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
