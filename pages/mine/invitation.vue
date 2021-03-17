<template>
	<view class="page-invitation dark-bg">
		<backCapsule type="capsule"></backCapsule>
		<navigationBar name="推荐有礼"></navigationBar>
		<image class="bg" src="../../static/bg-tg.jpg" mode="widthFix"></image>
		<view class="content">
			<view v-if="isAuthorized">
				<view class="fs-40 bold title">我的邀请码</view>
				<view class="code flex-center">{{ code }}</view>
			</view>
			<view class="input-group">
				<view class="fs-22">
					<view>邀请好友输入邀请码后，</view>
					<view>
						您和好友最高得
						<span>200</span>
						积分奖励，
					</view>
					<view>
						<span>10</span>
						积分 =
						<span>0.1</span>
						元，
					</view>
					<view>邀请无上限，邀请越多赚的越多。</view>
				</view>
				<input class="input fs-26" type="text" placeholder="输入好友验证码" placeholder-class="fc-a" v-model="friendCode" />
			</view>
			<!-- <view class="fc-a fs-22 tip">输入朋友邀请码，朋友和你都能获得积分奖励</view> -->
			<view v-if="isAuthorized" class="flex-center btnBox">
				<view class="flex-center" @click="checkFriendCode">提交</view>
				<view class="flex-center sc" @click="makePic">生成海报</view>
			</view>
			<button v-else class="share" @click="getUserInfo">
				<view class="flex-center btnBox">
					<view class="flex-center">提交</view>
					<view class="flex-center sc">生成海报</view>
				</view>
			</button>
		</view>
		<view class="my-friend">
			<view class="fs-40 bold title">我邀请的好友</view>
			<view v-if="invitationList.length > 0" class="people-list flex">
				<view v-for="(item, index) in invitationList" :key="index">
					<image class="header" :src="item.user_head_sculpture" mode="aspectFill"></image>
					<view class="fs-22 fc-6">{{ item.user_nick_name }}</view>
				</view>
			</view>
			<view class="no-people fs-24" v-else>暂无邀请的好友，快来邀请赚赏金吧！</view>
		</view>
		<!-- 海报 -->
		<view v-if="showBannerFlag">
			<view class="mask"></view>
			<view class="bannerBox flex-center">
				<view>
					<view class="imgBox">
						<view class="modal-content" id="canvas-container" style="padding:0px; width:100%; height: 100%;">
							<canvas canvas-id="myCanvas" style="width:100%; background-color:#ffffff; height:100%;"></canvas>
						</view>

						<image @click="toggleBannerFlag(false)" class="close" src="../../static/close-f.png" mode="widthFix"></image>
					</view>
					<view class="btn-big fc-f flex-center" @click="saveBanner">保存图片</view>
					<view class="btn-big fc-f flex-center" style="margin-top: 20rpx;" @click="toggleBannerFlag(false)">关闭</view>
				</view>
			</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
