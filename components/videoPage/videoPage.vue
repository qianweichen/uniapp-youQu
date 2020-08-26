<!-- 上下滑动视频页

	import videoBox from '@/components/videoPage/videoPage.vue';
	components:{
		videoBox
	},
									@loginFun:刷新数据	@getNextPage:获取下一页数据函数默认15条，在倒数第二条时请求											index:视频初始下标，不填默认为0
	<videoBox :videoList="videoList" @loginFun="getList" @getNextPage="getHomeList" @goodFun="goodFun" @commentFun="commentFun" @attentionFun="attentionFun" :index="videoIndex"></videoBox>
	
	//点赞后修改数据
	goodFun(index, num) {
		this.videoList[index]['is_info_zan'] = !this.videoList[index]['is_info_zan']; //修改点赞状态
		this.videoList[index]['info_zan_count'] = num; //修改点赞数
	},
	//评论后修改数据
	commentFun(index) {
		this.videoList[index].study_repount++; //评论数+1
	},
	//关注后修改数据
	attentionFun(index,state) {
		this.videoList[index].is_follow = state;
	},
 -->
<template>
	<view style="height: 100%;">
		<!-- 视频 -->
		<swiper class="video-swiper" @change="changeSwiper" :current="videoIndex" vertical>
			<swiper-item v-for="(item, index) in videoList" :key="index">
				<view class="videoBox" v-if="(index + 1) % 6 != 0 || parentPage != 'home'" @click="clickVideo(item.id, index)">
					<!-- 只显示一个视频，ios缓存有问题，没法同时放3个，遇到长视频会卡 -->
					<video
						v-if="videoIndex == index"
						:id="'myVideo' + index"
						:src="item.study_video"
						:show-center-play-btn="false"
						:controls="false"
						loop
						@timeupdate="videoTimeUpdate"
						@play="videoPlayStard"
						@error="videoPlayerror"
					></video>
					<!-- 节流:只显示3个swiper中的内容 -->
					<view v-if="videoIndex == index || videoIndex + 1 == index || videoIndex - 1 == index">
						<!-- 封面图 -->
						<view v-if="videoIndex != index || isLoadVideoShow" class="cover-img-group">
							<image class="cover-img" :src="item.image_part[0]" mode="aspectFit"></image>
						</view>
						<!-- 播放结束 -->
						<!-- <view class="playEndBox flex-center" v-if="showVideoEndShare">
							<view>
								<view class="fxd flex-between">
									<view class="line-left"></view>
									<view class="mid fc-f">分享到</view>
									<view class="line-right"></view>
								</view>
								<view class="flex-between endShareBox">
									<button open-type="share" class="share" data-type="video" :data-id="item.id" :data-content="item.study_content" :data-img="item.image_part[0]">
										<view class="endBtn flex-center"><image src="../../static/videoEnd1.png" mode="widthFix"></image></view>
									</button>
									<view class="endBtn flex-center" @click="goPage('/pages/mine/invitation')">
										<image src="../../static/videoEnd2.png" mode="widthFix"></image>
									</view>
								</view>
								<view class="flex-center endShareBox">
									<view @click="playVideo">
										<view class="endBtn flex-center"><image src="../../static/videoEnd3.png" mode="widthFix"></image></view>
										<view class="fc-f fs-24" style="text-align: center; padding-top: 20rpx;">重播</view>
									</view>
								</view>
							</view>
						</view> -->
						<!-- 载入中动画 -->
						<view v-if="isLoadVideoShow" class="donut"></view>
						<!-- 播放按钮 -->
						<image v-if="showVideoPlayBtn" @click.stop="playVideo" class="playBtn circle" src="../../static/icon-play.png" mode="widthFix"></image>
						<!-- 文案区域 -->
						<view class="contentBox" :class="isSmallScreen && parentPage == 'home' ? 'full-page' : ''">
							<view class="flex">
								<view class="realm-name-top" @click.stop="goPage('/pagesA/circle/circle?id=' + item.tory_id)">#{{ item.realm_name }}</view>
							</view>
							<view class="userInfo flex">
								<view class="header circle" @click.stop="goPage('/pages/personalCenter/personalCenter?id=' + item.user_id)">
									<image class="header-img circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
									<!-- <image v-if="item.user_id != userId && item.is_follow != 1" class="add" src="../../static/tabbar/publish.png" mode="widthFix"></image> -->
								</view>
								<view @click.stop="goPage('/pages/personalCenter/personalCenter?id=' + item.user_id)">
									<view class="fs-30 bold nick-name">{{ item.user_nick_name }}</view>
									<!-- <view class="fs-22" style="color: #eee; padding-top: 14rpx;">{{ item.adapter_time }}</view> -->
								</view>
								<view v-if="isAuthorized">
									<view v-if="item.is_follow == 0 || !item.is_follow" class="attention flex-center" @click.stop="attention(item.user_id, item.is_follow, index)">
										+关注
									</view>
								</view>
								<button v-else open-type="getUserInfo" class="share" @getuserinfo="getUserInfo"><view class="attention flex-center">+关注</view></button>
							</view>
							<view class="text fs-28" @click.stop="goPage('/pagesA/articleDetails/articleDetails?id=' + item.id)">{{ item.study_content }}</view>
							<view class="flex-between">
								<!-- <view class="circleName flex" @click="goPage('/pagesA/circle/circle?id=' + item.tory_id)">
									<view class="flex">
										<image class="circle" :src="item.realm_icon" mode="aspectFill"></image>
										<text class="fs-22">{{ item.realm_name }}</text>
									</view>
								</view> -->
								<!-- 评论滚动 -->
								<!-- <swiper class="comment-swiper" vertical circular autoplay interval="1500">
									<swiper-item v-for="(item, index) in item.pinglun" :key="index">
										<view class="fs-24">{{ item.reply_content }}</view>
									</swiper-item>
									<swiper-item v-if="item.pinglun.length == 1">
										<view class="fs-24">{{ item.pinglun[0].reply_content }}</view>
									</swiper-item>
									<swiper-item v-if="item.pinglun.length == 0"><view class="fs-24">暂无评论，期待您的精彩评论！</view></swiper-item>
									<swiper-item v-if="item.pinglun.length == 0"><view class="fs-24">暂无评论，期待您的精彩评论！</view></swiper-item>
								</swiper> -->
							</view>
						</view>
						<!-- 进度条 -->
						<view class="progress"><view :style="'width:' + progressNum + '%;'"></view></view>
						<!-- 点赞区域 -->
						<view class="btnBox fs-26" :class="isSmallScreen && parentPage == 'home' ? 'btnBox-full-page' : ''">
							<view v-if="isAuthorized && parentPage == 'home' && parentPageVideoType == 'recommend'">
								<view
									v-if="getRedNum < 4"
									class="progress-group"
									@click.stop="clickRed"
									:animation="getRedList[getRedNum].time <= watchTime ? redAnimationData : ''"
								>
									<cmd-progress
										width="40"
										status="success"
										type="circle"
										:percent="(watchTime / getRedList[getRedNum].time) * 100"
										:showInfo="false"
									></cmd-progress>
									<image src="../../static/redpak.png" mode="widthFix"></image>
								</view>
								<view v-else class="progress-group" @click.stop="clickRed" :animation="redAnimationData">
									<cmd-progress width="40" status="success" type="circle" :percent="100" :showInfo="false"></cmd-progress>
									<image src="../../static/redpak.png" mode="widthFix"></image>
								</view>
							</view>
							<view v-if="isAuthorized" @click.stop="goodFun(item.id, index)">
								<image class="opcity" :src="'../../static/like' + (item.is_info_zan ? '' : '_w') + '.png'" mode="widthFix"></image>
								<view>{{ item.info_zan_count }}</view>
							</view>
							<view v-else>
								<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
									<image class="opcity" :src="'../../static/like_w.png'" mode="widthFix"></image>
									<view>{{ item.info_zan_count }}</view>
								</button>
							</view>
							<view v-if="isAuthorized" @click.stop="showCommentFun">
								<image class="opcity" src="../../static/comment.png" mode="widthFix"></image>
								<view>{{ item.study_repount }}</view>
							</view>
							<view v-else>
								<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
									<image class="opcity" src="../../static/comment.png" mode="widthFix"></image>
									<view>{{ item.study_repount }}</view>
								</button>
							</view>
							<view v-if="isAuthorized" @click.stop="toggleShareBox(true)">
								<image src="../../static/wechat.png" mode="widthFix" :animation="isAnimationDataShow ? animationData : ''"></image>
								<view>分享</view>
							</view>
							<view v-else>
								<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
									<image src="../../static/wechat.png" mode="widthFix" :animation="isAnimationDataShow ? animationData : ''"></image>
									<view>分享</view>
								</button>
							</view>
						</view>
					</view>
				</view>
				<!-- 全屏广告 -->
				<view v-else-if="videoIndex == index || videoIndex + 1 == index || videoIndex - 1 == index" class="videoBox">
					<ad-custom class="ad-custom" :class="isSmallScreen ? 'smallScreen' : ''" unit-id="adunit-a556114efa3c01c5"></ad-custom>
				</view>
			</swiper-item>
		</swiper>
		<!-- 评论区域 -->
		<view v-if="showCommentFlag">
			<view class="mask" @click="hideCommentFun"></view>
			<view class="comment">
				<view class="title flex-center">
					<text class="fs-26">全部评论 ({{ videoList[videoIndex].study_repount }})</text>
					<image @click="hideCommentFun" src="../../static/close.png" mode="widthFix"></image>
				</view>
				<scroll-view class="listBox" scroll-y="true" @scrolltolower="getCommentList">
					<view class="list" v-if="commentList.length > 0">
						<block v-for="(item, index) in commentList" :key="index">
							<view class="item flex" @click="toggleTwoLevComment(true, item.id, item.user_id)">
								<image class="header circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
								<view class="content">
									<view class="fs-26 bold" style="color: #777;">{{ item.user_nick_name }}</view>
									<view>
										<text class="fs-30">{{ item.reply_content }}</text>
										<text class="fs-26" style="color: #999;">{{ item.apter_time }}</text>
									</view>
								</view>
								<view class="likeBox" @click.stop="commentGoodFun(item.id, index)">
									<image class="like" :src="'../../static/like' + (item.is_huifu_zan ? '' : '2') + '.png'" mode="widthFix"></image>
									<view class="fs-26" :style="'color: #' + (false ? '999' : '7364BD') + ';'">{{ item.is_huifu_zan_count }}</view>
								</view>
								<view v-if="deleteBtnFlag" class="likeBox" @click.stop="delInfoIpt(item.paper_id, item.id)">
									<image class="like" src="../../static/del-cmt.png" mode="widthFix"></image>
								</view>
							</view>
							<!-- 二级评论 -->
							<view class="secondaryComment item flex" v-for="(items, indexs) in item.huifu_info_list" :key="indexs">
								<image class="header circle" :src="items.user_head_sculpture" mode="aspectFill"></image>
								<view class="content">
									<view class="fs-26 bold" style="color: #777;">{{ items.user_nick_name }}</view>
									<view>
										<text class="fs-30">{{ items.duplex_content }}</text>
										<text class="fs-26" style="color: #999;">{{ items.duplex_time }}</text>
									</view>
								</view>
								<!-- <view class="likeBox">
									<image class="like" src="../../static/like2.png" mode="widthFix"></image>
									<view class="fs-26" :style="'color: #' + (false ? '999' : '7364BD') + ';'">205</view>
								</view> -->
							</view>
							<!-- 查看全部 -->
							<view class="more flex" v-if="item.huifu_count > 2" @click="getMoreComment(item.id, item.user_id)">
								<view class="line"></view>
								<text class="fs-26" style="color: #999;">查看全部{{ item.huifu_count }}条评论</text>
							</view>
						</block>
					</view>
					<view v-else style="text-align: center; padding-top: 200rpx;">暂无评论</view>
				</scroll-view>
				<view class="sendComment flex-between">
					<input type="text" placeholder="留下你的精彩评论吧" maxlength="30" v-model="commentContent" />
					<image class="send" src="../../static/send.png" mode="widthFix" @click="sendComment"></image>
				</view>
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
					<view style="text-align:right; font-size:24rpx;">{{ twoComment.length }}/200</view>
					<textarea fixed="true" placeholder="说点什么..." v-model="twoComment" auto-focus maxlength="200"></textarea>
				</view>
			</view>
		</view>
		<!-- 分享弹窗 -->
		<view v-if="showShareFlag">
			<view class="mask" @click="toggleShareBox(false)"></view>
			<view class="shareBox flex-around">
				<view class="flex-between">
					<view @click="makeBanner">
						<image src="../../static/icon-pyq.png" mode="widthFix"></image>
						<view class="fs-22">朋友圈</view>
					</view>
					<view>
						<button
							open-type="share"
							class="share"
							data-type="video"
							:data-id="videoList[videoIndex].id"
							:data-content="videoList[videoIndex].study_content"
							:data-img="videoList[videoIndex].image_part[0]"
						>
							<image src="../../static/wechat.png" mode="widthFix"></image>
							<view class="fs-22">微信好友</view>
						</button>
					</view>
				</view>
				<view class="line"></view>
				<view :class="deleteBtnFlag ? 'flex-between' : 'flex-center'">
					<view @click="toggleInform(true)">
						<image src="../../static/icon-jb.png" mode="widthFix"></image>
						<view class="fs-22">举报</view>
					</view>
					<view v-if="deleteBtnFlag" @click="toggleDelete(true)">
						<image src="../../static/icon-del.png" mode="widthFix"></image>
						<view class="fs-22">删除</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 举报信息填写 -->
		<view class="twoComment inform" v-if="showInformFlag">
			<view class="mask" @click="toggleInform(false)"></view>
			<view class="inputAlt-cont">
				<view class="inputAlt-cont-head flex-between">
					<view @click="toggleInform(false)">取消</view>
					<view @click="sendInform">举报</view>
				</view>
				<view class="inputAlt-cont-ipt">
					<view style="text-align:right; font-size:24rpx;">{{ informContent.length }}/200</view>
					<textarea fixed="true" placeholder="请具体说明问题,我们将尽快处理" v-model="informContent" auto-focus maxlength="200"></textarea>
				</view>
			</view>
		</view>
		<!-- 删除视频信息填写 -->
		<view class="twoComment inform" v-if="showDeleteFlag">
			<view class="mask" @click="toggleDelete(false)"></view>
			<view class="inputAlt-cont">
				<view class="inputAlt-cont-head flex-between">
					<view @click="toggleDelete(false)">取消</view>
					<view @click="deleteVideo">删除</view>
				</view>
				<view class="inputAlt-cont-ipt">
					<view style="text-align:right; font-size:24rpx;">{{ deleteContent.length }}/200</view>
					<textarea fixed="true" placeholder="请说明删除原因" v-model="deleteContent" auto-focus maxlength="200"></textarea>
				</view>
			</view>
		</view>
		<!-- 删除回复信息填写 -->
		<view class="twoComment inform" v-if="showDelInfoFlag">
			<view class="mask" @click="showDelInfoFlag = false"></view>
			<view class="inputAlt-cont">
				<view class="inputAlt-cont-head flex-between">
					<view @click="showDelInfoFlag = false">取消</view>
					<view @click="delComment">删除</view>
				</view>
				<view class="inputAlt-cont-ipt">
					<view style="text-align:right; font-size:24rpx;">{{ delCommentQuery.is_qq_text.length }}/200</view>
					<textarea fixed="true" placeholder="请说明删除原因" v-model="delCommentQuery.is_qq_text" auto-focus maxlength="200"></textarea>
				</view>
			</view>
		</view>

		<!-- 海报 -->
		<view v-if="showBannerFlag">
			<view class="mask"></view>
			<view class="bannerBox flex-center">
				<view>
					<view class="imgBox">
						<view class="modal-content" id="canvas-container" style="padding:0px; width:100%; height: 100%;">
							<canvas canvas-id="myCanvas" style="width:100%; background-color:#ffffff; height:100%;"></canvas>
						</view>
						<image @click="toggleBannerFlag(false)" class="close" src="../../static/close.png" mode="widthFix"></image>
					</view>
					<view class="btn-big fc-f flex-center" @click="saveBanner">保存图片</view>
					<view class="btn-big fc-f flex-center" style="margin-top: 20rpx;" @click="toggleBannerFlag(false)">关闭</view>
				</view>
			</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import videoPageJs from './videoPage.js';
import cmdProgress from '@/components/cmd-progress/cmd-progress';
export default {
	components: {
		cmdProgress
	},
	...videoPageJs
};
</script>

<style lang="scss">
@import './videoPage.scss';
</style>
