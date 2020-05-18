export default {
	data() {
		return {
			tabIndex: 0,
			dynamicList: [],
			personalId: '', //主页用户id
			personalInfo: {}, //用户信息
			uid: uni.getStorageSync('userId'), //用户id
			videoPage: 1 //页码
		};
	},
	methods: {
		//去播放页面
		goPlayPage(index) {
			var playVideoPageData = {
				videoList: this.dynamicList,
				page: this.videoPage,
				id: this.personalId,
				index
			}
			uni.setStorageSync('playVideoPageData', playVideoPageData);
			uni.navigateTo({
				url: '/pages/playVideo/playVideo'
			})
		},
		//关注
		attention() {
			uni.showLoading({
				title: '加载中'
			})
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
					console.log("关注:", res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					if (res.data.msg == "关注成功！") {
						wx.requestSubscribeMessage({
							tmplIds: ['h2WXfb886d0u4REloFOdW6L3LrXILAZT3INRequJOOE'],
							success: (res) => {
								console.log(res)
							}
						});
					}
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
			uni.showLoading({
				title: '加载中'
			});
			this.request({
				url: this.apiUrl + 'User/get_user_info_my',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: this.personalId,
					this_uid: uni.getStorageSync('userId')
				},
				success: res => {
					uni.hideLoading();
					console.log("获取用户信息:", res);
					this.personalInfo = res.data.info;
				},
			});
		},
		//获取作品数据
		getVideoList(isFirstPage) {
			uni.showLoading({
				title: '加载中'
			});
			if (isFirstPage) {
				this.videoPage = 1;
				this.dynamicList = [];
			}
			//动态访问User/get_my_list，喜欢访问User/get_my_list4
			var urlEnd = '';
			if (this.tabIndex == 2) {
				var urlEnd = '4';
			}
			//version 0是文字 1是语音 2是视频 3是全部
			var version = 3;
			if (this.tabIndex == 0) {
				var version = 2;
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
					uni.hideLoading();
					console.log("动态:", res);
					this.videoPage++;
					for (var i = 0; i < res.data.info.length; i++) {
						this.dynamicList = this.dynamicList.concat(res.data.info[i].list);
					}
					if (res.data.info.length == 0) {
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none'
						})
					}
				},
			});
		}
	},
	onLoad(options) {
		//获取id 请求
		this.personalId = options.id;
		this.getPersonalInfo();
		this.getVideoList(true);
	},
	onReachBottom() {
		this.getVideoList();
	}
};
