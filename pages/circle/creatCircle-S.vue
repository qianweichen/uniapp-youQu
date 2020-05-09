<template>
	<view class="page-creatCircle-l dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="圈子名称" haveHeight></navigationBar>
		<view class="iptBox flex-between">
			<input class="fs-26" type="text" placeholder="请输入圈子名称" placeholder-class="fc-f" v-model="name" maxlength="14"/>
			<image src="../../static/close-r.png" mode="widthFix"></image>
		</view>
		<view class="fc-9 fs-24">
			<view>1、名字不能超过14个汉字，限汉字、字母、数字、下划线；</view>
			<view>2、名称不能包含“医疗机构、具有药用性产品名、股票期货彩票”等金融信息。</view>
		</view>
		<view class="btn-big flex-center fs-32" @click="save">保存</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name:''
		};
	},
	methods: {
		save(){
			var pages = getCurrentPages();
			var prevPage = pages[pages.length - 2];  //上一个页面
			prevPage.$vm.circleInfo.name = this.name;
			uni.showToast({
				title:'设置成功'
			});
			setTimeout(()=>{
				this.goBack();
			},1500)
		}
	}
};
</script>

<style lang="scss">
.page-creatCircle-l {
	padding: 0 30rpx;
	.iptBox {
		margin: 40rpx 0;
		height: 80rpx;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 8rpx;
		padding: 0 30rpx;
		image {
			width: 32rpx;
			height: 32rpx;
		}
	}
	.btn-big {
		position: fixed;
		bottom: 56rpx;
		left: calc(50% - 345rpx);
	}
}
</style>
