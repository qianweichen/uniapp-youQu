<template>
	<view class="page-creatCircle dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="创建圈子" haveHeight></navigationBar>
		<view class="banner">
			<image src="../../static/logo.png" mode="aspectFill"></image>
			<view class="mask"></view>
			<view class="change fs-26 fc-f">点击修改背景图片</view>
		</view>
		<view class="infoList">
			<view class="infoItem flex-between">
				<view class="fc-9">圈子头像</view>
				<view class="flex">
					<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="infoItem flex-between" @click="goPage('/pages/circle/creatCircle-S')">
				<view class="fc-9">圈子名称</view>
				<view class="flex">
					<view>{{circleInfo.name||'请填写'}}</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="infoItem flex-between" @click="goPage('/pages/circle/creatCircle-L?type=1')">
				<view class="fc-9">圈子简介</view>
				<view class="flex">
					<view class="infoBox">{{circleInfo.intro||'请填写'}}</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="infoItem flex-between" @click="goPage('/pages/circle/creatCircle-L?type=2')">
				<view class="fc-9">申请原因</view>
				<view class="flex">
					<view class="infoBox">{{circleInfo.reason||'请填写申请原因'}}</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="infoItem flex-between">
				<view class="fc-9">开启圈子权限</view>
				<switch :checked="circleInfo.jurisdiction" color="#7364BD" @change="switchChange" />
			</view>
		</view>
		<view class="tip fc-9 fs-26 flex-center">说明：只有加入圈子的人才能看见圈子里发布的内容，加入圈子，需要通过圈子管理员审核</view>
		<view class="btn-big fs-32 flex-center">提交申请</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			circleInfo:{
				header:'',
				name:'',
				intro:'',
				reason:'',
				jurisdiction:true
			}
		};
	},
	methods: {
		switchChange(e) {
			this.circleInfo.jurisdiction = e.detail.value;
		}
	}
};
</script>

<style lang="scss">
.page-creatCircle {
	padding-bottom: 60rpx;

	.banner {
		position: relative;
		height: 500rpx;
		image {
			width: 100%;
			height: 100%;
		}
		.change {
			width: 220rpx;
			position: absolute;
			bottom: 40rpx;
			left: calc(50% - 110rpx);
			text-align: center;
		}
		.mask {
			position: absolute;
			background-color: rgba(0, 0, 0, 0.1);
		}
	}
	.infoList {
		padding: 0 30rpx;
		.infoItem {
			padding-top: 60rpx;
			.header {
				width: 100rpx;
				height: 100rpx;
			}
			.right {
				width: 20rpx;
				height: auto;
				margin-left: 30rpx;
			}
			.infoBox{
				text-align: right;
				width: 230rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
		}
	}
	.tip {
		width: 690rpx;
		margin: 60rpx auto;
		padding: 0 30rpx;
		box-sizing: border-box;
		height: 132rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8rpx;
	}
}
</style>
