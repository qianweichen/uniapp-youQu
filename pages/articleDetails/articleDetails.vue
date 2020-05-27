<template>
	<view class="page-articleDetails dark-bg">
		<backCapsule type="capsule"></backCapsule>
		<navigationBar name="帖子详情" haveHeight></navigationBar>
		<view class="list">
			<view class="item">
				<!-- 头部 -->
				<view class="header flex">
					<image class="circle" :src="articleData.user_head_sculpture" mode="aspectFill"></image>
					<view class="fs-28">{{articleData.user_nick_name}}</view>
					<view class="fs-26">{{articleData.adapter_time}}</view>
				</view>
				<!-- 文字 -->
				<view class="content fs-28">{{articleData.study_content}}</view>
				<!-- 图片/视频 -->
				<view v-if="articleData.study_type == 2" class="mediaBox"><video :src="articleData.study_video" controls :poster="articleData.image_part[0]"></video></view>
				<view v-else class="mediaBox">
					<!-- 1 -->
					<view class="one" v-if="articleData.image_part.length == 1">
						<image :src="articleData.image_part[0]" mode="aspectFill" @click="browseImg(articleData.image_part,0)"></image>
					</view>
					<!-- 2 -->
					<view class="two" v-if="articleData.image_part.length == 2">
						<image v-for="(items,indexs) in articleData.image_part" :key="indexs" :src="items" mode="aspectFill" @click="browseImg(articleData.image_part,indexs)"></image>
					</view>
					<!-- 3-9 -->
					<view class="more" v-if="articleData.image_part.length > 2">
						<image v-for="(items, indexs) in articleData.image_part" :key="indexs" :src="items" mode="aspectFill" @click="browseImg(articleData.image_part,indexs)"></image>
					</view>
				</view>
				<!-- 底部按钮 -->
				<view class="bottom flex-between">
					<view class="flex function fs-22">
						<view v-if="isAuthorized" class="flex" @click="goodFun()">
							<image :src="'../../static/like' + (articleData.is_info_zan ? '' : '2') + '.png'" mode="widthFix"></image>
							<text>{{ articleData.info_zan_count }}</text>
						</view>
						<view v-else class="flex">
							<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
								<image :src="'../../static/like' + (articleData.is_info_zan ? '' : '2') + '.png'" mode="widthFix"></image>
								<text>{{ articleData.info_zan_count }}</text>
							</button>
						</view>
						<view class="flex" v-if="isAuthorized">
							<image src="../../static/comment.png" mode="widthFix"></image>
							<text>{{ articleData.study_repount }}</text>
						</view>
						<view class="flex" v-else>
							<button open-type="getUserInfo" class="share" @getuserinfo="getUserInfo">
								<image src="../../static/comment.png" mode="widthFix"></image>
								<text>{{ articleData.study_repount }}</text>
							</button>
						</view>
						<button class="share flex" open-type="share" :data-id="articleData.id" :data-content="articleData.study_content" :data-img="articleData.image_part[0]">
							<image src="../../static/wechat.png" mode="widthFix"></image>
							<text>分享</text>
						</button>
					</view>
					<image class="more" src="../../static/more.png" mode="widthFix" @click="showAction(articleData.user_id,articleData.id)"></image>
				</view>
			</view>
		</view>
		<!-- 圈子 -->
		<view class="circleName flex-between" @click="goPage('/pages/circle/circle?id=' + articleData.tory_id)">
			<view class="flex">
				<image class="header circle" :src="articleData.realm_icon" mode="aspectFill"></image>
				<view>
					<view class="fs-26 bold">{{ articleData.realm_name }}</view>
					<view class="fs-20" style="color: #9A989E;">关注 {{articleData.concern||''}} | 帖子 {{articleData.paper_number||''}}</view>
				</view>
			</view>
			<image class="right" src="../../static/right.png" mode="widthFix"></image>
		</view>
		<!-- 评论 -->
		<view v-for="(item, index) in commentList" :key="index">
			<view class="comment flex-between" @click="toggleTwoLevComment(true, item.id, item.user_id)">
				<view class="flex align-star">
					<image class="header circle" :src="item.user_head_sculpture" mode="aspectFill"></image>
					<view>
						<view class="fc-9">
							<text class="fs-26">{{ item.user_nick_name }}</text>
							<text class="fs-22">{{ item.apter_time }}</text>
						</view>
						<view class="fs-30">{{ item.reply_content }}</view>
					</view>
				</view>
				<view class="right" @click.stop="commentGoodFun(item.id, index)">
					<image class="good" :src="'../../static/like' + (item.is_huifu_zan ? '' : '2') + '.png'" mode="widthFix"></image>
					<view class="fs-22" :style="'color: #' + (false ? '999' : '7364BD') + ';'">{{ item.is_huifu_zan_count }}</view>
				</view>
			</view>
			<!-- 二级评论 -->
			<view class="comment secondaryComment item flex" v-for="(items, indexs) in item.huifu_info_list" :key="indexs">
				<image class="header circle" :src="items.user_head_sculpture" mode="aspectFill"></image>
				<view class="content">
					<view class="fs-26 bold" style="color: #777;">{{ items.user_nick_name }}</view>
					<view>
						<text class="fs-30">{{ items.duplex_content }}</text>
						<text class="fs-26" style="color: #999;">{{ items.duplex_time }}</text>
					</view>
				</view>
			</view>
			<!-- 查看全部 -->
			<view class="moreComment flex" v-if="item.huifu_count > 2" @click="getMoreComment(item.id,item.user_id)">
				<view class="line"></view>
				<text class="fs-26" style="color: #999;">查看全部{{item.huifu_count}}条评论</text>
			</view>
		</view>
		<!-- 评论输入框 -->
		<view class="sendBox">
			<view class="box flex-between">
				<input class="fs-26" type="text" v-model="commentContent" placeholder="留下你的精彩评论吧" />
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
	</view>
</template>

<script>
import articleDetailsJs from './articleDetails.js';
export default {
	...articleDetailsJs
};
</script>

<style lang="scss">
@import './articleDetails.scss';
</style>
