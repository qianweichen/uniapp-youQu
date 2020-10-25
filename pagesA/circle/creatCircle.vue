<template>
	<view class="page-creatCircle dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="创建圈子" haveHeight></navigationBar>
		<view class="banner" @click="chooseImg(1)">
			<image :src="circleInfo.bg || '../../static/logo.png'" mode="aspectFill"></image>
			<view class="mask"></view>
			<view class="change fs-26 fc-f">点击修改背景图片</view>
		</view>
		<view class="infoList">
			<view class="infoItem flex-between">
				<view class="fc-9">圈子头像</view>
				<view class="flex" @click="chooseImg(2)">
					<image class="header circle" :src="circleInfo.header || '../../static/logo.png'" mode="aspectFill"></image>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="infoItem flex-between" @click="goPage('/pagesA/circle/creatCircle-S')">
				<view class="fc-9">圈子名称</view>
				<view class="flex">
					<view>{{ circleInfo.name || '请填写' }}</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="infoItem flex-between" @click="goPage('/pagesA/circle/creatCircle-L?type=1')">
				<view class="fc-9">圈子简介</view>
				<view class="flex">
					<view class="infoBox">{{ circleInfo.intro || '请填写' }}</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="infoItem flex-between" @click="isPiazzaShow = true;">
				<view class="fc-9">所属广场</view>
				<view class="flex">
					<view class="infoBox">{{ circleInfo.needle_id2.name || '请选择' }}</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="infoItem flex-between" @click="goPage('/pagesA/circle/creatCircle-L?type=2')">
				<view class="fc-9">申请原因</view>
				<view class="flex">
					<view class="infoBox">{{ circleInfo.reason || '请填写申请原因' }}</view>
					<image class="right" src="../../static/right-9.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="infoItem flex-between">
				<view class="fc-9">私密圈子</view>
				<switch :checked="circleInfo.jurisdiction" color="#7364BD" @change="switchChange" />
			</view>
		</view>
		<view class="tip fc-9 fs-26 flex-center">说明：只有加入圈子的人才能看见圈子里发布的内容，加入圈子，需要通过圈子管理员审核。私密圈子需要邀请码才能加入</view>
		<view class="btn-big fs-32 flex-center" @click="submit">提交申请</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
		
		<!-- 广场弹出 -->
		<view>
			<view v-if="isPiazzaShow" class="mask" style="z-index: 2;" @click="isPiazzaShow = false"></view>
			<view @click.stop="" class="piazza" :style="'height: ' + (isPiazzaShow ? '80%' : '0') + ';'">
				<view class="line"></view>
				<view class="title">选择标签</view>
				<view class="list flex">
					<view class="item flex-center" :class="{ active: item.checked }" v-for="(item, index) in piazzaList" :key="index" v-if="item.id != 11" @click="choose(item)">
						{{ item.name }}
					</view>
				</view>
				<image @click="isPiazzaShow = false;" class="close" src="../../static/close-f.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			circleInfo: {
				header: '',
				bg: '',
				name: '',
				intro: '',
				reason: '',
				jurisdiction: false,
				needle_id2: ''
			},
			piazzaList: [], //广场列表
			isPiazzaShow: false
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
						this.circleInfo.bg = imgArr[0];
					} else {
						this.circleInfo.header = imgArr[0];
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
						success: res => {
							// console.log(JSON.parse(res.data));
							if (type == 1) {
								this.circleInfo.bg = JSON.parse(res.data).url;
							} else {
								this.circleInfo.header = JSON.parse(res.data).url;
							}
						}
					});
				}
			});
		},
		switchChange(e) {
			this.circleInfo.jurisdiction = e.detail.value;
		},
		submit() {
			if (!this.circleInfo.bg) {
				uni.showToast({
					title: '请选择背景',
					icon: 'none'
				});
				return;
			}
			if (!this.circleInfo.header) {
				uni.showToast({
					title: '请选择头像',
					icon: 'none'
				});
				return;
			}
			if (!this.circleInfo.name) {
				uni.showToast({
					title: '请输入名称',
					icon: 'none'
				});
				return;
			}
			if (!this.circleInfo.intro) {
				uni.showToast({
					title: '请输入简介',
					icon: 'none'
				});
				return;
			}
			if (!this.circleInfo.needle_id2) {
				uni.showToast({
					title: '请选择广场',
					icon: 'none'
				});
				return;
			}
			if (!this.circleInfo.reason) {
				uni.showToast({
					title: '请输入原因',
					icon: 'none'
				});
				return;
			}
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/add_territory_petition',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					needle_id: 1,
					realm_icon: this.circleInfo.header, //头像
					realm_bg: this.circleInfo.bg, //背景
					is_gnaw_qulord: 1, //圈主： 0不是  1是
					attention: this.circleInfo.jurisdiction ? 1 : 0, //是否开放	0开放	1关闭
					realm_name: this.circleInfo.name, //圈子名字
					realm_synopsis: this.circleInfo.intro, //简介
					solicit_origin: this.circleInfo.reason, //原因
					needle_id2: this.circleInfo.needle_id2.id	//广场
				},
				success: res => {
					this.$refs.loading.close();
					// console.log("提交:",res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					setTimeout(() => {
						this.goBack();
					}, 1500);
				}
			});
		},
		choose(data) {
			this.piazzaList.forEach(item => {
				item.checked = false;
			});
			data.checked = true;
			this.$set(this.circleInfo, 'needle_id2', data);
		},
		//获取所有广场
		getPiazza(isFirstPage) {
			if (isFirstPage) {
				this.page = 1;
				this.piazzaList = [];
			}
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_all_needles',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId')
				},
				success: res => {
					this.$refs.loading.close();
					console.log('获取所有广场:', res);
					res.data.info.forEach(item => {
						item.checked = false;
					});
					this.piazzaList = res.data.info;
				}
			});
		}
	},
	onLoad() {
		this.getPiazza();
	}
};
</script>

