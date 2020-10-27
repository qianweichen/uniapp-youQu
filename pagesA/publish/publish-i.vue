<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="发布" haveHeight></navigationBar>
		<view class="iptBox"><textarea class="fs-26" placeholder="在这里写下你的心情..." placeholder-class="fc-9" maxlength="140" v-model="content" /></view>
		<sunui-upimg
			@change="getImageInfo"
			:upload_auto="true"
			ref="upimg1"
			:upload_count="6"
			upload_img_wh="width:196rpx;height:196rpx;"
			:url="apiUrl + 'User/img_upload'"
			:header="formData"
		></sunui-upimg>
		<view class="chooseBox fs-26">
			<view class="item flex-between" @click="goPage('/pagesA/publish/chooseCircle')">
				<view>同步到圈子</view>
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
import sunUiUpimg from '@/components/sunui-upimg/sunui-upimg.vue';
export default {
	components: {
		sunUiUpimg: sunUiUpimg
	},
	data() {
		return {
			apiUrl: this.apiUrl,
			content: '',
			chooseCirce: {}, //圈子信息
			imgArr: [],
			formData: {
				token: uni.getStorageSync('token'),
				openid: uni.getStorageSync('openid'),
				much_id: 1
			}
		};
	},
	methods: {
		// 第一步:订阅
		send() {
			if (!this.content) {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				});
				return;
			}
			if (this.imgArr.length==0) {
				uni.showToast({
					title: '请选择图片',
					icon: 'none'
				});
				return;
			}
			uni.requestSubscribeMessage({
				tmplIds: ['NfOZBD9yhTMpgM_CUJDBKdmkjvllcDF2RHPvlDMldoI', '7sor7eBvPETo04jeaDtzc_co2VX9_6NHnCJaqQiVMNE'],
				success: res => {
					// console.log(res);
					this.$refs.loading.open();
					var params = {};
					params.token = uni.getStorageSync('token');
					params.openid = uni.getStorageSync('openid');
					params.uid = uni.getStorageSync('userId');
					params.content = this.content;
					params.is_open = 1; //可以转发
					params.type = 0; //图文
					params.fa_class = this.chooseCirce.id ? this.chooseCirce.id : 1; //圈子id
					params.needle_id = 11; //广场id(默认)
					params.img_arr = this.imgArr; //图片
					//默认
					params.color = '#000000';
					params.title = 'default';
					params.file_ss = 0;
					params.mch_id = 1;
					this.submit(params);
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
					// console.log('发布:', res);
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.$refs.loading.close();
					setTimeout(() => {
						uni.navigateBack();
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
			// console.log('图片返回：', e);
			this.imgArr = e;
		}
		// 禁止转发
		// noForward(e) {
		// 	this.noForwardFlag = e.detail.value;
		// }
	},
	onLoad() {
		var sendCircleData = uni.getStorageSync('sendCircleData');
		if (sendCircleData) {
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
		width: 100%;
		height: 160rpx;
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
