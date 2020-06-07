<!-- 顶部tabbar
									haveHeight:是否需要高度占位
									white:白色主题
	<navigationBar name="圈子资料" haveHeight></navigationBar>
 -->
<template>
	<!-- <view>
		<view :class="{ bg: haveHeight, white: white }" class="navigationBar flex-center fs-32" :style="'height:' + (customBar + topCustomBar) + 'px; '">{{ name }}</view>
		<view v-if="haveHeight" :style="'height:' + (customBar + topCustomBar) + 'px; '"></view>
	</view> -->
	<view>
		<view :class="{ bg: haveHeight, white: white }" class="navigationBar flex-center fs-32" :style="'height:' + customBar + 'px; '+'padding-top:'+topCustomBar+'px;'">{{ name }}</view>
		<view v-if="haveHeight" :style="'height:' + (customBar + topCustomBar) + 'px; '"></view>
	</view>
</template>

<script>
export default {
	props: { name: String, haveHeight: Boolean, white: Boolean },
	data() {
		return {
			customBar: this.CustomBar,
			topCustomBar: this.StatusBar
		};
	}
};
</script>

<style lang="scss">
.navigationBar {
	box-sizing: border-box;
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1;
	color: #fff;
}
.bg {
	background-color: $themeColor;
}
.white {
	background-color: #fff;
	color: #000;
	box-shadow:0px 0px 2rpx 0px rgba(0, 0, 0, 0.36);
}
</style>
