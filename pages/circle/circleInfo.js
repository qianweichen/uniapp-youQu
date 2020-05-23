export default {
	data() {
		return {
			showComplaintFlag: false, //投诉弹窗
			showIptCodeFlag: false, //显示生成邀请码
			erCode: '',
			id: '', //圈子id
			circleInfo: {},
			tsContent: '' //投诉内容
		};
	},
	methods: {
		// 复制邀请码
		copyCode() {
			uni.setClipboardData({
				data: this.erCode
			});
		},
		//显示隐藏	生成邀请码
		toggleIptCodeFlag(flag) {
			this.showIptCodeFlag = flag;
		},
		//显示隐藏	投诉
		toggleComplaint(flag) {
			this.showComplaintFlag = flag;
		},
		showGuiFan(type) {
			var title, content;
			if (type == 1) {
				title = '圈主权益与规范';
				content = '圈主可以在任职的圈子里管理圈子内容和用户,还有闪亮亮的独家圈主标识哦。圈主团队由圈主和管理员构成。由圈主建立，并为圈子的发展和秩序负责。圈主最多三位。';
			} else if (type == 2) {
				title = '管理员权益与规范';
				content = '管理员由圈主设置，圈主有权取消其身份。作为圈主团队的一份子，管理员拥有圈子内删除、置顶帖子等权限、酷炫的标识。管理员最多十位。';
			}
			uni.showModal({
				title,
				content,
				showCancel: false,
				confirmText: '关闭'
			});
		},
		// 圈子信息
		getCircleInfo() {
			this.request({
				url: this.apiUrl + 'User/get_qq_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.id,
				},
				success: res => {
					uni.hideLoading();
					// console.log("圈子信息:", res);
					this.circleInfo = res.data.info;
					this.erCode = res.data.info.atcipher;
					// this_da_qq==1	是大管理员	0为相反
					// this_xiao_qq==1	是小管理员	0为相反
					// attention==0		是开放		1为相反
				},
			});
		},
		//发送投诉
		sendTs() {
			if (!this.tsContent) {
				uni.showToast({
					title: '请输入投诉内容',
					icon: 'none'
				})
				return;
			}
			uni.showLoading({
				title: '加载中'
			})
			this.request({
				url: this.apiUrl + 'User/add_tc_submit',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),

					id: this.id, //圈子id
					user_id: this.id, //圈子id  或  管理员id	看投诉哪个
					user_type: 0, // 0：投诉圈子
					labor: '', //投诉圈子传空
					get_tc_text: this.tsContent

				},
				success: res => {
					// console.log("投诉:", res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.tsContent = '';
					this.toggleComplaint(false);
				},
			});
		},
		// 打开或关闭圈子
		toggleAtence() {
			uni.showLoading({
				title:'加载中'
			})
			this.request({
				url: this.apiUrl + 'user/territoryStatus',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					tory_id: this.id,
				},
				success: res => {
					// console.log("打开或关闭暗号:", res);
					uni.showToast({
						title: res.data.msg,
					});
					this.getCircleInfo();
				},
			});
		},
		// 随机生成
		getRandom(){
			uni.showLoading({
				title:'加载中'
			})
			this.request({
				url: this.apiUrl + 'User/get_ah_random',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
				},
				success: res => {
					// console.log("随机生成:", res);
					uni.hideLoading();
					this.erCode = res.data;
				},
			});
		}
	},
	onLoad(options) {
		this.id = options.id;
		uni.showLoading({
			title:'加载中'
		});
		this.getCircleInfo();
	}
};
