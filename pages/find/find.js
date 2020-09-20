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
			showMoreCircle: false //默认显示3条推荐圈子
		}
	},
	methods: {
		//换一批或者更多圈子
		getMoreCircle() {
			if (!this.showMoreCircle) {
				this.showMoreCircle = true;
			} else {
				this.getCircleCList();
			}
		},
		//加入圈子
		join(id, trailing, index) {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'User/set_user_trailing',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					tory_id: id,
					is_trailing: trailing == 0 ? 0 : 1,
					// trailing_type: 1, //0申请（干掉） 1邀请码
					// trailing_text: this.erCode //邀请码
				},
				success: res => {
					// console.log("加入:",res);
					uni.showToast({
						title: res.data.msg
					});
					if (res.data.msg == "加入成功！") {
						this.$set(this.recommendList[index], 'is_gzqz', 1);
					}else if(res.data.msg == "取消成功！"){
						this.$set(this.recommendList[index], 'is_gzqz', 0);
					}
					this.$refs.loading.close();
				},
			});
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
		swiperChange(e) {
			// console.log(e.detail.current);
			this.swiperIndex = e.detail.current;
		},
		//关注后修改数据
		attentionFun(index, state) {
			this.dynamicList[index].is_follow = state; //评论数+1
		},
		//轮播图
		getBanners() {
			return new Promise((resolve, reject) => {
				this.request({
					url: this.apiUrl + 'User/get_ad',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
					},
					success: res => {
						// console.log("轮播图:",res);
						this.banners = res.data.info_sw;
						resolve();
					},
				});
			})
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
		// 切换顶部tab
		changeTabs(flag) {
			this.tabsFlag = flag;
		},
		// 切换中部tab  推荐/关注
		changeMidTab(index) {
			this.tabIndex = index;
			this.$refs.loading.open();
			if (index == 0) { //推荐
				this.getDynamicList(true).then(() => {
					this.$refs.loading.close();
				});
			} else { //关注
				this.getAttentionList(true).then(() => {
					this.$refs.loading.close();
				});
			}
		},
		//动态下拉刷新
		refreshDynamic() {
			this.refreshFlag = true;
			if (this.tabIndex == 0) { //推荐
				this.getDynamicList(true);
			} else { //关注
				this.getAttentionList(true);
			}
		},
		// 触底获取
		getDynamic() {
			if (this.loadStatus != "loadmore") {
				return;
			}
			this.loadStatus = "loading";
			if (this.tabIndex == 0) { //推荐
				this.getDynamicList().then((res) => {
					if (res == 'nomore') {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore";
					}
				});
			} else { //关注
				this.getAttentionList().then((res) => {
					if (res == 'nomore') {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore";
					}
				});
			}
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
		// 推荐圈子
		getCircleCList() {
			return new Promise((resolve, reject) => {
				this.request({
					url: this.apiUrl + 'user/rand_territory_six',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
					},
					success: res => {
						console.log("推荐圈子:", res);
						this.recommendList = res.data.data;
						resolve();
					}
				});
			});
		},
		getRecommendCircle(isFirstPage, change = 0) { //change切换传1
			return new Promise((resolve, reject) => {
				// 动画
				var animation = uni.createAnimation({
					duration: 200,
					timingFunction: 'ease',
				})
				animation.translate(80).opacity(0).step();
				this.animationData = animation.export();
				setTimeout(() => {
					var animation = uni.createAnimation({
						duration: 500,
						timingFunction: 'ease',
					})
					animation.translate(0).opacity(1).step();
					this.animationData = animation.export();
				}, 500);

				if (isFirstPage == true) {
					this.recommendPage = 1;
				}
				this.request({
					url: this.apiUrl + 'User/get_tj_list',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						change,
						page: this.recommendPage
					},
					success: res => {
						// console.log("推荐圈子:", res);
						this.recommendPage++;
						this.recommendList = res.data.info;
						resolve();
					}
				});
			});
		},
		// 动态列表
		getDynamicList(isFirstPage) {
			return new Promise((resolve, reject) => {
				if (isFirstPage == true) {
					this.dynamicPage = 1;
					this.dynamicList = [];
					this.loadStatus = 'loadmore';
				}
				this.request({
					url: this.apiUrl + 'User/get_index_list',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						version: 0, // 0是文字 1是语音 2是视频 3是全部
						index_page: this.dynamicPage
					},
					success: res => {
						// console.log("动态列表:", res);
						if (res.data.info.length == 0 && this.dynamicPage > 1) {
							// uni.showToast({
							// 	title: '没有更多了',
							// 	icon: 'none'
							// });
							resolve('nomore');
						}
						this.dynamicPage++;
						this.dynamicList = this.dynamicList.concat(res.data.info);
						this.refreshFlag = false;
						resolve();
					}
				});
			});
		},
		// 关注列表
		getAttentionList(isFirstPage) {
			return new Promise((resolve, reject) => {
				if (isFirstPage == true) {
					this.dynamicPage = 1;
					this.dynamicList = [];
					this.loadStatus = 'loadmore';
				}
				this.request({
					url: this.apiUrl + 'User/get_my_index_list',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						version: 0, // 0是文字 1是语音 2是视频 3是全部
						index_page: this.dynamicPage
					},
					success: res => {
						this.$refs.loading.close();
						// console.log("关注列表:", res);
						if (res.data.info.length == 0 && this.dynamicPage > 1) {
							// uni.showToast({
							// 	title: '没有更多了',
							// 	icon: 'none'
							// });
							resolve('nomore');
						}
						this.dynamicPage++;
						this.dynamicList = this.dynamicList.concat(res.data.info);
						this.refreshFlag = false;
						resolve();
					}
				});
			});
		},
		getUserInfo(e) {
			if (!e.detail.userInfo) return;
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
				this.getMyCircle(true);
			});
		},
		onShowFun() {
			this.isAuthorized = this.beAuthorized();
			if (this.isAuthorized) {
				this.getMyCircle(true);
				this.refreshDynamic();
			}
		}
	},
	mounted() {
		// console.log('findCreated');
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		if (this.isAuthorized) {
			this.$refs.loading.open();
			Promise.all([this.getCircleCList(), this.getDynamicList(true), this.getBanners(), this.getMyCircle(true)]).then(
				() => {
					this.$refs.loading.close();
				});
		} else {
			this.$refs.loading.open();
			Promise.all([this.getCircleCList(), this.getDynamicList(true), this.getBanners()]).then(() => {
				this.$refs.loading.close();
			});
		}
	}
}
