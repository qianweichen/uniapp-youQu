<template>
	<view class="page-editInfo dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="编辑资料" haveHeight></navigationBar>
		<view class="bannerBox" @click="chooseImg(1)">
			<image :src="bg" mode="aspectFill"></image>
			<view class="mask"></view>
			<view class="change fs-26">点击修改背景图片</view>
		</view>
		<view class="list">
			<view class="item flex-between" @click="chooseImg(2)">
				<view>头像</view>
				<view class="flex"><image class="header circle" :src="img" mode="aspectFill"></image></view>
			</view>
			<view class="item flex-between">
				<view>昵称</view>
				<view class="flex"><input type="text" placeholder="请填写" maxlength="10" placeholder-class="fc-9" v-model="nick_name" /></view>
			</view>
			<view class="item flex-between">
				<view>性别</view>
				<view class="flex fs-26">
					<picker mode="selector" @change="bindSexChange" :value="sexIndex" :range="sexArray">
						<view v-if="sexIndex == -1" class="fc-9">请选择</view>
						<view v-else class="uni-input">{{ sexArray[sexIndex] }}</view>
					</picker>
				</view>
			</view>
			<view class="item flex-between align-star">
				<view>个人签名</view>
				<view class="flex align-star"><textarea class="fs-26" placeholder="请填写" maxlength="50" placeholder-class="fc-9" v-model="autograph" /></view>
			</view>
		</view>
		<view class="btn-big flex-center fs-32" @click="submit">保存</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bg: '', //背景
			img: '', //头像
			nick_name: '', //昵称
			autograph: '', //个签
			sexIndex: -1,
			sexArray: ['男', '女']
		};
	},
	methods: {
		chooseImg(type) {
			//type:1背景 2头像
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: res => {
					var imgArr = res.tempFilePaths;
					if (type == 1) {
						this.bg = imgArr[0];
					} else {
						this.img = imgArr[0];
					}
					this.uploadFile({
						url: this.apiUrl + 'User/img_upload',
						filePath: imgArr[0],
						name: 'sngpic',
						formData: {
							token: uni.getStorageSync('token'),
							openid: uni.getStorageSync('openid')
						},
						header: {
							'Content-Type': 'multipart/form-data'
						},
						success:(res)=>{
							// console.log(JSON.parse(res.data));
							if (type == 1) {
								this.bg = JSON.parse(res.data).url;
							} else {
								this.img = JSON.parse(res.data).url;
							}
						}
					});
				}
			});
		},
		bindSexChange(e) {
			this.sexIndex = e.detail.value;
		},
		submit() {
			uni.showLoading({
				title: '加载中'
			});
			Promise.all([this.updataInfo(), this.updataBg()]).then(res => {
				// console.log(res);
				uni.showToast({
					title: res[1].data.msg,
					icon:'none'
				});
				setTimeout(()=>{
					this.getPersonalInfo();
				},1500);
			});
		},
		updataInfo() {
			return new Promise((resolve, reject) => {
				this.request({
					url: this.apiUrl + 'User/edit_user_info',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						img: this.img, //头像
						nick_name: this.nick_name, //昵称
						autograph: this.autograph, //个签
						gender: Number(this.sexIndex) + 1 //男1  女2
					},
					success: res => {
						// console.log("提交信息:",res);
						resolve(res);
					}
				});
			});
		},
		updataBg() {
			return new Promise((resolve, reject) => {
				this.request({
					url: this.apiUrl + 'User/bg_img_update',
					method: 'POST',
					data: {
						uid: uni.getStorageSync('userId'),
						bg_img_url: this.bg
					},
					success: res => {
						// console.log("提交背景:",res);
						resolve(res);
					}
				});
			});
		},
		//获取用户信息
		getPersonalInfo() {
			uni.showLoading({
				title: '加载中'
			});
			this.request({
				url: this.apiUrl + 'User/get_user_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid')
				},
				success: res => {
					uni.hideLoading();
					console.log('获取用户信息:', res);
					this.img = res.data.info.user_head_sculpture;
					this.nick_name = res.data.info.user_nick_name;
					this.autograph = res.data.info.autograph;
					this.sexIndex = Number(res.data.info.gender) - 1;
					this.bg = res.data.info.bg_img;
				}
			});
		}
	},
	onLoad() {
		this.getPersonalInfo();
	}
};
</script>

<style lang="scss">
.page-editInfo {
	padding-bottom: 120rpx;
	.bannerBox {
		position: relative;
		height: 500rpx;
		image {
			width: 100%;
			height: 100%;
			display: block;
		}
		.mask {
			position: absolute;
			background-color: rgba(0, 0, 0, 0.2);
		}
		.change {
			position: absolute;
			bottom: 40rpx;
			left: calc(50% - 120rpx);
			width: 240rpx;
			text-align: center;
			z-index: 1;
		}
	}
	.list {
		padding: 0 30rpx;
		.item {
			padding-top: 60rpx;

			.header {
				width: 100rpx;
				height: 100rpx;
			}
			input {
				text-align: right;
				font-size: 26rpx;
			}
			textarea {
				width: 400rpx;
				height: 200rpx;
			}
			.right {
				width: 40rpx;
				height: auto;
				margin-left: 30rpx;
			}
		}
	}
	.btn-big {
		position: fixed;
		bottom: 60rpx;
		left: calc(50% - 345rpx);
		z-index: 2;
	}
}
</style>
