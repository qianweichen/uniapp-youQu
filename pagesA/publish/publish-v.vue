<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="发布" haveHeight></navigationBar>
		<view class="iptBox flex-between">
			<textarea class="fs-26" placeholder="写下你的想法，让更多的人看见~" placeholder-class="fc-9" maxlength="140" v-model="content" />
			<video :src="videoData.tempVideoPath" controls :poster="videoData.tempThumbPath"></video>
		</view>
		<view class="chooseBox fs-26">
			<!-- <view class="item flex-between">
				<view>禁止转发</view>
				<switch :checked="noForwardFlag" @change="noForward" color="#7364BD" />
			</view> -->
			<view class="item flex-between" @click="goPage('/pagesA/publish/chooseCircle')">
				<view>发布到</view>
				<view class="flex">
					<text class="xz" :style="chooseCirce.realm_name ? 'color:#fff;' : ''">{{ chooseCirce.realm_name || '选择' }}</text>
					<image class="right" src="../../static/right.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="tip flex" @click="showTip">
				<text class="fs-24">发布须知</text>
				<image src="../../static/tip.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="btn-big flex-center" @click="send">发布</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
const qiniuUploader = require('@/components/qiniuUploader/qiniuUploader.js');
export default {
	data() {
		return {
			// noForwardFlag: false, //是否允许转发
			videoData: {}, //视频数据
			content: '', //内容
			chooseCirce: {} //圈子信息
		};
	},
	methods: {
		// 第一步:订阅
		send() {
			if (!this.chooseCirce.id) {
				uni.showToast({
					title: '请选择圈子',
					icon: 'none'
				});
				return;
			}
			if (!this.content) {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				});
				return;
			}
			uni.requestSubscribeMessage({
				tmplIds: ['NfOZBD9yhTMpgM_CUJDBKdmkjvllcDF2RHPvlDMldoI', '7sor7eBvPETo04jeaDtzc_co2VX9_6NHnCJaqQiVMNE'],
				success: res => {
					// console.log(res);
					this.saveVideo();
				}
			});
		},
		// 第二步:上传七牛
		saveVideo() {
			this.$refs.loading.open();
			var params = {};
			params.token = uni.getStorageSync('token');
			params.openid = uni.getStorageSync('openid');
			params.uid = uni.getStorageSync('userId');
			params.content = this.content;
			params.is_open = 1; //可以转发
			params.type = 2; //视频
			params.fa_class = this.chooseCirce.id; //圈子id
			params.color = '#000000';
			params.title = 'default';
			params.file_ss = 0;
			params.mch_id = 1;
			this.request({
				url: this.apiUrl + 'User/upload_token',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId')
				},
				success: res => {
					console.log('上传七牛:', res);
					var token = res.data.token;
					// 交给七牛上传
					qiniuUploader.upload(
						this.videoData.tempVideoPath,
						res => {
							// 每个文件上传成功后,处理相关的事情
							// 其中 info 是文件上传成功后，服务端返回的json，形式如
							// {
							//    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
							//    "key": "gogopher.jpg"
							//  }
							// 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
							params.user_file = 'https://' + res.imageURL;
							//视频自动调取封面
							params.img_arr = ['https://' + res.imageURL + '?vframe/jpg/offset/0'];
							params.video_duration = parseInt(this.videoData.duration);
							this.submit(params);
							console.log('file url is: ' + res.fileUrl);
						},
						error => {
							console.log('error: ' + error);
							params.user_file = '';
							this.submit(params);
						},
						{
							region: 'ECN',
							domain: 'dns.udiao.cn', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
							// key: 'customFileName.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
							// 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
							uptoken: token // 由其他程序生成七牛 uptoken
							// uptokenURL: 'UpTokenURL.com/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
							// uptokenFunc: function() {return '[yourTokenString]';}
						},
						res => {
							// console.log('上传进度', res.progress);
							// console.log('已经上传的数据长度', res.totalBytesSent);
							// console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
						},
						() => {
							// 取消上传
						},
						() => {
							// `before` 上传前执行的操作
						},
						err => {
							// `complete` 上传接受后执行的操作(无论成功还是失败都执行)
						}
					);
				}
			});
		},
		// 第三步:提交
		submit(params) {
			this.request({
				url: this.apiUrl + 'User/add_circle',
				data: params,
				method: 'POST',
				success: res => {
					console.log('发布:', res);
					uni.showToast({
						title: res.data.msg,
						icon:'none'
					});
					this.$refs.loading.close();
					setTimeout(() => {
						uni.navigateBack({
							delta:2
						});
					}, 1500);
				}
			});
		},
		showTip() {
			uni.showModal({
				title: '发布须知',
				content:
					'1.严禁网友在版块内散播或制造任何与事实不符的言论。您的任何不良言论都将可能绐第三方造成恶劣影响，相信您也不想受到同等待遇，请理解配合。\r\n2. 严禁将帖子发至无关版面，请选择对应版块发贴，以维护论坛的系统性和整洁性。\r\n3. 帖子标题请尽量与帖子内容相符，恶意欺骗性质或者标题过于刺激者，删除。\r\n4. 严禁因观点不同或a讨论立场有异在版块上发表针对他人的嘲笑、讽刺、漫骂等人身攻击言论，盼会员间能雅量和谐、理性讨论。',
				showCancel: false,
				confirmText: '我知道了'
			});
		},
		// 上传图片
		getImageInfo(e) {
			console.log('图片返回：', e);
		}
		// 禁止转发
		// noForward(e) {
		// 	this.noForwardFlag = e.detail.value;
		// }
	},
	onLoad() {
		//获取拍摄或选择的视频
		this.videoData = uni.getStorageSync('shootData');
		uni.removeStorageSync('shootData');
		
		var sendCircleData = uni.getStorageSync('sendCircleData');
		if(sendCircleData){
			this.chooseCirce = sendCircleData;
			uni.removeStorageSync('sendCircleData');
		}
	}
};
</script>

<style lang="scss">
.iptBox {
	padding: 50rpx;
	textarea {
		width: 460rpx;
		height: 262rpx;
	}
	video {
		width: 188rpx;
		height: 262rpx;
		border-radius: 8rpx;
	}
}
.chooseBox {
	padding: 0 30rpx;
	.item {
		padding: 40rpx 0;
		border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
		.right {
			width: 16rpx;
			height: auto;
		}
		.xz {
			color: rgba(255, 255, 255, 0.6);
			padding-right: 30rpx;
		}
		switch {
			zoom: 0.8;
		}
	}
	.tip {
		justify-content: flex-end;
		padding: 40rpx 0;
		.fs-24 {
			color: #7364bd;
		}
		image {
			width: 30rpx;
			height: auto;
			margin-left: 20rpx;
		}
	}
}
.btn-big {
	position: fixed;
	bottom: 80rpx;
	left: calc(50% - 345rpx);
}
</style>
