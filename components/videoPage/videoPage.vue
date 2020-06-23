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
		<swiper @change="changeSwiper" :current="videoIndex" vertical>
			<swiper-item v-for="(item, index) in videoList" :key="index">
				<view class="videoBox" v-if="index == videoIndex">
					<video
						@click="pauseVideo"
						id="myVideo"
						:src="item.study_video"
						:controls="false"
						autoplay
						@timeupdate="videoTimeUpdate"
						@ended="videoPlayEnd"
						@play="videoPlayStard"
					></video>
					<!-- 播放结束 -->
					<view class="playEndBox flex-center" v-if="showVideoEndShare">
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
								<view class="endBtn flex-center" @click="goPage('/pages/mine/invitation')"><image src="../../static/videoEnd2.png" mode="widthFix"></image></view>
							</view>
							<view class="flex-center endShareBox">
								<view @click="playVideo">
									<view class="endBtn flex-center"><image src="../../static/videoEnd3.png" mode="widthFix"></image></view>
									<view class="fc-f fs-24" style="text-align: center; padding-top: 20rpx;">重播</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 播放按钮 -->
					<!-- <view v-if="showVideoPlayBtn" @click="playVideo" class="playBtn circle flex-center"><image src="../../static/play.png" mode="widthFix"></image></view> -->
					<image v-if="showVideoPlayBtn" @click="playVideo" class="playBtn circle" src="../../static/icon-play.png" mode="widthFix"></image>

					<!-- 文案区域 -->
					<view class="contentBox">
						<view class="userInfo flex" @click="goPage('/pages/personalCenter/personalCenter?id=' + item.user_id)">
							<view class="header circle">
								<image class="header-img circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
								<!-- <image class="add" src="../../static/tabbar/publish.png" mode="widthFix"></image> -->
							</view>
							<view>
								<view class="fs-28 bold">{{ item.user_nick_name }}</view>
								<!-- <view class="fs-22" style="color: #eee; padding-top: 14rpx;">{{ item.adapter_time }}</view> -->
							</view>
							<view v-if="isAuthorized">
								<view
									v-if="item.user_id != userId && item.is_follow != 1"
									class="attention flex-center"
									@click.stop="attention(item.user_id, item.is_follow, index)"
								>
									<image v-if="item.is_follow != 1" src="../../static/add.png" mode="widthFix"></image>
									<view>关注</view>
								</view>
							</view>
							<button v-else open-type="getUserInfo" class="share" @getuserinfo="getUserInfo" @click.stop="">
								<view class="attention flex-center">
									<image src="../../static/add.png" mode="widthFix"></image>
									<view>关注</view>
								</view>
							</button>
						</view>
						<view class="text fs-28" @click="goPage('/pages/articleDetails/articleDetails?id=' + item.id)">{{ item.study_content }}</view>
						<view class="circleName flex" @click="goPage('/pages/circle/circle?id=' + item.tory_id)">
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
							<image :src="'../../static/like' + (item.is_info_zan ? '' : '2') + '.png'" mode="widthFix"></image>
							<view>{{ item.info_zan_count }}</view>
						</view>
						<view v-else>
							<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
								<image :src="'../../static/like' + (item.is_info_zan ? '' : '2') + '.png'" mode="widthFix"></image>
								<view>{{ item.info_zan_count }}</view>
							</button>
						</view>
						<view v-if="isAuthorized" @click="showCommentFun">
							<image src="../../static/comment.png" mode="widthFix"></image>
							<view>{{ item.study_repount }}</view>
						</view>
						<view v-else>
							<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
								<image src="../../static/comment.png" mode="widthFix"></image>
								<view>{{ item.study_repount }}</view>
							</button>
						</view>
						<view @click="toggleShareBox(true)">
							<image src="../../static/wechat.png" mode="widthFix" :animation="animationData"></image>
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
					<view @click="goPage('/pages/mine/invitation')">
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
		<!-- 删除信息填写 -->
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
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import videoPageJs from './videoPage.js';
export default {
	...videoPageJs
};
</script>

<style lang="scss">
@import './videoPage.scss';
</style>
