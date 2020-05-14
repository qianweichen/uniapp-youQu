<!--	选择发布类型

	import publish from '@/components/publish/publish';
	components: {
		publish
	},
	
	<publish v-if="showPublishFlag" @togglePublishFlag="togglePublishFlag"></publish>
	showPublishFlag:false
	// 选择发布类型
	togglePublishFlag(flag){
		this.showPublishFlag = flag;
	},
 -->
<template>
	<view class="page-publish mask">
		<view class="btnBox">
			<view class="send flex-between fc-f">
				<view @click="sendV">
					<image src="../../static/send-v.png" mode="widthFix"></image>
					<view class="fs-26">发视频</view>
				</view>
				<view @click="sendI">
					<image src="../../static/send-i.png" mode="widthFix"></image>
					<view class="fs-26">发动态</view>
				</view>
			</view>
			<image @click="close" class="close" src="../../static/close-r.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			sendV(){
				this.close();
				this.goPage('/pages/publish/shoot');
			},
			sendI(){
				this.close();
				this.goPage('/pages/publish/publish-i');
			},
			close(){
				this.$emit("togglePublishFlag",false);
			}
		}
	}
</script>

<style lang="scss">
	.page-publish{
		background-color: rgba(0,0,0,0.8);
		.btnBox{
			width: 388rpx;
			position: absolute;
			bottom: 132rpx;
			left: calc(50% - 194rpx);
			text-align: center;
			.send{
				margin: 0 auto;
				padding-bottom: 136rpx;
				image{
					width: 120rpx;
					height: 120rpx;
				}
			}
			.close{
				width: 66rpx;
				height: 66rpx;
			}
		}
	}
</style>
