export default {
	props: {
		type: String, //dynamic:动态  circle:圈子
		list: Array	//列表数据
	},
	data() {
		return {
			clickDynamicId:'',	//点击评论的动态id
			clickDynamicIndex:'',	//点击评论的下标
			showCommentFlag: false, //评论弹窗
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
			showDeleteFlag: false //控制删除弹出
		};
	},
	methods:{
		//举报
		sendInform() {
			if (this.informContent == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				})
				return;
			}
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.request({
				url: this.apiUrl + 'User/add_paper_complaint',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.clickDynamicId,
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
					this.informContent = '';
					this.toggleInform(false);
				},
			});
		},
		toggleInform(flag) {
			this.showInformFlag = flag;
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
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.request({
				url: this.apiUrl + 'User/del_article',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					paper_id: this.clickDynamicId,
					is_qq_text: this.deleteContent
				},
				success: res => {
					console.log("删除", res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.deleteContent = '';
					this.toggleDelete(false);
				},
			});
		},
		toggleDelete(flag) {
			this.showDeleteFlag = flag;
		},
		showAction(userId,index,dynamicId){
			this.clickDynamicId = dynamicId;	//存储动态id
			var itemList = ['举报'];
			var sameUser = userId == uni.getStorageSync('userId');
			var adAdmin = this.list[index]['check_qq'] == 'da';
			var xiaoAdmin = this.list[index]['check_qq'] == 'xiao';
			if (sameUser || adAdmin || xiaoAdmin) {
				itemList.push('删除');
			}
			uni.showActionSheet({
			    itemList,
			    success: res => {
			        // console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
					//举报
					if(res.tapIndex==0){
						this.toggleInform(true)
					}
					//删除
					if(res.tapIndex==1){
						this.toggleDelete(true);
					}
			    }
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
			uni.showLoading({
				title: '加载中',
				mask: true
			})
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
					})
					this.showCommentFun();
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
					id: this.clickDynamicId,
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
		//评论
		sendComment() {
			if (this.commentContent == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				})
				return;
			}
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.request({
				url: this.apiUrl + 'User/add_paper_reply',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.clickDynamicId,
					uid: uni.getStorageSync('userId'),
					reply_type: 0,
					text: this.commentContent
				},
				success: res => {
					console.log("评论:", res);
					this.commentContent = '';
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})
					this.showCommentFun(); //重新加载评论
					this.$emit('commentFun', this.clickDynamicIndex) //评论数+1
				},
			});
		
		},
		//获取评论
		getCommentList(isFirstPage) {
			if(isFirstPage==true){
				this.commentPage = 1;
				this.commentList = [];
			}
			this.request({
				url: this.apiUrl + 'User/get_article_huifu',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.clickDynamicId,
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
		//评论弹窗
		showCommentFun(id,index) {
			if(id){
				this.clickDynamicId = id;	//保存id
			}
			if(index){
				this.clickDynamicIndex = index;	//保存index
			}
			this.showCommentFlag = true;
			// 请求第一页
			this.getCommentList(true);
		},
		hideCommentFun() {
			this.showCommentFlag = false;
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
					zan_type: this.list[index]['is_info_zan'] == true ? 1 : 0
				},
				success: res => {
					console.log("点赞:", res);
					this.$emit('goodFun', index, res.data.info_zan_count) //修改点赞状态
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
				},
			});
		},
		moveHandle(){
			
		},
		//授权
		getUserInfo(e) {
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
			});
		}
	},
	created() {
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
	}
}
