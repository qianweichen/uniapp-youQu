<template>
	<view class="page-home">
		<!-- tab -->
		<view class="topTab flex-center" :style="'height:' + (customBar + topCustomBar) + 'px;'">
			<view class="tabs flex-between fs-32">
				<view @click="changeTabs(true)">
					<text :class="{ active: tabsFlag }">推荐</text>
					<view v-if="tabsFlag" class="line"></view>
				</view>
				<view @click="changeTabs(false)">
					<text :class="{ active: !tabsFlag }">关注</text>
					<view v-if="!tabsFlag" class="line"></view>
				</view>
			</view>
			<image @click="goPage('/pages/search/search')" class="search" src="../../static/search.png" mode="widthFix"></image>
		</view>
		<view :style="'height:' + (customBar + topCustomBar) + 'px;'"></view>
		<!-- 视频 -->
		<swiper @change="changeSwiper" vertical :style="'height:calc(100% - ' + (customBar + topCustomBar) + 'px);'">
			<swiper-item v-for="(item, index) in videoList" :key="index">
				<view class="videoBox" v-if="index == videoIndex">
					<video @click="pauseVideo" id="myVideo" :src="item.study_video" :controls="false" autoplay @timeupdate="videoTimeUpdate" @ended="videoPlayEnd"></video>
					<!-- 播放结束 -->
					<view class="playEndBox" v-if="showVideoEndShare">
						<view class="fxd flex-between">
							<view class="line-left"></view>
							<view class="mid fc-f">分享到</view>
							<view class="line-right"></view>
						</view>
						<view class="flex-between endShareBox">
							<button open-type="share" class="share">
								<view class="endBtn flex-center"><image src="../../static/videoEnd1.png" mode="widthFix"></image></view>
							</button>
							<view class="endBtn flex-center" @click="goPage('/pages/mine/invitation')"><image src="../../static/videoEnd2.png" mode="widthFix"></image></view>
						</view>
						<view class="flex-center endShareBox">
							<view @click="playVideo">
								<view class="endBtn flex-center"><image src="../../static/videoEnd3.png" mode="widthFix"></image></view>
								<view class="fc-f fs-24" style="text-align: center; padding-top: 20rpx;">重播</view>
							</view>
						</view>
					</view>
					<!-- 播放按钮 -->
					<view v-if="showVideoPlayBtn" @click="playVideo" class="playBtn circle flex-center"><image src="../../static/play.png" mode="widthFix"></image></view>
					<!-- 文案区域 -->
					<view class="contentBox">
						<view class="userInfo flex">
							<view class="header circle">
								<image class="header-img circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
								<image class="add" src="../../static/tabbar/publish.png" mode="widthFix"></image>
							</view>
							<view>
								<view class="fs-28 bold">{{ item.user_nick_name }}</view>
								<view class="fs-22" style="color: #eee; padding-top: 14rpx;">{{ item.adapter_time }}</view>
							</view>
						</view>
						<view class="text fs-28">{{ item.study_content }}</view>
						<view class="circleName flex-center">
							<view class="flex">
								<image class="circle" :src="item.realm_icon" mode="aspectFill"></image>
								<text class="fs-22">{{ item.realm_name }}</text>
							</view>
						</view>
					</view>
					<!-- 进度条 -->
					<view class="progress"><view :style="'width:' + progressNum + '%;'"></view></view>
					<!-- 点赞区域 -->
					<view class="btnBox fs-26">
						<view v-if="isAuthorized" @click="goodFun(item.id, index)">
							<image :src="'../../static/like' + (item.is_info_zan?'':'2') + '.png'" mode="widthFix"></image>
							<view>{{item.info_zan_count}}</view>
						</view>
						<view v-else>
							<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
								<image src="../../static/like.png" mode="widthFix"></image>
								<view>{{item.info_zan_count}}</view>
							</button>
						</view>
						<view v-if="isAuthorized" @click="showCommentFun">
							<image src="../../static/comment.png" mode="widthFix"></image>
							<view>{{item.study_repount}}</view>
						</view>
						<view v-else>
							<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
								<image src="../../static/comment.png" mode="widthFix"></image>
								<view>{{item.study_repount}}</view>
							</button>
						</view>
						<view @click="toggleShareBox(true)">
							<image src="../../static/wechat.png" mode="widthFix"></image>
							<view>分享</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<!-- 评论区域 -->
		<view class="mask" @click="hideCommentFun" v-if="showCommentFlag"></view>
		<view class="comment" v-if="showCommentFlag">
			<view class="title flex-center">
				<text class="fs-26">全部评论 (1350)</text>
				<image @click="hideCommentFun" src="../../static/close.png" mode="widthFix"></image>
			</view>
			<scroll-view class="listBox" scroll-y="true" @scrolltolower="getCommentList">
				<view class="list">
					<block v-for="(item, index) in commentList" :key="index">
						<view class="item flex" @click="toggleTwoLevComment(true,item.id,item.user_id)">
							<image class="header circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
							<view class="content">
								<view class="fs-26 bold" style="color: #777;">{{item.user_nick_name}}</view>
								<view>
									<text class="fs-30">{{item.reply_content}}</text>
									<text class="fs-26" style="color: #999;">{{item.apter_time}}</text>
								</view>
							</view>
							<view class="likeBox" @click="commentGoodFun(item.id,index)">
								<image class="like" :src="'../../static/like'+(item.is_huifu_zan?'':'2')+'.png'" mode="widthFix"></image>
								<view class="fs-26" :style="'color: #' + (false ? '999' : '7364BD') + ';'">{{item.is_huifu_zan_count}}</view>
							</view>
						</view>
						<!-- 二级评论 -->
						<view class="secondaryComment item flex" v-for="(items,indexs) in item.huifu_info_list" :key="indexs">
							<image class="header circle" :src="items.user_head_sculpture" mode="aspectFill"></image>
							<view class="content">
								<view class="fs-26 bold" style="color: #777;">{{items.user_nick_name}}</view>
								<view>
									<text class="fs-30">{{items.duplex_content}}</text>
									<text class="fs-26" style="color: #999;">{{items.duplex_time}}</text>
								</view>
							</view>
							<!-- <view class="likeBox">
								<image class="like" src="../../static/like2.png" mode="widthFix"></image>
								<view class="fs-26" :style="'color: #' + (false ? '999' : '7364BD') + ';'">205</view>
							</view> -->
						</view>
						<!-- 查看全部 -->
						<view class="more flex" v-if="item.huifu_count>2">
							<view class="line"></view>
							<text class="fs-26" style="color: #999;">查看全部</text>
						</view>
					</block>
				</view>
			</scroll-view>
			<view class="sendComment flex-between">
				<input type="text" placeholder="留下你的精彩评论吧" maxlength="30" v-model="commentContent" />
				<image class="send" src="../../static/send.png" mode="widthFix" @click="sendComment"></image>
			</view>
		</view>
		<!-- 二级评论 -->
		<view class="twoComment" v-if="showTwoLevCommentFlag">
			<view class="mask" @click="toggleTwoLevComment(false)"></view>
			<view class="inputAlt-cont">
			    <view class="inputAlt-cont-head flex-between">
			      <view @click="toggleTwoLevComment(false)">取消</view>
			      <view @click="sendTwoLevComment">发布</view>
			    </view>
			    <view class="inputAlt-cont-ipt">
			      <view style="text-align:right; font-size:24rpx;">{{twoComment.length}}/200</view>
			      <textarea fixed="true" placeholder="说点什么..." v-model="twoComment" auto-focus maxlength="200"></textarea>
			    </view>
			  </view>
		</view>
		<!-- 分享弹窗 -->
		<view v-if="showShareFlag">
			<view class="mask" @click="toggleShareBox(false)"></view>
			<view class="shareBox flex-around">
				<view class="flex-between">
					<view @click="goPage('/pages/mine/invitation')">
						<image src="../../static/icon-pyq.png" mode="widthFix"></image>
						<view class="fs-22">朋友圈</view>
					</view>
					<view>
						<button open-type="share" class="share">
							<image src="../../static/wechat.png" mode="widthFix"></image>
							<view class="fs-22">微信好友</view>
						</button>
					</view>
				</view>
				<view class="line"></view>
				<view class="flex-between">
					<view>
						<image src="../../static/icon-jb.png" mode="widthFix"></image>
						<view class="fs-22">举报</view>
					</view>
					<view>
						<image src="../../static/icon-del.png" mode="widthFix"></image>
						<view class="fs-22">删除</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import homeJs from './home.js';
export default {
	...homeJs
};
</script>

<style lang="scss">
@import './home.scss';
</style>
