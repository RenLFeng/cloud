import Vue from 'vue'
import store from './store'
import Home from './Home.vue'
import {
    createRouter
} from './router'
import './plugins/element.js'
import axios from 'axios'
import './assets/iconfont/iconfont.css'
import 'amfe-flexible';
import Viewer from 'v-viewer'
import VueI18n from 'vue-i18n'
import zh from '../src/langs/zh'
import en from '../src/langs/en'
// const weiXinEnv = wx.miniProgram.getEnv(function (res) {
//     return res.miniprogram
// });
// Vue.prototype.$isWeiXinEnv=weiXinEnv;
// import F2 from "@antv/f2/lib/index-all";
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
// import VueRouter from 'vue-router'
// Vue.use(VueRouter)


// import RouterTrans from './RouterTrans'





//! ---- routers
// import ExamMain from './Exam/ExamHome.vue'
// import NavOther from './NavOther.vue'
// import NavEdit from './NavEdit.vue'
// import examitemhome from './Exam/examitem/examitemhome'
// import examitemaddsel from './Exam/examitem/examitemaddsel'
// import exampaperhome from './Exam/exampaper/exampaperhome'
// import exampaperadd from './Exam/exampaper/exampaperadd'
// import examitempreview from './Exam/examitem/examitempreview'
// import login from './Main/Login'
// import cloudmain from './Main/CloudHome'
// import mineinfo from './Main/MineInfo'
// import minenameset from './Main/MineNameSet'
// import bankenew from './Main/BankeNew'
// import bankehome from './Main/BankeHome'
// import zuoyedetailedit from './Main/ZuoyeDetailEdit'
// import zuoyenew from './Main/ZuoyeNew'
// import zuoyeresult from './Main/ZuoyeResult'
// const routes = [
//     { path: '/bar', component: Page2 },
//     {path:'/', component:cloudmain},
//     {path:'/navother', component:NavOther},
//     {path:'/navedit', component:NavEdit},
//     {path:'/examitemhome', component:examitemhome},
//     {path:'/examitemaddsel', component:examitemaddsel},
//     {path:'/exampaperhome', component:exampaperhome},
//     {path:'/exampaperadd', component:exampaperadd},
//     {path:'/examitempreview', component:examitempreview},
//     {path:'/login', component:login},
//     {path:'/mineinfo', component:mineinfo},
//     {path:'/minenameset', component:minenameset},
//     {path:'/bankenew', component:bankenew},
//     {path:"/bankehome/:id", component:bankehome, props:true},
//     {path:'/zuoyedetailedit', component:zuoyedetailedit},
//     {path:'/zuoyenew/:bankeid', component:zuoyenew, props:true},
//     {path:'/zuoyeresult/:zuoyeid', component:zuoyeresult, props:true},
// ]


// const router = new VueRouter({
//     routes
// })


// router.beforeEach((to, from, next) => {
//  //   console.log('beforeEach');

//     if (
//         !store.getters.islogin
//         && to.path != '/login'
//     ) {
//         // this route requires auth, check if logged in
//         // if not, redirect to login page.
//         next({
//             path: '/login',

//         })
//     } else {
//         next() // 确保一定要调用 next()
//     }
// })

window.onresize = function () {
    let clientWidth = window.innerWidth;
    if (!clientWidth) return;
    if (clientWidth >= 640) {
        document.documentElement.style.fontSize = '2.5rem';
    }
}
new Vue({
    router: createRouter(),
    store,
    i18n,
    render: h => h(Home)
}).$mount('#app')

// 现在，应用已经启动了！

// new Vue({
//   render: h => h(Page2),
// }).$mount('#app')