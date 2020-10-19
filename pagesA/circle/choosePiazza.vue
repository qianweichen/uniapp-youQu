<template>
	<view class="dark-bg page-chooseCircle">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="选择广场" haveHeight></navigationBar>
		<view class="list">
			<view class="item flex-between" v-for="(item, index) in list" :key="index" @click="choose(item)">
				<view class="flex">
					<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
					<view>
						<view class="fs-30">{{ item.name }}</view>
						<view class="flex fs-24">
							<view>{{ item.keyword }}</view>
						</view>
					</view>
				</view>
				<image v-if="item.checked" class="yes" src="../../static/yes.png" mode="widthFix"></image>
			</view>
			<view v-if="list.length == 0" style="text-align: center; padding: 200rpx 0;">暂无广场</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	methods: {
		choose(data) {
			//修改上一个页面的发布广场信息
			var pages = getCurrentPages();
			var page = pages[pages.length - 2];
			this.$set(page.$vm.circleInfo, 'needle_id2', data);
			this.goBack();
		},
		//获取所有广场
		getPiazza(isFirstPage) {
			if (isFirstPage) {
				this.page = 1;
				this.list = [];
			}
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_all_needles',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
				},
				success: res => {
					this.$refs.loading.close();
					console.log('获取所有广场:', res);
					res.data.info.forEach(item=>{
						item.checked = false;
					});
					this.list = res.data.info;
				}
			});
		}
	},
	onShow() {
		this.getPiazza(true);
	}
};
</script>

<style lang="scss">
.page-chooseCircle {
	padding: 0 30rpx;
	.btn-big{
		position: fixed;
		bottom: 20rpx;
		left: calc(50% - 345rpx);
	}
	.list {
		padding-bottom: 140rpx;
		.item {
			padding: 40rpx 0;
			border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
			.header {
				width: 114rpx;
				height: 114rpx;
				margin-right: 30rpx;
			}
			.fs-24 {
				color: rgba(255, 255, 255, 0.6);
				padding-top: 20rpx;
				> view:first-child {
					padding-right: 40rpx;
				}
			}
			.yes {
				width: 50rpx;
				height: auto;
			}
		}
	}
}
.myCircle {
	.title {
		padding: 40rpx 30rpx;
		.left {
			image {
				width: 44rpx;
				height: auto;
				margin-right: 17rpx;
			}
		}
		.right {
			width: 210rpx;
			height: 54rpx;
			border: 1px solid rgba(188, 188, 192, 1);
			border-radius: 28rpx;
			image {
				width: 22rpx;
				height: auto;
				margin-right: 17rpx;
			}
		}
	}
	.list {
		box-sizing: border-box;
		padding-left: 30rpx;
		white-space: nowrap;
		.item {
			display: inline-block;
			margin-right: 10rpx;
			box-sizing: border-box;
			text-align: center;
			width: 220rpx;
			height: 380rpx;
			background: $ornamentColor;
			border-radius: 8rpx;
			padding: 30rpx 21rpx;
			.headerBox {
				width: 128rpx;
				height: 128rpx;
				border: 2rpx solid #fff;
				margin: 0 auto;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.join {
				margin: 0 auto;
				margin-top: 27rpx;
				width: 134rpx;
				height: 46rpx;
				border: 2rpx solid rgba(134, 133, 141, 1);
				border-radius: 24rpx;
			}
			.bold {
				padding: 14rpx 0;
			}
			.fs-20 {
				height: 60rpx;
				white-space: normal;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.name {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			&.item-new {
				width: unset;
				height: auto;
				background-color: unset;
				padding: 0 27rpx 0 0;
				.name {
					color: #a9a9ae;
					padding-top: 16rpx;
				}
			}
		}
	}
}
.recommend {
	.title {
		.right {
			width: 180rpx;
			height: 54rpx;
		}
	}
	.recommend-bubble {
		position: relative;
		width: 667rpx;
		height: 476rpx;
		margin: 0 auto;
		.bubble {
			border-radius: 50%;
			overflow: hidden;
			position: absolute;
			image {
				width: 100%;
				height: 100%;
				display: block;
			}
			.bubble1-title {
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.5);
				position: absolute;
				left: 0;
				top: 0;
				view {
					text-align: center;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}
		.bubble1 {
			width: 196rpx;
			height: 196rpx;
			top: 21rpx;
			left: 0;
			.bubble1-title {
				view {
					width: 118rpx;
					font-size: 30rpx;
				}
			}
		}
		.bubble2 {
			width: 120rpx;
			height: 120rpx;
			top: 0;
			left: 232rpx;
			.bubble1-title {
				view {
					width: 55rpx;
					font-size: 26rpx;
				}
			}
		}
		.bubble3 {
			width: 172rpx;
			height: 172rpx;
			top: 0;
			left: 392rpx;
			.bubble1-title {
				view {
					width: 118rpx;
					font-size: 30rpx;
				}
			}
		}
		.bubble4 {
			width: 220rpx;
			height: 220rpx;
			top: 128rpx;
			left: 192rpx;
			.bubble1-title {
				view {
					width: 167rpx;
					font-size: 34rpx;
				}
			}
		}
		.bubble5 {
			width: 156rpx;
			height: 156rpx;
			top: 255rpx;
			left: 29rpx;
			.bubble1-title {
				view {
					width: 87rpx;
					font-size: 30rpx;
				}
			}
		}
		.bubble6 {
			width: 120rpx;
			height: 120rpx;
			top: 362rpx;
			left: 219rpx;
			.bubble1-title {
				view {
					width: 55rpx;
					font-size: 26rpx;
				}
			}
		}
		.bubble7 {
			width: 134rpx;
			height: 134rpx;
			top: 323rpx;
			left: 353rpx;
			.bubble1-title {
				view {
					width: 79rpx;
					font-size: 30rpx;
				}
			}
		}
		.bubble8 {
			width: 194rpx;
			height: 194rpx;
			top: 182rpx;
			left: 474rpx;
			.bubble1-title {
				view {
					width: 117rpx;
					font-size: 30rpx;
				}
			}
		}
	}
	.recommend-list {
		margin-top: 50rpx;
		padding: 40rpx 30rpx;
		border-top: 20rpx solid rgba(238, 238, 238, 0.1);
		border-bottom: 20rpx solid rgba(238, 238, 238, 0.1);
		.item {
			.header {
				width: 50px;
				height: 50px;
				// border: 2rpx solid #fff;
				margin-right: 20rpx;
			}
			.join {
				width: 160rpx;
				height: 60rpx;
				background: #7464be;
				border-radius: 8rpx;
			}
			.attention {
				width: 40rpx;
				height: 40rpx;
				font-size: 22rpx;
				background-color: #7364bd;
				color: #fff;
				border-radius: 8rpx;
				margin-left: 20rpx;
			}
			.synopsis {
				color: #9a989e;
				padding-top: 10rpx;
				width: 410rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.list {
				box-sizing: border-box;
				white-space: nowrap;
				padding-left: 0;
				.video-item {
					position: relative;
					display: inline-block;
					margin: 40rpx 16rpx 40rpx 0;
					width: 280rpx;
					height: 370rpx;
					border-radius: 8rpx;
					overflow: hidden;
					.poster {
						width: 100%;
						height: 100%;
					}
					.info {
						width: 100%;
						font-size: 22rpx;
						position: absolute;
						left: 0;
						bottom: 0;
						padding: 14rpx;
						box-sizing: border-box;
						image {
							width: 35rpx;
							height: auto;
						}
					}
				}
			}
		}
	}
}
</style>
