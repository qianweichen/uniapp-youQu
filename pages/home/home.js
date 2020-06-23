export default {
	data() {
		return {
			shareVideoId: '', //接收分享来的id
			customBar: this.CustomBar,
			topCustomBar: this.StatusBar, //顶部状态栏高度
			tabsFlag: true, //推荐/喜欢
			videoPage: 1, //视频页码
			videoList: [], //视频列表
			isAuthorized: false //授权否
		};
	},
	methods: {
		//关注后修改数据
		attentionFun(index,state) {
			this.videoList[index].is_follow = state; //评论数+1
		},
		//点赞后修改数据
		goodFun(index, num) {
			this.videoList[index]['is_info_zan'] = !this.videoList[index]['is_info_zan']; //修改点赞状态
			this.videoList[index]['info_zan_count'] = num; //修改点赞数
		},
		//评论后修改数据
		commentFun(index) {
			this.videoList[index].study_repount++; //评论数+1
		},
		// 切换顶部tab
		changeTabs(flag) {
			this.tabsFlag = flag;

			//获取数据
			this.$refs.loading.open();
			if (flag) {
				this.getHomeList(true);
			} else {
				this.getAttentionList(true);
			}
		},
		//授权后刷新数据
		refreshList(){
			//获取数据
			this.$refs.loading.open();
			if (this.tabsFlag) {
				this.getHomeList(true);
			} else {
				this.getAttentionList(true);
			}
		},
		//获取首页视频列表
		getHomeList(isFirstPage) {
			if (isFirstPage) {
				this.videoPage = 1;
				this.videoList = [];
			}
			this.request({
				url: this.apiUrl + 'User/get_index_list2',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					version: 2, // 0是文字 1是语音 2是视频 3是全部
					index_page: this.videoPage,
					old_id: this.shareVideoId
				},
				success: res => {
					this.$refs.loading.close();
					// console.log("首页视频列表:", res);
					this.videoPage++;
					this.videoList = this.videoList.concat(res.data.info);
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
					this.$refs.loading.close();
					if (res.data.info.length == 0) {
						uni.showToast({
							title: '暂无关注数据',
							icon: 'none'
						})
					}
					console.log("首页视频列表:", res);
					this.videoPage++;
					this.videoList = this.videoList.concat(res.data.info);
				},
			});
		},
		//授权
		getUserInfo(e) {
			if (!e.detail.userInfo) return;
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
			});
		}
	},
	mounted() {
		// console.log('homeCreated');
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		//接收分享id
		var shareVideoId = uni.getStorageSync('shareVideoId');
		if (shareVideoId) {
			this.shareVideoId = shareVideoId;
			uni.removeStorageSync('shareVideoId');
		}
		//获取首页视频列表
		this.$refs.loading.open();
		this.getHomeList(true);
	}
};
