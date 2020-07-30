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
			animation: '', //分享动画
			animationData: '',
			userId: uni.getStorageSync('userId'),

			showDelInfoFlag: false, //删除回复弹窗
			delCommentQuery: {}, //删除参数

			showBannerFlag: false, //显示海报
			bannerBg: {}, //canvas动态图宽高

			showAd: false,
			adTimer: null,
			adShowTimer: null,
			second: 5
		}
	},
	props: {
		videoList: { //视频数组
			type: Array,
			default: []
		},
		index: { //默认下标
			type: Number,
			default: 0
		}
	},
	watch: {
		videoList(newName, oldName) {
			if (newName.length == 0) {
				//重置数据
				this.showVideoEndShare = false; //重置结束弹窗
				this.showVideoPlayBtn = false; //重置暂停按钮
				this.progressNum = 0; //重置百分比
				this.videoIndex = 0; //设置视频下标
			}
		}
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
		//生成海报---------------------------------------------------------------------
		makeBanner() {
			this.toggleBannerFlag(true);
			uni.showLoading({
				title: '获取二维码'
			});
			Promise.all([this.getAvater(), this.getQrCode(), this.getBg()]).then(res => {
				console.log(res);
				this.sharePosteCanvas(res[0], res[1], res[2]);
			});
		},
		sharePosteCanvas(avaterSrc, codeSrc, bgSrc) {
			uni.showLoading({
				title: '生成中...',
				mask: true
			});
			var cardInfo = uni.getStorageSync('userInfo'); //需要绘制的数据集合
			const ctx = uni.createCanvasContext('myCanvas', this);
			var width = '';
			uni.createSelectorQuery().in(this)
				.select('#canvas-container')
				.boundingClientRect(rect => {
					var left = rect.left;
					var right = rect.right;
					var height = rect.height;
					width = rect.width;
					ctx.save();
					ctx.setFillStyle('#FFFFFF');
					ctx.fillRect(0, 0, width, height);

					//头像
					ctx.beginPath();
					ctx.fill();
					var avatarurl_width = 50; //绘制的头像宽度
					var avatarurl_heigth = 50; //绘制的头像高度
					var avatarurl_x = 22.5;
					var avatarurl_y = 25;
					//先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
					ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI *
						2, false);
					ctx.clip();
					ctx.drawImage(avaterSrc, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
					//昵称
					ctx.restore();
					ctx.setFontSize(18);
					ctx.setFillStyle('#000');
					ctx.fillText(this.videoList[this.videoIndex].user_nick_name, 81, 60);

					//圈子名背景
					var cNameX = width - ctx.measureText(this.videoList[this.videoIndex].realm_name).width - 20,
						cNameY = 38.5,
						cNameW = ctx.measureText(this.videoList[this.videoIndex].realm_name).width + 10,
						cNameH = 23;
					ctx.setFillStyle('#7364BD');
					ctx.fillRect(cNameX, cNameY, cNameW, cNameH);
					//圈子名
					ctx.setFontSize(13);
					ctx.setFillStyle('#fff');
					ctx.fillText(this.videoList[this.videoIndex].realm_name, width - ctx.measureText(this.videoList[this.videoIndex].realm_name)
						.width - 25, 55);

					//时间背景
					ctx.setFillStyle('#D1D6D8');
					ctx.fillRect(20, 90, ctx.measureText(this.videoList[this.videoIndex].adapter_time).width + 10, 23);
					//时间
					ctx.setFontSize(13);
					ctx.setFillStyle('#fff');
					ctx.fillText(this.videoList[this.videoIndex].adapter_time, 25, 106);

					// 发布了一条动态
					ctx.setFontSize(13);
					ctx.setFillStyle('#aaa');
					ctx.fillText('发布了一条动态', 100, 106);

					//图片
					var canvas_width = 305,
						canvas_height = 200;
					var img = bgSrc;
					var img_width = this.bannerBg.width,
						img_height = this.bannerBg.height;
					var clip_left, clip_top, //左偏移值，上偏移值，
						clip_width, clip_height; //截取宽度，截取高度
					clip_height = img_width * (canvas_height / canvas_width);
					if (clip_height > img_height) {
						clip_height = img_height;
						clip_width = clip_height * (canvas_width / canvas_height);
						clip_left = (img_width - clip_width) / 2;
						clip_top = 0;
					} else {
						clip_left = 0;
						clip_top = (img_height - clip_height) / 2;
						clip_width = img_width
					}
					var data = {
						clip_left,
						clip_top,
						clip_width,
						clip_height
					}
					ctx.drawImage(img, clip_left, clip_top, clip_width, clip_height, 0, 123, width, canvas_height);

					//内容
					ctx.setFontSize(16);
					ctx.setFillStyle('#333');
					var text = this.videoList[this.videoIndex].study_content,
						lineheight = 20;
					for (var i = 1; this.getTrueLength(text) > 0; i++) {
						var tl = this.cutString(text, 36);
						ctx.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), 20, i * lineheight + 330);
						text = text.substr(tl);
					}
					//说明
					ctx.setFontSize(17);
					ctx.setFillStyle('#BEB9DE');
					ctx.fillText('长按识别二维码', width / 2 - 120, 430);
					ctx.fillText('打开小程序', width / 2 - 120 + 34, 460);
					//二维码
					ctx.drawImage(codeSrc, width - 120, 392, 99, 99);
				})
				.exec();
			setTimeout(function() {
				ctx.draw();
				uni.hideLoading();
			}, 500);
		},
		getTrueLength(str) { //获取字符串的真实长度（字节长度）
			var len = str.length,
				truelen = 0;
			for (var x = 0; x < len; x++) {
				if (str.charCodeAt(x) > 128) {
					truelen += 2;
				} else {
					truelen += 1;
				}
			}
			return truelen;
		},
		cutString(str, leng) { //按字节长度截取字符串，返回substr截取位置
			var len = str.length,
				tlen = len,
				nlen = 0;
			for (var x = 0; x < len; x++) {
				if (str.charCodeAt(x) > 128) {
					if (nlen + 2 < leng) {
						nlen += 2;
					} else {
						tlen = x;
						break;
					}
				} else {
					if (nlen + 1 < leng) {
						nlen += 1;
					} else {
						tlen = x;
						break;
					}
				}
			}
			return tlen;
		},
		getQrCode() {
			return new Promise((resolve, reject) => {
				this.request({
					url: this.apiUrl + 'User/qrcode',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						id: this.videoList[this.videoIndex].id
					},
					success: res => {
						console.log('二维码:', res);
						uni.getImageInfo({
							src: res.data.data.url,
							success: res => {
								resolve(res.path);
							}
						});
					}
				});
			});
		},
		getBg() {
			return new Promise((resolve, reject) => {
				uni.getImageInfo({
					src: this.videoList[this.videoIndex].image_part[0],
					success: res => {
						resolve(res.path);
						this.bannerBg.width = res.width;
						this.bannerBg.height = res.height;
					}
				});
			});
		},
		getAvater() {
			return new Promise((resolve, reject) => {
				uni.getImageInfo({
					src: this.videoList[this.videoIndex].user_head_sculpture,
					success: res => {
						resolve(res.path);
					}
				});
			});
		},
		//保存海报
		saveBanner() {
			uni.showLoading({
				title: '加载中'
			});
			uni.canvasToTempFilePath({
				canvasId: 'myCanvas',
				success: function(res) {
					uni.hideLoading();
					var tempFilePath = res.tempFilePath;
					uni.saveImageToPhotosAlbum({
						filePath: tempFilePath,
						success(res) {
							uni.showModal({
								content: '图片已保存到相册，赶紧晒一下吧~',
								showCancel: false,
								confirmText: '好的',
								confirmColor: '#333',
								success: function(res) {
									if (res.confirm) {}
								},
								fail: function(res) {}
							});
						},
						fail: function(res) {
							console.log(res);
							if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
								uni.showModal({
									content: '检测到您未打开微信保存图片到相册，开启后即可保存图片',
									confirmText: '去开启',
									success(res) {
										if (res.confirm) {
											uni.openSetting({
												success(res) {}
											});
										} else if (res.cancel) {}
									}
								});
							}
						}
					});
				},
				fail: function(err) {
					console.log(err);
				}
			}, this);
		},
		//控制海报
		toggleBannerFlag(flag) {
			this.showBannerFlag = flag;
		},
		// 海报end-----------------------------------------------------------------------------------------------------
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
					paper_id: this.videoList[this.videoIndex].id,
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
			this.$refs.loading.open();
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
					this.$refs.loading.close();
					this.informContent = '';
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
			//停止上一次播放的视频
			this.videoContext = uni.createVideoContext('myVideo' + this.videoIndex, this);
			this.videoContext.stop();
			//播放当前视频
			this.videoContext = uni.createVideoContext('myVideo' + e.detail.current, this);
			this.videoContext.play();
			//重置百分比
			this.progressNum = 0;
			//设置视频下标
			this.videoIndex = e.detail.current;
			//每12个获取下一组数据
			if ((e.detail.current + 3) % 15 == 0) {
				this.$emit('getNextPage'); //获取下一页
			}

			//左侧滑入的广告
			// this.second = 5;
			// if ((e.detail.current + 1) % 6 == 0) {
			// 	clearTimeout(this.adShowTimer);
			// 	this.adShowTimer = setTimeout(() => {
			// 		this.showAd = true;
			// 		clearInterval(this.adTimer);
			// 		this.adTimer = setInterval(() => {
			// 			this.second--;
			// 			if (this.second == 0) {
			// 				this.showAd = false;
			// 				clearInterval(this.adTimer);
			// 			}
			// 		}, 1000);
			// 	}, 500);
			// } else {
			// 	clearTimeout(this.adShowTimer);
			// 	clearInterval(this.adTimer);
			// 	this.showAd = false;
			// }
		},
		closeAd() {
			clearTimeout(this.adShowTimer);
			clearInterval(this.adTimer);
			this.showAd = false;
		},
		//视频播放开始
		videoPlayStard() {
			this.showVideoEndShare = false;
			this.showVideoPlayBtn = false;
		},
		//视频播放结束
		videoPlayEnd() {
			this.showVideoEndShare = true;
			this.videoContext.play();
		},
		//视频播放错误
		videoPlayerror() {
			uni.showToast({
				title: '视频跑丢啦!',
				icon: 'none'
			});
		},
		// 视频进度改变
		videoTimeUpdate(e) {
			this.progressNum = (e.detail.currentTime / e.detail.duration) * 100;
		},
		//暂停视频
		pauseVideo() {
			this.videoContext.pause();
			this.showVideoPlayBtn = true;
		},
		//播放视频
		playVideo() {
			this.videoContext.play();
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
			this.$refs.loading.open();
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
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.$refs.loading.close();
					if (res.data.msg == "已评论,请等待审核！") {
						this.commentContent = '';
					} else {
						this.$emit('commentFun', this.videoIndex, this.commentContent) //评论数+1
						this.commentContent = '';
						this.showCommentFun(); //重新加载评论
					}
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
					this.twoComment = '';
					this.showTwoLevCommentFlag = false;
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.$refs.loading.close();
					this.showCommentFun();
				},
			});
		},
		//删除评论
		delInfoIpt(paper_id, id) {
			this.showDelInfoFlag = true;
			this.delCommentQuery = {
				paper_id,
				id,
				is_qq_text: ''
			}
		},
		delComment() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/del_article_huifu',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					...this.delCommentQuery,
				},
				success: res => {
					console.log("删除评论:", res);
					this.showDelInfoFlag = false;
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.$refs.loading.close();
					this.showCommentFun();
					this.$emit('commentFun', this.videoIndex, this.commentContent, true) //评论数-1
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
					this.$emit('goodFun', this.videoIndex, res.data.info_zan_count) //修改点赞状态
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
			if (!e.detail.userInfo) return;
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
				this.userId = uni.getStorageSync('userId');
				this.$emit('loginFun', true);
			});
		},
		shareAnimate() {
			var animation = uni.createAnimation({
				duration: 1000,
				timingFunction: 'linear',
			})

			var count = 1;
			setInterval(function() {
				if (count++ % 2 == 1) {
					animation.scale(1.1).step()
				} else {
					animation.scale(0.9).step()
				}
				this.animationData = animation.export()
			}.bind(this), 1000)
		}
	},
	created() {
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();

		//分享动画
		this.shareAnimate();
	},
	mounted() {
		//初始视频下标
		this.videoIndex = this.index;
		//获取视频对象
		this.videoContext = uni.createVideoContext('myVideo0', this);
	}
}
