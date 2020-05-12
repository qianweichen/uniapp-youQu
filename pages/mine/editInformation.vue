<template>
	<view class="page-editInfo dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="编辑资料" haveHeight></navigationBar>
		<view class="bannerBox">
			<image src="../../static/logo.png" mode="aspectFill"></image>
			<view class="mask"></view>
			<view class="change fs-26">点击修改背景图片</view>
		</view>
		<view class="list">
			<view class="item flex-between">
				<view>头像</view>
				<view class="flex"><image class="header circle" src="../../static/logo.png" mode="aspectFill"></image></view>
			</view>
			<view class="item flex-between">
				<view>昵称</view>
				<view class="flex"><input type="text" placeholder="请填写" maxlength="6" placeholder-class="fc-9" /></view>
			</view>
			<view class="item flex-between">
				<view>性别</view>
				<view class="flex fs-26">
					<picker mode="selector" @change="bindSexChange" :value="sexIndex" :range="sexArray">
						<view v-if="sexIndex == -1" class="fc-9">请选择</view>
						<view v-else class="uni-input">{{ sexArray[sexIndex] }}</view>
					</picker>
				</view>
			</view>
			<view class="item flex-between align-star">
				<view>个人签名</view>
				<view class="flex align-star"><textarea class="fs-26" placeholder="请填写" maxlength="50" placeholder-class="fc-9" /></view>
			</view>
		</view>
		<view class="btn-big flex-center fs-32">保存</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sexIndex: -1,
			sexArray: ['男', '女']
		};
	},
	methods: {
		bindSexChange(e) {
			this.sexIndex = e.detail.value;
		}
	}
};
</script>

<style lang="scss">
.page-editInfo {
	padding-bottom: 120rpx;
	.bannerBox {
		position: relative;
		height: 500rpx;
		image {
			width: 100%;
			height: 100%;
			display: block;
		}
		.mask {
			position: absolute;
			background-color: rgba(0, 0, 0, 0.2);
		}
		.change {
			position: absolute;
			bottom: 40rpx;
			left: calc(50% - 120rpx);
			width: 240rpx;
			text-align: center;
			z-index: 1;
		}
	}
	.list {
		padding: 0 30rpx;
		.item {
			padding-top: 60rpx;

			.header {
				width: 100rpx;
				height: 100rpx;
			}
			input {
				text-align: right;
				font-size: 26rpx;
			}
			textarea {
				width: 400rpx;
				height: 200rpx;
			}
			.right {
				width: 40rpx;
				height: auto;
				margin-left: 30rpx;
			}
		}
	}
	.btn-big {
		position: fixed;
		bottom: 60rpx;
		left: calc(50% - 345rpx);
	}
}
</style>
