<template>
	<view class="page-msg dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="系统通知" haveHeight></navigationBar>
		<view class="symNote" v-for="(item, index) in 3" :key="index">
			<view class="time fs-22 fc-9">下午 17:30</view>
			<view class="flex align-star">
				<image class="pic" src="../../static/msg-lb.png" mode="aspectFill"></image>
				<view class="infoBox">
					<view class="fs-30 bold">您的圈子消息</view>
					<view class="userBox flex">
						<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
						<view class="fs-26">大圆子</view>
					</view>
					<view class="cont fs-26">
						申请了
						<text>喵星人研究协会</text>
						的
						<text>管理员</text>
						身份
					</view>
					<view class="symNote-btnBox flex fs-24">
						<view class="flex-center">拒绝</view>
						<view class="flex-center agree">同意</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			page: 1,
			title: '',
			type: ''
		};
	},
	methods: {
		//获取消息
		getMsg() {
			uni.showLoading({
				title: '加载中'
			});
			this.request({
				url: this.apiUrl + 'User/get_user_smail',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					// page: this.page,
					// type: this.type //类型  1点赞 2评论 3关注	不传 或者传其它的 默认全部
				},
				success: res => {
					console.log('获取消息:', res);
					uni.hideLoading();
					if (this.page > 1 && res.data.data.length == 0) {
						uni.showToast({
							title: '没有更多了',
							icon: 'none'
						});
					}
					// this.page++;
					// for (var i = 0; i < res.data.data.length; i++) {
					// 	if (res.data.data[i].pid && res.data.data[i].pid.image_part) res.data.data[i].pid.image_part = JSON.parse(res.data.data[i].pid.image_part);
					// }
					// this.list = this.list.concat(res.data.data);
					this.list = res.data.info;
				}
			});
		}
	},
	onLoad(options) {
		this.type = options.type;
		if (options.type == 1) {
			this.title = '赞';
		} else if (options.type == 2) {
			this.title = '评论';
		} else {
			this.title = '粉丝';
		}
		this.getMsg();
	},
	onReachBottom() {
		this.getMsg();
	}
};
</script>

<style lang="scss">
@import './message.scss';
</style>