// 在页面中定义插屏广告
let interstitialAd = null;
export default {
	data() {
		return {
			showBannerFlag: false,
			code: '',
			friendCode: '',
			isAuthorized: false, //授权否
			invitationList: []
		};
	},
	methods: {
		getInvitationList() {
			this.request({
				url: this.apiUrl + 'user/invitation_list',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId')
				},
				success: res => {
					// console.log('下级列表:', res);
					this.invitationList = res.data.data;
				}
			});
		},
		saveBanner() {
			uni.showLoading({
				title: '加载中'
			});
			uni.canvasToTempFilePath({
				canvasId: 'myCanvas',
				success: function(res) {
					uni.hideLoading();
					var tempFilePath = res.tempFilePath;
					uni.saveImageToPhotosAlbum({
						filePath: tempFilePath,
						success(res) {
							uni.showModal({
								content: '图片已保存到相册，赶紧晒一下吧~',
								showCancel: false,
								confirmText: '好的',
								confirmColor: '#333',
								success: function(res) {
									if (res.confirm) {
									}
								},
								fail: function(res) {}
							});
						},
						fail: function(res) {
							// console.log(res);
							if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
								uni.showModal({
									content: '检测到您未打开微信保存图片到相册，开启后即可保存图片',
									confirmText: '去开启',
									success(res) {
										if (res.confirm) {
											uni.openSetting({
												success(res) {}
											});
										} else if (res.cancel) {
										}
									}
								});
							}
						}
					});
				},
				fail: function(err) {
					// console.log(err);
				}
			});
		},
		makePic() {
			this.toggleBannerFlag(true);
			uni.showLoading({
				title: '获取二维码'
			});
			Promise.all([this.getAvater(), this.getQrCode()]).then(res => {
				// console.log(res);
				this.sharePosteCanvas(res[0], res[1]);
			});
		},
		sharePosteCanvas(avaterSrc, codeSrc) {
			uni.showLoading({
				title: '生成中...',
				mask: true
			});
			var that = this;
			var cardInfo = uni.getStorageSync('userInfo'); //需要绘制的数据集合
			const ctx = uni.createCanvasContext('myCanvas', that);
			var width = '';
			uni.createSelectorQuery()
				.select('#canvas-container')
				.boundingClientRect(rect => {
					var height = rect.height;
					var right = rect.right;
					width = rect.width;
					var left = rect.left;
					ctx.save();
					ctx.setFillStyle('#FFE200');
					ctx.fillRect(0, 0, width, height);
					//上半部分
					var path2 = '/static/shareTop.png';
					ctx.drawImage(path2, 0, 0, width, 150);

					//头像
					ctx.beginPath();
					ctx.fill();
					var avatarurl_width = 50; //绘制的头像宽度
					var avatarurl_heigth = 50; //绘制的头像高度
					var avatarurl_x = width / 2 - 25;
					var avatarurl_y = 160;
					//先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
					ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
					ctx.clip();
					ctx.drawImage(avaterSrc, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); // 推进去图片，必须是https图片
					//昵称
					ctx.restore();
					ctx.setFontSize(20);
					ctx.setFillStyle('#000');
					ctx.fillText(cardInfo.nickName, (width - ctx.measureText(cardInfo.nickName).width) / 2, avatarurl_y + 75);
					//说明
					ctx.setFontSize(11);
					ctx.setFillStyle('#000');
					ctx.fillText('邀你一起赚赏金', (width - ctx.measureText('邀你一起赚赏金').width) / 2, avatarurl_y + 100);
					//验证码背景
					var path3 = '/static/shareCodeBg.png';
					ctx.drawImage(path3, width / 2 - 115, avatarurl_y + 130, 230, 60);
					//验证码
					ctx.setFontSize(35);
					ctx.setFillStyle('#FFE200');
					ctx.fillText(this.code, (width - ctx.measureText(this.code).width) / 2, avatarurl_y + 165);
					//说明
					var path4 = '/static/shareTextBg.png';
					ctx.drawImage(path4, width / 2 - 125, avatarurl_y + 230, 130, 70);
					//验证码
					ctx.setFontSize(10);
					ctx.setFillStyle('#000000');
					ctx.fillText('进入小程序输入朋友的邀', width / 2 - 120, avatarurl_y + 250);
					ctx.fillText('请码，各自都会获得赏金', width / 2 - 120, avatarurl_y + 265);
					ctx.fillText('哦~', width / 2 - 120, avatarurl_y + 280);
					//二维码
					ctx.drawImage(codeSrc, width - 120, avatarurl_y + 200, 80, 80);
					//长按
					var path5 = '/static/shareTip.png';
					ctx.drawImage(path5, width - 120, avatarurl_y + 280, 80, 22);
				})
				.exec();
			setTimeout(function() {
				ctx.draw();
				uni.hideLoading();
			}, 500);
		},
		getQrCode() {
			return new Promise((resolve, reject) => {
				this.request({
					url: this.apiUrl + 'User/qrcode_code',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: this.code
					},
					success: res => {
						// console.log('二维码:', res);
						uni.getImageInfo({
							src: res.data.data.url,
							success: res => {
								resolve(res.path);
							}
						});
					}
				});
			});
		},
		getAvater() {
			return new Promise((resolve, reject) => {
				uni.getImageInfo({
					src: uni.getStorageSync('userInfo').avatarUrl,
					success: res => {
						resolve(res.path);
					}
				});
			});
		},
		toggleBannerFlag(flag) {
			this.showBannerFlag = flag;
		},
		getCode() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/ger_user_code',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId')
				},
				success: res => {
					// console.log("邀请码:",res);
					this.$refs.loading.close();
					this.code = res.data;
				}
			});
		},
		checkFriendCode() {
			if (!this.friendCode) {
				uni.showToast({
					title: '验证码不能为空',
					icon: 'none'
				});
				return;
			}
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/add_user_invitation',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					yzm_text: this.friendCode
				},
				success: res => {
					// console.log('绑定:', res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.$refs.loading.close();
				}
			});
		},
		getUserInfo(e) {
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
				this.getCode();
			});
		}
	},
	onLoad(options) {
		if (options.scene) {
			this.friendCode = options.scene;
		}
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();

		this.getCode();
		this.getInvitationList();

		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-f4669b91d9da4f72' });
			interstitialAd.onLoad(() => {});
			interstitialAd.onError(err => {});
			interstitialAd.onClose(() => {});
		}
		// 在适合的场景显示插屏广告
		if (interstitialAd) {
			interstitialAd.show().catch(err => {
				console.error(err);
			});
		}
	}
};
</script>

