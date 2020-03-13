import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import login from '../views/Login'
import cloudmain from '../views/CloudHome'

//弹幕
import Danmu from '../views/bankehudong/danmu/index'
import nativecode from '../nativecode'

Vue.use(Router)

// export function createRouter() {
let routers = new Router({
    // mode: 'history',
    routes: [
        { path: '/', name: 'cloudmain', component: cloudmain },
        { path: '*', name: 'cloudmain', component: cloudmain },
        { path: '/Danmu', name: 'Danmu', component: Danmu },



    ]
});
routers.beforeEach((to, from, next) => {
    if (!nativecode.hasloginpage()) {
        if (to.path == '/login') {
            next({
                path: '/'
            })
        } else {
            next();
        }
    } else if ( //! todo. 检测不需要登陆即可查看的网页？
        !store.getters.islogin &&
        to.path != '/login'
    ) {
        next({
            path: '/login',
        })
    } else {
        next()
    }
});
export default routers
// return routers
// }