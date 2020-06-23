<!-- 动态列表
import dynamicList from '@/components/dynamic/dynamic.vue';

//dynamic:动态  circle:圈子
<dynamicList type="dynamic" :list="dynamicList" @goodFun="goodFun" @commentFun="commentFun" @attentionFun="attentionFun" @playVideoFun="playVideoFun"></dynamicList> 

 components:{
 	dynamicList
 }
 
//点赞后修改数据
goodFun(index, num) {
	this.dynamicList[index]['is_info_zan'] = !this.dynamicList[index]['is_info_zan']; //修改点赞状态
	this.dynamicList[index]['info_zan_count'] = num; //修改点赞数
},
//评论后修改数据
commentFun(index) {
	this.dynamicList[index].study_repount++; //评论数+1
},
//关注后修改数据
attentionFun(index,state) {
	this.dynamicList[index].is_follow = state;
},
//播放视频
playVideoFun(index,oldIndex){
	for (var i = 0; i < this.dynamicList.length; i++) {
		this.$set(this.dynamicList[i], 'playVideoFlag', false);
	}
	this.$set(this.dynamicList[index], 'playVideoFlag', true);
},
 
-->
<template>
	<view class="page-dynamic fc-f">
		<view class="dynamicList">
			<view class="item" v-for="(item, index) in list" :key="index" :id="'videoGroup' + index">
				<!-- 头部 -->
				<view class="flex-between padding">
					<view class="header flex" @click="goPage('/pages/personalCenter/personalCenter?id=' + item.user_id)">
						<image class="circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
						<view class="fs-28">{{ item.user_nick_name }}</view>
						<view class="fs-26">{{ item.adapter_time }}</view>
					</view>
					<view v-if="item.user_id != userId">
						<view v-if="isAuthorized" class="btn flex-center fs-22" @click.stop="attention(item.user_id, item.is_follow, index)">
							{{ item.is_follow == 1 ? '已关注' : '关注' }}
						</view>
						<button v-else open-type="getUserInfo" class="share btn flex-center" @getuserinfo="getUserInfo" style="font-size: 22rpx;">关注</button>
					</view>
				</view>
				<!-- 文字 -->
				<view class="content fs-28 padding" @click="goPage('/pages/articleDetails/articleDetails?id=' + item.id)">{{ item.study_content }}</view>
				<!-- 图片/视频 -->
				<view v-if="item.study_type == 2" class="mediaBox" :style="'height:' + item.height + 'px;'">
					<video v-if="item.playVideoFlag" id="myVideo" :src="item.study_video" controls autoplay @error="videoError" @click="clickVideoFun"></video>
					<image v-else class="poster" :src="item.image_part[0]" mode="aspectFill"></image>
					<image v-if="!item.playVideoFlag" @click="playVideoFun(index)" class="circle play" src="../../static/icon-play.png" mode="widthFix"></image>
				</view>
				<view v-if="item.study_type != 2 && item.image_part.length > 0" class="mediaBox" :style="'height:' + imgHeightList[index] + 'px;'">
					<!-- 1 -->
					<!-- <view class="one" v-if="item.image_part.length == 1"><image :src="item.image_part[0]" mode="widthFix" @click="browseImg(item.image_part, 0)"></image></view> -->
					<!-- 2 -->
					<!-- <view class="two" v-if="item.image_part.length == 2">
						<image v-for="(items, indexs) in item.image_part" :key="indexs" :src="items" mode="aspectFill" @click="browseImg(item.image_part, indexs)"></image>
					</view> -->
					<!-- 3-9 -->
					<!-- <view class="more" v-if="item.image_part.length > 2">
						<image v-for="(items, indexs) in item.image_part" :key="indexs" :src="items" mode="aspectFill" @click="browseImg(item.image_part, indexs)"></image>
					</view> -->
					<swiper class="swiper" circular @change="changeSwiper" :data-index="index">
						<swiper-item v-for="(items, indexs) in item.image_part" :key="indexs">
							<image :src="items" mode="aspectFill" @click="browseImg(item.image_part, indexs)" @load="imgLoad" :data-index="index"></image>
						</swiper-item>
					</swiper>
					<view class="page-num flex-center">{{ bannerImgNumList[index] || 1 }}/{{ item.image_part.length }}</view>
				</view>
				<!-- 底部按钮 -->
				<view class="bottom flex-between padding">
					<!-- 动态列表 -->
					<view v-if="type == 'dynamic'" class="flex-center circleName" @click="goPage('/pages/circle/circle?id=' + item.tory_id)">
						<image class="header circle" :src="item.realm_icon" mode="aspectFill"></image>
						<view class="fs-22" style="color: #908E99;">{{ item.realm_name }}</view>
					</view>
					<!-- 公共部分 -->
					<view class="flex function fs-22">
						<view v-if="isAuthorized" class="flex" @click="goodFun(item.id, index)">
							<image :src="'../../static/like' + (item.is_info_zan ? '' : '2') + '.png'" mode="widthFix"></image>
							<text>{{ item.info_zan_count }}</text>
						</view>
						<view v-else class="flex">
							<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
								<image :src="'../../static/like' + (item.is_info_zan ? '' : '2') + '.png'" mode="widthFix"></image>
								<text>{{ item.info_zan_count }}</text>
							</button>
						</view>
						<view class="flex" v-if="isAuthorized" @click="showCommentFun(item.id, index)">
							<image src="../../static/comment.png" mode="widthFix"></image>
							<text>{{ item.study_repount }}</text>
						</view>
						<view class="flex" v-else>
							<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
								<image src="../../static/comment.png" mode="widthFix"></image>
								<text>{{ item.study_repount }}</text>
							</button>
						</view>
						<button class="share flex" open-type="share" :data-id="item.id" :data-content="item.study_content" :data-img="item.image_part[0]">
							<image src="../../static/wechat.png" mode="widthFix"></image>
							<text>分享</text>
						</button>
					</view>
					<!-- 圈子首页 -->
					<image v-if="type == 'circle'" class="more" src="../../static/more.png" mode="widthFix" @click="showAction(item.user_id, index, item.id)"></image>
				</view>
			</view>
		</view>
		<!-- 评论区域 -->
		<view class="mask" @click="hideCommentFun" v-if="showCommentFlag" @touchmove.stop.prevent="moveHandle"></view>
		<view class="comment" v-if="showCommentFlag">
			<view class="title flex-center">
				<text class="fs-26">全部评论</text>
				<image @click="hideCommentFun" src="../../static/close.png" mode="widthFix"></image>
			</view>
			<scroll-view class="listBox" scroll-y="true" @scrolltolower="getCommentList">
				<view class="list" v-if="commentList.length > 0">
					<block v-for="(item, index) in commentList" :key="index">
						<view class="item flex" @click="toggleTwoLevComment(true, item.id, item.user_id)">
							<image class="header circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
							<view class="content">
								<view class="fs-26 bold" style="color: #777;">{{ item.user_nick_name }}</view>
								<view>
									<text class="fs-30">{{ item.reply_content }}</text>
									<text class="fs-26" style="color: #999;">{{ item.apter_time }}</text>
								</view>
							</view>
							<view class="likeBox" @click.stop="commentGoodFun(item.id, index)">
								<image class="like" :src="'../../static/like' + (item.is_huifu_zan ? '' : '2') + '.png'" mode="widthFix"></image>
								<view class="fs-26" :style="'color: #' + (false ? '999' : '7364BD') + ';'">{{ item.is_huifu_zan_count }}</view>
							</view>
						</view>
						<!-- 二级评论 -->
						<view class="secondaryComment item flex" v-for="(items, indexs) in item.huifu_info_list" :key="indexs">
							<image class="header circle" :src="items.user_head_sculpture" mode="aspectFill"></image>
							<view class="content">
								<view class="fs-26 bold" style="color: #777;">{{ items.user_nick_name }}</view>
								<view>
									<text class="fs-30">{{ items.duplex_content }}</text>
									<text class="fs-26" style="color: #999;">{{ items.duplex_time }}</text>
								</view>
							</view>
							<!-- <view class="likeBox">
								<image class="like" src="../../static/like2.png" mode="widthFix"></image>
								<view class="fs-26" :style="'color: #' + (false ? '999' : '7364BD') + ';'">205</view>
							</view> -->
						</view>
						<!-- 查看全部 -->
						<view class="more flex" v-if="item.huifu_count > 2" @click="getMoreComment(item.id, item.user_id)">
							<view class="line"></view>
							<text class="fs-26" style="color: #999;">查看全部{{ item.huifu_count }}条评论</text>
						</view>
					</block>
				</view>
				<view v-else style="text-align: center; padding-top: 200rpx;">暂无评论</view>
			</scroll-view>
			<view class="sendComment flex-between">
				<input type="text" placeholder="留下你的精彩评论吧" maxlength="30" v-model="commentContent" />
				<image class="send" src="../../static/send.png" mode="widthFix" @click="sendComment"></image>
			</view>
		</view>
		<!-- 二级评论 -->
		<view class="twoComment" v-if="showTwoLevCommentFlag">
			<view class="mask" @click="toggleTwoLevComment(false)"></view>
			<view class="inputAlt-cont">
				<view class="inputAlt-cont-head flex-between">
					<view @click="toggleTwoLevComment(false)">取消</view>
					<view @click="sendTwoLevComment">发布</view>
				</view>
				<view class="inputAlt-cont-ipt">
					<view style="text-align:right; font-size:24rpx;">{{ twoComment.length }}/200</view>
					<textarea fixed="true" placeholder="说点什么..." v-model="twoComment" auto-focus maxlength="200"></textarea>
				</view>
			</view>
		</view>
		<!-- 举报信息填写 -->
		<view class="twoComment inform" v-if="showInformFlag">
			<view class="mask" @click="toggleInform(false)"></view>
			<view class="inputAlt-cont">
				<view class="inputAlt-cont-head flex-between">
					<view @click="toggleInform(false)">取消</view>
					<view @click="sendInform">举报</view>
				</view>
				<view class="inputAlt-cont-ipt">
					<view style="text-align:right; font-size:24rpx;">{{ informContent.length }}/200</view>
					<textarea fixed="true" placeholder="请具体说明问题,我们将尽快处理" v-model="informContent" auto-focus maxlength="200"></textarea>
				</view>
			</view>
		</view>
		<!-- 删除信息填写 -->
		<view class="twoComment inform" v-if="showDeleteFlag">
			<view class="mask" @click="toggleDelete(false)"></view>
			<view class="inputAlt-cont">
				<view class="inputAlt-cont-head flex-between">
					<view @click="toggleDelete(false)">取消</view>
					<view @click="deleteVideo">删除</view>
				</view>
				<view class="inputAlt-cont-ipt">
					<view style="text-align:right; font-size:24rpx;">{{ deleteContent.length }}/200</view>
					<textarea fixed="true" placeholder="请说明删除原因" v-model="deleteContent" auto-focus maxlength="200"></textarea>
				</view>
			</view>
		</view>
		<w-loading mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import dynamicJs from './dynamic.js';
export default {
	...dynamicJs
};
</script>

<style lang="scss">
@import './dynamic.scss';
</style>
