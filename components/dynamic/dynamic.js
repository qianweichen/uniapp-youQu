export default {
	props: {
		type: String, //dynamic:动态  circle:圈子
		list: Array //列表数据
	},
	data() {
		return {
			clickDynamicId: '', //点击评论的动态id
			clickDynamicIndex: '', //点击评论的下标
			showCommentFlag: false, //评论弹窗
			isAuthorized: false, //是否授权过
			commentPage: 1, //评论页码
			commentList: [], //评论列表
			commentContent: '', //评论内容
			twoComment: '', //二级评论内容
			showTwoLevCommentFlag: false, //控制二级评论box
			twoCommentId: '', //二级评论的回复id
			twoCommentUserId: '', //二级评论的回复用户id

			informContent: '', //举报输入内容
			showInformFlag: false, //控制举报弹出
			deleteContent: '', //删除输入内容
			showDeleteFlag: false, //控制删除弹出
			userId: uni.getStorageSync('userId'),
			oldIndex: '',

			clickTime: 0, //视频点击事件  控制双击
			isVideoFull: false, //是否已经全屏

			imgHeightList: [], //轮播高度数组
			screenWidth: uni.getSystemInfoSync().windowWidth, //屏幕宽度
			screenHeight: uni.getSystemInfoSync().windowHeight, //屏幕宽度
			bannerImgNumList: [] //轮播中图片总数
		};
	},
	methods: {
		changeSwiper(e) {
			var index = e.currentTarget.dataset.index;
			this.bannerImgNumList[index] = e.detail.current + 1;
			this.bannerImgNumList.splice(index, 1, e.detail.current + 1);
		},
		imgLoad(e) {
			var index = e.currentTarget.dataset.index,
				imgwidth = e.detail.width,
				imgheight = e.detail.height;
			// 宽高比
			var ratio = imgwidth / imgheight;
			// 计算的高度值
			var viewHeight = this.screenWidth / ratio;
			if (viewHeight > (this.screenHeight / 2)) {
				viewHeight = (this.screenHeight / 2);
			}

			//存到对应的动态下标上
			if (!this.imgHeightList[index]) {
				this.imgHeightList[index] = viewHeight;
				this.imgHeightList.splice(index, 1, viewHeight)
			} else if (viewHeight > this.imgHeightList[index]) {
				this.imgHeightList[index] = viewHeight;
				this.imgHeightList.splice(index, 1, viewHeight)
			}
			// console.log(this.imgHeightList);
		},
		clickVideoFun(e) {
			var curTime = e.timeStamp; //本次点击时间
			var lastTime = this.clickTime; //上次点击时间
			if (curTime - lastTime > 0) {
				if (curTime - lastTime < 300) {
					// console.log("双击事件，用了：" + (curTime - lastTime));
					var videoContext = uni.createVideoContext('myVideo', this);
					if (this.isVideoFull) {
						videoContext.exitFullScreen();
						this.isVideoFull = false;
					} else {
						videoContext.requestFullScreen();
						this.isVideoFull = true;
					}

				}
			}
			this.clickTime = curTime;
		},
		playVideoFun(index) {
			this.$emit('playVideoFun', index, this.oldIndex);
			this.oldIndex = index;
			this.isVideoFull = false;
		},
		videoError(e) {
			// console.log(e);
			uni.showToast({
				title: '视频跑丢啦',
				icon: 'none'
			});
		},
		//关注
		attention(uid, follow, index) {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_user_cancel',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					this_uid: uni.getStorageSync('userId'),
					uid,
					is_user: follow
				},
				success: res => {
					// console.log("关注:", res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.$refs.loading.close();
					//修改数据
					if (follow == 1) {
						this.$emit('attentionFun', index, 0);
					} else {
						this.$emit('attentionFun', index, 1);
					}

					// if (res.data.msg == "关注成功！") {
					// 	uni.requestSubscribeMessage({
					// 		tmplIds: ['h2WXfb886d0u4REloFOdW6L3LrXILAZT3INRequJOOE'],
					// 		success: (res) => {
					// 			// console.log(res)
					// 		}
					// 	});
					// }
				},
			});
		},
		// 查看全部二级评论
		getMoreComment(id, uid) {
			uni.navigateTo({
				url: `/pagesA/commentList/commentList?id=${id}&uid=${uid}`
			})
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
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/add_paper_complaint',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.clickDynamicId,
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
					this.$refs.loading.close();
					this.informContent = '';
					this.toggleInform(false);
				},
			});
		},
		toggleInform(flag) {
			this.showInformFlag = flag;
		},
		//删除
		deleteVideo() {
			if (this.deleteContent == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				})
				return;
			}
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/del_article',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					paper_id: this.clickDynamicId,
					is_qq_text: this.deleteContent
				},
				success: res => {
					console.log("删除", res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.$refs.loading.close();
					this.deleteContent = '';
					this.toggleDelete(false);
				},
			});
		},
		toggleDelete(flag) {
			this.showDeleteFlag = flag;
		},
		showAction(userId, index, dynamicId) {
			this.clickDynamicId = dynamicId; //存储动态id
			var itemList = ['举报'];
			var sameUser = userId == uni.getStorageSync('userId');
			var adAdmin = this.list[index]['check_qq'] == 'da';
			var xiaoAdmin = this.list[index]['check_qq'] == 'xiao';
			if (sameUser || adAdmin || xiaoAdmin) {
				itemList.push('删除');
			}
			uni.showActionSheet({
				itemList,
				success: res => {
					// console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
					//举报
					if (res.tapIndex == 0) {
						this.toggleInform(true)
					}
					//删除
					if (res.tapIndex == 1) {
						this.toggleDelete(true);
					}
				}
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
			this.$refs.loading.open();
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
					this.$refs.loading.close();
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
		//回复的消息点赞
		commentGoodFun(id, index) {
			this.request({
				url: this.apiUrl + 'User/add_paper_prely',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.clickDynamicId,
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
		//评论
		sendComment() {
			if (this.commentContent == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				})
				return;
			}
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/add_paper_reply',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.clickDynamicId,
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
					});
					this.$refs.loading.close();
					this.showCommentFun(); //重新加载评论
					this.$emit('commentFun', this.clickDynamicIndex) //评论数+1
				},
			});

		},
		//获取评论
		getCommentList(isFirstPage) {
			if (isFirstPage == true) {
				this.commentPage = 1;
				this.commentList = [];
			}
			this.request({
				url: this.apiUrl + 'User/get_article_huifu',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.clickDynamicId,
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
		//评论弹窗
		showCommentFun(id, index) {
			if (id) {
				this.clickDynamicId = id; //保存id
			}
			if (index || index == 0) {
				this.clickDynamicIndex = index; //保存index
			}
			this.showCommentFlag = true;
			// 请求第一页
			this.getCommentList(true);
		},
		hideCommentFun() {
			this.showCommentFlag = false;
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
					zan_type: this.list[index]['is_info_zan'] == true ? 1 : 0
				},
				success: res => {
					console.log("点赞:", res);
					this.$emit('goodFun', index, res.data.info_zan_count) //修改点赞状态
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
				},
			});
		},
		moveHandle() {

		},
		//授权
		getUserInfo(e) {
			if (!e.detail.userInfo) return;
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
				this.userId = uni.getStorageSync('userId');
			});
		}
	},
	created() {
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
	}
}
