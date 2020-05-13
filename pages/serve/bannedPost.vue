<template>
	<view class="dark-bg page-bannedPost">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="禁言申诉" haveHeight></navigationBar>
		<view class="list">
			<view class="item flex" v-for="(item,index) in 5" :key="index">
				<view class="date circle flex-center">
					04/20
				</view>
				<view class="right fs-26">
					<view class="flex-between top">
						<view>申诉理由：</view>
						<view class="fs-24 tag flex-center">申诉中</view>
						<!-- <view class="fs-24 tag flex-center ycl">已处理</view> -->
					</view>
					<viwe class="fc-9">没有做什么违规操作，但是账号没法正常评论。</viwe>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss">
	.page-bannedPost{
		padding: 0 30rpx;
		.list{
			.item{
				padding-bottom: 60rpx;
				.date{
					width:106rpx;
					height:106rpx;
					background:#7364BD;
					margin-right: 20rpx;
				}
				.right{
					width: 560rpx;
					.tag{
						width:100rpx;
						height:38rpx;
						background:#7F3239;
						border-radius:4rpx;
					}
					.ycl{
						background-color: #4A4853;
					}
					.top{
						padding-bottom: 24rpx;
					}
				}
			}
		}
	}
	
</style>
