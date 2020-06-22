<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="我的收藏" haveHeight></navigationBar>
		<view>
			<view class="fans flex-between" v-for="(item,index) in list" :key="index">
				<view class="flex align-star" @click="goPage('/pages/articleDetails/articleDetails?id=' + item.id)">
					<image class="header" :src="item.image_part[0]" mode="aspectFill"></image>
					<view>
						<view class="fs-28 bold">{{item.user_nick_name}}</view>
						<view class="fs-24 fc-9">{{item.study_content}}</view>
					</view>
				</view>
			</view>
			<view v-if="list.length==0" style="text-align: center; padding-top: 400rpx; color: #999;">暂无数据</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				page:1,
				list:[]
			}
		},
		methods:{
			getCollect(isFirstPage){
				if(isFirstPage==true){
					this.page = 1;
					this.list = [];
				}
				this.$refs.loading.open();
				this.request({
					url: this.apiUrl + 'User/get_user_collection',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						page:this.page
					},
					success: res => {
						console.log("关注:",res);
						this.$refs.loading.close();
						if(res.data.info.length==0&&this.page>1){
							uni.showToast({
								title:'没有更多了',
								icon:'none'
							})
						}
						this.page++;
						this.list = this.list.concat(res.data.info);
					},
				});
			}
		},
		onLoad() {
			this.getCollect(true);
		},
		onReachBottom() {
			this.getCollect();
		}
	}
</script>

<style lang="scss">
@import './myCircle.scss';
</style>
