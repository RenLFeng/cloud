import Vue from 'vue'
import store from './store'
import Home from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import 'amfe-flexible';
import './assets/iconfont/iconfont.css'
import Viewer from 'v-viewer'
import VueI18n from 'vue-i18n'
import zh from '../src/langs/zh'
import en from '../src/langs/en'
import {
    defaultImg,
} from "@/util";
Vue.prototype.$defaultImg = defaultImg;
Vue.prototype.$back = function () {
    //! cjy: 小程序的history 不准确， 这里直接调用 go(-1);
  //  Vm.$router.go(-1);
    //alert(window.history.length);
    if (window.history.length > 2) {
        Vm.$router.go(-1);
    } else {
        Vm.$router.push('/');
    }
}
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// Vue.use(vConsole)
Vue.prototype.$http = axios
Vue.config.productionTip = false;
Vue.use(Viewer, {
    defaultOptions: {
        navbar: false,
    }
})
Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: localStorage.getItem('lang') || 'zh',
    messages: {
        'zh': zh, // 中文语言包
        'en': en // 英文语言包
    },
    silentTranslationWarn: true
})
window.addEventListener("resize", function () {
    let clientWidth = window.innerWidth;
    if (!clientWidth) return;
    if (clientWidth >= 540) {
        document.documentElement.style.fontSize = '54px';
    }
});
let Vm = new Vue({
    // router: createRouter(),
    router,
    store,
    i18n,
    render: h => h(Home)
}).$mount('#app');
