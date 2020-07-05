<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="加入的圈子" haveHeight></navigationBar>
		<view>
			<view class="fans flex-between" v-for="(item,index) in list" :key="index">
				<view class="flex align-star" @click="goPage('/pagesA/circle/circle?id=' + item.id)">
					<image class="header circle" :src="item.realm_icon" mode="aspectFill"></image>
					<view>
						<view class="fs-28 bold">{{item.realm_name}}</view>
						<view class="fs-24 fc-9">已有{{item.concern}}人关注</view>
					</view>
				</view>
				<view class="fs-26">
					<view class="gz flex-center" @click="join(item.id)">退圈</view>
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
			join(id) {
				this.$refs.loading.open();
				this.request({
					url: this.apiUrl + 'User/set_user_trailing',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						tory_id: id,
						is_trailing: 1
					},
					success: res => {
						this.$refs.loading.close();
						// console.log("加入:",res);
						uni.showToast({
							title: res.data.msg
						});
						setTimeout(()=>{
							this.getMyCircle(true);
						},1500);
					},
				});
			},
			getMyCircle(isFirstPage){
				if(isFirstPage==true){
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
						get_id:-1,
						page:this.page
					},
					success: res => {
						// console.log("圈子:",res);
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
			this.getMyCircle(true);
		},
		onReachBottom() {
			this.getMyCircle();
		}
	}
</script>

<style lang="scss">
@import './myCircle.scss';
</style>
