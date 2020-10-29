<template>
	<view class="page-persionalC dark-bg" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">
		<backCapsule type="capsule"></backCapsule>
		<navigationBar name="个人主页"></navigationBar>
		<view v-if="personalInfo.bg_img" class="banner" :style="'background-image: url(' + personalInfo.bg_img + ');'">
			<view class="infoBox">
				<image class="header circle" :src="personalInfo.user_head_sculpture" mode="aspectFill"></image>
				<view class="name fs-40">{{ personalInfo.user_nick_name }}</view>
				<view v-if="personalId == uid">
					<view class="flex numberBox">
						<view>
							<text class="bold fs-40">{{ personalInfo.trailing }}</text>
							获赞
						</view>
						<!-- <view>
							<text class="bold fs-40">2</text>
							赞
						</view> -->
						<view>
							<text class="bold fs-40">{{ personalInfo.user_track }}</text>
							关注
						</view>
						<view>
							<text class="bold fs-40">{{ personalInfo.user_fs }}</text>
							粉丝
						</view>
					</view>
					<view class="autograph fs-26">{{ personalInfo.autograph || '这个人很懒，什么都没说' }}</view>
				</view>
				<view class="myBtnBox flex-between fs-26">
					<view class="flex-center" style="background-color: rgba(255,255,255,0.1);">
						<button open-type="share" class="share flex-center" data-type="persional" style="width: 100%; height: 100%;">分享</button>
					</view>

					<view v-if="isAuthorized" style="width: 312rpx;">
						<view class="flex-center" style="width: 100%; height: 100%;" v-if="personalInfo.is_user == 0 && personalInfo.id != uid" @click="attention">关注</view>
						<view class="flex-center" style="width: 100%; height: 100%;" v-if="personalInfo.is_user == 1 && personalInfo.id != uid" @click="attention">取消关注</view>
						<view class="flex-center" style="width: 100%; height: 100%;" v-if="personalInfo.id == uid" @click="signIn">打卡</view>
					</view>
					<view v-else style="width: 312rpx;">
						<button open-type="getUserInfo" class="share flex-center" @getuserinfo="getUserInfo" @click.stop="" style="width: 100%; height: 100%;">关注</button>
					</view>

					<view class="flex-center">举报</view>
				</view>
			</view>
			<!-- <image class="header circle" :src="personalInfo.user_head_sculpture" mode="aspectFill"></image>
			<view class="btnBox flex-between fs-26">
				<view class="flex-center gz" v-if="personalInfo.is_user == 0 && personalInfo.id != uid" @click="attention">关注</view>
				<view class="flex-center gz" v-if="personalInfo.is_user == 1 && personalInfo.id != uid" @click="attention">取消关注</view>
				<view class="flex-center sx">私信</view>
			</view> -->
		</view>

		<view v-if="personalId == uid" style="height: 320rpx;"></view>
		<view v-else style="height: 160rpx;"></view>

		<!-- <view class="info">
			<view class="fs-46 bold">{{ personalInfo.user_nick_name }}</view>
			<view class="fs-26 fc-9">{{ personalInfo.autograph }}</view>
		</view>
		<view class="myNum flex fs-30">
			<view>
				<text class="bold fs-40">{{ personalInfo.trailing }}</text>
				圈子
			</view>
			<view>
				<text class="bold fs-40">2</text>
				赞
			</view>
			<view>
				<text class="bold fs-40">{{ personalInfo.user_track }}</text>
				关注
			</view>
			<view>
				<text class="bold fs-40">{{ personalInfo.user_fs }}</text>
				粉丝
			</view>
		</view> -->
		<view class="tabBox flex-around fs-30">
			<view :class="{ active: tabIndex == 0 }" @click="changeTab(0)"><text>作品</text></view>
			<view :class="{ active: tabIndex == 1 }" @click="changeTab(1)"><text>动态</text></view>
			<view :class="{ active: tabIndex == 2 }" @click="changeTab(2)"><text>赞</text></view>
		</view>
		<view v-if="tabIndex == 0" class="list-zp flex">
			<view class="item" v-for="(item, index) in dynamicList" :key="index" @click="goPlayPage(index)">
				<view class="imgBox">
					<image class="poster" :src="item.image_part[0]" mode="aspectFill"></image>
					<view class="mask flex">
						<!-- <image src="../../static/good.png" mode="widthFix"></image>
						<text class="fs-22">{{ item.info_zan_count }}</text> -->
					</view>
				</view>
				<!-- <view class="infoBox flex-column-between">
					<view class="cont fs-24" v-if="item.study_content">{{ item.study_content }}</view>
					<view class="flex-between">
						<view class="flex">
							<image class="circle header" :src="item.user_head_sculpture" mode="aspectFill"></image>
							<view class="fs-22 nickName">{{ item.user_nick_name }}</view>
						</view>
						<view v-if="isAuthorized" class="flex" @click.stop="videoGoodFun(item.id, index)">
							<image v-if="item.is_info_zan" class="good" src="../../static/like.png" mode="widthFix"></image>
							<image v-else class="good" src="../../static/like2.png" mode="widthFix"></image>
							<view class="fs-22">{{ item.info_zan_count }}</view>
						</view>
						<button v-else open-type="getUserInfo" class="share flex" @getuserinfo="getUserInfo" @click.stop="">
							<image class="good" src="../../static/like2.png" mode="widthFix"></image>
							<view class="fs-22">{{ item.info_zan_count }}</view>
						</button>
					</view>
				</view> -->
			</view>
		</view>
		<view v-if="tabIndex == 1">
			<!-- <dynamicList type="dynamic" :list="dynamicList" @goodFun="goodFun" @commentFun="commentFun" @attentionFun="attentionFun"></dynamicList>-->
			<!-- 图文动态 瀑布流 -->
			<view class="list-zp-dynamic flex-between">
				<view>
					<view
						v-if="index % 2 == 0"
						class="item"
						v-for="(item, index) in dynamicList"
						:key="index"
						@click="goPage('/pagesA/articleDetails/articleDetails?id=' + item.id)"
					>
						<view class="imgBox">
							<image :src="item.image_part[0]" mode="widthFix"></image>
							<view class="mask"></view>
						</view>
						<view class="infoBox flex-column-between">
							<view class="cont fs-24" v-if="item.study_content">{{ item.study_content }}</view>
							<view class="flex-between">
								<view class="flex">
									<image class="circle header" :src="item.user_head_sculpture" mode="aspectFill"></image>
									<view class="fs-22 nickName">{{ item.user_nick_name }}</view>
								</view>
								<view v-if="isAuthorized" class="flex" @click.stop="videoGoodFun(item.id, index)">
									<image v-if="item.is_info_zan" class="good" src="../../static/like.png" mode="widthFix"></image>
									<image v-else class="good" src="../../static/like2.png" mode="widthFix"></image>
									<view class="fs-22">{{ item.info_zan_count }}</view>
								</view>
								<button v-else open-type="getUserInfo" class="share flex" @getuserinfo="getUserInfo" @click.stop="">
									<image class="good" src="../../static/like2.png" mode="widthFix"></image>
									<view class="fs-22">{{ item.info_zan_count }}</view>
								</button>
							</view>
						</view>
					</view>
				</view>
				<view>
					<view
						v-if="index % 2 == 1"
						class="item"
						v-for="(item, index) in dynamicList"
						:key="index"
						@click="goPage('/pagesA/articleDetails/articleDetails?id=' + item.id)"
					>
						<view class="imgBox">
							<image :src="item.image_part[0]" mode="widthFix"></image>
							<view class="mask"></view>
						</view>
						<view class="infoBox flex-column-between">
							<view class="cont fs-24" v-if="item.study_content">{{ item.study_content }}</view>
							<view class="flex-between">
								<view class="flex">
									<image class="circle header" :src="item.user_head_sculpture" mode="aspectFill"></image>
									<view class="fs-22 nickName">{{ item.user_nick_name }}</view>
								</view>
								<view v-if="isAuthorized" class="flex" @click.stop="videoGoodFun(item.id, index)">
									<image v-if="item.is_info_zan" class="good" src="../../static/like.png" mode="widthFix"></image>
									<image v-else class="good" src="../../static/like2.png" mode="widthFix"></image>
									<view class="fs-22">{{ item.info_zan_count }}</view>
								</view>
								<button v-else open-type="getUserInfo" class="share flex" @getuserinfo="getUserInfo" @click.stop="">
									<image class="good" src="../../static/like2.png" mode="widthFix"></image>
									<view class="fs-22">{{ item.info_zan_count }}</view>
								</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="tabIndex == 2" class="list-zp flex">
			<!-- <dynamicList
				ref="dynamicList"
				type="dynamic"
				:list="dynamicList"
				@goodFun="goodFun"
				@commentFun="commentFun"
				@attentionFun="attentionFun"
				@playVideoFun="playVideoFun"
			></dynamicList> -->
			<view class="item" v-for="(item, index) in dynamicList" :key="index" @click="goPlayPage(index)">
				<!-- 视频 -->
				<view class="imgBox">
					<!-- <image v-if="item.study_type == 2" class="type video" src="../../static/play.png" mode="widthFix"></image>
					<image v-else class="type" src="../../static/shoot-img.png" mode="widthFix"></image> -->
					<image class="poster" :src="item.image_part[0]" mode="aspectFill"></image>
					<view class="mask flex"></view>
				</view>
			</view>
		</view>
		<view v-if="dynamicList.length == 0  && loadStatus=='nomore'" style="text-align: center; padding-top: 100rpx;">暂无数据</view>
		<loadMore v-else :status="loadStatus"></loadMore>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import dynamicList from '@/components/dynamic/dynamic.vue';
import personalCenterJs from './personalCenter.js';
export default {
	components: {
		dynamicList
	},
	...personalCenterJs
};
</script>

<style lang="scss">
@import './personalCenter.scss';
</style>
