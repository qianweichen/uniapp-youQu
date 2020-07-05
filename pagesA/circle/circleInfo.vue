<template>
	<view class="dark-bg page-circleInfo">
		<navigationBar name="圈子资料"></navigationBar>
		<backCapsule type="normal"></backCapsule>
		<view class="banner" :style="'background-image: url(' + (circleInfo.realm_bg||'') + ');'">
			<view class="tsBox" @click="toggleComplaint(true)">
				<image class="ts" src="../../static/msg.png" mode="widthFix"></image>
				<view class="fs-22">投诉</view>
			</view>
		</view>
		<view class="personInfo">
			<image class="header circle" :src="circleInfo.realm_icon" mode="aspectFill"></image>
			<view class="fs-32 bold">{{ circleInfo.realm_name }}</view>
			<view class="fs-24 fc-d">{{ circleInfo.realm_synopsis }}</view>
		</view>
		<view class="list">
			<view class="item flex-between">
				<view class="left flex">
					<image src="../../static/cinfo-1.png" mode="widthFix"></image>
					<view class="fs-28">圈主</view>
				</view>
				<view class="right flex" v-if="circleInfo.da_qq.length>0">
					<image class="header circle" :src="circleInfo.da_qq[0].user_head_sculpture" mode="aspectFill"></image>
					<text class="fs-26 fc-d">{{circleInfo.da_qq[0].user_nick_name}}</text>
				</view>
				<view class="right flex" v-else>
					<text class="fs-26 fc-d">暂无圈主</text>
				</view>
			</view>
			<view class="item flex-between" @click="goPage('/pagesA/circle/circleManager?id=' + id)">
				<view class="left flex">
					<image src="../../static/cinfo-2.png" mode="widthFix"></image>
					<view class="fs-28">管理员</view>
				</view>
				<view class="right flex">
					<view class="headerBox">
						<image v-for="(item, index) in circleInfo.xiao_qq" :key="index" class="header circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
					</view>
					<image class="right-icon" src="../../static/right.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="item flex-between" @click="toggleIptCodeFlag(true)" v-if="circleInfo.this_da_qq==1">
				<view class="left flex">
					<image src="../../static/cinfo-3.png" mode="widthFix"></image>
					<view class="fs-28">我的邀请码</view>
				</view>
				<view class="right flex">
					<text class="fs-26 fc-d">{{ erCode }}</text>
					<image class="right-icon" src="../../static/right.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="item flex-between" v-if="circleInfo.this_da_qq==1">
				<view class="left flex">
					<image src="../../static/cinfo-4.png" mode="widthFix"></image>
					<view class="fs-28">是否开放圈子</view>
				</view>
				<view class="right flex">
					<switch :checked="circleInfo.attention==0" @change="toggleAtence" color="#7364BD" style="zoom: 0.8;" />
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
			<textarea class="textarea fs-26" placeholder="请说明投诉理由" v-model="tsContent"/>
			<view class="btn flex-center fc-f" @click="sendTs">提交</view>
		</view>
		<!-- 生成邀请码弹窗 -->
		<view v-if="showIptCodeFlag" class="erCodeBox">
			<view class="fs-32 bold title">我的邀请码</view>
			<view class="iptBox flex fs-26">
				<input class="left flex-center" type="text" :placeholder="erCode" v-model="erCode" />
				<view class="right fc-f flex-center" @click="getRandom">刷新</view>
			</view>
			<view class="fs-22 tip">点击刷新随机生成新的邀请码</view>
			<view class="btnBox flex">
				<view class="flex-center" @click="toggleIptCodeFlag(false)">关闭</view>
				<view class="flex-center" @click="copyCode">复制邀请码</view>
			</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import circleInfoJs from './circleInfo.js';
export default {
	...circleInfoJs
};
</script>

<style lang="scss">
@import './circleInfo.scss';
</style>
