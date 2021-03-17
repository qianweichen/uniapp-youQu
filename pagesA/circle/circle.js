export default {
	data() {
		return {
			noJurisdiction: false, //没权限
			erCode: '', //邀请码
			showIptCodeFlag: false, //显示输入邀请码
			page: 1,
			dynamicList: [],
			circleId: '', //圈子id
			circleData: {}, //圈子信息
			isAuthorized: false, //授权否
			qrCode: '', //圈子二维码
			topList: [], //置顶推荐
			showPublishFlag: false, //发布
			//海报数据
			poster: {},
			qrShow: false,
			canvasId: 'default_PosterCanvasId',
			//自动播放数据
			screenWidth: uni.getSystemInfoSync().windowWidth,
			screenHeight: uni.getSystemInfoSync().windowHeight,
			playIndex: 0, //播放视频下标
			firstTop: 200, //第一个默认的位置
			touchStar: 0,
			touchEnd: 0,
			pageScroll: 0,
			timer: null,
			autoPlayFlag: false,
			
			loadStatus: 'loadmore',
			publishCircleId: '', //发贴返回获取的id

			circleAdmin_da: [],
			circleAdmin_xiao: [],
		};
	},
	methods: {
		//点击展开收起全文按钮
		toggleAllText(index, flag, init) {
			this.$set(this.dynamicList[index], 'hideText', flag);
			//初始化时 控制是否显示 全文/隐藏 按钮
			if (init == "init") {
				this.$set(this.dynamicList[index], 'hasHideBtn', flag);
			}
		},
		//关注后修改数据
		attentionFun(index, state) {
			this.dynamicList[index].is_follow = state; //评论数+1
		},
		// 选择发布类型
		togglePublishFlag(flag) {
			uni.setStorageSync('sendCircleData', this.circleData);
			this.showPublishFlag = flag;
		},
		//点赞后修改数据
		goodFun(index, num) {
			this.dynamicList[index]['is_info_zan'] = !this.dynamicList[index]['is_info_zan']; //修改点赞状态
			this.dynamicList[index]['info_zan_count'] = num; //修改点赞数
		},
		//评论后修改数据
		commentFun(index, content, isDel) {
			if (isDel) {
				this.dynamicList[index].study_repount--; //评论数-1
			} else {
				this.dynamicList[index].study_repount++; //评论数+1
				this.dynamicList[index].pinglun.push({
					text: content,
					time: this.dynamicList[index].pinglun.length + 1
				})
			}
		},
		//动态视频播放
		playVideoFun(index, oldIndex) {
			// if (typeof oldIndex == 'number') {
			// 	this.$set(this.dynamicList[oldIndex], 'playVideoFlag', false);
			// }
			this.autoPlayFlag = true;
			for (var i = 0; i < this.dynamicList.length; i++) {
				this.$set(this.dynamicList[i], 'playVideoFlag', false);
			}
			this.$set(this.dynamicList[index], 'playVideoFlag', true);
		},
		// 帖子数据
		getArticleList(isFirstPage) {
			return new Promise((resolve, reject) => {
				if (isFirstPage == true) {
					this.page = 1;
					this.dynamicList = [];
					this.loadStatus = 'loadmore';
				}
				this.request({
					url: this.apiUrl + 'User/get_index_list',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						tory_id: this.circleId,
						index_page: this.page,
						version: 3, // 0是文字 1是语音 2是视频 3是全部
						startid: this.dynamicList.length ? this.dynamicList[0].id : 0,
						// id: this.publishCircleId	//发帖后来，放在第一条
					},
					success: res => {
						// console.log("帖子数据:", res);
						if (res.data.info.length == 0) {
							// uni.showToast({
							// 	title: '没有更多了',
							// 	icon: 'none'
							// });
							this.loadStatus = 'nomore';
							resolve('nomore');
							return;
						}

						for (let i = 0; i < res.data.info.length; i++) {
							let _item = res.data.info[i];
							if (_item.study_type == 2 && _item.image_part) {
								var src = this.httpsUrl(_item.image_part[0]);
								uni.getImageInfo({
									src,
									success: (res) => {
										var width = this.screenWidth - 30;
										var height = width * res.height / res.width;
										if (height > this.screenHeight / 2 + 30) {
											height = this.screenHeight / 2 + 30;
										}
										// _item.height = height;	//不渲染
										this.$set(_item, 'height', height); //渲染
									}
								})
							}
						}
						this.dynamicList = this.dynamicList.concat(res.data.info);
						this.page++;
						resolve();
					},
				});
			});
		},
		// 获取置顶帖子
		getTopArticle() {
			return new Promise((resolve, reject) => {
				this.request({
					url: this.apiUrl + 'User/get_placement_top',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						tory_id: this.circleId,
					},
					success: res => {
						// console.log("置顶帖子:", res);
						this.topList = res.data.info;
						resolve();
					},
				});
			});
		},
		//海报star----------------------------------------------------------------------------
		sharePosteCanvas(avaterSrc, codeSrc, bgSrc) {
			uni.showLoading({
				title: '生成中...',
				mask: true
			});
			var cardInfo = uni.getStorageSync('userInfo'); //需要绘制的数据集合
			const ctx = uni.createCanvasContext('myCanvas', this);
			var width = '';
			uni.createSelectorQuery()
				.select('#canvas-container')
				.boundingClientRect(rect => {
					var left = rect.left;
					var right = rect.right;
					var height = rect.height;
					width = rect.width;
					ctx.save();
					ctx.setFillStyle('#FFFFFF');
					ctx.fillRect(0, 0, width, height);
					//上半部分
					ctx.drawImage(bgSrc, 0, 0, width, 195);

					//头像
					ctx.beginPath();
					ctx.fill();
					var avatarurl_width = 92; //绘制的头像宽度
					var avatarurl_heigth = 92; //绘制的头像高度
					var avatarurl_x = width / 2 - 46;
					var avatarurl_y = 148;
					//先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
					ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI *
						2, false);
					ctx.clip();
					ctx.drawImage(avaterSrc, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); // 推进去图片，必须是https图片
					//昵称
					ctx.restore();
					ctx.setFontSize(20);
					ctx.setFillStyle('#000');
					ctx.fillText(this.circleData.realm_name, (width - ctx.measureText(this.circleData.realm_name).width) / 2,
						avatarurl_y + 120);
					//说明
					ctx.setFontSize(11);
					ctx.setFillStyle('#666');
					var text = this.circleData.realm_synopsis,
						lineheight = 20;
					for (var i = 1; this.getTrueLength(text) > 0; i++) {
						var tl = this.cutString(text, 50);
						ctx.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), (width - 262) / 2, i * lineheight + avatarurl_y + 120);
						text = text.substr(tl);
					}
					// ctx.fillText(this.circleData.realm_synopsis, (width - ctx.measureText(this.circleData.realm_synopsis).width) / 2, avatarurl_y + 140);
					//说明
					ctx.setFontSize(17);
					ctx.setFillStyle('#BEB9DE');
					ctx.fillText('长按识别二维码', width / 2 - 120, avatarurl_y + 222);
					ctx.fillText('打开小程序', width / 2 - 120 + 34, avatarurl_y + 252);
					//二维码
					ctx.drawImage(codeSrc, width - 120, avatarurl_y + 185, 99, 99);
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
		shareQrCode() {
			this.qrShow = true;
			//获取二维码后生成图片
			Promise.all([this.getCircleHead(), this.getQrCode(), this.getCircleBanner()]).then((res) => {
				this.sharePosteCanvas(res[0], res[1], res[2]);
			})
		},
		getCircleHead() {
			return new Promise((resolve, reject) => {
				var src = this.httpsUrl(this.circleData.realm_icon);
				uni.getImageInfo({
					src,
					success: function(image) {
						resolve(image.path);
					}
				});
			})
		},
		getCircleBanner() {
			return new Promise((resolve, reject) => {
				var src = this.httpsUrl(this.circleData.realm_bg);
				uni.getImageInfo({
					src,
					success: function(image) {
						resolve(image.path);
					}
				});
			})
		},
		getQrCode() { //获取圈子二维码
			return new Promise((resolve, reject) => {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.request({
					url: this.apiUrl + 'User/qrcodeBypath',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						id: this.circleId,
						page: 'pagesA/circle/circle',
						scene: this.circleId
					},
					success: res => {
						uni.hideLoading();
						// console.log("获取圈子二维码:", res);
						this.qrCode = res.data.data.url;
						uni.getImageInfo({
							src: this.qrCode,
							success: function(image) {
								resolve(image.path);
							}
						});
					}
				});
			});
		},
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
							// console.log(res);
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
					// console.log(err);
				}
			});
		},
		hideQr() {
			this.qrShow = false;
		},
		//海报end------------------------------------------------------------------------------
		join() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/set_user_trailing',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					tory_id: this.circleId,
					is_trailing: this.circleData['is_trailing'] == true ? 1 : 0,
					trailing_type: 1, //0申请（干掉） 1邀请码
					trailing_text: this.erCode //邀请码
				},
				success: res => {
					// console.log("加入:",res);
					uni.showToast({
						title: res.data.msg
					});
					this.showIptCodeFlag = false; //隐藏邀请码填写弹窗
					//刷新信息
					this.getData();
				},
			});
		},
		//获取圈子信息
		getCircleInfo() {
			return new Promise((resolve, reject) => {
				this.request({
					url: this.apiUrl + 'User/get_tory_info',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						id: this.circleId,
					},
					success: res => {
						// console.log("获取圈子信息:", res);
						//去除换行符
						res.data.info.realm_synopsis = res.data.info.realm_synopsis.replace(/[\r\n]/g, "");
						this.circleData = res.data.info;
						//私密圈子   并且   未加入
						this.noJurisdiction = res.data.info.attention == 1 && res.data.info.is_trailing == false;
						resolve();
					},
				});
			});
		},
		// 圈子信息
		getCircleAdmin() {
			this.request({
				url: this.apiUrl + 'User/get_qq_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.circleId,
				},
				success: res => {
					// console.log("圈子信息:", res);
					this.circleAdmin_da = res.data.info.da_qq;
					this.circleAdmin_xiao = res.data.info.xiao_qq;
				},
			});
		},
		// 粘贴
		setCode() {
			uni.getClipboardData({
				success: res => {
					this.erCode = res.data;
				}
			});
		},
		// 输入邀请码弹窗
		toggleIptCodeFlag(flag) {
			this.showIptCodeFlag = flag;
		},
		// 请求访问
		sendCode() {
			if (!this.erCode) {
				uni.showToast({
					title: '请输入邀请码',
					icon: 'none'
				})
				return;
			}
			this.join();
		},
		getUserInfo(e) {
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
			});
		},
		//存储滑动开始和结束位置
		touchstart(e) {
			this.touchStar = this.pageScroll;
		},
		touchmove(e) {
			this.touchEnd = this.pageScroll;
		},
		touchend(e) {
			this.touchEnd = this.pageScroll;
		},
		//获取数据
		getData() {
			this.$refs.loading.open();
			Promise.all([this.getCircleInfo(), this.getTopArticle(), this.getArticleList(true)]).then((res) => {
				this.$refs.loading.close();
				uni.stopPullDownRefresh();
			});
		}
	},
	onLoad(options) {
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		// 获取id请求
		if (options.scene) {
			this.circleId = options.scene;
		}
		if (options.id) {
			this.circleId = options.id;
		}
		this.getData();
		this.getCircleAdmin();

		//收录小程序的页面信息
		this.submitPages('pagesA/circle/circle', 'id=' + options.id);
	},
	onShow() {
		// 发布视频后返回检测id
		var publishCircleId = uni.getStorageSync('publishCircleId');
		if (publishCircleId) {
			// console.log('发布视频的id:', publishCircleId);
			this.publishCircleId = publishCircleId;
			this.$refs.loading.open();
			this.getArticleList(true).then((res) => {
				this.$refs.loading.close();
			});
			uni.removeStorageSync('publishCircleId');
		}
	},
	onPullDownRefresh() {
		this.getData();
	},
	onReachBottom() {
		if (this.loadStatus != 'loadmore') {
			return;
		}
		this.loadStatus = 'loading';
		this.getArticleList().then((res) => {
			if (res == 'nomore') {
				this.loadStatus = 'nomore';
			} else {
				this.loadStatus = 'loadmore';
			}
		});
	},
	onShareAppMessage(res) {
		// console.log(res);
		// 系统菜单分享
		if (res.from === 'menu') {
			return {
				title: this.miniProgramName,
				path: '/pages/index/index',
				imageUrl: '/static/logo.png'
			};
		}
		// 页面内分享按钮
		if (res.from === 'button') {
			if (res.target.dataset.type == 2) {
				//视频类型去主页
				return {
					title: res.target.dataset.content || this.miniProgramName,
					path: '/pages/index/index?id=' + res.target.dataset.id,
					imageUrl: res.target.dataset.img
				};
			} else {
				//图文类型去详情
				return {
					title: res.target.dataset.content || this.miniProgramName,
					path: '/pagesA/articleDetails/articleDetails?id=' + res.target.dataset.id,
					imageUrl: res.target.dataset.img
				};
			}
		}
	},
	onPageScroll(e) {
		this.pageScroll = e.scrollTop;
		uni.createSelectorQuery().in(this.$refs.dynamicList).select("#videoGroup" + this.playIndex).boundingClientRect(rect => {
			uni.createSelectorQuery().in(this.$refs.dynamicList).select("#videoGroup" + (this.playIndex - 1 < 0 ? 0 : this.playIndex -
				1)).boundingClientRect(rect2 => {
				let spaceArea = (this.screenHeight - rect.height) / 2; //留白区域
				let spaceArea2 = (this.screenHeight - rect2.height) / 2; //上一个留白区域
				if ((this.touchEnd - this.touchStar > 0) && (e.scrollTop > (this.firstTop - spaceArea))) {
					this.playIndex++;
					this.firstTop = this.firstTop + rect.height;
					// console.log("触发向下", this.playIndex)

					if (!this.autoPlayFlag) {
						return;
					}
					//自动播放视频
					if (this.playIndex - 2 >= 0) {
						this.$set(this.dynamicList[this.playIndex - 2], 'playVideoFlag', false);
					}
					this.$set(this.dynamicList[this.playIndex - 1], 'playVideoFlag', true);
					//自动播放视频end

				} else if ((this.touchEnd - this.touchStar < 0) && (e.scrollTop <= (this.firstTop - rect2.height - spaceArea2))) {
					this.playIndex--;
					this.firstTop = this.firstTop - rect2.height;
					// console.log("触发向上", this.playIndex)

					if (!this.autoPlayFlag) {
						return;
					}
					//自动播放视频
					// if (this.playIndex - 2 >= 0) {
					// 	this.$set(this.dynamicList[this.playIndex + 1], 'playVideoFlag', false);
					// }
					for (var i = 0; i < this.dynamicList.length; i++) {
						this.$set(this.dynamicList[i], 'playVideoFlag', false);
					}
					this.$set(this.dynamicList[this.playIndex], 'playVideoFlag', true);
					//自动播放视频end
				}
			}).exec();
		}).exec();
	}
};
