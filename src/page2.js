import Vue from 'vue'
import Page2 from './Page2.vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter)

import store from './store'


import './plugins/element.js'

//import RouterTrans from './RouterTrans'

import axios from 'axios'
Vue.prototype.$http= axios

Vue.config.productionTip = false







//! ---- routers
import Home from './Home.vue'
import ExamMain from './Exam/ExamHome.vue'
import NavOther from './NavOther.vue'
import NavEdit from './NavEdit.vue'
import examitemhome from './Exam/examitem/examitemhome'
import examitemaddsel from './Exam/examitem/examitemaddsel'
import exampaperhome from './Exam/exampaper/exampaperhome'
import exampaperadd from './Exam/exampaper/exampaperadd'
import examitempreview from './Exam/examitem/examitempreview'
import login from './Main/Login'
import cloudmain from './Main/CloudHome'
import mineinfo from './Main/MineInfo'
import minenameset from './Main/MineNameSet'
import bankenew from './Main/BankeNew'
import bankehome from './Main/BankeHome'
import zuoyedetailedit from './Main/ZuoyeDetailEdit'
import zuoyenew from './Main/ZuoyeNew'
import zuoyeresult from './Main/ZuoyeResult'
const routes = [
    { path: '/bar', component: Page2 },
    {path:'/', component:cloudmain},
    {path:'/navother', component:NavOther},
    {path:'/navedit', component:NavEdit},
    {path:'/examitemhome', component:examitemhome},
    {path:'/examitemaddsel', component:examitemaddsel},
    {path:'/exampaperhome', component:exampaperhome},
    {path:'/exampaperadd', component:exampaperadd},
    {path:'/examitempreview', component:examitempreview},
    {path:'/login', component:login},
    {path:'/mineinfo', component:mineinfo},
    {path:'/minenameset', component:minenameset},
    {path:'/bankenew', component:bankenew},
    {path:"/bankehome/:id", component:bankehome, props:true},
    {path:'/zuoyedetailedit', component:zuoyedetailedit},
    {path:'/zuoyenew/:bankeid', component:zuoyenew, props:true},
    {path:'/zuoyeresult/:zuoyeid', component:zuoyeresult, props:true},
]


const router = new VueRouter({
    routes
})


router.beforeEach((to, from, next) => {
 //   console.log('beforeEach');

    if (
        !store.getters.islogin
        && to.path != '/login'
    ) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        next({
            path: '/login',

        })
    } else {
        next() // 确保一定要调用 next()
    }
})



new Vue({
    router,
    store,
    render: h => h(Home)
}).$mount('#app')

// 现在，应用已经启动了！

// new Vue({
//   render: h => h(Page2),
// }).$mount('#app')
