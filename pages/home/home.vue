<template>
	<view class="page-home">
		<!-- 红包广告 -->
		<view v-if="isShowRed" class="red-icon-group">
			<image @click="isShowShare = true" class="red-icon" src="@/static/share-icon.png" mode="widthFix" :animation="animation"></image>
		</view>
		<!-- 新人红包 -->
		<view v-if="isNewRedShow" class="new-red flex-center">
			<view>
				<image v-if="isAuthorized" @click="signIn" class="red" src="../../static/new-red.png" mode="widthFix"></image>
				<button v-else open-type="getUserInfo" @getuserinfo="getUserInfo" class="share"><image class="red" src="../../static/new-red.png" mode="widthFix"></image></button>
				<image
					@click="
						isNewRedShow = false;
						closedRed = true;
					"
					class="close"
					src="../../static/close-r.png"
					mode="widthFix"
				></image>
			</view>
		</view>
		<!-- 签到toast -->
		<view v-if="isSignToastShow" class="sign-toast flex-center">
			<view style="position: relative;">
				<image class="img" src="../../static/sign-toast.png" mode="widthFix"></image>
				<view class="success">今日签到成功</view>
				<view class="number">+{{ isSignToastShow }}积分</view>
			</view>
		</view>
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
					v-if="refreshRecommendFlag"
					ref="recommendVideo"
					:videoList="videoList"
					:parentPage="'home'"
					:parentPageVideoType="'recommend'"
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
					v-if="refreshAttentionFlag"
					ref="attentionVideo"
					:videoList="attentionVideoList"
					:parentPage="'home'"
					@loginFun="refreshList"
					@getNextPage="getAttentionList"
					@goodFun="goodFun"
					@commentFun="commentFun"
					@attentionFun="attentionFun"
				></videoBox>
			</view>
		</view>

		<w-loading mask="true" click="true" ref="loading"></w-loading>

		<!-- 公告 -->
		<view v-if="isShowNotice">
			<view class="mask">
				<view class="notice">
					<image src="@/static/notice.png" mode="widthFix"></image>
					<view class="concat">
						<view class="title">版本更新</view>
						<view class="info">本次更新平台新增早起打卡功能，分享视频也可以增加积分。积分兑换比例调整为根据前一日广告收益浮动</view>
						<view class="btn-big flex-center" @click="closeNotice">立即探索</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 红包-签到 -->
		<view v-if="isShowShare">
			<view class="mask" @click="isShowShare = false">
				<view class="share-group" @click.stop="">
					<view>
						<image class="bg" src="@/static/share-bg.png" mode="widthFix"></image>
						<view class="title flex-between">
							<view v-if="isAuthorized" @click="goPage('/pages/mine/wallet')">提现</view>
							<button v-else open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">提现</button>
							<image @click="isShowShare = false" src="@/static/share-close.png" mode="widthFix"></image>
						</view>

						<!-- 7日签到 -->
						<view class="seven-days">
							<view class="flex">
								<view class="item active">
									<view class="num">1</view>
									<view>第1天</view>
									<view v-if="sevenRed.data == 0 || sevenRed.data == 7" class="add">+{{ sevenRed.res.number1 }}</view>
								</view>
								<view class="item" :class="{ active: sevenRed.data >= 1 }">
									<view class="num">2</view>
									<view>第2天</view>
									<view v-if="sevenRed.data == 1" class="add">+{{ sevenRed.res.number2 }}</view>
								</view>
								<view class="item" :class="{ active: sevenRed.data >= 2 }">
									<view class="num">3</view>
									<view>第3天</view>
									<view v-if="sevenRed.data == 2" class="add">+{{ sevenRed.res.number3 }}</view>
								</view>
								<view class="item" :class="{ active: sevenRed.data >= 3 }">
									<view class="num">4</view>
									<view>第4天</view>
									<view v-if="sevenRed.data == 3" class="add">+{{ sevenRed.res.number4 }}</view>
								</view>
								<view class="item" :class="{ active: sevenRed.data >= 4 }">
									<view class="num">5</view>
									<view>第5天</view>
									<view v-if="sevenRed.data == 4" class="add">+{{ sevenRed.res.number5 }}</view>
								</view>
								<view class="item" :class="{ active: sevenRed.data >= 5 }">
									<view class="num">6</view>
									<view>第6天</view>
									<view v-if="sevenRed.data == 5" class="add">+{{ sevenRed.res.number6 }}</view>
								</view>
								<view class="item" :class="{ active: sevenRed.data >= 6 }">
									<image src="../../static/red-gift.png" mode="widthFix"></image>
									<view>第7天</view>
									<view v-if="sevenRed.data == 6" class="add">+{{ sevenRed.res.number7 }}</view>
								</view>
							</view>
							<view v-if="isAuthorized">
								<view v-if="sevenRed.state == 0" class="tip" style="padding-top: 20rpx;" @click="signIn">
									<view class="flex-center">
										<text style="padding: 6rpx 20rpx; border-radius: 30rpx; background-color: #FF893E; color: #fff;">点击签到</text>
									</view>
								</view>
								<view v-else class="tip" style="padding-top: 20rpx;">
									<view class="flex-center">
										<text style="padding: 6rpx 20rpx; border-radius: 30rpx; background-color: #FF893E; color: #fff;">今日已签到</text>
									</view>
								</view>
							</view>
							<button v-else open-type="getUserInfo" @getuserinfo="getUserInfo" class="share" style="overflow: unset;">
								<view class="tip" style="padding-top: 20rpx;">
									<view class="flex-center">
										<text style="padding: 6rpx 20rpx; border-radius: 30rpx; background-color: #FF893E; color: #fff;">点击签到</text>
									</view>
								</view>
							</button>
						</view>

						<!-- <view v-if="!personalInfo.is_sign" class="tip">打卡单次最高得2元，秒体现秒到账</view> -->
						<!-- <view v-else class="tip">邀请一个好友最高可得2元，秒体现秒到账。</view> -->

						<view v-if="isAuthorized">
							<view v-if="sevenRed.state == 0"></view>
							<view v-else>
								<!-- <image :animation="animation2" @click="goPage('/pages/mine/invitation')" class="share-btn" src="@/static/share-btn.png" mode="widthFix"></image> -->
								<view class="tip" style="padding-top: 20rpx;">
									<view class="flex-center">
										<image style="width: 30rpx; height: auto; margin-right: 12rpx;" src="../../static/sign-ok.png" mode="widthFix"></image>
										<text>今日已签到</text>
									</view>
									<view>我的余额：{{ (personalInfo.fraction / 1000).toFixed(2) }}元</view>
								</view>
							</view>
							<view class="sign-in fs-40 flex-center" @click="goPage('/pagesA/clockIn/clockIn')">
								<view>早起打卡</view>
								<image class="red-btn" src="../../static/red-btn.png" mode="widthFix"></image>
							</view>
						</view>
						<button v-else open-type="getUserInfo" @getuserinfo="getUserInfo" class="share" style="overflow: unset;">
							<view :animation="animation2" class="sign-in fs-40 flex-center">
								<view>早起打卡</view>
								<image class="red-btn" src="../../static/red-btn.png" mode="widthFix"></image>
							</view>
						</button>
						<!-- 广告位 -->
						<swiper v-if="isAuthorized" class="ads-swiper">
							<swiper-item v-for="(item, index) in advertisingList" :key="index" class="btn-group flex">
								<view v-for="(items, indexs) in item" :key="indexs" class="item" @click="clickAdvertising(items)">
									<view class="img-box flex-center"><image :src="items.logo" mode="widthFix"></image></view>
									<view class="text flex-center">{{ items.name }}</view>
									<view v-if="items.number" class="add-number">+{{ items.number }}积分</view>
								</view>
							</swiper-item>
						</swiper>
						<button v-else open-type="getUserInfo" class="ads-swiper share btn-group flex-between" @getuserinfo="getUserInfo">
							<swiper class="ads-swiper">
								<swiper-item v-for="(item, index) in advertisingList" :key="index" class="btn-group flex">
									<view v-for="(items, indexs) in item" :key="indexs" class="item">
										<view class="img-box flex-center"><image :src="items.logo" mode="widthFix"></image></view>
										<view class="text flex-center">{{ items.name }}</view>
										<view class="add-number">+{{ items.number }}积分</view>
									</view>
								</swiper-item>
							</swiper>
						</button>
						<view class="fs-24 text-center" style="color: #7E0C00; padding-bottom: 40rpx;">
							*每天点击以上小程序也可以增加积分哦
						</view>
						<!-- 提现列表 -->
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
