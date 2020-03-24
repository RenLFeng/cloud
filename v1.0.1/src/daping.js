import Vue from 'vue'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import Daping from './daping.vue'
import './assets/iconfont/iconfont.css'
Vue.prototype.$http = axios;
import {
  defaultImg,
} from "@/util";
Vue.prototype.$defaultImg = defaultImg;
Vue.config.productionTip = false
new Vue({
  store,
  render: h => h(Daping),
}).$mount('#group')
