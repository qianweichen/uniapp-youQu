<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="关于" haveHeight></navigationBar>
		<view class="logoBox flex-center">
			<view>
				<image class="logo" :src="info.sgraph" mode="widthFix"></image>
				<view class="fs-36 name">{{info.title}}</view>
				<view class="fs-30 name">{{info.copyright}}</view>
			</view>
		</view>
		<view class="list">
			<view class="item flex-between">
				<view>
					<view class="fs-28">圈遇官方邮箱</view>
					<view class="fs-24 fc-9">2314058122@qq.com</view>
				</view>
				<view class="flex" @click="setClip('2314058122@qq.com')">
					<view class="fs-28 fc-9">复制邮箱</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-28">客服微信号</view>
					<view class="fs-24 fc-9">{{info.cust_phone}}</view>
				</view>
				<view class="flex" @click="setClip(info.cust_phone)">
					<view class="fs-28 fc-9">复制微信</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-28">小程序版本</view>
					<view class="fs-24 fc-9">v1.0.0</view>
				</view>
			</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				info:{}
			}
		},
		methods:{
			setClip(data){
				uni.setClipboardData({
				    data: data
				});
			},
			getAuthority(){
				this.$refs.loading.open();
				this.request({
					url: this.apiUrl + 'User/get_authority',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid')
					},
					success: res => {
						// console.log("站点信息:",res);
						this.info = res.data;
						this.$refs.loading.close();
					},
				});
			}
		},
		onLoad() {
			this.getAuthority();
		}
	}
</script>

<style lang="scss">
.logoBox {
	text-align: center;
	padding: 90rpx 0;
	.logo {
		width: 166rpx;
		height: auto;
	}
	.name {
		padding-top: 20rpx;
	}
}
.list {
	padding: 0 30rpx;
	.item {
		padding-top: 74rpx;
		.right {
			width: 30rpx;
			height: auto;
		}
	}
}
</style>
