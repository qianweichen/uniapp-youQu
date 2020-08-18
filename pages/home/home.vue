<template>
	<view class="page-home">
		<!-- 红包广告 -->
		<image v-if="isShowRed" @click="isShowShare = true" class="red-icon" src="@/static/share-icon.png" mode="widthFix" :animation="animation"></image>
		<!-- tab -->
		<view class="topTab flex-center" :style="'height:' + (customBar + topCustomBar) + 'px;'">
			<view class="tabs flex-between fs-32">
				<view @click="changeTabs(true)">
					<text :class="{ active: tabsFlag }">推荐</text>
					<view v-if="tabsFlag" class="line"></view>
				</view>
				<view v-if="isAuthorized" @click="changeTabs(false)">
					<text :class="{ active: !tabsFlag }">关注</text>
					<view v-if="!tabsFlag" class="line"></view>
				</view>
				<view v-else>
					<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
						<text :class="{ active: !tabsFlag }">关注</text>
						<view v-if="!tabsFlag" class="line"></view>
					</button>
				</view>
			</view>
			<image @click="goPage('/pages/search/search')" class="search" src="@/static/search.png" mode="widthFix"></image>
		</view>
		<!-- <view :style="'height:' + (customBar + topCustomBar) + 'px;'"></view> -->
		<!-- <view  :style="'height:calc(100% - ' + (customBar + topCustomBar) + 'px);'"> -->
		<view class="video-swiper-group" :style="!tabsFlag ? 'left:' + -screenWidth + 'px;' : '0'">
			<!-- 推荐 -->
			<view>
				<videoBox
					ref="recommendVideo"
					:videoList="videoList"
					:parentPage="'home'"
					@loginFun="refreshList"
					@getNextPage="getHomeList"
					@goodFun="goodFun"
					@commentFun="commentFun"
					@attentionFun="attentionFun"
				></videoBox>
			</view>
			<!-- 关注 -->
			<view>
				<videoBox
					ref="attentionVideo"
					:videoList="attentionVideoList"
					:parentPage="'home'"
					@loginFun="refreshList"
					@getNextPage="getHomeList"
					@goodFun="goodFun"
					@commentFun="commentFun"
					@attentionFun="attentionFun"
				></videoBox>
			</view>
		</view>

		<w-loading mask="true" click="true" ref="loading"></w-loading>

		<!-- 公告 -->
		<!-- <view v-if="isShowNotice">
			<view class="mask">
				<view class="notice">
					<image src="@/static/notice.png" mode="widthFix"></image>
					<view class="concat">
						<view class="title">友趣短视频小程序正式上线啦！</view>
						<view class="info">新版福利：发布的视频或动态点赞量达到100，奖励10元。点赞量达到1000，奖励100元。联系客服即可领取奖励，快来体验吧！</view>
						<view class="btn-big flex-center" @click="closeNotice">立即探索</view>
					</view>
				</view>
			</view>
		</view> -->

		<!-- 分享 -->
		<view v-if="isShowShare">
			<view class="mask" @click="isShowShare = false">
				<view class="share-group" @click.stop="">
					<image class="bg" src="@/static/share-bg.png" mode="widthFix"></image>
					<view class="title flex-between">
						<view v-if="isAuthorized" @click="goPage('/pages/mine/wallet')">提现</view>
						<button v-else open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">提现</button>
						<image @click="isShowShare = false" src="@/static/share-close.png" mode="widthFix"></image>
					</view>

					<view v-if="!personalInfo.is_sign" class="tip">打卡单次最高得2元，秒体现秒到账</view>
					<view v-else class="tip">邀请一个好友最高可得2元，秒体现秒到账。</view>

					<view v-if="isAuthorized">
						<view v-if="!personalInfo.is_sign" :animation="animation2" class="sign-in fs-40 flex-center" @click="signIn">点击打卡</view>
						<view v-else>
							<image :animation="animation2" @click="goPage('/pages/mine/invitation')" class="share-btn" src="@/static/share-btn.png" mode="widthFix"></image>
							<view class="tip" style="padding-top: 20rpx;">今日已打卡,余额约{{ (personalInfo.fraction / 100).toFixed(2) }}</view>
							<view class="sign-in fs-40 flex-center" @click="goPage('/pages/mine/wallet')">立即提现</view>
						</view>
					</view>
					<button v-else open-type="getUserInfo" @getuserinfo="getUserInfo" class="share" style="overflow: unset;">
						<view :animation="animation2" class="sign-in fs-40 flex-center">点击打卡</view>
					</button>

					<view v-if="isAuthorized" class="btn-group flex-between" @click="goPage('/pages/task/task')">
						<view>
							<view class="img-box flex-center"><image src="@/static/share-fsp.png" mode="widthFix"></image></view>
							<view class="text flex-center">发视频</view>
						</view>
						<view>
							<view class="img-box flex-center"><image src="@/static/share-ksp.png" mode="widthFix"></image></view>
							<view class="text flex-center">看视频</view>
						</view>
						<view>
							<view class="img-box flex-center"><image src="@/static/share-zan.png" mode="widthFix"></image></view>
							<view class="text flex-center">点赞×10</view>
						</view>
						<view>
							<view class="img-box flex-center"><image src="@/static/share-pl.png" mode="widthFix"></image></view>
							<view class="text flex-center">写评论</view>
						</view>
					</view>
					<button v-else open-type="getUserInfo" class="share btn-group flex-between" @getuserinfo="getUserInfo">
						<view>
							<view class="img-box flex-center"><image src="@/static/share-fsp.png" mode="widthFix"></image></view>
							<view class="text flex-center">发视频</view>
						</view>
						<view>
							<view class="img-box flex-center"><image src="@/static/share-ksp.png" mode="widthFix"></image></view>
							<view class="text flex-center">看视频</view>
						</view>
						<view>
							<view class="img-box flex-center"><image src="@/static/share-zan.png" mode="widthFix"></image></view>
							<view class="text flex-center">点赞×10</view>
						</view>
						<view>
							<view class="img-box flex-center"><image src="@/static/share-pl.png" mode="widthFix"></image></view>
							<view class="text flex-center">写评论</view>
						</view>
					</button>
					<swiper class="red-swiper" circular vertical interval="1500" autoplay>
						<swiper-item v-for="(item, index) in txList" :key="index">
							<view class="tx-group flex-between">
								<view class="flex">
									<image class="header" :src="item.user_head_sculpture" mode="aspectFill"></image>
									<view class="fs-24">{{ item.user_nick_name }}</view>
								</view>
								<view class="fs-24 bold">赚到了{{ item.display_money }}元现金</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import homeJs from './home.js';
import videoBox from '@/components/videoPage/videoPage.vue';
export default {
	...homeJs,
	components: {
		videoBox
	}
};
</script>

<style lang="scss">
@import './home.scss';
</style>
