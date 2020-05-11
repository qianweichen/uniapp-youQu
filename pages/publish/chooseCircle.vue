<template>
	<view class="dark-bg page-chooseCircle">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="发布到" haveHeight></navigationBar>
		<view class="list">
			<view class="item flex-between" v-for="(item,index) in 5" :key="index" @click="choose()">
				<view class="flex">
					<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
					<view>
						<view class="fs-30">流浪动物保护领养中心</view>
						<view class="flex fs-24">
							<view>1358人加入</view>
							<view>466条内容</view>
						</view>
					</view>
				</view>
				<image class="yes" src="../../static/yes.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			choose(){
				this.goBack();
			}
		}
	}
</script>

<style lang="scss">
	.page-chooseCircle{
		padding: 0 30rpx;
		.list{
			.item{
				padding: 40rpx 0;
				border-bottom: 2rpx solid rgba(255,255,255,0.1);
				.header{
					width:114rpx;
					height:114rpx;
					margin-right: 30rpx;
				}
				.fs-24{
					color:rgba(255,255,255,0.6);
					padding-top: 20rpx;
					>view:first-child{
						padding-right: 40rpx;
					}
				}
				.yes{
					width: 50rpx;
					height: auto;
				}
			}
		}
	}
</style>
