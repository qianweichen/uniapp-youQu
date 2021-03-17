export default {
	data() {
		return {
			isAuthorized: false, //授权否
			customBar: this.CustomBar,
			topCustomBar: this.StatusBar, //顶部状态栏高度
			tabsFlag: false, //顶部 圈子/动态
			dynamicList: [],
			dynamicPage: 1,
			tabIndex: 0, //动态 中部tab  推荐/关注
			myCirclePage: 1,
			myCircleList: [], //我加入的圈子
			recommendPage: 1,
			recommendList: [], //推荐的圈子
			banners: [],
			refreshFlag: false, //下拉刷新状态
			swiperIndex: 0,
			animationData: null,
			loadStatus: 'loadmore',
			showMoreCircle: false, //默认显示3条推荐圈子
			scrollTop: 0,

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

			platform: uni.getStorageSync('platform')
		}
	},
	methods: {
		stopVideo(){
			for (var i = 0; i < this.dynamicList.length; i++) {
				this.$set(this.dynamicList[i], 'playVideoFlag', false);
			}
		},
		showDynamicCommentFun(flag) {
			// console.log('find', flag);
			this.$emit('showDynamicCommentFun', flag);
		},
		exitFullScreen() {
			this.scrollTop = this.pageScroll + 1;
			setTimeout(() => {
				this.scrollTop = this.pageScroll;
			}, 0);
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
		//关注后修改数据
		attentionFun(index, state) {
			this.dynamicList[index].is_follow = state;
		},
		//播放视频
		playVideoFun(index, oldIndex) {
			this.autoPlayFlag = true;
			for (var i = 0; i < this.dynamicList.length; i++) {
				this.$set(this.dynamicList[i], 'playVideoFlag', false);
			}
			this.$set(this.dynamicList[index], 'playVideoFlag', true);
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
		//滚动
		pageScrollFun(e) {
			this.pageScroll = e.detail.scrollTop;
			uni.createSelectorQuery().in(this.$refs.dynamicList).select("#videoGroup" + this.playIndex).boundingClientRect(rect => {
				uni.createSelectorQuery().in(this.$refs.dynamicList).select("#videoGroup" + (this.playIndex - 1 < 0 ? 0 : this.playIndex -
					1)).boundingClientRect(rect2 => {
					let spaceArea = (this.screenHeight - rect.height) / 2; //留白区域
					let spaceArea2 = (this.screenHeight - rect2.height) / 2; //上一个留白区域
					if ((this.touchEnd - this.touchStar > 0) && (this.pageScroll > (this.firstTop - spaceArea / 2))) {
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

					} else if ((this.touchEnd - this.touchStar < 0) && (this.pageScroll <= (this.firstTop - rect2.height -
							spaceArea2 / 2))) {
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
		},
		//点击展开收起全文按钮
		toggleAllText(index, flag, init) {
			this.$set(this.dynamicList[index], 'hideText', flag);
			//初始化时 控制是否显示 全文/隐藏 按钮
			if (init == "init") {
				this.$set(this.dynamicList[index], 'hasHideBtn', flag);
			}
		},
		// 触底获取
		getDynamic() {
			if (this.loadStatus != "loadmore") {
				return;
			}
			this.loadStatus = "loading";
			this.getRealUserArticle();
		},
		// 我加入的圈子
		getMyCircle(isFirstPage) {
			return new Promise((resolve, reject) => {
				if (isFirstPage == true) {
					this.myCirclePage = 1;
					this.myCircleList = [];
				}
				this.request({
					url: this.apiUrl + 'User/get_right_needle',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						get_id: -1,
						page: this.myCirclePage
					},
					success: res => {
						// console.log("我加入的圈子:", res);
						if (res.data.info.length == 0 && this.myCirclePage > 1) {
							uni.showToast({
								title: '没有更多了',
								icon: 'none'
							});
						}
						this.myCirclePage++;
						this.myCircleList = this.myCircleList.concat(res.data.info);
						resolve();
					},
				});
			});
		},
		getRealUserArticle(isFirstPage) {
			if (isFirstPage) {
				this.dynamicPage = 1;
				this.dynamicList = [];
			}
			this.request({
				url: this.apiUrl + 'user/index_list',
				method: 'POST',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					version: 3, // 0是文字 1是语音 2是视频 3是全部
					index_page: this.dynamicPage
				},
				success: res => {
					console.log("真实用户帖子列表:", res);
					this.dynamicPage++;
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
					if (res.data.info.length < 15) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore";
					}
				}
			});
		},
		getUserInfo(e) {
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
				this.getMyCircle(true);
			});
		},
		onShowFun() {
			this.isAuthorized = this.beAuthorized();
			if (this.isAuthorized) {
				this.getMyCircle(true);
				this.getRealUserArticle(true);
			}
		}
	},
	mounted() {
		// console.log('findCreated');
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		if (this.isAuthorized) {
			this.$refs.loading.open();
			Promise.all([this.getRealUserArticle(true), this.getMyCircle(true)]).then(() => {
				this.$refs.loading.close();
			});
		} else {
			this.$refs.loading.open();
			Promise.all([this.getRealUserArticle(true)]).then(() => {
				this.$refs.loading.close();
			});
		}
	}
}
