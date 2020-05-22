<template>
	<view>
		<backCapsule type="normal"></backCapsule>
		<view style="height: 100vh;">
			<videoBox :videoList="videoList" @getNextPage="getVideoList" @goodFun="goodFun" @commentFun="commentFun" :index="videoIndex"></videoBox>
		</view>
	</view>
</template>

<script>
import videoBox from '@/components/videoPage/videoPage.vue';
export default {
	components:{
		videoBox
	},
	data() {
		return {
			videoList: [], //视频列表
			videoIndex:0,	//初始下标
			videoPage:1,	//初始页码
			userId:''//用户id
		};
	},
	computed: {
		//是否显示删除按钮
		deleteBtnFlag() {
			if (this.videoList.length == 0) return false;
			var sameUser = this.videoList[this.videoIndex].user_id == uni.getStorageSync('userId');
			var adAdmin = this.videoList[this.videoIndex]['check_qq'] == 'da';
			var xiaoAdmin = this.videoList[this.videoIndex]['check_qq'] == 'xiao';
			if (sameUser || adAdmin || xiaoAdmin) {
				return true;
			}
			return false;
		}
	},
	methods: {
		//点赞后修改数据
		goodFun(index, num) {
			this.videoList[index]['is_info_zan'] = !this.videoList[index]['is_info_zan']; //修改点赞状态
			this.videoList[index]['info_zan_count'] = num; //修改点赞数
		},
		//评论后修改数据
		commentFun(index) {
			this.videoList[index].study_repount++; //评论数+1
		},
		getVideoList(isFirstPage){
			uni.showLoading({
				title: '加载中'
			});
			if (isFirstPage) {
				this.videoPage = 1;
				this.dynamicList = [];
			}
			this.request({
				url: this.apiUrl + 'User/get_my_list',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					id: this.userId,
					uid: uni.getStorageSync('userId'),
					index_page: this.videoPage,
					version:2
				},
				success: res => {
					uni.hideLoading();
					console.log("动态:", res);
					this.videoPage++;
					for (var i = 0; i < res.data.info.length; i++) {
						this.videoList = this.videoList.concat(res.data.info[i].list);
					}
					if (res.data.info.length == 0) {
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none'
						})
					}
				},
			});
		},
		//授权
		getUserInfo(e) {
			if(!e.detail.userInfo)	return;
			this.doLogin(e.detail.userInfo, () => {
				this.isAuthorized = true;
			});
		}
	},
	onLoad() {
		//判断授权 已授权为true
		this.isAuthorized = this.beAuthorized();
		//获取数据
		var playVideoPageData = uni.getStorageSync('playVideoPageData');
		if(playVideoPageData){
			this.videoList = playVideoPageData.videoList;
			this.videoPage = playVideoPageData.page;
			this.userId = playVideoPageData.id;
			this.videoIndex = playVideoPageData.index;
			uni.removeStorageSync('playVideoPageData');
		}
	}
};

</script>

<style lang="scss">
@import '@/pages/home/home.scss';
</style>
