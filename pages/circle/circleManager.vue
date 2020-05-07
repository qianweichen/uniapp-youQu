<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="管理员" haveHeight></navigationBar>
		<view v-for="(item,index) in 10" :key="index">
			<uni-swipe-action>
				<uni-swipe-action-item :options="options" @click="onClick" @change="change">
					<view class="item flex-between">
						<view class="flex">
							<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
							<view>
								<view class="fs-32">乖乖是只猫</view>
								<view class="fs-24">乖乖首席铲屎官是也。</view>
							</view>
						</view>
						<image class="right" src="../../static/right.png" mode="widthFix"></image>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
	</view>
</template>

<script>
import uniSwipeAction from '@/components/uni-swipe/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe/uni-swipe-action-item/uni-swipe-action-item.vue';
export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem
	},
	data() {
		return {
			options: [
				{
					text: '投诉',
					style: {
						backgroundColor: '#7364BD'
					}
				}
			]
		};
	},
	methods: {
		onClick(e) {
			console.log('当前点击的是第' + e.index + '个按钮，点击内容是' + e.content.text);
		},
		change(open) {
			// console.log('当前开启状态：' + open);
		}
	}
};
</script>

<style lang="scss">
	.item{
		padding: 30rpx;
		width: 100%;
		background-color: $themeColor;
		.header{
			width: 120rpx;
			height: 120rpx;
			border:2rpx solid #fff;
			margin-right: 20rpx;
		}
		.right{
			width: 20rpx;
			height: auto;
		}
	}
</style>
