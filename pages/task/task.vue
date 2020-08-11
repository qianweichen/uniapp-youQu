<template>
	<view class="dark-bg page-task">
		<backCapsule type="capsule"></backCapsule>
		<navigationBar name="任务" haveHeight></navigationBar>
		<view class="topBox flex-center">
			<view class="left">
				<view class="flex-center">
					<text class="fs-22">我的积分</text>
					<text class="fs-18">可提现</text>
				</view>
				<view class="flex-center">
					<view class="fs-46">
						<view>{{ personalInfo.fraction }}</view>
						<view style="font-size: 22rpx;">(约{{(personalInfo.fraction/100).toFixed(2)}}元)</view>
					</view>
					<text class="fs-22 bold tixian" @click="goPage('/pages/task/deposit')">提现</text>
				</view>
			</view>
			<!-- <view class="line"></view>
			<view class="right">
				<view class="fs-22">我的积分</view>
				<view class="fs-46">0</view>
			</view> -->
		</view>
		<view class="title fs-32 bold">积分任务</view>
		<view class="list">
			<view class="item flex-between">
				<view>
					<view class="fs-26">发布帖子</view>
					<view class="fs-24" style="color: #7364BD;">+{{ taskData.fatie.jf_num }}积分</view>
				</view>
				<view class="right fs-22 flex-center" @click="togglePublishFlag(true)">{{ taskData.fatie.is_ok ? '已完成' : '去完成' }}</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-26">点赞10个</view>
					<view class="fs-24" style="color: #7364BD;">+{{ taskData.dianzan.jf_num }}积分</view>
				</view>
				<view class="right fs-22 flex-center" @click="goHome">{{ taskData.dianzan.is_ok ? '已完成' : '去完成' }}</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-26">回帖</view>
					<view class="fs-24" style="color: #7364BD;">+{{ taskData.huitie.jf_num }}积分</view>
				</view>
				<view class="right fs-22 flex-center" @click="goHome">{{ taskData.huitie.is_ok ? '已完成' : '去完成' }}</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-26">观看视频</view>
					<view class="fs-24" style="color: #7364BD;">+{{ taskData.kanshipin.jf_num }}积分</view>
				</view>
				<view class="right fs-22 flex-center" @click="playAd">{{ taskData.kanshipin.is_ok ? '已完成' : '去完成' }}</view>
			</view>
			<view class="item flex-between">
				<view>
					<view class="fs-26">浏览15分钟</view>
					<view class="fs-24" style="color: #7364BD;">+{{ taskData.liulan.jf_num }}积分</view>
				</view>
				<view class="right fs-22 flex-center">{{ taskData.liulan.is_ok ? '已完成' : '去完成' }}</view>
			</view>
		</view>
		<button open-type="contact" class="contact share"><image class="circle" src="../../static/icon-kf.png" mode="widthFix"></image></button>
		<ad unit-id="adunit-37e1565cee4fea69"></ad>
		<publish v-if="showPublishFlag" @togglePublishFlag="togglePublishFlag"></publish>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import publish from '@/components/publish/publish';
let rewardedVideoAd = null;
export default {
	components: {
		publish
	},
	data() {
		return {
			personalInfo: '',
			taskData: '',
			showPublishFlag:false
		};
	},
	methods: {
		// 选择发布类型
		togglePublishFlag(flag){
			this.showPublishFlag = flag;
		},
		//任务信息
		getTaskData() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/bonus_points_task',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					version: 1
				},
				success: res => {
					// console.log('任务信息:', res);
					this.$refs.loading.close();
					this.taskData = res.data.data;
				}
			});
		},
		//签到
		signIn() {
			uni.requestSubscribeMessage({
				tmplIds: ['eouzl8p41dm6RqLnP1EJwn22CFomD67vIc8nXezyMI4'],
				success: res => {
					// console.log(res);
					this.request({
						url: this.apiUrl + 'User/add_user_punch',
						data: {
							token: uni.getStorageSync('token'),
							openid: uni.getStorageSync('openid'),
							uid: uni.getStorageSync('userId')
						},
						success: res => {
							// console.log('签到:', res);
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							setTimeout(() => {
								this.getPersonalInfo();
							}, 1500);
						}
					});
				}
			});
		},
		//获取用户信息
		getPersonalInfo() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_user_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid')
				},
				success: res => {
					this.$refs.loading.close();
					// console.log('获取用户信息:', res);
					this.personalInfo = res.data.info;
				}
			});
		},
		playAd() {
			// 用户触发广告后，显示激励视频广告
			if (rewardedVideoAd) {
				rewardedVideoAd.show().catch(() => {
					// 失败重试
					rewardedVideoAd
						.load()
						.then(() => rewardedVideoAd.show())
						.catch(err => {
							// console.log('激励视频 广告显示失败');
						});
				});
			}
		}
	},
	onReady() {
		if (uni.createRewardedVideoAd) {
			rewardedVideoAd = uni.createRewardedVideoAd({ adUnitId: 'adunit-838a47bd221802de' });
			rewardedVideoAd.onLoad(() => {
				// console.log('onLoad event');
			});
			rewardedVideoAd.onError(err => {
				// console.log('onError event', err);
			});
			rewardedVideoAd.onClose(res => {
				// console.log('onClose event', res);
				if ((res && res.isEnded) || res === undefined) {
					this.$refs.loading.open();
					this.request({
						url: this.apiUrl + 'User/user_jf_add',
						data: {
							token: uni.getStorageSync('token'),
							openid: uni.getStorageSync('openid'),
							uid: uni.getStorageSync('userId'),
							type: 1,
							version: 1
						},
						success: res => {
							// console.log('看完视频:', res);
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							this.$refs.loading.close();
							this.getPersonalInfo();
							this.getTaskData();
						}
					});
				}
			});
		}
	},
	onShow() {
		this.getPersonalInfo();
		this.getTaskData();
	}
};
</script>

<style lang="scss">
@import './task.scss';
</style>
