<template>
	<view class="page-circle dark-bg">
		<backCapsule type="capsule"></backCapsule>
		<view class="topInfoBox" :style="'background-image: url(' + '../../static/logo.png' + ');'">
			<view class="info">
				<view class="flex-between align-star">
					<view class="flex info-left" @click="goPage('/pages/circle/circleInfo?id=' + '1')">
						<view class="user flex-column-between">
							<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
							<view v-if="true" class="fs-22 join flex-center">加入</view>
							<view v-else class="fs-22 join flex-center outCircle">退圈</view>
						</view>
						<view class="nameBox fc-f flex-column-between">
							<view class="fs-32 bold">爱宠俱乐部</view>
							<view class="fs-24" style="color: #ddd;">宠物是我们最好的朋友，不要伤害它...</view>
							<view class="fs-20">关注 1758 | 帖子 474</view>
						</view>
					</view>
					<view class="share">
						<image src="../../static/ercode.png" mode="widthFix"></image>
						<view class="fs-22 fc-f">分享</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 无权限 -->
		<view v-if="noJurisdiction" class="noQx">
			<view @click="toggleIptCodeFlag(true)">
				<view class="picBox flex-center">
					<view>
						<image src="../../static/lock.png" mode="widthFix"></image>
						<view class="fs-22">私密圈子</view>
					</view>
				</view>
				<view class="fs-22">
					<view>该圈子需要有邀请码才可以加入和访问</view>
					<view>点击填写邀请码</view>
				</view>
			</view>
			<!-- 填写弹窗 -->
			<view v-if="showIptCodeFlag" class="mask"></view>
			<view v-if="showIptCodeFlag" class="erCodeBox">
				<view class="fs-32 bold title">该圈子需要填写邀请码才能加入！</view>
				<view class="iptBox flex fs-26">
					<input class="left flex-center" type="text" placeholder="请输入邀请码" v-model="erCode" />
					<view class="right fc-f flex-center" @click="setCode">粘贴</view>
				</view>
				<view class="fs-22 tip">邀请码由圈子圈主随机生成</view>
				<view class="btnBox flex">
					<view class="flex-center" @click="toggleIptCodeFlag(false)">取消</view>
					<view class="flex-center" @click="sendCode">确认</view>
				</view>
			</view>
		</view>
		<!-- 有权限 -->
		<view v-else>
			<!-- 置顶 -->
			<view class="topBox fs-24">
				<view class="item flex" v-for="(item, index) in 2" :key="index">
					<view class="tag flex-center">置顶</view>
					<view class="info">纯干货！养猫3种错误的喂养方式。你是不是也这样？</view>
				</view>
			</view>
			<dynamicList type="circle" :list="dynamicList"></dynamicList>
			<!-- 发布按钮 -->
			<image class="sendDynamic" src="../../static/tabbar/publish.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
import dynamicList from '@/components/dynamic/dynamic.vue';
export default {
	components: {
		dynamicList
	},
	data() {
		return {
			noJurisdiction: true, //没权限
			erCode: '', //邀请码
			showIptCodeFlag: false, //显示输入邀请码
			dynamicList: [1, 2, 3]
		};
	},
	methods: {
		// 粘贴
		setCode() {
			uni.getClipboardData({
				success: res => {
					this.erCode = res.data;
				}
			});
		},
		// 输入邀请码弹窗
		toggleIptCodeFlag(flag) {
			this.showIptCodeFlag = flag;
		},
		// 请求访问
		sendCode() {
			this.noJurisdiction = false;
			this.showIptCodeFlag = false;
		}
	},
	onLoad(options) {
		console.log(options.id);
	}
};
</script>

<style lang="scss">
@import './circle.scss';
</style>
