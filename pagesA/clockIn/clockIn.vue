<template>
	<view class="wrap">
		<backCapsule type="capsule"></backCapsule>
		<navigationBar name="早起打卡挑战赛"></navigationBar>
		<image class="bg" src="../static/clockIn/bg.png" mode="widthFix"></image>
		<view style="height: 416rpx;"></view>
		<view class="info-group">
			<view class="fc-3 fs-28">今日总累计积分</view>
			<view class="num">{{ poolInfo.data }}</view>
			<view class="people flex-center">
				<image src="../static/clockIn/user.png" mode="widthFix"></image>
				<view class="number">{{ poolInfo.num }}</view>
				<view>人已参加报名</view>
			</view>
			<view v-if="activityTime" class="time">
				<text>距离报名截至时间还有：</text>
				<text class="number">{{ activityTime.hour }}</text>
				<text>时</text>
				<text class="number">{{ activityTime.minute }}</text>
				<text>分</text>
				<text class="number">{{ activityTime.second }}</text>
				<text>秒</text>
			</view>
			<view v-else class="time">
				<text>距离报名截至时间还有：</text>
				<text class="number">00</text>
				<text>时</text>
				<text class="number">00</text>
				<text>分</text>
				<text class="number">00</text>
				<text>秒</text>
			</view>
			<view v-if="isAuthorized" class="btn-group">
				<image src="../static/clockIn/btn.png" mode="widthFix"></image>
				<!-- 在打卡时间段 -->
				<view v-if="clockTime">
					<!-- 0未预约   1已预约 未打卡   2已打卡瓜分 -->
					<view v-if="clockStatus == 0" class="flex-center" @click="appointment">点击预约打卡</view>
					<view v-if="clockStatus == 1" class="flex-center" @click="clockIn">打卡中 {{ clockTime.hour }}:{{ clockTime.minute }}:{{ clockTime.second }}</view>
					<view v-if="clockStatus == 2">
						<!-- 0今天未预约  1今天已预约 -->
						<view v-if="clockStatusToday == 0" class="flex-center" @click="appointment">点击预约打卡</view>
						<view v-if="clockStatusToday == 1" class="flex-center">已预约明天的活动</view>
					</view>
				</view>
				<!-- 不在打卡时间段 -->
				<view v-else>
					<!-- 在预约时间段内 -->
					<view v-if="activityTime">
						<view v-if="clockStatusToday == 0" class="flex-center" @click="appointment">点击预约打卡</view>
						<view v-if="clockStatusToday == 1" class="flex-center">打卡倒计时{{ starClockTime.hour }}:{{ starClockTime.minute }}:{{ starClockTime.second }}</view>
					</view>
					<view v-else>
						<view v-if="clockStatusToday == 0" class="flex-center" @click="appointment">点击预约打卡</view>
						<view v-if="clockStatusToday == 1" class="flex-center">打卡倒计时{{ starClockTime.hour }}:{{ starClockTime.minute }}:{{ starClockTime.second }}</view>
					</view>
				</view>
			</view>
			<button v-else @click="getUserInfo" class="share btn-group">
				<image src="../static/clockIn/btn.png" mode="widthFix"></image>
				<view v-if="clockTime">
					<view v-if="clockStatus == 0" class="flex-center">点击预约打卡</view>
					<view v-if="clockStatus == 1" class="flex-center">打卡中 {{ clockTime.hour }}:{{ clockTime.minute }}:{{ clockTime.second }}</view>
					<view v-if="clockStatus == 2" class="flex-center">点击预约打卡</view>
				</view>
				<view v-else>
					<view v-if="activityTime">
						<view v-if="clockStatusToday == 0" class="flex-center">点击预约打卡</view>
						<view v-if="clockStatusToday == 1" class="flex-center">打卡倒计时{{ starClockTime.hour }}:{{ starClockTime.minute }}:{{ starClockTime.second }}</view>
					</view>
					<view v-else>
						<view v-if="clockStatusToday == 0" class="flex-center">点击预约打卡</view>
						<view v-if="clockStatusToday == 1" class="flex-center">打卡倒计时{{ starClockTime.hour }}:{{ starClockTime.minute }}:{{ starClockTime.second }}</view>
					</view>
				</view>
			</button>
		</view>
		<view class="step-group">
			<view class="title flex-center">
				<image src="../static/clockIn/arrow.png" mode="widthFix"></image>
				<view>三步赚取打卡积分</view>
				<image src="../static/clockIn/arrow.png" mode="widthFix"></image>
			</view>
			<view class="icon-group flex-between">
				<view>
					<image src="../static/clockIn/day1.png" mode="widthFix"></image>
					<view class="name">参与打卡</view>
					<view class="name2">报名比赛</view>
				</view>
				<view>
					<image src="../static/clockIn/day2.png" mode="widthFix"></image>
					<view class="name">打卡（05:00-10:00）</view>
					<view class="name2">获得瓜分资格</view>
				</view>
				<view>
					<image src="../static/clockIn/day3.png" mode="widthFix"></image>
					<view class="name">瓜分积分</view>
					<view class="name2">12点前积分结算</view>
				</view>
			</view>
			<view class="header-group" v-if="joined.length > 0">
				<image v-for="(item, index) in joined" :key="index" :src="item.user_head_sculpture" mode="aspectFill"></image>
				<image src="../static/clockIn/more.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- 邀请助力 -->
		<view class="invite">
			<view class="title flex-center">
				<image src="../static/clockIn/arrow.png" mode="widthFix"></image>
				<view>邀请好友助力</view>
				<image src="../static/clockIn/arrow.png" mode="widthFix"></image>
			</view>
			<!-- 进度条 -->
			<view class="progress flex-center">
				<view class="line-group">
					<view class="line" :style="'width:' + sharePeoplesNum + '%;'">
						<view v-if="shareList.length == 0" class="tip-0 flex-center">赶快邀请好友助力吧！</view>
						<view v-else-if="shareList.length == 10" class="tip-10 flex-center">已邀请10位好友</view>
						<view v-else class="tip flex-center">已邀请{{ shareList.length }}位好友</view>
					</view>
				</view>
			</view>
			<!-- 按钮 -->
			<view v-if="isAuthorized" class="btn-group flex-center">
				<image src="../../static/red-btn.png" mode="widthFix"></image>
				<button class="btn share" open-type="share">邀请好友助力，获取更多积分</button>
			</view>
			<button v-else @click="getUserInfo" class="share btn-group flex-center">
				<image src="../../static/red-btn.png" mode="widthFix"></image>
				<button class="btn share" open-type="share">邀请好友助力，获取更多积分</button>
			</button>
			<view class="tips">邀请新用户成功预约打卡后可获得300积分，邀请老用户成功预约打卡后可获得100积分，同时积分池的积分也会瓜分的更多（每天限定只能邀请10个好友）</view>
			<swiper v-if="shareList.length > 0" class="list" circular vertical interval="2000" autoplay>
				<swiper-item v-for="(item, index) in shareList" :key="index">
					<view class="item flex-between">
						<view class="flex">
							<image class="header" :src="item.user.user_head_sculpture" mode="aspectFill"></image>
							<view class="user-name fs-24 fc-3">{{ item.user.user_nick_name }}</view>
						</view>
						<view class="flex">
							<view class="fs-24 fc-8">{{ item.createtime_text }}，获取{{ item.bind_integral }}积分</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="ranking-group" v-if="ranking.length > 0">
			<view class="title flex-center">
				<image src="../static/clockIn/arrow.png" mode="widthFix"></image>
				<view>打卡战况</view>
				<image src="../static/clockIn/arrow.png" mode="widthFix"></image>
			</view>
			<view class="icon-group flex-between">
				<view>
					<image v-if="ranking[1]" class="circle" :src="ranking[1].user.user_head_sculpture" mode="aspectFill"></image>
					<image v-else class="circle" src="../static/logo.png" mode="widthFix"></image>
					<view class="name user-name">{{ ranking[1].user.user_nick_name || '拭目以待' }}</view>
					<view class="name2">{{ ranking[1].updatetime_text || '-' }}</view>
					<view class="ranking">
						<image src="../static/clockIn/icon-2.png" mode="widthFix"></image>
						<view class="flex-center">亚军</view>
					</view>
				</view>
				<view>
					<image class="circle" :src="ranking[0].user.user_head_sculpture" mode="aspectFill"></image>
					<view class="name user-name">{{ ranking[0].user.user_nick_name }}</view>
					<view class="name2">{{ ranking[0].updatetime_text || '-' }}</view>
					<view class="ranking">
						<image src="../static/clockIn/icon-1.png" mode="widthFix"></image>
						<view class="flex-center">冠军</view>
					</view>
				</view>
				<view>
					<image v-if="ranking[2]" class="circle" :src="ranking[2].user.user_head_sculpture" mode="aspectFill"></image>
					<image v-else class="circle" src="../static/logo.png" mode="widthFix"></image>
					<view class="name user-name">{{ ranking[2].user.user_nick_name || '拭目以待' }}</view>
					<view class="name2">{{ ranking[2].updatetime_text || '-' }}</view>
					<view class="ranking">
						<image src="../static/clockIn/icon-3.png" mode="widthFix"></image>
						<view class="flex-center">季军</view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="item flex-between" v-for="(item, index) in ranking" :key="index" v-if="index > 2">
					<view class="flex">
						<image class="header" :src="item.user.user_head_sculpture" mode="aspectFill"></image>
						<view class="user-name fs-24 fc-3">{{ item.user.user_nick_name }}</view>
					</view>
					<view class="flex">
						<image class="clock" src="../static/clockIn/clock.png" mode="widthFix"></image>
						<view class="fs-24 fc-8">{{ item.updatetime_text }}，累计打卡{{ item.count_num }}天</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fixed-btns">
			<view @click="goPage('/pagesA/clockIn/rules')">活动规则</view>
			<view v-if="isAuthorized" @click="goPage('/pagesA/clockIn/record')" style="background-color: #5F3DD2;">我的战绩</view>
			<button
				v-else
				@click="getUserInfo"
				class="share"
				style="background-color: #5F3DD2; color: #fff; font-size: 26rpx; height: 50%; padding: 20rpx; border-radius: 0;"
			>
				我的战绩
			</button>
		</view>
		<!-- 超时弹窗 -->
		<view v-if="isTimeoutShow" class="mask flex-center">
			<view class="time-out">
				<image class="icon" src="../static/clockIn/time-out.png" mode="widthFix"></image>
				<view class="fs-24">
					<view>打卡失败！已超出打卡时间范围，</view>
					<view>明天记得早点再来哦~</view>
				</view>
				<view class="btn flex-center" @click="isTimeoutShow = false">继续报名</view>
				<image class="close" src="../static/close.png" mode="widthFix" @click="isTimeoutShow = false"></image>
			</view>
		</view>
		<!-- 成功弹窗 -->
		<view v-if="isSuccessShow" class="mask flex-center">
			<view class="time-out">
				<image class="icon" src="../static/clockIn/success.png" mode="widthFix"></image>
				<view class="fs-24">
					<view>
						<text>打卡成功，</text>
						<!-- <text>您是第</text>
						<text class="number">562</text>
						<text>位打卡成功，</text> -->
						<text>积分将在</text>
					</view>
					<view>12点前发放至账户</view>
				</view>
				<view class="btn flex-center" @click="isSuccessShow = false">继续报名</view>
				<image class="close" src="../static/close.png" mode="widthFix" @click="isSuccessShow = false"></image>
			</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