<style lang="scss">
.page-creatCircle {
	padding-bottom: 60rpx;

.piazza {
	width: 100%;
	height: 80%;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 2;
	background-color: $ornamentColor;
	border-radius: 30rpx 30rpx 0 0;
	transition: all ease 0.6s;
	.close{
		position: absolute;
		right: 30rpx;
		top: 30rpx;
		width: 50rpx;
		height: auto;
	}
	.line {
		width: 200rpx;
		height: 10rpx;
		border-radius: 10rpx;
		background-color: #eee;
		margin: 20rpx auto;
	}
	.title {
		color: #fff;
		padding: 0 30rpx;
	}
	.list {
		padding: 30rpx;
		flex-wrap: wrap;
		.item {
			width: 156rpx;
			height: 60rpx;
			background-color: #eee;
			color: #333;
			font-size: 26rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			border-radius: 6rpx;
			&.active {
				background-color: #7464be;
				color: #fff;
			}
			&:nth-child(4n) {
				margin-right: 0;
			}
		}
	}
}
	.banner {
		position: relative;
		height: 500rpx;
		image {
			width: 100%;
			height: 100%;
		}
		.change {
			width: 220rpx;
			position: absolute;
			bottom: 40rpx;
			left: calc(50% - 110rpx);
			text-align: center;
		}
		.mask {
			position: absolute;
			background-color: rgba(0, 0, 0, 0.1);
		}
	}
	.infoList {
		padding: 0 30rpx;
		.infoItem {
			padding-top: 60rpx;
			.header {
				width: 100rpx;
				height: 100rpx;
			}
			.right {
				width: 20rpx;
				height: auto;
				margin-left: 30rpx;
			}
			.infoBox {
				text-align: right;
				width: 230rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	.tip {
		width: 690rpx;
		margin: 60rpx auto;
		padding: 0 30rpx;
		box-sizing: border-box;
		height: 132rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8rpx;
	}
}
</style>
