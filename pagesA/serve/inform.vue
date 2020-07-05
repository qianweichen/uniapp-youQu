<template>
	<view class="dark-bg page-del">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="举报投诉记录" haveHeight></navigationBar>
		<view class="tabBox flex fs-30">
			<view :class="{ active: tabIndex == 0 }" @click="changeTab(0)"><text>帖子</text></view>
			<view :class="{ active: tabIndex == 1 }" @click="changeTab(1)"><text>回复</text></view>
		</view>
		<view class="list">
			<view class="item flex" v-for="(item,index) in list" :key="index">
				<image class="header" :src="item.paper.image_part[0]" mode="aspectFill"></image>
				<view class="right flex-column-between">
					<view class="fs-26">
						<text>发布在</text>
						<text>{{item.realm_name}}</text>
						<view class="content">{{item.paper.study_content}}</view>
					</view>
					<view class="fs-24 fc-9">{{item.petition_time}}</view>
				</view>
			</view>
			<view v-if="list.length == 0" style="text-align: center; padding-top: 400rpx; color: #999;">暂无数据</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabIndex: 0,
			list:[]
		};
	},
	methods: {
		changeTab(index) {
			this.tabIndex = index;
			this.getReport();
		},
		getReport() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_user_report',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					is_type: 'tab' + (this.tabIndex + 1)
				},
				success: res => {
					console.log('记录:', res);
					this.$refs.loading.close();
					this.list = res.data.info;
				}
			});
		}
	},
	onLoad() {
		this.getReport();
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
			.content {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding-top: 10rpx;
			}
		}
	}
}
</style>
