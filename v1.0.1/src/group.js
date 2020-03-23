import Vue from 'vue'
import store from './store'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import GroupHome from './group.vue'
import './assets/iconfont/iconfont.css'
Vue.prototype.$http = axios;
import {
  defaultImg,
} from "@/util";
Vue.prototype.$defaultImg = defaultImg;
Vue.config.productionTip = false
new Vue({
  store,
  router,
  render: h => h(GroupHome),

}).$mount('#group')
