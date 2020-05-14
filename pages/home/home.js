export default {
	data() {
		return {
			customBar: this.CustomBar,
			topCustomBar: this.StatusBar, //顶部状态栏高度
			tabsFlag: true, //推荐/喜欢
			videoIndex: 0, //当前视频下标
			videoContext: '', //视频对象
			progressNum: 0, //视频播放进度百分比
			showVideoPlayBtn: false ,//控制播放按钮
			showCommentFlag:false	,//评论弹窗
			showShareFlag:false //控制分享弹出
		};
	},
	methods: {
		//切换分享弹出层
		toggleShareBox(flag){
			this.showShareFlag = flag;
		},
		// 切换顶部tab
		changeTabs(flag) {
			this.tabsFlag = flag;
		},
		//滑动视频
		changeSwiper(e) {
			this.progressNum = 0; //重置百分比
			this.videoIndex = e.detail.current; //设置视频下标
			this.videoContext = uni.createVideoContext('myVideo', this); //获取视频对象
		},
		// 视频进度改变
		videoTimeUpdate(e) {
			this.progressNum = (e.detail.currentTime / e.detail.duration) * 100;
		},
		//暂停视频
		pauseVideo() {
			this.videoContext.stop();
			this.showVideoPlayBtn = true;
		},
		//播放视频
		playVideo() {
			this.videoContext.play();
			this.showVideoPlayBtn = false;
		},
		//评论弹窗
		showCommentFun(){
			this.showCommentFlag = true;
		},
		hideCommentFun(){
			this.showCommentFlag = false;
		}
	},
	created() {
		console.log('homeCreated');
		this.videoContext = uni.createVideoContext('myVideo', this); //获取视频对象
	}
};
