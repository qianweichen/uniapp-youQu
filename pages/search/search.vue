<template>
	<view class="dark-bg page-search">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="搜索" haveHeight></navigationBar>
		<view class="searchBox">
			<view class="search flex-between">
				<view class="left flex">
					<image src="../../static/search.png" mode="widthFix"></image>
					<input class="fs-26" type="text" confirm-type="搜索" @confirm="search(true)" placeholder="请输入要搜索的内容" placeholder-class="fc-9" v-model="searchContent"/>
				</view>
				<view class="right fs-30 fc-f flex-center" @click="search(true)">搜索</view>
			</view>
		</view>
		<!-- 搜索前 -->
		<view v-if="!searched">
			<view class="history">
				<view class="item flex-between" v-for="(item,index) in searchHistory" :key="index">
					<view class="left flex" @click="chooseHistory(item)">
						<image src="../../static/time.png" mode="widthFix"></image>
						<view class="fs-26">{{item}}</view>
					</view>
					<view class="right" @click="delHistory(index)"><image src="../../static/close.png" mode="widthFix"></image></view>
				</view>
			</view>
			<!-- <view class="title fs-32 bold">猜你想搜</view>
			<view class="guess flex-between">
				<view v-for="(item,index) in 8" :key="index" class="flex fs-26">
					<view class="cont">giao哥遇上三枝花</view>
					<view class="hot flex-center fs-20">热</view>
					<view class="new flex-center fs-20">新</view>
				</view>
			</view> -->
		</view>
		<!-- 搜索后 -->
		<view v-else>
			<view class="tabBox flex-around fs-30">
				<view :class="{ active: tabIndex == 0 }" @click="changeTab(0)">
					<text>综合</text>
				</view>
				<view :class="{ active: tabIndex == 1 }" @click="changeTab(1)">
					<text>视频</text>
				</view>
				<view :class="{ active: tabIndex == 2 }" @click="changeTab(2)">
					<text>动态</text>
				</view>
				<view :class="{ active: tabIndex == 3 }" @click="changeTab(3)">
					<text>用户</text>
				</view>
				<!-- <view :class="{ active: tabIndex == 4 }" @click="changeTab(4)">
					<text>音乐</text>
				</view> -->
			</view>
			<!-- 综合 -->
			<view v-if="tabIndex == 0">
				<scroll-view class="circleList" scroll-x="true" @scrolltolower="getMyCircle">
					<!-- 圈子 -->
					<view class="item" v-for="(item, index) in circleList" :key="index" @click="goPage('/pages/circle/circle?id='+item.id)">
						<view class="headerBox circle"><image class="circle" :src="item.realm_icon" mode="aspectFill"></image></view>
						<view class="bold fs-26">{{item.realm_name}}</view>
						<view class="fs-20" style="color: #9A989E;">{{item.realm_synopsis}}</view>
						<view class="join fs-22 flex-center">去圈子</view>
						<!-- <view v-if="false" class="join fs-22 flex-center">已加入</view>
						<view v-else class="join no-join fs-22 flex-center">申请加入</view> -->
					</view>
				</scroll-view>
				<view v-if="circleList.length==0" class="flex-between creatCircle">
					<view>暂时没有{{searchContent}}的圈子</view>
					<view class="btn flex-center" @click="goPage('/pages/circle/creatCircle')">抢先申请</view>
				</view>
				<dynamicList type="dynamic" :list="dynamicList" @goodFun="goodFun" @commentFun="commentFun" @attentionFun="attentionFun" @playVideoFun="playVideoFun"></dynamicList> 
				<view v-if="dynamicList.length==0" style="text-align: center; padding-top: 300rpx; color: #999;">暂无数据</view>
			</view>
			<!-- 视频 -->
			<view v-if="tabIndex == 1">
				<view class="video flex-between">
					<view class="item" v-for="(item,index) in dynamicList" :key="index" @click="goPlayPage(index)">
						<image class="pic" :src="item.image_part[0]" mode="aspectFill"></image>
						<view class="infoBox">
							<view class="cont fs-28">
								{{ item.study_content }}
							</view>
							<view class="flex-between">
								<view class="flex">
									<image class="header circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
									<view class="fs-28">{{ item.user_nick_name }}</view>
								</view>
								<view class="flex">
									<image class="good" src="../../static/good.png" mode="widthFix"></image>
									<view class="fs-26">{{ item.info_zan_count }}</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="dynamicList.length==0" style="text-align: center; padding-top: 300rpx; color: #999; width: 100%;">暂无数据</view>
				</view>
			</view>
			<!-- 动态 -->
			<view v-if="tabIndex == 2">
				<dynamicList type="dynamic" :list="dynamicList" @goodFun="goodFun" @commentFun="commentFun"></dynamicList> 
				<view v-if="dynamicList.length==0" style="text-align: center; padding-top: 300rpx; color: #999;">暂无数据</view>
			</view>
			<!-- 用户 -->
			<view v-if="tabIndex == 3">
				<view class="user">
					<view class="item flex-between" v-for="(item,index) in dynamicList" :key="index" @click="goPage('/pages/personalCenter/personalCenter?id=' + item.id)">
						<view class="flex">
							<image class="header circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
							<view>
								<view class="fs-28 bold">{{item.user_nick_name}}</view>
								<view class="fs-22 fc-9">{{item.autograph||'这个人很懒，还没有编辑个性签名'}}</view>
								<!-- <view class="fs-22 fc-9">粉丝：236</view> -->
							</view>
						</view>
						<view v-if="item.is_user==0" class="right flex-center fs-28" @click.stop="attention(item.id,item.is_user,index)">关注</view>
						<view v-else class="right flex-center fs-28" @click.stop="attention(item.id,item.is_user,index)">取消关注</view>
					</view>
					<view v-if="dynamicList.length==0" style="text-align: center; padding-top: 300rpx; color: #999;">暂无数据</view>
				</view>
			</view>
			<!-- 音乐 -->
			<!-- <view v-if="tabIndex == 4">
				<view class="user music">
					<view class="item flex-between" v-for="(item,index) in 5" :key="index">
						<view class="flex">
							<view class="imgBox">
								<image class="header" src="../../static/logo.png" mode="aspectFill"></image>
								<image v-if="false" class="play" src="../../static/stop.png" mode="widthFix"></image>
								<image v-else class="play" src="../../static/play.png" mode="widthFix"></image>
							</view>
							<view>
								<view class="fs-30 bold">猫咪喂养人</view>
								<view class="fs-22 fc-9">BlackDD</view>
								<view class="fs-22 fc-9">03:17</view>
							</view>
						</view>
						<view class="right flex-center fs-28">使用</view>
					</view>
				</view>
			</view> -->
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import searchJs from './search.js';
import dynamicList from '@/components/dynamic/dynamic.vue';
export default {
	components:{
		dynamicList
	},
	...searchJs
};
</script>

<style lang="scss">
@import './search.scss';
</style>
