<template>
	<view class="page-msg dark-bg" style="padding-bottom: 0;">
		<backCapsule type="normal"></backCapsule>
		<navigationBar :name="title" haveHeight></navigationBar>
		<uni-swipe-action>
			<uni-swipe-action-item :options="options" @click="onClick(item.id,index)" @change="change" v-for="(item, index) in list" :key="index">
				<!-- 赞 -->
				<view v-if="item.type == 1" class="good flex-between align-star bg-theme">
					<view class="flex align-star">
						<image class="header circle" :src="item.launch_user_id.user_head_sculpture" mode="aspectFill"></image>
						<view>
							<view class="fs-26">
								<!-- <text style="color: #7364BD;">小镜哥</text>
								<text>...等4个赞过你的作品</text> -->
								<text>{{ item.content }}</text>
							</view>
							<view class="fs-24">{{ item.pid.study_content }}</view>
							<view class="fs-24 fc-9">{{ item.add_time }}</view>
							<!-- <view class="headerBox">
								<image :src="item.launch_user_id.user_head_sculpture" mode="aspectFill"></image>
							</view> -->
						</view>
					</view>
					<image class="pic" :src="item.pid.image_part[0]" mode="aspectFill"></image>
				</view>
				<!-- 评价 -->
				<view v-if="item.type == 2" class="good flex-between align-star comment bg-theme">
					<view class="flex align-star">
						<image class="header circle" :src="item.launch_user_id.user_head_sculpture" mode="aspectFill"></image>
						<view>
							<view class="fs-26">{{item.launch_user_id.user_nick_name}}评论了你的作品</view>
							<view class="cont fs-26">{{ item.pid.study_content }}</view>
							<view class="fs-24 fc-9">{{ item.add_time }}</view>
						</view>
					</view>
					<image class="pic" :src="item.pid.image_part[0]" mode="aspectFill"></image>
				</view>
				<!-- 粉丝 -->
				<view v-if="item.type == 3" class="fans flex-between bg-theme">
					<view class="flex align-star">
						<image class="header circle" :src="item.launch_user_id.user_head_sculpture" mode="aspectFill"></image>
						<view>
							<view class="fs-26">{{ item.launch_user_id.user_nick_name }}</view>
							<view class="fs-26 cont">{{ item.content }}了你</view>
							<view class="fs-24 fc-9">{{ item.add_time }}</view>
						</view>
					</view>
					<!-- <view class="fs-26">
						<view v-if="true" class="gz flex-center">关注</view>
						<view v-else class="gz flex-center active">互相关注</view>
					</view> -->
				</view>
			</uni-swipe-action-item>
			<view v-if="list.length==0" style="text-align: center; padding-top: 400rpx; color: #999;">暂无数据</view>
		</uni-swipe-action>
	</view>
</template>

<script>
import uniSwipeAction from '@/components/uni-swipe/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe/uni-swipe-action-item/uni-swipe-action-item.vue';
export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem
	},
	data() {
		return {
			list: [],
			page: 1,
			title: '',
			type: '',
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
			uni.showLoading({
				title: '加载中'
			});
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
					uni.hideLoading();
					this.list.splice(index,1);
				},
			});
		},
		change(open) {
			// console.log('当前开启状态：' + open);
		},
		//获取消息
		getMsg() {
			uni.showLoading({
				title: '加载中'
			});
			this.request({
				url: this.apiUrl + 'user/message',
				data: {
					token: uni.getStorageSync('token'),
					openid: uni.getStorageSync('openid'),
					uid: uni.getStorageSync('userId'),
					page: this.page,
					type: this.type //类型  1点赞 2评论 3关注	不传 或者传其它的 默认全部
				},
				success: res => {
					console.log('获取消息:', res);
					uni.hideLoading();
					if (this.page > 1 && res.data.data.length == 0) {
						uni.showToast({
							title: '没有更多了',
							icon: 'none'
						});
					}
					this.page++;
					for (var i = 0; i < res.data.data.length; i++) {
						if (res.data.data[i].pid && res.data.data[i].pid.image_part) res.data.data[i].pid.image_part = JSON.parse(res.data.data[i].pid.image_part);
					}
					this.list = this.list.concat(res.data.data);
				}
			});
		}
	},
	onLoad(options) {
		this.type = options.type;
		if (options.type == 1) {
			this.title = '赞';
		} else if (options.type == 2) {
			this.title = '评论';
		} else {
			this.title = '粉丝';
		}
		this.getMsg();
	},
	onReachBottom() {
		this.getMsg();
	}
};
</script>

<style lang="scss">
@import './message.scss';
</style>
