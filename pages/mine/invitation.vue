<template>
	<view class="page-invitation dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="推荐有礼"></navigationBar>
		<image class="bg" src="../../static/bg-tg.jpg" mode="widthFix"></image>
		<view class="content">
			<view class="fs-40 bold title">我的邀请码</view>
			<view class="code flex-center">9E60EZ</view>
			<input class="input fs-26" type="text" placeholder="输入好友验证码" placeholder-class="fc-a"/>
			<view class="fc-a fs-22 tip">输入朋友邀请码，朋友和你都能获得积分奖励</view>
			<view class="flex-center btnBox">
				<view class="flex-center">提交</view>
				<view class="flex-center sc" @click="toggleBannerFlag(true)">生成海报</view>
			</view>
		</view>
		<!-- 海报 -->
		<view v-if="showBannerFlag">
			<view class="mask"></view>
			<view class="bannerBox flex-center">
				<view>
					<view class="imgBox">
						<image src="../../static/logo.png" mode="widthFix"></image>
						<image @click="toggleBannerFlag(false)" class="close" src="../../static/close-f.png" mode="widthFix"></image>
					</view>
					<view class="btn-big fc-f flex-center">保存图片</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				showBannerFlag:false
			}
		},
		methods:{
			toggleBannerFlag(flag){
				this.showBannerFlag = flag;
			}
		}
	}
</script>

<style lang="scss">
	.page-invitation{
		text-align: center;
		color: #2E2929;
		background-color: #F6551E;
		.bg{
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: auto;
		}
		.content{
			width:690rpx;
			height:700rpx;
			background:#fff;
			box-shadow:0 10rpx 70rpx 0 rgba(227,50,5,0.74);
			border-radius:8rpx;
			position: fixed;
			bottom: 32rpx;
			left: calc(50% - 345rpx);
			.title{
				padding-top: 80rpx;
				padding-bottom: 30rpx;
			}
			.code{
				width:330rpx;
				height:108rpx;
				margin: 0 auto;
				background:rgba(238,238,238,1);
				box-shadow:0px 10rpx 10rpx 0px rgba(227,50,5,0.68);
				border-radius:54rpx;
				font-size: 60rpx;
				color: #F6551E;
			}
			.input{
				width:290rpx;
				height:68rpx;
				margin: 0 auto;
				background:rgba(238,238,238,1);
				border-radius:34rpx;
				margin-top: 90rpx;
			}
			.tip{
				padding-top: 20rpx;
			}
			.btnBox{
				padding-top: 80rpx;
				view{
					width:260rpx;
					height:66rpx;
					background:#F6551E;
					border-radius:34rpx;
					color: #fff;
				}
				.sc{
					background-color: #5D1DBE;
					margin-left: 30rpx;
				}
			}
		}
		.bannerBox{
			position: fixed;
			z-index: 1;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			.imgBox{
				width:650rpx;
				height:990rpx;
				border-radius:8rpx;
				position: relative;
				.close{
					width: 40rpx;
					height: auto;
					position: absolute;
					right: 20rpx;
					top: 20rpx;
				}
			}
			.btn-big{
				width: 650rpx;
				margin-top: 60rpx;
			}
		}
	}
</style>