<style lang="scss">
.page-invitation {
	text-align: center;
	color: #2e2929;
	background-color: #f6551e;
	.bg {
		position: fixed;
		left: 0;
		top: 0;
		z-index: -1;
		width: 100%;
		height: auto;
	}
	.my-friend {
		background-color: #fff;
		width: 690rpx;
		margin: 40rpx auto;
		box-shadow: 0 10rpx 70rpx 0 rgba(227, 50, 5, 0.74);
		border-radius: 8rpx;
		padding: 79rpx 34rpx 62rpx;
		box-sizing: border-box;
		.people-list {
			padding-top: 59rpx;
			display: -webkit-box;
			overflow-x: scroll;
			-webkit-overflow-scrolling: touch;
			.header {
				width: 90rpx;
				height: 82rpx;
				border-radius: 50%;
			}
		}
		.no-people {
			text-align: center;
			padding-top: 59rpx;
		}
	}
	.content {
		width: 690rpx;
		background: #fff;
		box-shadow: 0 10rpx 70rpx 0 rgba(227, 50, 5, 0.74);
		border-radius: 8rpx;
		padding: 80rpx 0;
		margin: 0 auto;
		margin-top: 600rpx;
		.input-group {
			width: 552rpx;
			background: rgba(254, 238, 232, 1);
			border-radius: 8rpx;
			margin: 0 auto;
			color: #666;
			line-height: 34rpx;
			padding: 40rpx 70rpx;
			box-sizing: border-box;
			margin-top: 70rpx;
			span {
				color: #f6551e;
				font-size: 28rpx;
				font-weight: bold;
				padding: 0 10rpx;
			}
			.input {
				width: 290rpx;
				height: 68rpx;
				margin: 0 auto;
				background: #fff;
				border-radius: 34rpx;
				margin-top: 36rpx;
			}
		}
		.title {
			padding-bottom: 30rpx;
		}
		.code {
			width: 330rpx;
			height: 108rpx;
			margin: 0 auto;
			background: rgba(238, 238, 238, 1);
			box-shadow: 0px 10rpx 10rpx 0px rgba(227, 50, 5, 0.68);
			border-radius: 54rpx;
			font-size: 60rpx;
			color: #f6551e;
		}
		.tip {
			padding-top: 20rpx;
		}
		.btnBox {
			padding-top: 80rpx;
			view {
				width: 260rpx;
				height: 66rpx;
				background: #f6551e;
				border-radius: 34rpx;
				color: #fff;
			}
			.sc {
				background-color: #5d1dbe;
				margin-left: 30rpx;
			}
		}
	}
	.bannerBox {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		.imgBox {
			width: 650rpx;
			height: 990rpx;
			border-radius: 8rpx;
			position: relative;
			.close {
				width: 40rpx;
				height: auto;
				position: absolute;
				right: 20rpx;
				top: 20rpx;
			}
		}
		.btn-big {
			width: 650rpx;
			margin-top: 60rpx;
		}
	}
}
</style>
