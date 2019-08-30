import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

import Page2 from '../page2'
import NavOther from '../NavOther.vue'
import NavEdit from '../NavEdit.vue'
import examitemhome from '../Exam/examitem/examitemhome'
import examitemaddsel from '../Exam/examitem/examitemaddsel'
import exampaperhome from '../Exam/exampaper/exampaperhome'
import exampaperadd from '../Exam/exampaper/exampaperadd'
import examitempreview from '../Exam/examitem/examitempreview'
import login from '../Main/Login'
import cloudmain from '../Main/CloudHome'
import mineinfo from '../Main/MineInfo'
import minenameset from '../Main/MineNameSet'
import bankenew from '../Main/BankeNew'
import bankehome from '../Main/BankeHome'
import zuoyedetailedit from '../Main/ZuoyeDetailEdit'
import zuoyenew from '../Main/ZuoyeNew'
import zuoyeresult from '../Main/ZuoyeResult'

Vue.use(Router)
export function createRouter() {
  let routers = new Router({
    routes: [
        { path: '/bar',component: Page2,},
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
  });
  routers.beforeEach((to, from, next) => {
    if (
        !store.getters.islogin
        && to.path != '/login'
    ) {
        next({
            path: '/login',
        })
    } else {
        next() 
    }
});
return routers
}