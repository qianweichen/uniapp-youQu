export default {
	data() {
		return {
			tabIndex: 0,
			dynamicList: [],
			page: 1,
			searchContent: '',
			version: 3, // 0是文字 1是语音 2是视频 3是全部
			circleList:[],
			circlePage:1,
			searchHistory:[]
		};
	},
	computed: {
		searched: function() {
			if (this.searchContent.length > 0) {
				return true;
			}
			this.searchHistory = uni.getStorageSync('searchHistory');
			return false;
		}
	},
	methods: {
		chooseHistory(searchContent){
			this.searchContent = searchContent;
			this.search(true);
		},
		//关注
		attention(id,isUser,index) {
			uni.showLoading({
				title: '加载中'
			})
			this.request({
				url: this.apiUrl + 'User/get_user_cancel',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					this_uid: uni.getStorageSync('userId'),
					uid: id,
					is_user: isUser==0?0:1
				},
				success: res => {
					// console.log("关注:", res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					if (res.data.msg == "关注成功！") {
						uni.requestSubscribeMessage({
							tmplIds: ['h2WXfb886d0u4REloFOdW6L3LrXILAZT3INRequJOOE'],
							success: (res) => {
								// console.log(res)
								this.dynamicList[index].is_user = 1;
							}
						});
					}else{
						this.dynamicList[index].is_user = 0;
					}
				},
			});
		},
		//去播放页面
		goPlayPage(index) {
			var playVideoPageData = {
				videoList: this.dynamicList,
				page: this.page,
				index,
				search:this.searchContent
			}
			uni.setStorageSync('playVideoPageData', playVideoPageData);
			uni.navigateTo({
				url: '/pages/playVideo/playVideo'
			})
		},
		changeTab(index) {
			this.tabIndex = index;
			this.search(true);
		},
		//搜用户
		searchUser(isFirstPage){
			if (isFirstPage == true) {
				this.page = 1;
				this.dynamicList = [];
			}
			uni.showLoading({
				title: '加载中'
			});
			this.request({
				url: this.apiUrl + 'user/user_search',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					page: this.page,
					search: this.searchContent
				},
				success: res => {
					console.log("搜用户:", res);
					uni.hideLoading();
					if(res.data.data.length==0&&this.page>1){
						uni.showToast({
							title:'没有更多了',
							icon:'none'
						})
					}
					this.page++;
					this.dynamicList = this.dynamicList.concat(res.data.data);
				},
			});
		},
		//分页查圈子
		getMyCircle(){
			uni.showLoading({
				title:'加载中'
			});
			this.searchCircle().then(()=>{
				uni.hideLoading();
			})
		},
		//搜圈子
		searchCircle(isFirstPage){
			return new Promise((resolve, reject)=>{
				if (isFirstPage == true) {
					this.circlePage = 1;
					this.circleList = [];
				}
				this.request({
					url: this.apiUrl + 'user/trailing_search',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						uid: uni.getStorageSync('userId'),
						page: this.circlePage,
						search: this.searchContent
					},
					success: res => {
						console.log("搜索圈子:", res);
						if(res.data.data.length==0&&this.circlePage>1){
							uni.showToast({
								title:'没有更多了',
								icon:'none'
							})
						}
						this.circlePage++;
						this.circleList = this.circleList.concat(res.data.data);
						resolve();
					},
				});
			})
		},
		//搜动态
		searchDynamic(isFirstPage){
			if (isFirstPage == true) {
				this.page = 1;
				this.dynamicList = [];
			}
			uni.showLoading({
				title: '加载中'
			});
			this.request({
				url: this.apiUrl + 'User/get_search_list',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					page: this.page,
					search: this.searchContent,
					version: this.version
				},
				success: res => {
					console.log("搜索:", res);
					uni.hideLoading();
					if(res.data.info.length==0&&this.page>1){
						uni.showToast({
							title:'没有更多了',
							icon:'none'
						})
					}
					this.page++;
					this.dynamicList = this.dynamicList.concat(res.data.info);
				},
			});
		},
		search(isFirstPage) {
			if (!this.searchContent) {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				});
				return;
			}
			
			//缓存数据
			var arr = uni.getStorageSync('searchHistory');
			if(!arr) arr = [];
			if(arr.indexOf(this.searchContent)==-1){
				arr.unshift(this.searchContent);
				arr = arr.splice(0,5);
				uni.setStorageSync('searchHistory',arr);
			}
			
			var index = this.tabIndex;
			if (index == 0) { //综合
				this.version = 3;
				this.searchDynamic(isFirstPage);
				this.searchCircle(isFirstPage);
			} else if (index == 1) { //视频
				this.version = 2;
				this.searchDynamic(isFirstPage);
			} else if (index == 2) { //动态
				this.version = 0;
				this.searchDynamic(isFirstPage);
			} else if (index == 3) { //用户
				this.searchUser(isFirstPage);
			}
			
		},
		//点赞后修改数据
		goodFun(index, num) {
			this.dynamicList[index]['is_info_zan'] = !this.dynamicList[index]['is_info_zan']; //修改点赞状态
			this.dynamicList[index]['info_zan_count'] = num; //修改点赞数
		},
		//评论后修改数据
		commentFun(index) {
			this.dynamicList[index].study_repount++; //评论数+1
		},
		delHistory(index){
			var arr = uni.getStorageSync('searchHistory');
			arr.splice(index,1);
			this.searchHistory = arr;
			uni.setStorageSync('searchHistory',arr);
		}
	},
	onReachBottom() {
		this.search();
	}
};
