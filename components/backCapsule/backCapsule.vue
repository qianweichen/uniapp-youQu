<!-- 回退胶囊 
	<backCapsule type="normal"></backCapsule>	white:白色主题
	<backCapsule type="capsule"></backCapsule>
 -->
<template>
	<view class="backBtnBox flex-center" :style="'height:' + (customBar + topCustomBar) + 'px; '">
		<view v-if="type == 'capsule'" class="backBtn flex-around" :class="{ 'only-home': pages == 1 }">
			<image v-if="pages > 1" @click="goBack" class="back" src="../../static/w_back.png" mode="widthFix"></image>
			<view v-if="pages > 1" class="line"></view>
			<image @click="goHome" class="home" src="../../static/w_home.png" mode="widthFix"></image>
		</view>
		<view v-if="type == 'normal' && white" class="normal flex-around"><image @click="goBack" class="back" src="../../static/b_back.png" mode="widthFix"></image></view>
		<view v-if="type == 'normal' && !white" class="normal flex-around"><image @click="goBack" class="back" src="../../static/w_back.png" mode="widthFix"></image></view>
	</view>
</template>

<script>
export default {
	props: { type: String, white: Boolean },
	data() {
		return {
			customBar: this.CustomBar,
			topCustomBar: this.StatusBar,
			pages: 1
		};
	},
	created() {
		var pages = getCurrentPages();
		this.pages = pages.length;
	}
};
</script>

<style lang="scss">
.backBtnBox {
	position: fixed;
	left: 30rpx;
	top: 0;
	z-index: 2;
	.normal {
		.back {
			width: 40rpx;
			height: auto;
		}
	}
	.backBtn {
		width: 158rpx;
		height: 64rpx;
		box-sizing: border-box;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 1);
		border-radius: 28rpx;
		&.only-home {
			width: 80rpx;
		}
		.back {
			width: 32rpx;
			height: auto;
		}
		.line {
			width: 2rpx;
			height: 32rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 1px;
		}
		.home {
			width: 32rpx;
			height: auto;
		}
	}
}
</style>
