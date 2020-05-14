<template>
	<view class="dark-bg page-circleInfo">
		<navigationBar name="圈子资料"></navigationBar>
		<backCapsule type="normal"></backCapsule>
		<view class="banner" :style="'background-image: url(' + '../../static/logo.png' + ');'">
			<view class="tsBox" @click="toggleComplaint(true)">
				<image class="ts" src="../../static/msg.png" mode="widthFix"></image>
				<view class="fs-22">投诉</view>
			</view>
		</view>
		<view class="personInfo">
			<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
			<view class="fs-32 bold">爱宠俱乐部</view>
			<view class="fs-24 fc-d">宠物是我们最好的朋友，不要伤害它...</view>
		</view>
		<view class="list">
			<view class="item flex-between">
				<view class="left flex">
					<image src="../../static/cinfo-1.png" mode="widthFix"></image>
					<view class="fs-28">圈主</view>
				</view>
				<view class="right flex">
					<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
					<text class="fs-26 fc-d">乖乖是只猫</text>
				</view>
			</view>
			<view class="item flex-between" @click="goPage('/pages/circle/circleManager?id=' + '1')">
				<view class="left flex">
					<image src="../../static/cinfo-2.png" mode="widthFix"></image>
					<view class="fs-28">管理员</view>
				</view>
				<view class="right flex">
					<view class="headerBox"><image v-for="(item, index) in 5" :key="index" class="header circle" src="../../static/logo.png" mode="aspectFill"></image></view>
					<image class="right-icon" src="../../static/right.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="item flex-between" @click="toggleIptCodeFlag(true)">
				<view class="left flex">
					<image src="../../static/cinfo-3.png" mode="widthFix"></image>
					<view class="fs-28">我的邀请码</view>
				</view>
				<view class="right flex">
					<text class="fs-26 fc-d">{{erCode}}</text>
					<image class="right-icon" src="../../static/right.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="item flex-between">
				<view class="left flex">
					<image src="../../static/cinfo-4.png" mode="widthFix"></image>
					<view class="fs-28">是否开放圈子</view>
				</view>
				<view class="right flex">
					<switch :checked="jurisdiction" @change="changeJurisdiction" color="#7364BD" style="zoom: 0.8;"/>
					<image class="right-icon" src="../../static/right.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="guifan fs-26">
			<text @click="showGuiFan(1)">《圈主权益与规范》</text>
			<text @click="showGuiFan(2)">《管理员权益与规范》</text>
		</view>
		<!-- 投诉弹窗 -->
		<view v-if="showComplaintFlag" @click="toggleComplaint(false)" class="mask"></view>
		<view v-if="showComplaintFlag" class="complaint">
			<view class="title fs36 bold">
				<text>投诉理由</text>
				<image @click="toggleComplaint(false)" src="../../static/close.png" mode="widthFix"></image>
			</view>
			<textarea class="textarea fs-26" placeholder="请说明投诉理由" />
			<view class="btn flex-center fc-f">提交</view>
		</view>
		<!-- 生成邀请码弹窗 -->
		<view v-if="showIptCodeFlag" class="erCodeBox">
			<view class="fs-32 bold title">我的邀请码</view>
			<view class="iptBox flex fs-26">
				<input class="left flex-center" type="text" :placeholder="erCode" v-model="erCode"/>
				<view class="right fc-f flex-center">刷新</view>
			</view>
			<view class="fs-22 tip">点击刷新随机生成新的邀请码</view>
			<view class="btnBox flex">
				<view class="flex-center" @click="toggleIptCodeFlag(false)">关闭</view>
				<view class="flex-center" @click="copyCode">复制邀请码</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showComplaintFlag:false,	//投诉弹窗
			jurisdiction:true	,//权限
			showIptCodeFlag:false,	//显示生成邀请码
			erCode:'4477es'
		};
	},
	methods: {
		// 复制邀请码
		copyCode(){
			uni.setClipboardData({
			    data: this.erCode
			});
		},
		//显示隐藏	生成邀请码
		toggleIptCodeFlag(flag){
			this.showIptCodeFlag = flag;
		},
		//设置权限
		changeJurisdiction(e){
			this.jurisdiction = e.detail.value;
		},
		//显示隐藏	投诉
		toggleComplaint(flag){
			this.showComplaintFlag = flag;
		},
		showGuiFan(type) {
			var title, content;
			if (type == 1) {
				title = '圈主权益与规范';
				content = '圈主可以在任职的圈子里管理圈子内容和用户,还有闪亮亮的独家圈主标识哦。圈主团队由圈主和管理员构成。由圈主建立，并为圈子的发展和秩序负责。圈主最多三位。';
			} else if (type == 2) {
				title = '管理员权益与规范';
				content = '管理员由圈主设置，圈主有权取消其身份。作为圈主团队的一份子，管理员拥有圈子内删除、置顶帖子等权限、酷炫的标识。管理员最多十位。';
			}
			uni.showModal({
				title,
				content,
				showCancel: false,
				confirmText: '关闭'
			});
		}
	}
};
</script>

<style lang="scss">
@import './circleInfo.scss';
</style>
