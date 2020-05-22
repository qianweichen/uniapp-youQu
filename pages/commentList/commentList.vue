<template>
	<view class="page-articleDetails dark-bg" style="padding-bottom: 0;">
		<backCapsule type="normal"></backCapsule>
		<navigationBar name="全部回复" haveHeight></navigationBar>
		<!-- 评论 -->
		<view v-for="(item, index) in commentList" :key="index">
			<view class="comment flex-between">
				<view class="flex align-star">
					<image class="header circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
					<view>
						<view class="fc-9">
							<text class="fs-26">{{ item.user_nick_name }}</text>
							<text class="fs-22">{{ item.duplex_time }}</text>
						</view>
						<view class="fs-30">{{ item.duplex_content }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 评论输入框 -->
		<view class="sendBox">
			<view class="box flex-between">
				<input class="fs-26" type="text" v-model="twoComment" placeholder="留下你的精彩评论吧" />
				<image class="send" src="../../static/send.png" mode="widthFix" @click="sendComment"></image>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: '',
			uid: '',
			page: 1,
			commentList: [],
			twoComment: ''
		};
	},
	methods: {
		sendComment() {
			if (this.twoComment == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.request({
				url: this.apiUrl + 'User/add_paper_reply_duplex',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					id: this.id,
					user_id: this.uid,
					duplex_content: this.twoComment
				},
				success: res => {
					// console.log('发送二级评论:', res);
					this.twoComment = '';
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					this.getCommentList(true);
				}
			});
		},
		getCommentList(isfirstPage) {
			if (isfirstPage == true) {
				this.page = 1;
				this.commentList = [];
			}
			this.request({
				url: this.apiUrl + 'User/get_paper_reply_info',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.id,
					page: this.page
				},
				success: res => {
					// console.log('评论列表:', res);
					if(res.data.list.length==0){
						uni.showToast({
							title:'没有更多了',
							icon:'none'
						})
					}
					this.commentList = this.commentList.concat(res.data.list);
					this.page++;
				}
			});
		}
	},
	onReachBottom() {
		this.getCommentList();
	},
	onLoad(options) {
		// console.log(options);
		this.id = options.id;
		this.uid = options.uid;
		this.getCommentList();
	}
};
</script>

<style lang="scss">
@import '../articleDetails/articleDetails.scss';
</style>
