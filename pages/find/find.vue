<template>
	<view class="page-find">
		<!-- tab -->
		<view class="topTab flex-center" :style="'height:' + customBar + 'px;' + 'padding-top:' + topCustomBar + 'px;'">
			<!-- <view class="tabs flex-between fs-32">
				<view @click="changeTabs(false)">
					<text :class="{ active: !tabsFlag }">动态</text>
					<view v-if="!tabsFlag" class="line"></view>
				</view>
				<view @click="changeTabs(true)">
					<text :class="{ active: tabsFlag }">圈子</text>
					<view v-if="tabsFlag" class="line"></view>
				</view>
			</view> -->
			<view class="fs-32">圈子</view>
			<image
				@click="goPage('/pages/search/search')"
				class="search"
				src="../../static/search.png"
				mode="widthFix"
				:style="'top: calc(50% - 20rpx + ' + topCustomBar / 2 + 'px);'"
			></image>
		</view>
		<view :style="'height:' + customBar + 'px;'"></view>

		<view class="dynamic" :style="'height: calc(100% - ' + (customBar + topCustomBar) + 'px);'">
			<!-- <scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="getDynamic" refresher-enabled @refresherrefresh="refreshDynamic" :refresher-triggered="refreshFlag"> -->
			<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="getDynamic" :scroll-top="scrollTop" scroll-with-animation>
				<view>
					<!-- 我加入的圈子 -->
					<view class="myCircle">
						<view class="title flex-between">
							<view class="left flex">
								<image src="../../static/like-c.png" mode="widthFix"></image>
								<text class="fs-32">我加入的圈子</text>
							</view>
							<view v-if="isAuthorized" class="right flex-center" @click="goPage('/pagesA/circle/creatCircle')">
								<image src="../../static/add.png" mode="widthFix"></image>
								<text class="fs-22">创建我的圈子</text>
							</view>
							<view v-else class="right flex-center">
								<button open-type="getUserInfo" class="share flex-center" @getuserinfo="getUserInfo">
									<image src="../../static/add.png" mode="widthFix"></image>
									<text class="fs-22">创建我的圈子</text>
								</button>
							</view>
						</view>
						<scroll-view class="list" scroll-x="true" @scrolltolower="getMyCircle">
							<view class="item item-new" v-for="(item, index) in myCircleList" :key="index" @click="goPage('/pagesA/circle/circle?id=' + item.id)">
								<view class="headerBox circle"><image class="circle" :src="item.realm_icon" mode="aspectFill"></image></view>
								<view class="fs-24 name">{{ item.realm_name }}</view>
							</view>
							<view v-if="myCircleList.length == 0" style="padding: 40rpx 0; text-align: center; color: #999;">没有加入任何圈子</view>
						</scroll-view>
						<!-- <scroll-view class="list" scroll-x="true" @scrolltolower="getMyCircle">
							<view class="item" v-for="(item, index) in myCircleList" :key="index" @click="goPage('/pagesA/circle/circle?id=' + item.id)">
								<view class="headerBox circle"><image class="circle" :src="item.realm_icon" mode="aspectFill"></image></view>
								<view class="bold fs-26 name">{{ item.realm_name }}</view>
								<view class="fs-20" style="color: #9A989E;">{{ item.realm_synopsis }}</view>
								<view class="join fs-22 flex-center">去圈子</view>
							</view>
							<view v-if="myCircleList.length == 0" style="padding: 40rpx 0; text-align: center; color: #999;">没有加入任何圈子</view>
						</scroll-view> -->
					</view>
					<!-- <image class="mid-banner" src="https://quanyu.udiao.cn/assets/img/banner.gif" mode="widthFix" @click="goPage('/pages/task/task')"></image> -->
					<!-- 玩转圈子享好礼 -->
					<view class="myCircle gift">
						<view class="title flex-between">
							<view class="left flex">
								<image src="../../static/like-c.png" mode="widthFix"></image>
								<text class="fs-32">玩转圈子享好礼</text>
							</view>
							<view v-if="isAuthorized" class="flex gift-right" @click="goPage('/pages/task/task')">
								<image class="icon-gift" src="../../static/gift-c.png" mode="widthFix"></image>
								<view class="fs-22">完成任务兑好礼</view>
								<image class="icon-right" src="../../static/right.png" mode="widthFix"></image>
							</view>
							<button v-else open-type="getUserInfo" class="share flex gift-right" @getuserinfo="getUserInfo">
								<image class="icon-gift" src="../../static/gift-c.png" mode="widthFix"></image>
								<view class="fs-22">完成任务兑好礼</view>
								<image class="icon-right" src="../../static/right.png" mode="widthFix"></image>
							</button>
						</view>
					</view>
					<view style="padding: 30rpx;">
						<ad-custom unit-id="adunit-41ae0353c959fde8"></ad-custom>
					</view>
					<!-- 为我推荐 -->
					<view class="myCircle recommend">
						<!-- <view class="title flex-between">
							<view class="left flex">
								<image src="../../static/good-c.png" mode="widthFix"></image>
								<text class="fs-32">为我推荐</text>
							</view>
							<view class="right flex-center" @click="getRecommendCircle(true, 1)">
								<image src="../../static/refresh.png" mode="widthFix"></image>
								<text class="fs-22">换一批</text>
							</view>
						</view> -->
						<view id="recommendCircle" class="recommend-list">
							<view class="item" v-for="(item, index) in recommendList" :key="index">
								<view v-if="index < (showMoreCircle ? 6 : 3)">
									<div class="flex-between">
										<view class="flex" @click="goPage('/pagesA/circle/circle?id=' + item.id)">
											<image class="header circle" :src="item.realm_icon" mode="aspectFill"></image>
											<view>
												<view class="fs-28 flex">
													<view>{{ item.realm_name }}</view>
													<view class="attention flex-center" v-if="item.attention == 1">私</view>
												</view>
												<view class="fs-20 synopsis">{{ item.realm_synopsis }}</view>
											</view>
										</view>
										<view @click="join(item.id, item.is_gzqz, index)" class="fs-28 join flex-center">{{ item.is_gzqz == 0 ? '加入' : '已加入' }}</view>
									</div>
									<scroll-view v-if="item.paper_list.length>0" class="list" scroll-x="true">
										<view
											class="video-item"
											v-for="(items, indexs) in item.paper_list"
											:key="indexs"
											@click="goPage('/pagesA/articleDetails/articleDetails?id=' + items.id)"
										>
											<image class="poster" :src="items.image_part[0]" mode="aspectFill"></image>
											<view class="info flex-between">
												<div class="flex">
													<image src="../../static/good.png" mode="widthFix"></image>
													<text>{{ items.study_laud }}</text>
												</div>
												<div>{{ items.adapter_time }}</div>
											</view>
										</view>
									</scroll-view>
									<view v-else class="no-data fs-26 fc-6">
										暂无作品展示
									</view>
								</view>
							</view>
							<view v-if="!showMoreCircle" class="fs-26 fc-a text-center" @click="getMoreCircle">查看更多＞</view>
							<view v-else class="fs-26 fc-a text-center flex-center" @click="getMoreCircle">
								<text>换一批</text>
								<image style="width: 30rpx; height: auto; margin-left: 10rpx;" src="../../static/refresh.png" mode="widthFix"></image>
							</view>
						</view>
						<!-- <view class="recommend-bubble" :animation="animationData">
							<view
								v-if="index < 8"
								@click="goPage('/pagesA/circle/circle?id=' + item.id)"
								class="bubble"
								:class="'bubble' + (index + 1)"
								v-for="(item, index) in recommendList"
								:key="index"
							>
								<image :src="item.realm_icon" mode="aspectFill"></image>
								<view class="bubble1-title fc-f flex-center">
									<view>{{ item.realm_name }}</view>
								</view>
							</view>
						</view> -->
					</view>
				</view>
				<!-- <swiper class="banner" indicator-dots autoplay @change="swiperChange" previous-margin="40rpx" next-margin="40rpx">
					<swiper-item class="flex" v-for="(item, index) in banners" :key="index">
						<image :src="item.playbill_url" mode="aspectFill" :style="index != swiperIndex ? 'height: 80%;' : ''"></image>
					</swiper-item>
				</swiper> -->
				<!-- 图文动态tab -->
				<!-- <view class="tabBox flex fs-30">
					<view :class="{ active: tabIndex == 0 }" @click="changeMidTab(0)"><text>推荐</text></view>
					<view v-if="isAuthorized" :class="{ active: tabIndex == 1 }" @click="changeMidTab(1)"><text>关注</text></view>
					<button v-else open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">关注</button>
				</view> -->
				<!-- 图文动态 瀑布流 -->
				<!-- <view class="list-zp flex-between">
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
				</view> -->
				<!-- <dynamicList type="dynamic" :list="dynamicList" @goodFun="goodFun" @commentFun="commentFun" @attentionFun="attentionFun"></dynamicList> -->
				<view v-if="dynamicList.length == 0 && loadStatus == 'nomore'" style="text-align: center; padding-top: 200rpx; color: #999;">暂无数据</view>
				<!-- <loadMore v-else :status="loadStatus"></loadMore> -->
			</scroll-view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import dynamicList from '@/components/dynamic/dynamic.vue';
import findJs from './find.js';
export default {
	...findJs,
	components: {
		dynamicList
	}
};
</script>

<style lang="scss">
@import '../home/home.scss';
@import './find.scss';
</style>
