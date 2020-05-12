<template>
	<view class="page-msg dark-bg">
		<navigationBar name="站内信" haveHeight></navigationBar>
		<view class="btnBox flex-around fs-26">
			<view @click="goPage('/pages/message/fans')">
				<image src="../../static/msg1.png" mode="widthFix"></image>
				<view>粉丝</view>
			</view>
			<view @click="goPage('/pages/message/good')">
				<image src="../../static/msg2.png" mode="widthFix"></image>
				<view>赞</view>
			</view>
			<view @click="goPage('/pages/message/comment')">
				<image src="../../static/msg3.png" mode="widthFix"></image>
				<view>评论</view>
			</view>
		</view>
		<view class="list">
			<!-- 赞 -->
			<view class="good flex-between align-star">
				<view class="flex align-star">
					<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
					<view>
						<view class="fs-26 bold">
							<text style="color: #7364BD;">小镜哥</text>
							<text>...等4个赞过你的作品</text>
						</view>
						<view class="fs-24 fc-9">下午 17:28</view>
						<view class="headerBox">
							<image src="../../static/logo.png" mode="aspectFill"></image>
							<image src="../../static/logo.png" mode="aspectFill"></image>
							<image src="../../static/logo.png" mode="aspectFill"></image>
							<image src="../../static/logo.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<image class="pic" src="../../static/logo.png" mode="aspectFill"></image>
			</view>
			<!-- 粉丝 -->
			<view class="fans flex-between">
				<view class="flex align-star">
					<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
					<view>
						<view class="fs-32 bold">小镜哥养猫</view>
						<view class="fs-26 cont">哈喽！很高兴你关注我。....</view>
						<view class="fs-24 fc-9">下午 17:28</view>
					</view>
				</view>
				<view class="fs-26">
					<view v-if="true" class="gz flex-center">关注</view>
					<view v-else class="gz flex-center active">互相关注</view>
				</view>
			</view>
			<!-- 评价 -->
			<view class="good flex-between align-star comment">
				<view class="flex align-star">
					<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
					<view>
						<view class="fs-26">
							小镜哥铲屎官
						</view>
						<view class="cont fs-32">
							这只猫咪太可爱了.
						</view>
						<view class="fs-24 fc-9">下午 17:28</view>
					</view>
				</view>
				<image class="pic" src="../../static/logo.png" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {},
	created() {
		console.log('messageCreated');
	}
};
</script>

<style lang="scss">
@import './message.scss';
</style>
