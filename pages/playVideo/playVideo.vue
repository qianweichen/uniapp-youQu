<template>
	<view>
		<backCapsule type="normal"></backCapsule>
		<!-- 视频 -->
		<swiper @change="changeSwiper" vertical :style="'height:calc(100% - ' + (customBar + 10) + 'px);'">
			<swiper-item v-for="(item, index) in 3" :key="index">
				<view class="videoBox" v-if="index == videoIndex">
					<video
						@click="pauseVideo"
						id="myVideo"
						src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
						:controls="false"
						autoplay
						@timeupdate="videoTimeUpdate"
					></video>
					<!-- 播放按钮 -->
					<view v-if="showVideoPlayBtn" @click="playVideo" class="playBtn circle flex-center"><image src="../../static/play.png" mode="widthFix"></image></view>
					<!-- 文案区域 -->
					<view class="contentBox">
						<view class="userInfo flex">
							<view class="header circle">
								<image class="header-img circle" src="../../static/logo.png" mode="aspectFill"></image>
								<image class="add" src="../../static/tabbar/publish.png" mode="widthFix"></image>
							</view>
							<view>
								<view class="fs-28 bold">娜比小仙女</view>
								<view class="fs-22" style="color: #908E99; padding-top: 14rpx;">10分钟前</view>
							</view>
						</view>
						<view class="text fs-28">如果开心太难，那我愿你每夜无梦好眠， 晚安，各位圈友。太难，那我愿你每夜无梦好眠， 晚安，各位圈友</view>
						<view class="circleName flex-center">
							<view class="flex">
								<image class="circle" src="../../static/logo.png" mode="widthFix"></image>
								<text class="fs-22">情感专栏</text>
							</view>
						</view>
					</view>
					<!-- 进度条 -->
					<view class="progress"><view :style="'width:' + progressNum + '%;'"></view></view>
					<!-- 点赞区域 -->
					<view class="btnBox fs-26">
						<view>
							<image src="../../static/like.png" mode="widthFix"></image>
							<view>320</view>
						</view>
						<view @click="showCommentFun">
							<image src="../../static/comment.png" mode="widthFix"></image>
							<view>280</view>
						</view>
						<view>
							<button class="share" open-type="share">
								<image src="../../static/wechat.png" mode="widthFix"></image>
								<view>分享</view>
							</button>
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
			<scroll-view class="listBox" scroll-y="true">
				<view class="list">
					<block v-for="(item, index) in 5" :key="index">
						<view class="item flex">
							<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
							<view class="content">
								<view class="fs-26 bold" style="color: #777;">name</view>
								<view>
									<text class="fs-30">睡得好好的给摇醒，就这服务态度，还 办卡？！</text>
									<text class="fs-26" style="color: #999;">昨天22:35</text>
								</view>
							</view>
							<view class="likeBox">
								<image class="like" src="../../static/like2.png" mode="widthFix"></image>
								<view class="fs-26" :style="'color: #' + (false ? '999' : '7364BD') + ';'">205</view>
							</view>
						</view>
						<!-- 二级评论 -->
						<view class="secondaryComment item flex">
							<image class="header circle" src="../../static/logo.png" mode="aspectFill"></image>
							<view class="content">
								<view class="fs-26 bold" style="color: #777;">name</view>
								<view>
									<text class="fs-30">睡得好好的给摇醒，就这服务态度，还 办卡？！</text>
									<text class="fs-26" style="color: #999;">昨天22:35</text>
								</view>
							</view>
							<view class="likeBox">
								<image class="like" src="../../static/like2.png" mode="widthFix"></image>
								<view class="fs-26" :style="'color: #' + (false ? '999' : '7364BD') + ';'">205</view>
							</view>
						</view>
						<!-- 查看全部 -->
						<view class="more flex">
							<view class="line"></view>
							<text class="fs-26" style="color: #999;">查看全部</text>
						</view>
					</block>
				</view>
			</scroll-view>
			<view class="sendComment flex-between">
				<input type="text" placeholder="留下你的精彩评论吧" maxlength="30" />
				<image class="send" src="../../static/send.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			videoIndex: 0, //当前视频下标
			videoContext: '', //视频对象
			progressNum: 0, //视频播放进度百分比
			showVideoPlayBtn: false ,//控制播放按钮
			showCommentFlag:false	//评论弹窗
		};
	},
	methods:{
		//滑动视频
		changeSwiper(e) {
			this.progressNum = 0; //重置百分比
			this.videoIndex = e.detail.current; //设置视频下标
			this.videoContext = uni.createVideoContext('myVideo', this); //获取视频对象
		},
		// 视频进度改变
		videoTimeUpdate(e) {
			this.progressNum = (e.detail.currentTime / e.detail.duration) * 100;
		},
		//暂停视频
		pauseVideo() {
			this.videoContext.stop();
			this.showVideoPlayBtn = true;
		},
		//播放视频
		playVideo() {
			this.videoContext.play();
			this.showVideoPlayBtn = false;
		},
		//评论弹窗
		showCommentFun(){
			this.showCommentFlag = true;
		},
		hideCommentFun(){
			this.showCommentFlag = false;
		}
	}
};
</script>

<style lang="scss">
@import '@/pages/home/home.scss';
swiper{
	height: 100vh;
}
</style>
