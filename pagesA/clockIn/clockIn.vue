<template>
	<view class="wrap">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="早起打卡挑战赛"></navigationBar>
		<image class="bg" src="../../static/clockIn/bg.png" mode="widthFix"></image>
		<view style="height: 416rpx;"></view>
		<view class="info-group">
			<view class="fc-3 fs-28">今日总累计积分</view>
			<view class="num">6355</view>
			<view class="people flex-center">
				<image src="../../static/clockIn/user.png" mode="widthFix"></image>
				<view class="number">6344</view>
				<view>人已参加报名</view>
			</view>
			<view class="time">
				<text>活动计时：</text>
				<text class="number">01</text>
				<text>时</text>
				<text class="number">01</text>
				<text>分</text>
				<text class="number">01</text>
				<text>秒</text>
			</view>
			<view class="btn-group">
				<image src="../../static/clockIn/btn.png" mode="widthFix"></image>
				<view class="flex-center">打卡倒计时 07:02:31</view>
			</view>
		</view>
		<view class="step-group">
			<view class="title flex-center">
				<image src="../../static/clockIn/arrow.png" mode="widthFix"></image>
				<view>三步赚取打卡积分</view>
				<image src="../../static/clockIn/arrow.png" mode="widthFix"></image>
			</view>
			<view class="icon-group flex-between">
				<view>
					<image src="../../static/clockIn/day1.png" mode="widthFix"></image>
					<view class="name">参与打卡</view>
					<view class="name2">报名比赛</view>
				</view>
				<view>
					<image src="../../static/clockIn/day2.png" mode="widthFix"></image>
					<view class="name">打卡（05:00-10:00）</view>
					<view class="name2">获得瓜分资格</view>
				</view>
				<view>
					<image src="../../static/clockIn/day3.png" mode="widthFix"></image>
					<view class="name">瓜分积分</view>
					<view class="name2">12点前积分结算</view>
				</view>
			</view>
			<view class="header-group">
				<image v-for="(item,index) in 6" :key="index" src="../../static/clockIn/day2.png" mode="aspectFill"></image>
				<image src="../../static/clockIn/more.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="ranking-group">
			<view class="title flex-center">
				<image src="../../static/clockIn/arrow.png" mode="widthFix"></image>
				<view>打卡战况</view>
				<image src="../../static/clockIn/arrow.png" mode="widthFix"></image>
			</view>
			<view class="icon-group flex-between">
				<view>
					<image src="../../static/clockIn/day1.png" mode="widthFix"></image>
					<view class="name">五月蓝天</view>
					<view class="name2">00:02:00打卡</view>
					<view class="ranking">
						<image src="../../static/clockIn/icon-2.png" mode="widthFix"></image>
						<view class="flex-center">亚军</view>
					</view>
				</view>
				<view>
					<image src="../../static/clockIn/day2.png" mode="widthFix"></image>
					<view class="name">乖乖是只猫</view>
					<view class="name2">00:02:00打卡</view>
					<view class="ranking">
						<image src="../../static/clockIn/icon-1.png" mode="widthFix"></image>
						<view class="flex-center">冠军</view>
					</view>
				</view>
				<view>
					<image src="../../static/clockIn/day3.png" mode="widthFix"></image>
					<view class="name">张海璐</view>
					<view class="name2">00:02:00打卡</view>
					<view class="ranking">
						<image src="../../static/clockIn/icon-3.png" mode="widthFix"></image>
						<view class="flex-center">季军</view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="item flex-between" v-for="(item,index) in 8" :key="index">
					<view class="flex">
						<image class="header" src="../../static/clockIn/day2.png" mode="aspectFill"></image>
						<view class="fs-24 fc-3">乖乖是只喵</view>
					</view>
					<view class="flex">	
						<image class="clock" src="../../static/clockIn/clock.png" mode="widthFix"></image>
						<view class="fs-24 fc-8">今日打卡0次，总共打卡10次</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.wrap {
	position: relative;
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: auto;
	}
	.info-group {
		width: 690rpx;
		margin: 0 auto 20rpx;
		padding: 50rpx 40rpx;
		box-sizing: border-box;
		background: #ffffff;
		border: 8rpx solid #c110fc;
		box-shadow: 0 -10rpx 0 0 #c110fc;
		border-radius: 20rpx;
		text-align: center;
		.num {
			font-size: 68rpx;
			color: #c111fb;
			font-weight: bold;
			padding: 15rpx 0;
		}
		.people {
			font-size: 24rpx;
			image {
				width: 20rpx;
				height: auto;
				font-size: 24rpx;
			}
			.number {
				color: #5f3dd2;
				padding: 0 12rpx;
			}
		}
		.time {
			padding: 40rpx 0 20rpx;
			font-size: 24rpx;
			.number {
				padding: 0 4rpx;
				background-color: #c111fb;
				color: #fff;
			}
		}
		.btn-group {
			position: relative;
			image {
				width: 602rpx;
				height: 129rpx;
				display: block;
			}
			view {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				font-size: 42rpx;
				color: #fff6e2;
				text-shadow: 0 2rpx 2rpx #5a0da3;
			}
		}
	}
	.step-group {
		width: 690rpx;
		height: 514rpx;
		margin: 0 auto 20rpx;
		padding: 45rpx 24rpx;
		box-sizing: border-box;
		background: #ffffff;
		box-shadow: -2rpx 4rpx 24rpx 4rpx rgba(228, 228, 228, 0.58);
		border-radius: 20rpx;
		.title {
			image {
				width: 48rpx;
				height: 12rpx;
				&:last-child {
					transform: scale(180deg);
				}
			}
			view {
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
				padding: 0 19rpx;
			}
		}
		.icon-group {
			padding: 50rpx 40rpx;
			text-align: center;
			image {
				width: 128rpx;
				height: 128rpx;
			}
			.name {
				color: #333;
				font-size: 24rpx;
				font-weight: bold;
				padding: 10rpx 0 7rpx;
			}
			.name2 {
				font-size: 20rpx;
				color: #C588D9;
			}
		}
		.header-group{
			image{
				width: 82rpx;
				height: 84rpx;
				border-radius: 50%;
				margin-right: 11rpx;
				&:last-child{
					margin-right: 0;
				}
			}
		}
	}
	.ranking-group {
		width: 690rpx;
		margin: 0 auto 20rpx;
		padding: 45rpx 24rpx;
		box-sizing: border-box;
		background: #ffffff;
		box-shadow: -2rpx 4rpx 24rpx 4rpx rgba(228, 228, 228, 0.58);
		border-radius: 20rpx;
		.title {
			image {
				width: 48rpx;
				height: 12rpx;
				&:last-child {
					transform: scale(180deg);
				}
			}
			view {
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
				padding: 0 19rpx;
			}
		}
		.icon-group {
			padding: 50rpx 40rpx;
			text-align: center;
			>view{
				position: relative;
				image {
					width: 128rpx;
					height: 128rpx;
				}
				.name {
					color: #333;
					font-size: 24rpx;
					font-weight: bold;
					padding: 10rpx 0 7rpx;
				}
				.name2 {
					font-size: 20rpx;
					color: #C588D9;
				}
				.ranking{
					position: absolute;
					left: calc(50% - 80rpx);
					bottom: 68rpx;
					image{
						width: 160rpx;
						height: 54rpx;
						display: block;
					}
					view{
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
						font-size: 24rpx;
						color: #FFFFFF;
						padding: 4rpx 0 0 16rpx;
					}
				}
			}
		}
		.list{
			.item{
				width: 652rpx;
				height: 84rpx;
				background: #F5F5F5;
				border-radius: 20rpx;
				padding: 0 20rpx;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				&:last-child{
					margin-bottom: 0;
				}
				.header{
					width: 32px;
					height: 32px;
					border-radius: 50%;
					margin-right: 15rpx;
				}
				.clock{
					width: 34rpx;
					height: 32rpx;
					margin-right: 8rpx;
				}
			}
		}
	}
}
</style>
