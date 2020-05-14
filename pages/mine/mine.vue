<template>
	<view class="page-persionalC page-mine">
		<navigationBar name="我的"></navigationBar>
		<view class="banner" :style="'background-image: url(' + '../../static/logo.png' + ');'">
			<view class="myPage flex-center" @click="goPage('/pages/personalCenter/personalCenter')">
				<view class="fs-26">个人主页</view>
				<image src="../../static/right.png" mode="widthFix"></image>
			</view>
			<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
			<view class="btnBox flex-between fs-26">
				<view class="flex-center gz" @click="goPage('/pages/mine/editInformation')">编辑资料</view>
				<view class="flex-center sx">签到</view>
			</view>
		</view>
		<view class="info">
			<view class="fs-46 bold">猫咪客栈</view>
			<view class="fs-26 fc-9">宠物是我们最好的朋友，不要伤害它...</view>
		</view>
		<view class="myNum flex fs-30">
			<view @click="goPage('/pages/mine/myCircle')">
				<text class="bold fs-40">2</text>
				圈子
			</view>
			<view>
				<text class="bold fs-40">2</text>
				赞
			</view>
			<view @click="goPage('/pages/mine/followee')">
				<text class="bold fs-40">2</text>
				关注
			</view>
			<view @click="goPage('/pages/mine/myFans')">
				<text class="bold fs-40">2</text>
				粉丝
			</view>
		</view>
		<view class="functionList flex">
			<view class="item" v-for="(item,index) in btnList" :key="index" @click="goPage(item.url)">
				<view class="imgBox flex-center">
					<image :src="item.img" mode="widthFix"></image>
				</view>
				<view class="fs-26">{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			btnList:[{
				name:'我的圈子',
				img:'../../static/circle.png',
				url:'/pages/mine/creatCircle'
			},{
				name:'我的收藏',
				img:'../../static/collect.png',
				url:'/pages/mine/myCollect'
			},{
				name:'我的钱包',
				img:'../../static/wallet.png',
				url:'/pages/mine/wallet'
			},{
				name:'邀请好友',
				img:'../../static/share.png',
				url:''
			},{
				name:'服务中心',
				img:'../../static/service.png',
				url:'/pages/mine/serve'
			},{
				name:'关于我们',
				img:'../../static/about.png',
				url:'/pages/mine/about'
			}
			// ,{
			// 	name:'收到的礼物',
			// 	img:'../../static/gift.png',
			// 	url:''
			// }
			// ,{
			// 	name:'我的订单',
			// 	img:'../../static/order.png',
			// 	url:''
			// }
			]
		};
	},
	methods: {},
	created() {
		console.log('mineCreated');
	}
};
</script>

<style lang="scss">
@import '@/pages/personalCenter/personalCenter.scss';
.banner{
	.myPage{
		width:194rpx;
		height:54rpx;
		background:rgba(0,0,0,0.3);
		border-radius:28rpx 0px 0px 28rpx;
		position: absolute;
		right: 0;
		top: calc(50% - 27rpx);
		image{
			width: 12rpx;
			height: auto;
			margin-left: 20rpx;
		}
	}
}
.page-mine{
	height: 100%;
	color: #fff;
	background-color: $themeColor;
	overflow-y: auto;
}
.functionList{
	flex-wrap: wrap;
	.item{
		padding: 50rpx 30rpx;
		text-align: center;
		.imgBox{
			width:120rpx;
			height:110rpx;
			background:rgba(35,32,51,1);
			border-radius:46rpx;
			image{
				width: 60rpx;
				height: auto;
			}
		}
		.fs-26{
			color: rgba(255,255,255,0.5);
			padding-top: 24rpx;
		}
	}
}
</style>
