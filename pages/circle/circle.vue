<template>
	<view class="page-circle">
		<backCapsule type="capsule"></backCapsule>
		<view class="topInfoBox" :style="'background-image: url(' + '../../static/logo.png' + ');'">
			<view class="info">
				<view class="flex-between align-star">
					<view class="flex info-left">
						<view class="user flex-column-between">
							<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
							<view v-if="true" class="fs-22 join flex-center">加入</view>
							<view v-else class="fs-22 join flex-center outCircle">退圈</view>
						</view>
						<view class="nameBox fc-f flex-column-between">
							<view class="fs-32 bold">爱宠俱乐部</view>
							<view class="fs-24" style="color: #ddd;">宠物是我们最好的朋友，不要伤害它...</view>
							<view class="fs-20">关注 1758 | 帖子 474</view>
						</view>
					</view>
					<view class="share">
						<image src="../../static/ercode.png" mode="widthFix"></image>
						<view class="fs-22 fc-f">分享</view>
					</view>
				</view>
			</view>
		</view>
		<dynamicList type="circle" :list="dynamicList"></dynamicList> 
		<!-- 发布按钮 -->
		<image class="sendDynamic" src="../../static/tabbar/publish.png" mode="widthFix"></image>
	</view>
</template>

<script>
import dynamicList from '@/components/dynamic/dynamic.vue';
export default {
	components:{
		dynamicList
	},
	data() {
		return {
			dynamicList:[1,2,3]
		};
	},
	created() {
		
	}
};
</script>

<style lang="scss">
@import './circle.scss';
</style>
