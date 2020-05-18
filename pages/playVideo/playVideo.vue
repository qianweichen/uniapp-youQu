<template>
	<view>
		<backCapsule type="normal"></backCapsule>
		<!-- 视频 -->
		<swiper @change="changeSwiper" :current="videoIndex" vertical>
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
							<button open-type="share" class="share" :data-id="item.id" :data-content="item.study_content" :data-img="item.image_part[0]">
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
						<view class="userInfo flex" @click="goPage('/pages/personalCenter/personalCenter?id=' + item.user_id)">
							<view class="header circle">
								<image class="header-img circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
								<image class="add" src="../../static/tabbar/publish.png" mode="widthFix"></image>
							</view>
							<view>
								<view class="fs-28 bold">{{ item.user_nick_name }}</view>
								<view class="fs-22" style="color: #eee; padding-top: 14rpx;">{{ item.adapter_time }}</view>
							</view>
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
						<view class="more flex" v-if="item.huifu_count > 2">
							<view class="line"></view>
							<text class="fs-26" style="color: #999;">查看全部</text>
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
	</view>
</template>

<script>
export default {
	data() {
		return {
			videoIndex: 0, //当前视频下标
			videoContext: '', //视频对象
			progressNum: 0, //视频播放进度百分比
			showVideoPlayBtn: false, //控制播放按钮
			showVideoEndShare: false, //控制播放结束后的分享模块
			showCommentFlag: false, //评论弹窗
			showShareFlag: false, //控制分享弹出
			isAuthorized: false, //是否授权过
			videoPage: 1, //视频页码
			videoList: [], //视频列表
			commentPage: 1, //评论页码
			commentList: [], //评论列表
			commentContent: '', //评论内容
			twoComment: '', //二级评论内容
			showTwoLevCommentFlag: false, //控制二级评论box
			twoCommentId: '', //二级评论的回复id
			twoCommentUserId: '', //二级评论的回复用户id
			informContent: '', //举报输入内容
			showInformFlag: false ,//控制举报弹出
			deleteContent: '', //删除输入内容
			showDeleteFlag:false	,//控制删除弹出
			userId:''//用户id
		};
	},
	computed: {
		//是否显示删除按钮
		deleteBtnFlag() {
			if (this.videoList.length == 0) return false;
			var sameUser = this.videoList[this.videoIndex].user_id == uni.getStorageSync('userId');
			var adAdmin = this.videoList[this.videoIndex]['check_qq'] == 'da';
			var xiaoAdmin = this.videoList[this.videoIndex]['check_qq'] == 'xiao';
			if (sameUser || adAdmin || xiaoAdmin) {
				return true;
			}
			return false;
		}
	},
	methods: {
		//删除
		deleteVideo(){
			if (this.deleteContent == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				})
				return;
			}
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.request({
				url: this.apiUrl + 'User/del_article',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					paper_id:this.videoList[this.videoIndex].id,
					is_qq_text: this.deleteContent
				},
				success: res => {
					console.log("删除",res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.deleteContent = '';
					this.toggleDelete(false);
				},
			});
		},
		toggleDelete(flag){
			if (flag) {
				//关闭上一个弹出
				this.toggleShareBox(false);
			}
			this.showDeleteFlag = flag;
		},
		//举报
		sendInform() {
			if (this.informContent == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				})
				return;
			}
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.request({
				url: this.apiUrl + 'User/add_paper_complaint',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.videoList[this.videoIndex].id,
					uid: uni.getStorageSync('userId'),
					tale_type: 0, //0举报 1禁言
					content: this.informContent
				},
				success: res => {
					// console.log("举报:",res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.this.informContent = '';
					this.toggleInform(false);
				},
			});
		},
		toggleInform(flag) {
			if (flag) {
				//关闭上一个弹出
				this.toggleShareBox(false);
			}
			this.showInformFlag = flag;
		},
		//控制二级评论box
		toggleTwoLevComment(flag, id, userId) {
			this.showTwoLevCommentFlag = flag;
			//回复id
			if (id) {
				this.twoCommentId = id;
			}
			// 回复者id
			if (userId) {
				this.twoCommentUserId = userId;
			}
		},
		//切换分享弹出层
		toggleShareBox(flag) {
			this.showShareFlag = flag;
		},
		//滑动视频
		changeSwiper(e) {
			this.showVideoEndShare = false; //重置结束弹窗
			this.showVideoPlayBtn = false; //重置暂停按钮
			this.progressNum = 0; //重置百分比
			this.videoIndex = e.detail.current; //设置视频下标
			this.videoContext = uni.createVideoContext('myVideo', this); //获取视频对象

			if ((e.detail.current + 3) % 15 == 0) {
				this.getVideoList();
			}
		},
		getVideoList(isFirstPage){
			uni.showLoading({
				title: '加载中'
			});
			if (isFirstPage) {
				this.videoPage = 1;
				this.dynamicList = [];
			}
			this.request({
				url: this.apiUrl + 'User/get_my_list',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.userId,
					uid: uni.getStorageSync('userId'),
					index_page: this.videoPage,
					version:2
				},
				success: res => {
					uni.hideLoading();
					console.log("动态:", res);
					this.videoPage++;
					for (var i = 0; i < res.data.info.length; i++) {
						this.videoList = this.videoList.concat(res.data.info[i].list);
					}
					if (res.data.info.length == 0) {
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none'
						})
					}
				},
			});
		},
		//视频播放结束
		videoPlayEnd() {
			this.showVideoEndShare = true;
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
			this.showVideoPlayBtn = false; //重置暂停按钮
			this.showVideoEndShare = false; //重置暂停按钮
		},
		//评论弹窗
		showCommentFun() {
			this.showCommentFlag = true;
			// 重置后请求第一页
			this.commentPage = 1;
			this.commentList = [];
			this.getCommentList();
		},
		hideCommentFun() {
			this.showCommentFlag = false;
		},
		//评论
		sendComment() {
			if (this.commentContent == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				})
				return;
			}
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.request({
				url: this.apiUrl + 'User/add_paper_reply',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.videoList[this.videoIndex].id,
					uid: uni.getStorageSync('userId'),
					reply_type: 0,
					text: this.commentContent
				},
				success: res => {
					console.log("评论:", res);
					this.commentContent = '';
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})
					this.showCommentFun(); //重新加载评论
					this.videoList[this.videoIndex].study_repount++; //评论数+1
				},
			});

		},
		//发送二级评论
		sendTwoLevComment() {
			if (this.twoComment == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				})
				return;
			}
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.request({
				url: this.apiUrl + 'User/add_paper_reply_duplex',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					id: this.twoCommentId,
					user_id: this.twoCommentUserId,
					duplex_content: this.twoComment
				},
				success: res => {
					console.log("发送二级评论:", res);
					this.twoComment = '';
					this.showTwoLevCommentFlag = false;
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})
					this.showCommentFun();
				},
			});
		},
		//获取评论
		getCommentList() {
			this.request({
				url: this.apiUrl + 'User/get_article_huifu',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.videoList[this.videoIndex].id,
					uid: uni.getStorageSync('userId'),
					page: this.commentPage,
					show_type: 'all'
				},
				success: res => {
					console.log("获取评论:", res);
					this.commentPage++;
					this.commentList = this.commentList.concat(res.data.huifu);
				},
			});
		},
		//点赞
		goodFun(id, index) {
			this.request({
				url: this.apiUrl + 'User/add_user_zan',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id,
					uid: uni.getStorageSync('userId'),
					applaud_type: 0,
					zan_type: this.videoList[index]['is_info_zan'] == true ? 1 : 0
				},
				success: res => {
					console.log("点赞:", res);
					this.videoList[index]['is_info_zan'] = !this.videoList[index]['is_info_zan'];
					this.videoList[index]['info_zan_count'] = res.data.info_zan_count;
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
				},
			});
		},
		//回复的消息点赞
		commentGoodFun(id, index) {
			this.request({
				url: this.apiUrl + 'User/add_paper_prely',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.videoList[this.videoIndex].id,
					uid: uni.getStorageSync('userId'),
					hui_id: id
				},
				success: res => {
					console.log("回复的消息点赞", res);
					this.commentList[index]['is_huifu_zan'] = !this.commentList[index]['is_huifu_zan'];
					if (this.commentList[index]['is_huifu_zan']) {
						this.commentList[index]['is_huifu_zan_count'] = this.commentList[index]['is_huifu_zan_count'] + 1;
						uni.showToast({
							title: '点赞成功',
							icon: 'none'
						});
					} else {
						this.commentList[index]['is_huifu_zan_count'] = this.commentList[index]['is_huifu_zan_count'] - 1;
						uni.showToast({
							title: '取消成功',
							icon: 'none'
						});
					}
				},
			});
		},
		//授权
		getUserInfo(e) {
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
			});
		}
	},
	onLoad() {
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		//获取数据
		var playVideoPageData = uni.getStorageSync('playVideoPageData');
		if(playVideoPageData){
			this.videoList = playVideoPageData.videoList;
			this.videoPage = playVideoPageData.page;
			this.userId = playVideoPageData.id;
			this.videoIndex = playVideoPageData.index;
			//获取视频对象
			this.videoContext = uni.createVideoContext('myVideo', this);
			uni.removeStorageSync('playVideoPageData');
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
