<template>
	<view class="dark-bg">
		<backCapsule v-if="shootTime == 1 || shootTime == 3" type="normal"></backCapsule>
		<camera class="camera" @error="cameraError"></camera>
		<view class="btnBox flex-between">
			<view class="item" v-if="shootTime == 2"></view>
			<view class="item" v-if="shootTime == 1 || shootTime == 3">
				<image src="../../static/shoot-m.png" mode="widthFix"></image>
				<view>音乐</view>
			</view>
			<viwe class="timer" v-if="shootTime == 2 || shootTime == 3">{{ timerNum.toFixed(1) }}s</viwe>
			<view v-if="shootTime == 1 || shootTime == 2" class="midBox" @touchstart="shootStar" @touchend="shootEnd">
				<view :class="{ none: shootTime != 1 }" class="mid flex-center"><view class="center"></view></view>
				<image :class="{ none: shootTime != 2 }" class="img" src="../../static/shooting.png" mode="widthFix"></image>
			</view>
			<image v-if="shootTime == 3" class="img" src="../../static/shooted.png" mode="widthFix"></image>
			<view class="item" v-if="shootTime == 1">
				<image src="../../static/shoot-img.png" mode="widthFix"></image>
				<view>相册</view>
			</view>
			<view class="item" v-if="shootTime == 2"></view>
			<view class="item" v-if="shootTime == 3">
				<image src="../../static/shoot-next.png" mode="widthFix" style="width: 68rpx;"></image>
				<view>下一步</view>
			</view>
			<image v-if="shootTime == 3" @click="delFun" class="del" src="../../static/shoot-del.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cameraContext: '',
			shootTime: 1, //拍摄状态 1开始 2拍摄中 3结束
			timerNum: 0, //拍摄时长
			myInterval: ''
		};
	},
	methods: {
		cameraError() {
			uni.showToast({
				title: '摄像头被禁用',
				icon: 'none'
			});
		},
		shootStar() {
			clearInterval(this.myInterval);
			this.cameraContext.startRecord({
				success: e => {
					console.log('开始录像', e);
					this.shootTime = 2;
					this.myInterval = setInterval(() => {
						this.timerNum += 0.1;
					}, 100);
				},
				timeoutCallback: e => {
					uni.showToast({
						title:'拍摄时长上限为30秒',
						icon:'none'
					})
					this.saveVideo(e);
				}
			});
		},
		shootEnd() {
			this.cameraContext.stopRecord({
				success: e => {
					this.saveVideo(e);
				}
			});
		},
		saveVideo(e){
			console.log('录像结束', e);
			this.shootTime = 3;
			clearInterval(this.myInterval);
		},
		delFun() {
			this.shootTime = 1;
		}
	},
	onLoad() {
		this.cameraContext = uni.createCameraContext();
	}
};
</script>

<style lang="scss">
.btnBox {
	position: fixed;
	bottom: 140rpx;
	left: calc(50% - 262rpx);
	width: 524rpx;
	text-align: center;
	font-size: 28rpx;
	.item {
		width: 92rpx;
	}
	image {
		width: 70rpx;
		height: auto;
	}
	.midBox {
		width: 168rpx;
		height: 168rpx;
	}
	.mid {
		width: 168rpx;
		height: 168rpx;
		background: linear-gradient(48deg, rgba(168, 102, 214, 0.5), rgba(130, 121, 228, 0.5));
		border-radius: 50%;
		.center {
			width: 138rpx;
			height: 138rpx;
			background: linear-gradient(48deg, rgba(168, 102, 214, 1), rgba(130, 121, 228, 1));
			border-radius: 50%;
			border: 2rpx solid $themeColor;
		}
	}
	.img {
		width: 168rpx;
		height: 168rpx;
	}
	.timer {
		width: 80rpx;
		position: absolute;
		top: -50rpx;
		left: calc(50% - 40rpx);
	}
	.del {
		width: 52rpx;
		height: auto;
		position: absolute;
		bottom: -72rpx;
		left: calc(50% - 26rpx);
	}
}
.camera {
	height: 100vh;
}
.hide {
	opacity: 0;
}
.none {
	display: none;
}
</style>
