export default {
	data() {
		return {
			list: [],
			page: 1,
			options: [{
				text: '删除',
				style: {
					backgroundColor: '#7364BD'
				}
			}]
		};
	},
	methods: {
		onClick(id,index) {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'user/message_del',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					id
				},
				success: res => {
					console.log("删除消息:", res);
					this.$refs.loading.close();
					this.list.splice(index,1);
				},
			});
		},
		change(open) {
			// console.log('当前开启状态：' + open);
		},
		//获取消息
		getMsg() {
			this.$refs.loading.open();
			this.request({
				url: this.apiUrl + 'user/message',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					page: this.page,
					type: '', //类型  1点赞 2评论 3关注	不传 或者传其它的 默认全部
				},
				success: res => {
					console.log("获取消息:", res);
					this.$refs.loading.close();
					if (this.page > 1 && res.data.data.length == 0) {
						uni.showToast({
							title: '没有更多了',
							icon: 'none'
						})
					}
					this.page++;
					for (var i = 0; i < res.data.data.length; i++) {
						if (res.data.data[i].pid && res.data.data[i].pid.image_part)
							res.data.data[i].pid.image_part = JSON.parse(res.data.data[i].pid.image_part);
					}
					this.list = this.list.concat(res.data.data);
					//修改首页未读消息
					getCurrentPages()[0].$vm.messageNum = 0;
				},
			});
		},
		onShowFun() {
			this.page = 1;
			this.list = [];
			this.getMsg();
		},
		onBottomFun() {
			this.getMsg();
		}
	},
	mounted() {
		// console.log('messageCreated');
		this.getMsg();
	}
};
