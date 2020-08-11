<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="我管理的圈子" haveHeight></navigationBar>
		<view>
			<view class="fans flex-between" v-for="(item, index) in list" :key="index">
				<view class="flex align-star" @click="goPage('/pagesA/circle/circle?id=' + item.id)">
					<image class="header circle" :src="item.realm_icon" mode="aspectFill"></image>
					<view>
						<view class="fs-28 bold">{{item.realm_name}}</view>
						<view class="fs-24 fc-9">关注{{item.concern}}人</view>
					</view>
				</view>
				<view class="fs-26" style="color: #7364BD;" v-if="item.is_type=='da'">圈主身份</view>
				<view class="fs-26" style="color: #7364BD;" v-if="item.is_type=='xiao'">管理员身份</view>
			</view>
			<view v-if="list.length==0" style="text-align: center; padding-top: 400rpx; color: #999;">暂无数据</view>
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
		getMyCircle() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/user_mastert',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
				},
				success: res => {
					// console.log("圈子:",res);
					this.$refs.loading.close();
					this.list = this.list.concat(res.data.info);
				}
			});
		}
	},
	onLoad() {
		this.getMyCircle();
	}
};
</script>

<style lang="scss">
@import './myCircle.scss';
</style>
