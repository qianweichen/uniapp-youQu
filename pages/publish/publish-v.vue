<template>
	<view class="dark-bg">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="发布" haveHeight></navigationBar>
		<view class="iptBox flex-between">
			<textarea class="fs-26" placeholder="写下你的想法，让更多的人看见~" placeholder-class="fc-9" maxlength="140" />
			<video src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" controls></video>
		</view>
		<view class="chooseBox fs-26">
			<view class="item flex-between">
				<view>禁止转发</view>
				<switch :checked="noForwardFlag" @change="noForward" color="#7364BD" />
			</view>
			<view class="item flex-between" @click="goPage('/pages/publish/chooseCircle')">
				<view>发布到</view>
				<view class="flex">
					<text class="xz">选择</text>
					<image class="right" src="../../static/right.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="tip flex" @click="showTip">
				<text class="fs-24">发布须知</text>
				<image src="../../static/tip.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="btn-big flex-center">发布</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			noForwardFlag: false
		};
	},
	methods: {
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
		},
		// 禁止转发
		noForward(e) {
			this.noForwardFlag = e.detail.value;
		}
	}
};
</script>

<style lang="scss">
.iptBox {
	padding: 50rpx;
	textarea {
		width: 460rpx;
		height:262rpx;
	}
	video{
		width:188rpx;
		height:262rpx;
		border-radius:8rpx;
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
