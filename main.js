import Vue from 'vue';
import App from './App';
//阿拉丁
import './static/ald-stat/ald-stat';
//小神推
import './static/xst-stat/push_sdk';
//公共JS
import '@/common/common.js';

//顶部tabbar
import navigationBar from "./components/navigationBar/navigationBar.vue";
Vue.component("navigationBar", navigationBar);
//返回胶囊
import backCapsule from "./components/backCapsule/backCapsule.vue";
Vue.component("backCapsule", backCapsule);
//加载动画
import wLoading from "@/components/loading/w-loading.vue";
Vue.component('w-loading',wLoading);
//上拉加载状态
import loadMore from "@/components/load-more/load-more.vue";
Vue.component('loadMore',loadMore);

Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
	...App
});
app.$mount();