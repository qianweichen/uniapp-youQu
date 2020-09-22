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
		<view class="btnBox" v-if="isAuthorized">
			<view class="send flex-between fc-f">
				<view @click="sendV">
					<image src="../../static/send-v.png" mode="widthFix"></image>
					<view class="fs-26">发视频</view>
				</view>
				<view @click="upV">
					<image src="../../static/send-up.png" mode="widthFix"></image>
					<view class="fs-26">上传视频</view>
				</view>
				<view @click="sendI">
					<image src="../../static/send-i.png" mode="widthFix"></image>
					<view class="fs-26">发动态</view>
				</view>
			</view>
			<image @click="close" class="close" src="../../static/close-r.png" mode="widthFix"></image>
		</view>
		<view class="btnBox" v-else>
			<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
				<view class="send flex-between fc-f">
					<view>
						<image src="../../static/send-v.png" mode="widthFix"></image>
						<view class="fs-26">发视频</view>
					</view>
					<view>
						<image src="../../static/send-up.png" mode="widthFix"></image>
						<view class="fs-26">上传视频</view>
					</view>
					<view>
						<image src="../../static/send-i.png" mode="widthFix"></image>
						<view class="fs-26">发动态</view>
					</view>
				</view>
			</button>
			<image @click="close" class="close" src="../../static/close-r.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isAuthorized: false //授权否
		};
	},
	methods: {
		getUserInfo(e) {
			if (!e.detail.userInfo) return;
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
			});
		},
		sendV() {
			this.close();
			this.goPage('/pagesA/publish/shoot');
		},
		upV(){
			this.close();
			this.goPage('/pagesA/publish/publish-v');
		},
		sendI() {
			this.close();
			this.goPage('/pagesA/publish/publish-i');
		},
		close() {
			this.$emit('togglePublishFlag', false);
		}
	},
	created() {
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
	}
};
</script>

<style lang="scss">
.page-publish {
	background-color: rgba(0, 0, 0, 0.8);
	.btnBox {
		width: 580rpx;
		position: absolute;
		bottom: 132rpx;
		left: calc(50% - 290rpx);
		text-align: center;
		.send {
			margin: 0 auto;
			padding-bottom: 136rpx;
			image {
				width: 120rpx;
				height: 120rpx;
			}
		}
		.close {
			width: 66rpx;
			height: 66rpx;
		}
	}
}
</style>
