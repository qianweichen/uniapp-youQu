<template>
	<view class="dark-bg page-chooseCircle">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="发布到" haveHeight></navigationBar>
		<view class="list">
			<view class="item flex-between" v-for="(item,index) in list" :key="index" @click="choose(item)">
				<view class="flex">
					<image class="header circle" :src="item.realm_icon" mode="aspectFill"></image>
					<view>
						<view class="fs-30">{{item.realm_name}}</view>
						<view class="flex fs-24">
							<view>{{item.concern}}人加入</view>
							<view>{{item.is_paper_count}}条内容</view>
						</view>
					</view>
				</view>
				<!-- <image v-if="item.checked" class="yes" src="../../static/yes.png" mode="widthFix"></image> -->
			</view>
			<view v-if="list.length==0" style="text-align: center; padding-top: 400rpx;">您还没加入任何圈子，请先加入</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				list:[],
				page:1
			}
		},
		methods:{
			choose(data){
				//修改上一个页面的发布圈子信息
				var pages = getCurrentPages();
				var page = pages[pages.length - 2];
				page.$vm.chooseCirce = data;
				
				this.goBack();
			},
			//获取所有圈子
			getCircle(){
				uni.showLoading({
					title:'加载中'
				});
				this.request({
					url: this.apiUrl + 'User/get_right_needle',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						get_id:-1,
						page:this.page
					},
					success: res => {
						uni.hideLoading();
						console.log("获取所有圈子:",res);
						if (this.page > 1 && res.data.info.length == 0) {
							uni.showToast({
								title: '没有更多了',
								icon: 'none'
							})
						}
						this.page++;
						this.list = this.list.concat(res.data.info);
					},
				});
			},
		},
		onLoad() {
			this.getCircle();
		},
		onReachBottom() {
			this.getCircle();
		}
	}
</script>

<style lang="scss">
	.page-chooseCircle{
		padding: 0 30rpx;
		.list{
			.item{
				padding: 40rpx 0;
				border-bottom: 2rpx solid rgba(255,255,255,0.1);
				.header{
					width:114rpx;
					height:114rpx;
					margin-right: 30rpx;
				}
				.fs-24{
					color:rgba(255,255,255,0.6);
					padding-top: 20rpx;
					>view:first-child{
						padding-right: 40rpx;
					}
				}
				.yes{
					width: 50rpx;
					height: auto;
				}
			}
		}
	}
</style>
