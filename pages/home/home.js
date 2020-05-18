export default {
	data() {
		return {
			shareVideoId: '', //接收分享来的id
			customBar: this.CustomBar,
			topCustomBar: this.StatusBar, //顶部状态栏高度
			tabsFlag: true, //推荐/喜欢
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
			showDeleteFlag:false	//控制删除弹出
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
		// 切换顶部tab
		changeTabs(flag) {
			this.tabsFlag = flag;
			//重置数据
			this.showVideoEndShare = false; //重置结束弹窗
			this.showVideoPlayBtn = false; //重置暂停按钮
			this.progressNum = 0; //重置百分比
			this.videoIndex = 0; //设置视频下标
			//获取数据
			uni.showLoading({
				title: '加载中'
			});
			if (flag) {
				this.getHomeList(true);
			} else {
				this.getAttentionList(true);
			}
		},
		//滑动视频
		changeSwiper(e) {
			this.showVideoEndShare = false; //重置结束弹窗
			this.showVideoPlayBtn = false; //重置暂停按钮
			this.progressNum = 0; //重置百分比
			this.videoIndex = e.detail.current; //设置视频下标
			this.videoContext = uni.createVideoContext('myVideo', this); //获取视频对象

			if ((e.detail.current + 3) % 15 == 0) {
				this.getHomeList();
			}
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
		//获取首页视频列表
		getHomeList(isFirstPage) {
			if (isFirstPage) {
				this.videoPage = 1;
				this.videoList = [];
			}
			this.request({
				url: this.apiUrl + 'User/get_index_list',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					version: 2, // 0是文字 1是语音 2是视频 3是全部
					index_page: this.videoPage
				},
				success: res => {
					uni.hideLoading();
					// console.log("首页视频列表:", res);
					this.videoPage++;
					this.videoList = this.videoList.concat(res.data.info);
					//获取视频对象
					this.videoContext = uni.createVideoContext('myVideo', this);
				},
			});
		},
		//获取首页关注
		getAttentionList(isFirstPage) {
			if (isFirstPage) {
				this.videoPage = 1;
				this.videoList = [];
			}
			this.request({
				url: this.apiUrl + 'User/get_my_index_list',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					version: 2, // 0是文字 1是语音 2是视频 3是全部
					index_page: this.videoPage
				},
				success: res => {
					uni.hideLoading();
					if (res.data.info.length == 0) {
						uni.showToast({
							title: '暂无关注数据',
							icon: 'none'
						})
					}
					console.log("首页视频列表:", res);
					this.videoPage++;
					this.videoList = this.videoList.concat(res.data.info);
					//获取视频对象
					this.videoContext = uni.createVideoContext('myVideo', this);
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
	created() {
		console.log('homeCreated');
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		//接收分享id
		var shareVideoId = uni.getStorageSync('shareVideoId');
		if (shareVideoId) {
			this.shareVideoId = shareVideoId;
			uni.removeStorageSync('shareVideoId');
		}
		//获取首页视频列表
		uni.showLoading({
			title: '加载中'
		});
		this.getHomeList(true);
	}
};
