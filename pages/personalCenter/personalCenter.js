export default {
	data() {
		return {
			tabIndex: 0,
			dynamicList: [],
			personalId: '', //主页用户id
			personalInfo: {}, //用户信息
			uid: uni.getStorageSync('userId'), //用户id
			videoPage: 1, //页码
			isAuthorized: false, //授权否
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
			loadStatus:'loadmore',
			
			videoId:''
		};
	},
	methods: {
		//播放视频
		playVideoFun(index, oldIndex) {
			this.autoPlayFlag = true;
			for (var i = 0; i < this.dynamicList.length; i++) {
				this.$set(this.dynamicList[i], 'playVideoFlag', false);
			}
			this.$set(this.dynamicList[index], 'playVideoFlag', true);
		},
		//签到
		signIn() {
			uni.requestSubscribeMessage({
				tmplIds: ['eouzl8p41dm6RqLnP1EJwn22CFomD67vIc8nXezyMI4'],
				complete: res => {
					this.request({
						url: this.apiUrl + 'User/add_user_punch',
						data: {
							token: uni.getStorageSync('token'),
							openid: uni.getStorageSync('openid'),
							uid: uni.getStorageSync('userId')
						},
						success: res => {
							// console.log('签到:', res);
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							// setTimeout(()=>{
							// 	this.getPersonalInfo();
							// },1500);
						}
					});
				}
			});
		},
		//关注后修改数据
		attentionFun(index, state) {
			this.dynamicList[index].is_follow = state; //评论数+1
			this.getPersonalInfo();
		},
		//点赞
		videoGoodFun(id, index) {
			this.request({
				url: this.apiUrl + 'User/add_user_zan',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id,
					uid: uni.getStorageSync('userId'),
					applaud_type: 0,
					zan_type: this.dynamicList[index]['is_info_zan'] == true ? 1 : 0
				},
				success: res => {
					// console.log("点赞:", res);
					this.dynamicList[index]['is_info_zan'] = !this.dynamicList[index]['is_info_zan']; //修改点赞状态
					this.dynamicList[index]['info_zan_count'] = res.data.info_zan_count; //修改点赞数
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
				},
			});
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
			}
		},
		//去播放页面
		goPlayPage(index) {
			var playVideoPageData = {
				videoList: this.dynamicList,
				page: this.videoPage,
				id: this.personalId,
				index
			}
			uni.setStorageSync('playVideoPageData', playVideoPageData);
			if (this.tabIndex == 2) {	//喜欢的
				uni.navigateTo({
					url: '/pages/playVideo/playVideo?isFromLike=isFromLike'
				});
			}else{
				uni.navigateTo({
					url: '/pages/playVideo/playVideo'
				});
			}
		},
		//关注
		attention() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/get_user_cancel',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: this.personalId,
					this_uid: uni.getStorageSync('userId'),
					is_user: this.personalInfo.is_user
				},
				success: res => {
					// console.log("关注:", res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.$refs.loading.close();
					// if (res.data.msg == "关注成功！") {
					// 	uni.requestSubscribeMessage({
					// 		tmplIds: ['h2WXfb886d0u4REloFOdW6L3LrXILAZT3INRequJOOE'],
					// 		success: (res) => {
					// 			// console.log(res)
					// 		}
					// 	});
					// }
					this.getPersonalInfo(); //更新用户信息
				},
			});
		},
		changeTab(index) {
			this.tabIndex = index;
			//请求
			this.getVideoList(true);
		},
		//获取用户信息
		getPersonalInfo() {
			this.request({
				url: this.apiUrl + 'User/get_user_info_my',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: this.personalId,
					this_uid: uni.getStorageSync('userId')
				},
				success: res => {
					// console.log("获取用户信息:", res);
					this.personalInfo = res.data.info;
				},
			});
		},
		//获取作品数据
		getVideoList(isFirstPage) {
			if (isFirstPage) {
				this.videoPage = 1;
				this.dynamicList = [];
				this.$refs.loading.open();
				this.loadStatus = "loadmore";
			}else{
				this.loadStatus = "loading";
			}
			//动态访问User/get_my_list，喜欢访问User/get_my_list4
			var urlEnd = '';
			if (this.tabIndex == 2) {
				var urlEnd = '4';
			}
			//version 0是文字 1是语音 2是视频 3是全部
			var version = 2;
			if (this.tabIndex == 0) {
				var version = 2;
			}
			if (this.tabIndex == 1) {
				var version = 0;
			}
			this.request({
				url: this.apiUrl + 'User/get_my_list' + urlEnd,
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.personalId,
					uid: uni.getStorageSync('userId'),
					index_page: this.videoPage,
					version
				},
				success: res => {
					if (isFirstPage) {
						this.$refs.loading.close();
					}else{
						this.loadStatus = "loadmore";
					}
					// console.log("动态:", res);
					this.videoPage++;
					for (var j = 0; j < res.data.info.length; j++) {
						for (var i = 0; i < res.data.info[j].list.length; i++) {
							let _item = res.data.info[j].list[i];
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
						this.dynamicList = this.dynamicList.concat(res.data.info[j].list);
					}
					if (res.data.info.length == 0) {
						// uni.showToast({
						// 	title: '没有更多数据了',
						// 	icon: 'none'
						// });
						this.loadStatus = "nomore";
					}
				},
			});
		},
		getUserInfo(e) {
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
				this.getPersonalInfo();
				this.getVideoList(true);
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
		}
	},
	onLoad(options) {
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();

		//获取id 请求
		this.personalId = options.id;
		this.getPersonalInfo();
		this.getVideoList(true);
		
		//从哪个视频跳转来的   用于标记
		if(options.videoId){
			this.videoId = options.videoId;
		}
	},
	onReachBottom() {
		if(this.loadStatus != "loadmore"){
			return;
		}
		this.getVideoList();
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
			if (res.target.dataset.type == 'persional') {
				//分享个人页
				return {
					title: this.personalInfo.user_nick_name || this.miniProgramName,
					path: '/pages/personalCenter/personalCenter?id=' + this.personalId,
					imageUrl: this.personalInfo.bg_img
				};
			} else if (res.target.dataset.type == 2) {
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
	// onPageScroll(e) {
	// 	if (this.tabIndex != 2) {
	// 		return;
	// 	}
	// 	this.pageScroll = e.scrollTop;
	// 	uni.createSelectorQuery().in(this.$refs.dynamicList).select("#videoGroup" + this.playIndex).boundingClientRect(rect => {
	// 		uni.createSelectorQuery().in(this.$refs.dynamicList).select("#videoGroup" + (this.playIndex - 1 < 0 ? 0 : this.playIndex -
	// 			1)).boundingClientRect(rect2 => {
	// 			let spaceArea = (this.screenHeight - rect.height) / 2; //留白区域
	// 			let spaceArea2 = (this.screenHeight - rect2.height) / 2; //上一个留白区域
	// 			if ((this.touchEnd - this.touchStar > 0) && (e.scrollTop > (this.firstTop - spaceArea))) {
	// 				this.playIndex++;
	// 				this.firstTop = this.firstTop + rect.height;
	// 				// console.log("触发向下", this.playIndex)

	// 				if (!this.autoPlayFlag) {
	// 					return;
	// 				}
	// 				//自动播放视频
	// 				if (this.playIndex - 2 >= 0) {
	// 					this.$set(this.dynamicList[this.playIndex - 2], 'playVideoFlag', false);
	// 				}
	// 				this.$set(this.dynamicList[this.playIndex - 1], 'playVideoFlag', true);
	// 				//自动播放视频end

	// 			} else if ((this.touchEnd - this.touchStar < 0) && (e.scrollTop <= (this.firstTop - rect2.height - spaceArea2))) {
	// 				this.playIndex--;
	// 				this.firstTop = this.firstTop - rect2.height;
	// 				// console.log("触发向上", this.playIndex)

	// 				if (!this.autoPlayFlag) {
	// 					return;
	// 				}
	// 				//自动播放视频
	// 				// if (this.playIndex - 2 >= 0) {
	// 				// 	this.$set(this.dynamicList[this.playIndex + 1], 'playVideoFlag', false);
	// 				// }
	// 				for (var i = 0; i < this.dynamicList.length; i++) {
	// 					this.$set(this.dynamicList[i], 'playVideoFlag', false);
	// 				}
	// 				this.$set(this.dynamicList[this.playIndex], 'playVideoFlag', true);
	// 				//自动播放视频end
	// 			}
	// 		}).exec();
	// 	}).exec();
	// }
};
