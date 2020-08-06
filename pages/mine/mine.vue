<template>
	<view class="page-persionalC page-mine">
		<navigationBar name="我的"></navigationBar>
		<view class="banner" :style="'background-image: url(' + personalInfo.bg_img + ');'">
			<view class="myPage flex-center" @click="goPage('/pages/personalCenter/personalCenter?id=' + personalInfo.id)">
				<view class="fs-26">个人主页</view>
				<image src="../../static/right.png" mode="widthFix"></image>
			</view>
			<image v-if="isAuthorized" class="header circle" :src="personalInfo.user_head_sculpture || ''" mode="aspectFill"></image>
			<view v-else class="header circle" style="background-color: #363441;">
				<button open-type="getUserInfo" class="share flex-center" @getuserinfo="getUserInfo" style="width: 100%; height: 100%;">点我登陆</button>
			</view>
			<view v-if="isAuthorized" class="btnBox flex-between fs-26">
				<view class="flex-center gz" @click="goPage('/pages/mine/editInformation')">编辑资料</view>
				<view v-if="!personalInfo.is_sign" class="flex-center sx" @click="signIn">签到</view>
				<view v-else class="flex-center sx" @click="signIn">{{ personalInfo.fraction }}积分</view>
			</view>
			<view v-else>
				<button open-type="getUserInfo" class="share btnBox flex-between" @getuserinfo="getUserInfo">
					<view class="flex-center gz fs-26">编辑资料</view>
					<view class="flex-center sx fs-26">签到</view>
				</button>
			</view>
		</view>
		<view class="info">
			<view class="fs-46 bold">{{ personalInfo.user_nick_name }}</view>
			<view class="fs-26 fc-9">{{ personalInfo.autograph }}</view>
		</view>
		<view v-if="isAuthorized" class="myNum flex fs-30">
			<view @click="goPage('/pages/mine/myCircle')">
				<text class="bold fs-40">{{ personalInfo.trailing }}</text>
				圈子
			</view>
			<!-- <view>
				<text class="bold fs-40">2</text>
				赞
			</view> -->
			<view @click="goPage('/pages/mine/followee')">
				<text class="bold fs-40">{{ personalInfo.user_track }}</text>
				关注
			</view>
			<view @click="goPage('/pages/mine/myFans')">
				<text class="bold fs-40">{{ personalInfo.user_fs }}</text>
				粉丝
			</view>
		</view>
		<button v-else open-type="getUserInfo" class="share myNum flex" @getuserinfo="getUserInfo" style="font-size: 30rpx;">
			<view>
				<text class="bold fs-40">{{ personalInfo.trailing }}</text>
				圈子
			</view>
			<view>
				<text class="bold fs-40">{{ personalInfo.user_track }}</text>
				关注
			</view>
			<view>
				<text class="bold fs-40">{{ personalInfo.user_fs }}</text>
				粉丝
			</view>
		</button>
		<view class="functionList flex">
			<view class="item" v-for="(item, index) in btnList" :key="index">
				<view v-if="isAuthorized" @click="goPage(item.url)">
					<view class="imgBox flex-center"><image :src="item.img" mode="widthFix"></image></view>
					<view class="fs-26">{{ item.name }}</view>
				</view>
				<view v-else>
					<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
						<view class="imgBox flex-center"><image :src="item.img" mode="widthFix"></image></view>
						<view class="fs-26">{{ item.name }}</view>
					</button>
				</view>
			</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			uid: uni.getStorageSync('userId'),
			personalInfo: '',
			isAuthorized: false, //授权否
			btnList: [
				{
					name: '我的圈子',
					img: '../../static/circle.png',
					url: '/pages/mine/creatCircle'
				},
				{
					name: '我的收藏',
					img: '../../static/collect.png',
					url: '/pages/mine/myCollect'
				},
				{
					name: '我的钱包',
					img: '../../static/wallet.png',
					url: '/pages/mine/wallet'
				},
				{
					name: '邀请好友',
					img: '../../static/share.png',
					url: '/pages/mine/invitation'
				},
				{
					name: '服务中心',
					img: '../../static/service.png',
					url: '/pages/mine/serve'
				},
				{
					name: '关于我们',
					img: '../../static/about.png',
					url: '/pages/mine/about'
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
	methods: {
		//签到
		signIn() {
			uni.requestSubscribeMessage({
				tmplIds: ['eouzl8p41dm6RqLnP1EJwn22CFomD67vIc8nXezyMI4'],
				success: res => {
					// console.log(res);
					this.request({
						url: this.apiUrl + 'User/add_user_punch',
						data: {
							token: uni.getStorageSync('token'),
							openid: uni.getStorageSync('openid'),
							uid: uni.getStorageSync('userId')
						},
						success: res => {
							console.log('签到:', res);
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							setTimeout(()=>{
								this.getPersonalInfo();
							},1500);
						}
					});
				}
			});
		},
		//获取用户信息
		getPersonalInfo() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_user_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid')
				},
				success: res => {
					this.$refs.loading.close();
					// console.log('获取用户信息:', res);
					this.personalInfo = res.data.info;
				}
			});
		},
		getUserInfo(e) {
			if (!e.detail.userInfo) return;
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
				this.getPersonalInfo();
			});
		},
		onShowFun(){
			this.isAuthorized = this.beAuthorized();
			if(this.isAuthorized)
				this.getPersonalInfo();
		}
	},
	mounted() {
		// console.log('mineCreated');
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		if(this.isAuthorized)
			this.getPersonalInfo();
	}
};
</script>

<style lang="scss">
@import '@/pages/personalCenter/personalCenter.scss';
.banner {
	.myPage {
		width: 194rpx;
		height: 54rpx;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 28rpx 0px 0px 28rpx;
		position: absolute;
		right: 0;
		top: calc(50% - 27rpx);
		image {
			width: 12rpx;
			height: auto;
			margin-left: 20rpx;
		}
	}
}
.page-mine {
	height: 100%;
	color: #fff;
	background-color: $themeColor;
	overflow-y: auto;
}
.functionList {
	flex-wrap: wrap;
	.item {
		padding: 50rpx 30rpx;
		text-align: center;
		.imgBox {
			width: 120rpx;
			height: 110rpx;
			background: rgba(35, 32, 51, 1);
			border-radius: 46rpx;
			image {
				width: 60rpx;
				height: auto;
			}
		}
		.fs-26 {
			color: rgba(255, 255, 255, 0.5);
			padding-top: 24rpx;
		}
	}
}
</style>
