<template>
	<view class="page-creatCircle-l dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar :name="title" haveHeight></navigationBar>
		<textarea class="textarea fs-26" value="" placeholder="填写简介，不超过140个字符" placeholder-class="fc-f" v-model="information" maxlength="140"/>
		<view class="btn-big flex-center fs-32" @click="save">保存</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>		
	</view>
</template>

<script>
export default {
	data() {
		return {
			title:'圈子简介',
			type:1	,//1:简介	2:原因
			information:''
		};
	},
	methods: {
		save(){
			var pages = getCurrentPages();
			var prevPage = pages[pages.length - 2];  //上一个页面
			if(this.type == 1){
				prevPage.$vm.circleInfo.intro = this.information;
			}else{
				prevPage.$vm.circleInfo.reason = this.information;
			}
			
			uni.showToast({
				title:'设置成功'
			});
			setTimeout(()=>{
				this.goBack();
			},1500)
		}
	},
	onLoad(options) {
		//1:简介	2:原因
		if(options.type==2){
			this.title = "申请原因";
			this.type = 2;
		}
	}
};
</script>

<style lang="scss">
.page-creatCircle-l {
	padding: 0 30rpx;
	.textarea {
		width: 100%;
		height: 360rpx;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 8rpx;
		padding: 30rpx;
		box-sizing: border-box;
	}
	.btn-big {
		position: fixed;
		bottom: 56rpx;
		left: calc(50% - 345rpx);
	}
}
</style>
