<template>
	<view>
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="活动规则" haveHeight></navigationBar>
		<view class="wrap">
			<view class="title">活动名称</view>
			<view class="text">早起打卡挑战赛</view>
			<view class="title">活动参与规则</view>
			<view class="text">1. 活动期间每日00:00-23:59 (北京时间）可报名次日早起•打卡挑战赛；</view>
			<view class="text">2. 用户通过观看视频免费报名早起打卡挑战赛，用户看视频完成报名，每报名1人总积分增加≥15积分；</view>
			<view class="text">3. 成功报名用户在次日05:00-10:00 (北京时间）到小程序，点击 活动页面完成打卡，10:00后打卡的视为挑战失败；</view>
			<view class="text">4. 当日打卡结束后，积分会在当日12:00前结算，打卡成功的用户 将获得的积分，挑战失败的用户无积分；</view>
			<view class="title">免责条款</view>
			<view class="text">
				1. 用户知悉互联网存在诸多不确定性因素，因此理解并同意，如因 不可抗力、网络、通讯线路故障、计算机大规模瘫痪及活动中存在大
				面积作弊行为等非本应用原因致使本活动出现异常情况或难以继 续开展的，我司有权采取包括但不限于通过各种方式消除异常情况
				或调整、暂.停、取消本活动等措施，因此造成用户损失的，我司不 承担任何责任；
			</view>
			<view class="text">2. 请保证参与活动过程中手机网络正常，若因手机网络异常等原因 导致奖励发送失败的情况，我司将不做任何补偿；</view>
			<view class="text">3. 用户报名成功即对平台的判定结果表示认同；</view>
			<view class="text">4. 凡是被平台判定为作弊的用户将取消奖励；</view>
			<view class="text">5.用户对本平台任何活动规则存在疑问时，可随时咨询客服。</view>
		</view>
	</view>
</template>

<script></script>

<style lang="scss">
.wrap {
	padding: 30rpx;
	.title {
		display: inline-block;
		border-radius: 40rpx;
		padding: 10rpx 20rpx;
		background-color: #7882ff;
		font-size: 28rpx;
		color: #fff;
		margin: 20rpx 0;
	}
	.text {
		font-size: 26rpx;
		padding-bottom: 10rpx;
		line-height: 50rpx;
	}
}
</style>
