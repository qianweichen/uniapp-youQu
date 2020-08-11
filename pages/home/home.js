export default {
	data() {
		return {
			shareVideoId: '', //接收分享来的id
			customBar: this.CustomBar,
			topCustomBar: this.StatusBar, //顶部状态栏高度
			tabsFlag: true, //推荐/喜欢
			videoPage: 1, //视频页码
			videoList: [], //视频列表
			isAuthorized: false, //授权否
			isShowNotice: false,
			isShowShare: false,
			txList: [],
			animation: '',
			animation2: '',
			isShowRed: false,
			showVideoFlag:true
		};
	},
	methods: {
		//获取红包开关
		getRed() {
			this.request({
				url: this.apiUrl + 'user/getkg',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
				},
				success: res => {
					// console.log("获取红包开关:", res);
					this.isShowRed = res.data.data.with_status;
				},
			});
		},
		//获取提现记录
		getTxList() {
			this.request({
				url: this.apiUrl + 'user/tx_list_new',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
				},
				success: res => {
					// console.log("获取提现记录:", res);
					this.txList = res.data.data;
				},
			});
		},
		//关注后修改数据
		attentionFun(index, state) {
			this.videoList[index].is_follow = state; //评论数+1
		},
		//点赞后修改数据
		goodFun(index, num) {
			this.videoList[index]['is_info_zan'] = !this.videoList[index]['is_info_zan']; //修改点赞状态
			this.videoList[index]['info_zan_count'] = num; //修改点赞数
		},
		//评论后修改数据
		commentFun(index, content, isDel) {
			if (isDel) {
				this.videoList[index].study_repount--; //评论数-1
			} else {
				this.videoList[index].study_repount++; //评论数+1
				this.videoList[index].pinglun.push({
					reply_content: content
				});
			}
		},
		// 切换顶部tab
		changeTabs(flag) {
			this.tabsFlag = flag;
			//利用v-if切换时清除video，保证初始化播放
			this.showVideoFlag = false;
			//获取数据
			this.$refs.loading.open();
			if (flag) {
				this.getHomeList(true);
			} else {
				this.getAttentionList(true);
			}
		},
		//授权后刷新数据
		refreshList() {
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
					old_id: this.videoPage == 1 ? this.shareVideoId : ''
				},
				success: res => {
					this.$refs.loading.close();
					// console.log("首页视频列表:", res);
					this.videoPage++;
					this.videoList = this.videoList.concat(res.data.info);
					this.showVideoFlag = true;
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
					// console.log("首页视频列表:", res);
					this.videoPage++;
					this.videoList = this.videoList.concat(res.data.info);
					this.showVideoFlag = true;
				},
			});
		},
		//关闭公告
		closeNotice() {
			uni.setStorageSync('showNoticeDate', new Date().toLocaleDateString());
			this.isShowNotice = false;
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
		// 公告:每天弹出一次
		var nowDate = new Date().toLocaleDateString(),
			oldDate = uni.getStorageSync('showNoticeDate');
		if (nowDate != oldDate) {
			this.isShowNotice = true;
		}

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
		this.getTxList();
		this.getRed();


		// 1: 创建动画实例animation:
		var animation = uni.createAnimation({
			duration: 200,
			timingFunction: 'ease',
		})
		this.animation = animation
		var next = true;
		//连续动画关键步骤
		setInterval(function() {
			//2: 调用动画实例方法来描述动画
			if (next) {
				// animation.translateX(4).step();
				animation.rotate(8).step()
				animation.rotate(-8).step()
				animation.rotate(0).step()
				next = !next;
			} else {
				// animation.translateX(-4).step();
				animation.rotate(-8).step()
				animation.rotate(8).step()
				animation.rotate(0).step()
				next = !next;
			}
			//3: 将动画export导出，把动画数据传递组件animation的属性 
			this.animation = animation.export();
		}.bind(this), 2000)

		// 1: 创建动画实例animation:
		var animation2 = uni.createAnimation({
			duration: 1000,
			timingFunction: 'linear',
		})
		this.animation2 = animation2
		var next2 = true;
		//连续动画关键步骤
		setInterval(function() {
			//2: 调用动画实例方法来描述动画
			if (next2) {
				// animation2.translateX(4).step();
				animation2.scale(1.1).step()
				next2 = !next2;
			} else {
				// animation2.translateX(-4).step();
				animation2.scale(0.9).step()
				next2 = !next2;
			}
			//3: 将动画export导出，把动画数据传递组件animation2的属性 
			this.animation2 = animation2.export();
		}.bind(this), 1000)
	}
};
