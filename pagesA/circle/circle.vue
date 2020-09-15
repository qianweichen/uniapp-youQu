<template>
	<view class="page-circle dark-bg" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">
		<backCapsule type="capsule"></backCapsule>
		<navigationBar :name="circleData.realm_name || ''"></navigationBar>
		<view class="topInfoBox" :style="'background-image: url(' + (circleData.realm_bg || '') + ');'">
			<view class="info">
				<view class="flex-between">
					<view class="flex info-left">
						<view class="user flex-column-between">
							<image class="header circle" :src="circleData.realm_icon" mode="aspectFill"></image>
							<view v-if="isAuthorized">
								<view v-if="!noJurisdiction" @click.stop="join">
									<view v-if="!circleData.is_trailing" class="fs-22 join flex-center">加入</view>
									<view v-else class="fs-22 join flex-center outCircle">退圈</view>
								</view>
								<view v-else class="fs-22 join flex-center" @click.stop="toggleIptCodeFlag(true)">加入</view>
							</view>
							<view v-else @click.stop="">
								<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo"><view class="fs-22 join flex-center">加入</view></button>
							</view>
						</view>
						<view v-if="isAuthorized" class="nameBox fc-f flex-column-between" @click="goPage('/pagesA/circle/circleInfo?id=' + circleId)">
							<view class="fs-32 bold">{{ circleData.realm_name || '' }}</view>
							<view class="fs-24" style="color: #ddd;">{{ circleData.realm_synopsis || '' }}</view>
							<view class="fs-20">关注 {{ circleData.concern || '' }} | 帖子 {{ circleData.is_paper_count || '' }}</view>
						</view>
						<button v-else open-type="getUserInfo" class="share nameBox fc-f flex-column-between" @getuserinfo="getUserInfo" style="text-align: left;">
							<view class="fs-32 bold">{{ circleData.realm_name || '' }}</view>
							<view class="fs-24" style="color: #ddd;">{{ circleData.realm_synopsis || '' }}</view>
							<view class="fs-20">关注 {{ circleData.concern || '' }} | 帖子 {{ circleData.is_paper_count || '' }}</view>
						</button>
					</view>
					<view v-if="isAuthorized" class="share" @click="shareQrCode">
						<image src="../../static/ercode.png" mode="widthFix"></image>
						<view class="fs-22 fc-f">分享</view>
					</view>
					<view v-else class="share">
						<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
							<image src="../../static/ercode.png" mode="widthFix"></image>
							<view class="fs-22 fc-f">分享</view>
						</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 无权限 -->
		<view v-if="noJurisdiction" class="noQx">
			<view v-if="isAuthorized" @click="toggleIptCodeFlag(true)">
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
			<view v-else>
				<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
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
				</button>
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
				<view class="item flex" v-for="(item, index) in topList" :key="index" @click="goPage('/pagesA/articleDetails/articleDetails?id=' + item.id)">
					<view class="tag flex-center">置顶</view>
					<view class="info">{{ item.study_content }}</view>
				</view>
			</view>
			<dynamicList
				ref="dynamicList"
				type="circle"
				:list="dynamicList"
				@toggleAllText="toggleAllText"
				@goodFun="goodFun"
				@commentFun="commentFun"
				@attentionFun="attentionFun"
				@playVideoFun="playVideoFun"
			></dynamicList>
			<view v-if="dynamicList.length == 0 && loadStatus=='nomore'" style="text-align: center; padding-top: 200rpx; color: #999;">暂无数据</view>
			<loadMore v-else :status="loadStatus"></loadMore>
			<!-- 发布按钮 -->
			<image @click="togglePublishFlag(true)" class="sendDynamic" src="../../static/tabbar/publish.png" mode="widthFix"></image>
		</view>

		<!-- 海报 -->
		<view v-if="qrShow">
			<view class="mask"></view>
			<view class="bannerBox flex-center">
				<view>
					<view class="imgBox">
						<view class="modal-content" id="canvas-container" style="padding:0px; width:100%; height: 100%;">
							<canvas canvas-id="myCanvas" style="width:100%; background-color:#ffffff; height:100%;"></canvas>
						</view>

						<image @click="hideQr" class="close" src="../../static/close-f.png" mode="widthFix"></image>
					</view>
					<view class="btn-big fc-f flex-center" @click="saveBanner">保存图片</view>
					<view class="btn-big fc-f flex-center" style="margin-top: 20rpx;" @click="hideQr">关闭</view>
				</view>
			</view>
		</view>

		<!-- 发布 -->
		<publish v-if="showPublishFlag" @togglePublishFlag="togglePublishFlag"></publish>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import publish from '@/components/publish/publish';
import dynamicList from '@/components/dynamic/dynamic.vue';
import circleJs from './circle.js';
export default {
	components: {
		dynamicList,
		publish
	},
	...circleJs
};
</script>

<style lang="scss">
@import './circle.scss';
</style>
