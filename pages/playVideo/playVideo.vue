<template>
	<view>
		<backCapsule type="normal"></backCapsule>
		<view style="height: 100vh;">
			<videoBox
				:videoList="videoList"
				@loginFun="getVideoList"
				@getNextPage="getVideoList"
				@goodFun="goodFun"
				@commentFun="commentFun"
				@attentionFun="attentionFun"
				:index="videoIndex"
			></videoBox>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import videoBox from '@/components/videoPage/videoPage.vue';
export default {
	components: {
		videoBox
	},
	data() {
		return {
			videoList: [], //视频列表
			videoIndex: 0, //初始下标
			videoPage: 1, //初始页码
			userId: '', //个人页跳转来的用户id
			search: '', //搜索页跳转来的搜索内容
			screenWidth: uni.getSystemInfoSync().windowWidth, //屏幕宽度
			screenHeight: uni.getSystemInfoSync().windowHeight,

			isFromLike: false //是否从个人页 喜欢的作品来
		};
	},
	methods: {
		//关注后修改数据
		attentionFun(index, state) {
			this.videoList[index].is_follow = state; //评论数+1
		},
		//点赞后修改数据
		goodFun(index, num) {
			this.videoList[index]['is_info_zan'] = !this.videoList[index]['is_info_zan']; //修改点赞状态
			this.videoList[index]['info_zan_count'] = num; //修改点赞数
		},
		//评论后修改数据
		commentFun(index, content, isDel) {
			if (isDel) {
				this.videoList[index].study_repount--; //评论数-1
			} else {
				this.videoList[index].study_repount++; //评论数+1
				this.videoList[index].pinglun.push({
					reply_content: content
				});
			}
		},
		getVideoList(isFirstPage) {
			if (isFirstPage) {
				this.videoPage = 1;
				this.dynamicList = [];
			}
			if (this.search) {
				//有搜索内容走搜索，没有则是从个人页来的
				this.getSearchVideo();
			} else {
				this.getPersionVideo();
			}
		},
		//获取个人动态
		getPersionVideo() {
			this.request({
				url: this.apiUrl + 'User/get_my_list' + (this.isFromLike ? '4' : ''),
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.userId,
					uid: uni.getStorageSync('userId'),
					index_page: this.videoPage,
					version: 2
				},
				success: res => {
					uni.hideLoading();
					// console.log('动态:', res);
					this.videoPage++;
					for (var i = 0; i < res.data.info.length; i++) {
						this.videoList = this.videoList.concat(res.data.info[i].list);
					}
					if (res.data.info.length == 0) {
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none'
						});
					}
					//获取 封面图/视频 高度
					res.data.info.forEach(_item => {
						if (_item.study_type == 2) {
							var src = this.httpsUrl(_item.study_video + '?vframe/jpg/offset/0');
							uni.getImageInfo({
								src,
								success: res => {
									var width = this.screenWidth;
									var height = (width * res.height) / res.width;
									if (height / this.screenHeight > 0.8) {	//高度在90%以上
										this.$set(_item, 'cover', true);
									}
								}
							});
						}
					});
				}
			});
		},
		//获取搜索动态
		getSearchVideo() {
			this.request({
				url: this.apiUrl + 'User/get_search_list',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					page: this.videoPage,
					search: this.search,
					version: 2
				},
				success: res => {
					// console.log('搜索:', res);
					uni.hideLoading();
					this.videoPage++;
					this.videoList = this.videoList.concat(res.data.info);
					//获取 封面图/视频 高度
					res.data.info.forEach(_item => {
						if (_item.study_type == 2) {
							var src = this.httpsUrl(_item.study_video + '?vframe/jpg/offset/0');
							uni.getImageInfo({
								src,
								success: res => {
									var width = this.screenWidth;
									var height = (width * res.height) / res.width;
									if (height / this.screenHeight > 0.8) {	//高度在90%以上
										this.$set(_item, 'cover', true);
									}
								}
							});
						}
					});
				}
			});
		}
	},
	onLoad(options) {
		//获取数据
		var playVideoPageData = uni.getStorageSync('playVideoPageData');
		if (playVideoPageData) {
			this.videoList = playVideoPageData.videoList;
			this.videoPage = playVideoPageData.page;
			this.userId = playVideoPageData.id; //个人页跳转来的用户id
			this.videoIndex = playVideoPageData.index;
			this.search = playVideoPageData.search; //搜索页跳转来的搜索内容
			uni.removeStorageSync('playVideoPageData');
		}

		if (options.isFromLike == 'isFromLike') {
			//从个人喜欢页面来
			this.isFromLike = true;
		}
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
</script>

<style lang="scss">
@import '@/pages/home/home.scss';
</style>
