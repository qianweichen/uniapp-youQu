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
			searchHistory:[],
			//自动播放数据
			screenWidth: uni.getSystemInfoSync().windowWidth,
			screenHeight: uni.getSystemInfoSync().windowHeight,
			playIndex: 0, //播放视频下标
			firstTop: 200, //第一个默认的位置
			touchStar: 0,
			touchEnd: 0,
			pageScroll: 0,
			timer: null,
			autoPlayFlag:false
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
		//播放视频
		playVideoFun(index,oldIndex){
			// if(typeof oldIndex == 'number'){
			// 	this.$set(this.dynamicList[oldIndex], 'playVideoFlag', false);
			// }
			this.autoPlayFlag = true;
			for (var i = 0; i < this.dynamicList.length; i++) {
				this.$set(this.dynamicList[i], 'playVideoFlag', false);
			}
			this.$set(this.dynamicList[index], 'playVideoFlag', true);
		},
		//关注后修改数据
		attentionFun(index,state) {
			this.dynamicList[index].is_follow = state;
		},
		chooseHistory(searchContent){
			this.searchContent = searchContent;
			this.search(true);
		},
		//关注
		attention(id,isUser,index) {
			this.$refs.loading.open();
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
					this.$refs.loading.close();
					if (res.data.msg == "关注成功！") {
						// uni.requestSubscribeMessage({
						// 	tmplIds: ['h2WXfb886d0u4REloFOdW6L3LrXILAZT3INRequJOOE'],
						// 	success: (res) => {
						// 		// console.log(res)
						// 		this.dynamicList[index].is_user = 1;
						// 	}
						// });
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
			this.$refs.loading.open();
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
					// console.log("搜用户:", res);
					this.$refs.loading.close();
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
			this.$refs.loading.open();
			this.searchCircle().then(()=>{
				this.$refs.loading.close();
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
						// console.log("搜索圈子:", res);
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
			this.$refs.loading.open();
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
					// console.log("搜索:", res);
					this.$refs.loading.close();
					if(res.data.info.length==0&&this.page>1){
						uni.showToast({
							title:'没有更多了',
							icon:'none'
						})
					}
					for (let i = 0; i < res.data.info.length; i++) {
						let _item = res.data.info[i];
						if (_item.study_type == 2) {
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
				if(isFirstPage)	this.searchCircle(isFirstPage);
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
		commentFun(index, content , isDel) {
			if(isDel){
				this.dynamicList[index].study_repount--; //评论数-1
			}else{
				this.dynamicList[index].study_repount++; //评论数+1
			}
		},
		delHistory(index){
			var arr = uni.getStorageSync('searchHistory');
			arr.splice(index,1);
			this.searchHistory = arr;
			uni.setStorageSync('searchHistory',arr);
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
	onReachBottom() {
		this.search();
	},
	onPageScroll(e) {
		if(this.tabIndex!=0){
			return;
		}
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
