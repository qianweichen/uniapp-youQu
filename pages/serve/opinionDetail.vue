<template>
	<view class="dark-bg page-opinionDt">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="意见反馈" haveHeight></navigationBar>
		<view class="iptBox fs-26">
			<textarea placeholder="请填写10个字以上的问题描述以便帮助我们更好的帮助..." maxlength="200"/>
			<view class="fc-9 num">0/200</view>
		</view>
		<view class="contant flex-between fs-26">
			<view class="bold">联系方式</view>
			<input type="number" placeholder="请输入联系方式" />
		</view>
		<sunui-upimg @change="getImageInfo" :upload_auto="true" ref="upimg1" :upload_count="3"></sunui-upimg>
		<view class="bottomBox">
			<view class="flex-center">
				<checkbox color="#7364BD" class="checkbox" checked="" />
				<view class="fs-22">允许开发者在48小时之内通过客服消息联系我</view>
			</view>
			<view class="btn-big flex-center fs-32">提交</view>
		</view>
	</view>
</template>

<script>
	import sunUiUpimg from '@/components/sunui-upimg/sunui-upimg.vue';
	export default{
		data(){
			return{
				
			}
		},
		components: {
			'sunUiUpimg': sunUiUpimg
		},
		methods:{
			getImageInfo(e) {
				console.log('图片返回：', e)
			}
		}
	}
</script>

<style lang="scss">
.page-opinionDt{
	padding: 0 50rpx;
	.iptBox{
		height: 340rpx;
		textarea{
			width: 100%;
		}
		.num{
			text-align: right;
		}
	}
	.contant{
		padding: 50rpx 0;
		margin: 50rpx 0;
		border-top: 2rpx solid #4A4853;
		border-bottom: 2rpx solid #4A4853;
		input{
			text-align: right;
		}
	}
	.bottomBox{
		width: 100%;
		position: fixed;
		bottom: 80rpx;
		left: 0;
		.checkbox{
			zoom: 0.8;
		}
		.btn-big{
			margin-top: 46rpx;
			width: 650rpx;
		}
	}
}
</style>
