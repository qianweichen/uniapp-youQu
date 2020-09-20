<template>
	<view class="dark-bg page-chooseCircle">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="发布到" haveHeight></navigationBar>
		<view class="list">
			<view class="item flex-between" v-for="(item, index) in list" :key="index" @click="choose(item)">
				<view class="flex">
					<image class="header circle" :src="item.realm_icon" mode="aspectFill"></image>
					<view>
						<view class="fs-30">{{ item.realm_name }}</view>
						<view class="flex fs-24">
							<view>{{ item.concern }}人加入</view>
							<view>{{ item.is_paper_count }}条内容</view>
						</view>
					</view>
				</view>
				<!-- <image v-if="item.checked" class="yes" src="../../static/yes.png" mode="widthFix"></image> -->
			</view>
			<view v-if="list.length == 0" style="text-align: center; padding: 200rpx 0;">您还没加入任何圈子，请先加入</view>
			<view>
				<!-- 为我推荐 -->
				<view class="myCircle recommend">
					<view class="title flex-between">
						<view class="left flex">
							<image src="../../static/good-c.png" mode="widthFix"></image>
							<text class="fs-32">为我推荐</text>
						</view>
						<view class="right flex-center" @click="getRecommendCircle(true, 1)">
							<image src="../../static/refresh.png" mode="widthFix"></image>
							<text class="fs-22">换一批</text>
						</view>
					</view>
					<view class="recommend-bubble" :animation="animationData">
						<view
							v-if="index < 8"
							@click="goPage('/pagesA/circle/circle?id=' + item.id)"
							class="bubble"
							:class="'bubble' + (index + 1)"
							v-for="(item, index) in recommendList"
							:key="index"
						>
							<image :src="item.realm_icon" mode="aspectFill"></image>
							<view class="bubble1-title fc-f flex-center">
								<view>{{ item.realm_name }}</view>
							</view>
						</view>
					</view>
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
			list: [],
			page: 1,
			recommendList: [],
			recommendPage: 1,
			animationData: ''
		};
	},
	methods: {
		getRecommendCircle(isFirstPage, change = 0) {
			//change切换传1
			return new Promise((resolve, reject) => {
				// 动画
				var animation = uni.createAnimation({
					duration: 200,
					timingFunction: 'ease'
				});
				animation
					.translate(80)
					.opacity(0)
					.step();
				this.animationData = animation.export();
				setTimeout(() => {
					var animation = uni.createAnimation({
						duration: 500,
						timingFunction: 'ease'
					});
					animation
						.translate(0)
						.opacity(1)
						.step();
					this.animationData = animation.export();
				}, 500);

				if (isFirstPage == true) {
					this.recommendPage = 1;
				}
				this.request({
					url: this.apiUrl + 'User/get_tj_list',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						change,
						page: this.recommendPage
					},
					success: res => {
						// console.log("推荐圈子:", res);
						this.recommendPage++;
						this.recommendList = res.data.info;
						resolve();
					}
				});
			});
		},
		choose(data) {
			//修改上一个页面的发布圈子信息
			var pages = getCurrentPages();
			var page = pages[pages.length - 2];
			page.$vm.chooseCirce = data;

			this.goBack();
		},
		//获取所有圈子
		getCircle(isFirstPage) {
			if (isFirstPage) {
				this.page = 1;
				this.list = [];
			}
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_right_needle',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					get_id: -1,
					page: this.page
				},
				success: res => {
					this.$refs.loading.close();
					console.log('获取所有圈子:', res);
					if (this.page > 1 && res.data.info.length == 0) {
						uni.showToast({
							title: '没有更多了',
							icon: 'none'
						});
					}
					this.page++;
					this.list = this.list.concat(res.data.info);
				}
			});
		}
	},
	onShow() {
		this.getCircle(true);
		this.getRecommendCircle(true);
	},
	onReachBottom() {
		this.getCircle();
	}
};
</script>

<style lang="scss">
.page-chooseCircle {
	padding: 0 30rpx;
	.list {
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