// 在页面中定义插屏广告
let interstitialAd = null;
let rewardedVideoAd = null;
export default {
	computed: {
		sharePeoplesNum() {
			return this.shareList.length * 10;
		}
	},
	data() {
		return {
			isTimeoutShow: false,
			isSuccessShow: false,
			activityTime: '', //活动倒计时
			clockTime: '', //打卡中：打卡结束倒计时
			starClockTime: '', //已预约：打开开始倒计时
			poolInfo: {},
			clockStatus: '', //昨天的活动是否预约了 	0未预约   1已预约 未打卡   2已打卡瓜分
			clockStatusToday: '', //今天是否预约明天的活动	0未预约   1已预约
			ranking: [], //排名
			joined: [], //已加入
			timeQuantum: '', //0-5点=1   5-10点=2  10点以后=3
			isAuthorized: false, //授权否
			shareList: [],
			pid: '' //邀请人id
		};
	},
	methods: {
		//授权
		getUserInfo(e) {
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
				this.init();
			});
		},
		//obj：修改哪个对象   endtime：结束时间
		getSurplusTime(obj, endtime) {
			var nowtime = new Date(), //获取当前时间
				endtime = new Date(endtime); //定义结束时间
			var lefttime = endtime.getTime() - nowtime.getTime(); //距离结束时间的毫秒数
			var hour = String(Math.floor((lefttime / (1000 * 60 * 60)) % 24)),
				minute = String(Math.floor((lefttime / (1000 * 60)) % 60)),
				second = String(Math.floor((lefttime / 1000) % 60));
			this[obj] = {
				hour: hour.length > 1 ? hour : '0' + hour,
				minute: minute.length > 1 ? minute : '0' + minute,
				second: second.length > 1 ? second : '0' + second
			};
		},
		//获取积分池数据
		getIntegralPool() {
			this.request({
				url: this.apiUrl + 'user/integral_pool',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					type: 1 //1 今日 2昨天  默认1
				},
				success: res => {
					console.log('积分池数量', res);
					this.poolInfo = res.data;
				}
			});
		},
		//打卡
		clockIn() {
			this.request({
				url: this.apiUrl + 'user/punch_clock',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId')
				},
				success: res => {
					console.log('打卡', res);
					this.isSuccessShow = true;
					this.init();
				}
			});
		},
		//预约
		appointment() {
			uni.requestSubscribeMessage({
				tmplIds: ['juzBV1wr_fSkUcLvdMBm4fheXMPKVc0a_PmKd9rAdCQ'],
				complete: res => {
					this.doAppointment();
					// 用户触发广告后，显示激励视频广告
					// if (rewardedVideoAd) {
					// 	rewardedVideoAd.show().catch(() => {
					// 		// 失败重试
					// 		rewardedVideoAd
					// 			.load()
					// 			.then(() => rewardedVideoAd.show())
					// 			.catch(err => {
					// 				// console.log('激励视频 广告显示失败');
					// 				this.doAppointment();
					// 			});
					// 	});
					// }
				}
			});
		},
		doAppointment() {
			if (!this.activityTime && this.clockStatusToday == 0) {
				uni.showToast({
					title: '上期积分池正在瓜分，5点以后才可预约！',
					icon: 'none'
				});
				return;
			}
			this.request({
				url: this.apiUrl + 'user/make_punch',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					pid: this.pid
				},
				success: res => {
					console.log('预约', res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.init();
				}
			});
		},
		//查询打卡状态
		getClockStatus() {
			this.request({
				url: this.apiUrl + 'user/is_clock_or_make',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId')
				},
				success: res => {
					console.log('查询打卡状态', res);
					this.clockStatus = res.data.data; //	0未预约   1已预约 未打卡   2已打卡瓜分
					this.clockStatusToday = res.data.data2; //	0未预约   1已预约

					//已预约并且超过打卡时间，弹框提示，一天只提示一次
					if (this.timeQuantum == 3 && this.clockStatus == 1) {
						var today = new Date().Format("yyyy/MM/dd 00:00:00"),
							storageDay = uni.getStorageSync('timeoutShowFlag');
						if (today != storageDay) {
							this.isTimeoutShow = true;
							uni.setStorageSync('timeoutShowFlag', today);
						}
					}
				}
			});
		},
		//战况
		getRanking() {
			this.request({
				url: this.apiUrl + 'user/zhnakuang',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					page: 1
				},
				success: res => {
					console.log('战况', res);
					res.data.data.forEach(item => {
						item.updatetime_text = new Date(item.updatetime * 1000).Format('hh:mm:ss');
					});
					this.ranking = res.data.data;
					this.joined = res.data.data2;
				}
			});
		},
		//获取倒计时
		getCountDown() {
			//获取当前时间
			var now = new Date().getTime(),
				today_5 = new Date(new Date(new Date().Format("yyyy/MM/dd 00:00:00")).getTime() + 5 * 60 * 60 * 1000).getTime(), //今天5点
				today_10 = new Date(new Date(new Date().Format("yyyy/MM/dd 00:00:00")).getTime() + 10 * 60 * 60 * 1000).getTime(); //今天10点
			if (now < today_5) {
				//5点前
				//不在预约时间
				this.activityTime = '';
				//非打卡时段不显示打卡倒计时
				this.clockTime = '';
				//不在打卡时间段获取打卡开始时间倒计时（今天五点）
				var starClockTime = new Date(new Date(new Date().Format("yyyy/MM/dd 00:00:00")).getTime() + 5 * 60 * 60 * 1000);
				this.getSurplusTime('starClockTime', starClockTime);

				this.timeQuantum = 1;
			} else if (now < today_10) {
				//5-10点
				//预约截至时间 第二天0点
				var appointmentEndTime = new Date(new Date(new Date().Format("yyyy/MM/dd 00:00:00")).getTime() + 24 * 60 * 60 * 1000);
				this.getSurplusTime('activityTime', appointmentEndTime);
				//打卡截至时间 当天上午十点
				var clockEndTime = new Date(new Date(new Date().Format("yyyy/MM/dd 00:00:00")).getTime() + 10 * 60 * 60 * 1000);
				this.getSurplusTime('clockTime', clockEndTime);
				//打卡时间段不获取打卡开始时间倒计时
				this.starClockTime = '';

				this.timeQuantum = 2;
			} else {
				//10点以后
				//预约截至时间 第二天0点
				var appointmentEndTime = new Date(new Date(new Date().Format("yyyy/MM/dd 00:00:00")).getTime() + 24 * 60 * 60 * 1000);
				this.getSurplusTime('activityTime', appointmentEndTime);
				//非打卡时段不显示打卡倒计时
				this.clockTime = '';
				//不在打卡时间段获取打卡开始时间倒计时（明天五点）
				var starClockTime = new Date(new Date(new Date().Format("yyyy/MM/dd 00:00:00")).getTime() + (24 + 5) * 60 * 60 * 1000);
				this.getSurplusTime('starClockTime', starClockTime);

				this.timeQuantum = 3;
			}
		},
		getShareList() {
			this.request({
				url: this.apiUrl + 'user/jfc_bind_list',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId')
				},
				success: res => {
					console.log('邀请人列表', res);
					res.data.data.forEach(item => {
						item.createtime_text = new Date(item.createtime * 1000).Format('hh:mm:ss');
					});
					this.shareList = res.data.data;
				}
			});
		},
		init() {
			this.getIntegralPool();
			this.getClockStatus();
			this.getRanking();
			this.getShareList();
		}
	},
	onLoad(options) {
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();

		this.init();
		//每秒刷新一下时间
		this.getCountDown();
		setInterval(() => {
			this.getCountDown();
		}, 1000);

		//邀请助力
		if (options.pid) {
			this.pid = options.pid;
		}

		// 插屏广告
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-f4669b91d9da4f72'
			});
			interstitialAd.onLoad(() => {});
			interstitialAd.onError(err => {});
			interstitialAd.onClose(() => {});
		}
		// 在适合的场景显示插屏广告
		if (interstitialAd) {
			interstitialAd.show().catch(err => {
				console.error(err);
			});
		}
	},
	onReady() {
		// if (uni.createRewardedVideoAd) {
		// 	rewardedVideoAd = uni.createRewardedVideoAd({ adUnitId: 'adunit-838a47bd221802de' });
		// 	rewardedVideoAd.onLoad(() => {
		// 		// console.log('onLoad event');
		// 	});
		// 	rewardedVideoAd.onError(err => {
		// 		// console.log('onError event', err);
		// 	});
		// 	rewardedVideoAd.onClose(res => {
		// 		// console.log('onClose event', res);
		// 		if ((res && res.isEnded) || res === undefined) {
		// 			this.doAppointment();
		// 		}
		// 	});
		// }
	},
	onShareAppMessage(res) {
		return {
			title: '您的好友 ' + uni.getStorageSync('userInfo').nickName + ' 邀请你一起参加早起打卡挑战赛,瓜分万元奖励',
			path: '/pagesA/clockIn/clockIn?pid=' + uni.getStorageSync('userId'),
			imageUrl: '../static/clockIn/share.jpg'
		};
	}
};
</script>

