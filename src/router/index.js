import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

<<<<<<< HEAD
import Page2 from '../App'
=======
import Page2 from '../page2'
>>>>>>> 81928888a0fb73867c99559d99c5d1bf75b96d2f
import NavOther from '../NavOther.vue'
import NavEdit from '../NavEdit.vue'
import examitemhome from '../Exam/examitem/examitemhome'
import examitemaddsel from '../Exam/examitem/examitemaddsel'
import exampaperhome from '../Exam/exampaper/exampaperhome'
import exampaperadd from '../Exam/exampaper/exampaperadd'
import examitempreview from '../Exam/examitem/examitempreview'
<<<<<<< HEAD
import login from '../views/Login'
import cloudmain from '../views/CloudHome'
import mineinfo from '../views/MineInfo'
import minenameset from '../views/MineNameSet'
import bankenew from '../views/BankeNew'
import bankehome from '../views/BankeHome'
import zuoyedetailedit from '../views/ZuoyeDetailEdit'
import zuoyenew from '../views/ZuoyeNew'
import zuoyeresult from '../views/ZuoyeResult'
=======
import login from '../Main/Login'
import cloudmain from '../Main/CloudHome'
import mineinfo from '../Main/MineInfo'
import minenameset from '../Main/MineNameSet'
import bankenew from '../Main/BankeNew'
import bankehome from '../Main/BankeHome'
import zuoyedetailedit from '../Main/ZuoyeDetailEdit'
import zuoyenew from '../Main/ZuoyeNew'
import zuoyeresult from '../Main/ZuoyeResult'
import preview from '../Main/preview'
>>>>>>> 81928888a0fb73867c99559d99c5d1bf75b96d2f

Vue.use(Router)
export function createRouter() {
  let routers = new Router({
<<<<<<< HEAD
    // mode: 'history',
=======
>>>>>>> 81928888a0fb73867c99559d99c5d1bf75b96d2f
    routes: [
        { path: '/bar',component: Page2,},
        {path:'/', name:'cloudmain',component:cloudmain},
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
<<<<<<< HEAD
=======
        {path:'/preview', component:preview},
>>>>>>> 81928888a0fb73867c99559d99c5d1bf75b96d2f
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