import _app from '@/components/QS-SharePoster/app.js';
import {
	getSharePoster
} from '@/components/QS-SharePoster/QS-SharePoster.js';
export default {
	data() {
		return {
			noJurisdiction: false, //没权限
			erCode: '', //邀请码
			showIptCodeFlag: false, //显示输入邀请码
			page: 1,
			dynamicList: [],
			circleId: '', //圈子id
			circleData: {}, //圈子信息
			isAuthorized: false, //授权否
			qrCode: '', //圈子二维码
			topList: [], //置顶推荐
			showPublishFlag: false, //发布
			//海报数据
			poster: {},
			qrShow: false,
			canvasId: 'default_PosterCanvasId'
		};
	},
	methods: {
		// 选择发布类型
		togglePublishFlag(flag) {
			this.showPublishFlag = flag;
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
		// 帖子数据
		getArticleList(isFirstPage) {
			if (isFirstPage == true) {
				this.page = 1;
				this.dynamicList = [];
			}
			this.request({
				url: this.apiUrl + 'User/get_index_list',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					tory_id: this.circleId,
					index_page: this.page,
					version: 3, // 0是文字 1是语音 2是视频 3是全部
					startid: this.dynamicList.length ? this.dynamicList[0].id : 0,
				},
				success: res => {
					// console.log("帖子数据:", res);
					this.dynamicList = this.dynamicList.concat(res.data.info);
					this.page++;
				},
			});
		},
		// 获取置顶帖子
		getTopArticle() {
			this.request({
				url: this.apiUrl + 'User/get_placement_top',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					tory_id: this.circleId,
				},
				success: res => {
					// console.log("置顶帖子:", res);
					this.topList = res.data.info;
				},
			});
		},
		//海报star
		shareQrCode() {
			//获取二维码后生成图片
			this.getQrCode().then(this.shareFc);
		},
		getQrCode() { //获取圈子二维码
			return new Promise((resolve, reject) => {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.request({
					url: this.apiUrl + 'User/qrcodeBypath',
					data: {
						token: uni.getStorageSync('token'),
						openid: uni.getStorageSync('openid'),
						id: this.circleId,
						// page: 'pages/circle/circle',
						page: 'yl_welore/pages/packageA/circle_info/index',
						scene: '?id=' + this.circleId
					},
					success: res => {
						uni.hideLoading();
						console.log("获取圈子二维码:", res);
						this.qrCode = res.data.data.url;
						resolve();
					}
				});
			});
		},
		async shareFc() {
			try {
				_app.log('准备生成:' + new Date())
				const d = await getSharePoster({
					backgroundImage: this.circleData.realm_bg, //背景
					_this: this, //若在组件中使用 必传
					type: 'testShareType',
					formData: {
						//访问接口获取背景图携带自定义数据

					},
					posterCanvasId: this.canvasId, //canvasId
					delayTimeScale: 20, //延时系数
					/* background: {
						width: 1080,
						height: 1920,
						backgroundColor: '#666'
					}, */
					drawArray: ({
						bgObj,
						type,
						bgScale
					}) => {
						const dx = bgObj.width * 0.3;
						const fontSize = bgObj.width * 0.045;
						const lineHeight = bgObj.height * 0.04;
						//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
						return new Promise((rs, rj) => {
							rs([{
									type: 'custom',
									setDraw(Context) {
										Context.setFillStyle('black');
										Context.setGlobalAlpha(0.3);
										Context.fillRect(0, bgObj.height - bgObj.height * 0.2, bgObj.width, bgObj.height * 0.2);
										Context.setGlobalAlpha(1);
									}
								},
								{
									type: 'image',
									url: this.circleData.realm_icon,
									alpha: 1,
									dx: bgObj.width * 0.03,
									dy: bgObj.height - bgObj.width * 0.35,
									infoCallBack(imageInfo) {
										let scale = bgObj.width * 0.2 / imageInfo.height;
										return {
											circleSet: {
												x: imageInfo.width * scale / 2,
												y: bgObj.width * 0.2 / 2,
												r: bgObj.width * 0.2 / 2
											}, // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
											dWidth: imageInfo.width * scale, // 因为设置了圆形图片 所以要乘以2
											dHeight: bgObj.width * 0.2,
											/* roundRectSet: { // 圆角矩形
												r: imageInfo.width * .1
											} */
										}
									}
								},
								{
									type: 'image',
									url: this.qrCode,
									alpha: 1,
									dx: bgObj.width * 0.75,
									dy: bgObj.height - bgObj.width * 0.35,
									infoCallBack(imageInfo) {
										let scale = bgObj.width * 0.2 / imageInfo.height;
										return {
											circleSet: {
												x: imageInfo.width * scale / 2,
												y: bgObj.width * 0.2 / 2,
												r: bgObj.width * 0.2 / 2
											}, // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
											dWidth: imageInfo.width * scale, // 因为设置了圆形图片 所以要乘以2
											dHeight: bgObj.width * 0.2,
											/* roundRectSet: { // 圆角矩形
												r: imageInfo.width * .1
											} */
										}
									}
								},
								{
									type: 'text',
									text: this.circleData.realm_synopsis,
									size: fontSize,
									color: 'white',
									alpha: 1,
									textAlign: 'left',
									textBaseline: 'middle',
									infoCallBack(textLength) {
										_app.log('index页面的text的infocallback ，textlength:' + textLength);
										return {
											dx: bgObj.width - textLength - fontSize,
											dy: bgObj.height - lineHeight * 2
										}
									},
									serialNum: 0,
								}
							]);
						})
					},
					setCanvasWH: ({
						bgObj,
						type,
						bgScale
					}) => { // 为动态设置画布宽高的方法，
						this.poster = bgObj;
					}
				});
				_app.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + d.poster.tempFilePath)
				this.poster.finalPath = d.poster.tempFilePath;
				this.qrShow = true;
			} catch (e) {
				_app.hideLoading();
				_app.showToast(JSON.stringify(e));
				console.log(JSON.stringify(e));
			}
		},
		saveImage() {
			// #ifndef H5
			uni.saveImageToPhotosAlbum({
				filePath: this.poster.finalPath,
				success(res) {
					_app.showToast('保存成功');
				}
			})
			// #endif
			// #ifdef H5
			_app.showToast('保存了');
			// #endif
		},
		hideQr() {
			this.qrShow = false;
		},
		//海报end
		join() {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.request({
				url: this.apiUrl + 'User/set_user_trailing',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					tory_id: this.circleId,
					is_trailing: this.circleData['is_trailing'] == true ? 1 : 0,
					trailing_type: 1, //0申请（干掉） 1邀请码
					trailing_text: this.erCode //邀请码
				},
				success: res => {
					uni.hideLoading();
					// console.log("加入:",res);
					uni.showToast({
						title: res.data.msg
					});
					this.showIptCodeFlag = false;	//隐藏邀请码填写弹窗
					//刷新信息
					this.getCircleInfo();
					this.getTopArticle();
					this.getArticleList(true);
				},
			});
		},
		//获取圈子信息
		getCircleInfo() {
			this.request({
				url: this.apiUrl + 'User/get_tory_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					id: this.circleId,
				},
				success: res => {
					uni.hideLoading();
					// console.log("获取圈子信息:", res);
					this.circleData = res.data.info;
													      //私密圈子   并且   未加入
					this.noJurisdiction = res.data.info.attention == 1 && res.data.info.is_trailing == false;
				},
			});
		},
		// 粘贴
		setCode() {
			uni.getClipboardData({
				success: res => {
					this.erCode = res.data;
				}
			});
		},
		// 输入邀请码弹窗
		toggleIptCodeFlag(flag) {
			this.showIptCodeFlag = flag;
		},
		// 请求访问
		sendCode() {
			if(!this.erCode){
				uni.showToast({
					title:'请输入邀请码',
					icon:'none'
				})
				return;
			}
			this.join();
		},
		getUserInfo(e) {
			if (!e.detail.userInfo) return;
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
			});
		}
	},
	onLoad(options) {
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		// 获取id请求
		this.circleId = options.id;
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		this.getCircleInfo();
		this.getTopArticle();
		this.getArticleList(true);
	},
	onReachBottom() {
		this.getArticleList();
	},
	onShareAppMessage(res) {
		// console.log(res);
		// 系统菜单分享
		if (res.from === 'menu') {
			return {
				title: this.miniProgramName,
				path: '/pages/index/index',
				imageUrl: '/static/logo.png'
			};
		}
		// 页面内分享按钮
		if (res.from === 'button') {
			return {
				title: res.target.dataset.content || this.miniProgramName,
				path: '/pages/index/index?id=' + res.target.dataset.id,
				imageUrl: res.target.dataset.img
			};
		}
	}
};