<style lang="scss">
.user-name {
	width: 190rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.wrap {
	position: relative;
	.invite {
		width: 690rpx;
		margin: 0 auto 20rpx;
		padding: 45rpx 24rpx;
		box-sizing: border-box;
		background: #ffffff;
		box-shadow: -2rpx 4rpx 24rpx 4rpx rgba(228, 228, 228, 0.58);
		border-radius: 20rpx;
		.title {
			image {
				width: 48rpx;
				height: 12rpx;
				&:last-child {
					transform: rotate(180deg);
				}
			}
			view {
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
				padding: 0 19rpx;
			}
		}
		.progress {
			padding: 124rpx 0 44rpx;
			.line-group {
				width: 576rpx;
				height: 14rpx;
				background: #e5e5e5;
				border-radius: 8rpx;
				position: relative;
				.line {
					width: 0%;
					height: 100%;
					border-radius: 8rpx;
					position: absolute;
					left: 0;
					top: 0;
					background-color: #ffa43c;
					.tip {
						position: absolute;
						right: -90rpx;
						bottom: 38rpx;
						width: 192rpx;
						height: 48rpx;
						background: #ffa43c;
						border-radius: 8rpx;
						font-size: 24rpx;
						font-weight: bold;
						color: #ffffff;
						&::after {
							content: '';
							width: 0;
							height: 0;
							border-right: 20rpx solid transparent;
							border-left: 20rpx solid transparent;
							border-top: 20rpx solid #ffa43c;
							position: absolute;
							left: calc(50% - 20rpx);
							bottom: -14rpx;
						}
					}
					.tip-0 {
						position: absolute;
						left: -20rpx;
						bottom: 38rpx;
						width: 252rpx;
						height: 48rpx;
						background: #e5e5e5;
						color: #888888;
						border-radius: 8rpx;
						font-size: 24rpx;
						font-weight: bold;
						&::after {
							content: '';
							width: 0;
							height: 0;
							border-right: 20rpx solid transparent;
							border-left: 20rpx solid transparent;
							border-top: 20rpx solid #e5e5e5;
							position: absolute;
							left: 10rpx;
							bottom: -14rpx;
						}
					}
					.tip-10 {
						position: absolute;
						right: -28rpx;
						bottom: 38rpx;
						width: 192rpx;
						height: 48rpx;
						background: #ffa43c;
						border-radius: 8rpx;
						font-size: 24rpx;
						font-weight: bold;
						color: #ffffff;
						&::after {
							content: '';
							width: 0;
							height: 0;
							border-right: 20rpx solid transparent;
							border-left: 20rpx solid transparent;
							border-top: 20rpx solid #ffa43c;
							position: absolute;
							right: 10rpx;
							bottom: -14rpx;
						}
					}
				}
			}
		}
		.btn-group {
			position: relative;
			width: 600rpx;
			height: 130rpx;
			margin: 0 auto;
			image {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
			.btn {
				font-size: 40rpx;
				font-weight: 800;
				color: #fff6e2;
				text-shadow: 0 2rpx 2rpx #b28600;
				position: relative;
				padding-bottom: 4rpx;
			}
		}
		.tips {
			padding: 24rpx 40rpx 48rpx;
			font-size: 22rpx;
			color: #c588d9;
			line-height: 32rpx;
		}
		.list {
			height: 84rpx;
			.item {
				width: 652rpx;
				height: 84rpx;
				background: #f5f5f5;
				border-radius: 20rpx;
				padding: 0 20rpx;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				&:last-child {
					margin-bottom: 0;
				}
				.header {
					width: 32px;
					height: 32px;
					border-radius: 50%;
					margin-right: 15rpx;
				}
				.clock {
					width: 34rpx;
					height: 32rpx;
					margin-right: 8rpx;
				}
			}
		}
	}
	.time-out {
		position: relative;
		width: 568rpx;
		height: 552rpx;
		padding-top: 70rpx;
		box-sizing: border-box;
		background: #ffffff;
		border-radius: 20rpx;
		text-align: center;
		.icon {
			width: 236rpx;
			height: 214rpx;
		}
		.fs-24 {
			padding: 28rpx 0 48rpx;
			.number {
				color: #5f3dd2;
				font-size: 30rpx;
				font-weight: bold;
			}
		}
		.btn {
			width: 384rpx;
			height: 78rpx;
			background: #5f3dd2;
			font-size: 34rpx;
			color: #ffffff;
			border-radius: 40rpx;
			margin: 0 auto;
		}
		.close {
			width: 36rpx;
			height: 36rpx;
			position: absolute;
			right: 30rpx;
			top: 30rpx;
		}
	}
	.fixed-btns {
		position: fixed;
		top: 300rpx;
		right: 0;
		width: 94rpx;
		height: 220rpx;
		background: #c111fb;
		border-radius: 20rpx 0 0 20rpx;
		overflow: hidden;
		view {
			width: 100%;
			height: 50%;
			padding: 20rpx;
			box-sizing: border-box;
			font-size: 26rpx;
			color: #fff;
		}
	}
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: auto;
	}
	.info-group {
		width: 690rpx;
		margin: 0 auto 20rpx;
		padding: 50rpx 40rpx;
		box-sizing: border-box;
		background: #ffffff;
		border: 8rpx solid #c110fc;
		box-shadow: 0 -10rpx 0 0 #c110fc;
		border-radius: 20rpx;
		text-align: center;
		.num {
			font-size: 68rpx;
			color: #c111fb;
			font-weight: bold;
			padding: 15rpx 0;
		}
		.people {
			font-size: 24rpx;
			image {
				width: 20rpx;
				height: auto;
				font-size: 24rpx;
			}
			.number {
				color: #5f3dd2;
				padding: 0 12rpx;
			}
		}
		.time {
			padding: 40rpx 0 20rpx;
			font-size: 24rpx;
			.number {
				padding: 0 4rpx;
				background-color: #c111fb;
				color: #fff;
				margin: 0 4rpx;
			}
		}
		.btn-group {
			position: relative;
			width: 602rpx;
			height: 130rpx;
			image {
				width: 602rpx;
				height: 130rpx;
				display: block;
			}
			view {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				font-size: 42rpx;
				color: #fff6e2;
				text-shadow: 0 2rpx 2rpx #5a0da3;
			}
		}
	}
	.step-group {
		width: 690rpx;
		height: 514rpx;
		margin: 0 auto 20rpx;
		padding: 45rpx 24rpx;
		box-sizing: border-box;
		background: #ffffff;
		box-shadow: -2rpx 4rpx 24rpx 4rpx rgba(228, 228, 228, 0.58);
		border-radius: 20rpx;
		.title {
			image {
				width: 48rpx;
				height: 12rpx;
				&:last-child {
					transform: rotate(180deg);
				}
			}
			view {
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
				padding: 0 19rpx;
			}
		}
		.icon-group {
			padding: 50rpx 40rpx;
			text-align: center;
			image {
				width: 128rpx;
				height: 128rpx;
			}
			.name {
				color: #333;
				font-size: 24rpx;
				font-weight: bold;
				padding: 10rpx 0 7rpx;
			}
			.name2 {
				font-size: 20rpx;
				color: #c588d9;
			}
		}
		.header-group {
			image {
				width: 82rpx;
				height: 84rpx;
				border-radius: 50%;
				margin-right: 11rpx;
				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
	.ranking-group {
		width: 690rpx;
		margin: 0 auto 20rpx;
		padding: 45rpx 24rpx;
		box-sizing: border-box;
		background: #ffffff;
		box-shadow: -2rpx 4rpx 24rpx 4rpx rgba(228, 228, 228, 0.58);
		border-radius: 20rpx;
		.title {
			image {
				width: 48rpx;
				height: 12rpx;
				&:last-child {
					transform: rotate(180deg);
				}
			}
			view {
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
				padding: 0 19rpx;
			}
		}
		.icon-group {
			padding: 50rpx 40rpx;
			text-align: center;
			> view {
				position: relative;
				image {
					width: 128rpx;
					height: 128rpx;
				}
				.name {
					color: #333;
					font-size: 24rpx;
					font-weight: bold;
					padding: 10rpx 0 7rpx;
				}
				.name2 {
					font-size: 20rpx;
					color: #c588d9;
				}
				.ranking {
					position: absolute;
					left: calc(50% - 80rpx);
					bottom: 68rpx;
					image {
						width: 160rpx;
						height: 54rpx;
						display: block;
					}
					view {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
						font-size: 24rpx;
						color: #ffffff;
						padding: 4rpx 0 0 16rpx;
					}
				}
			}
		}
		.list {
			.item {
				width: 652rpx;
				height: 84rpx;
				background: #f5f5f5;
				border-radius: 20rpx;
				padding: 0 20rpx;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				&:last-child {
					margin-bottom: 0;
				}
				.header {
					width: 32px;
					height: 32px;
					border-radius: 50%;
					margin-right: 15rpx;
				}
				.clock {
					width: 34rpx;
					height: 32rpx;
					margin-right: 8rpx;
				}
			}
		}
	}
}
</style>
