<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="我的粉丝" haveHeight></navigationBar>
		<view>
			<view class="fans flex-between" v-for="(item,index) in list" :key="index">
				<view class="flex align-star" @click="goPage('/pages/personalCenter/personalCenter?id=' + item.id)">
					<image class="header circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
					<view>
						<view class="fs-28 bold">{{item.user_nick_name}}</view>
						<view class="fs-24 fc-9">{{item.autograph||'这个人很懒，没有个性签名'}}</view>
						<!-- <view class="fs-24 fc-9">已有{{item}}人关注</view> -->
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
			getUserList(isFirstPage){
				if(isFirstPage==true){
					this.page = 1;
					this.list = [];
				}
				this.$refs.loading.open();
				this.request({
					url: this.apiUrl + 'User/get_follow_fansi',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						page:this.page,
						type:2
					},
					success: res => {
						this.$refs.loading.close();
						// console.log("关注的人:",res);
						if(res.data.info.length==0&&this.page>1){
							uni.showToast({
								title:'没有更多了',
								icon:'none'
							});
						}
						this.page++;
						this.list = this.list.concat(res.data.info);
					},
				});
			}
		},
		onLoad() {
			this.getUserList(true);
		},
		onReachBottom() {
			this.getUserList();
		}
	}
</script>

<style lang="scss">
@import './myCircle.scss';
</style>
