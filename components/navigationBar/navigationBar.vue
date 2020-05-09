<!-- 顶部tabbar
									haveHeight:是否需要高度占位
	<navigationBar name="圈子资料" haveHeight></navigationBar>
 -->
<template>
	<view>
		<view :class="{'bg':haveHeight}" class="navigationBar flex-center" :style="'height:' + (customBar + topCustomBar) + 'px; '">{{ name }}</view>
		<view v-if="haveHeight" :style="'height:' + (customBar + topCustomBar) + 'px; '"></view>
	</view>
</template>

<script>
export default {
	props: { name: String, haveHeight: Boolean },
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
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1;
	color: #fff;
}
.bg{
	background-color: $themeColor;
}
</style>
