<template>
	<view class="page-circle dark-bg">
		<backCapsule type="capsule"></backCapsule>
		<view class="topInfoBox" :style="'background-image: url(' + (circleData.realm_bg||'') + ');'">
			<view class="info">
				<view class="flex-between align-star">
					<view class="flex info-left" @click="goPage('/pages/circle/circleInfo?id=' + circleId)">
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
								<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
									<view class="fs-22 join flex-center">加入</view>
								</button>
							</view>
						</view>
						<view class="nameBox fc-f flex-column-between">
							<view class="fs-32 bold">{{circleData.realm_name}}</view>
							<view class="fs-24" style="color: #ddd;">{{circleData.realm_synopsis}}</view>
							<view class="fs-20">关注 {{circleData.concern}} | 帖子 {{circleData.is_paper_count}}</view>
						</view>
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
				<view class="item flex" v-for="(item, index) in topList" :key="index" @click="goPage('/pages/articleDetails/articleDetails?id=' + item.id)">
					<view class="tag flex-center">置顶</view>
					<view class="info">{{item.study_content}}</view>
				</view>
			</view>
			<dynamicList type="circle" :list="dynamicList" @goodFun="goodFun" @commentFun="commentFun"></dynamicList>
			<!-- 发布按钮 -->
			<image @click="togglePublishFlag(true)" class="sendDynamic" src="../../static/tabbar/publish.png" mode="widthFix"></image>
		</view>
		
		<!-- 图片展示由自己实现 -->
		<view class="flex_row_c_c modalView" :class="qrShow?'show':''" @tap="hideQr()">
			<view class="flex_column">
				<view class="backgroundColor-white padding1vh border_radius_10px">
					<image :src="poster.finalPath || ''" mode="widthFix" class="posterImage"></image>
				</view>
				<view class="flex_row marginTop2vh">
					<button type="primary" size="mini" @tap.prevent.stop="saveImage()">保存图片</button>
				</view>
			</view>
		</view>
		<!-- 画布 -->
		<view class="hideCanvasView">
			<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||10) + 'px', height: (poster.height||10) + 'px'}"></canvas>
		</view>
		<!-- 发布 -->
		<publish v-if="showPublishFlag" @togglePublishFlag="togglePublishFlag"></publish>
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
