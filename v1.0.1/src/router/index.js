import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Page2 from '../App'
import NavOther from '../NavOther.vue'
import NavEdit from '../NavEdit.vue'
import examitemhome from '../Exam/examitem/examitemhome'
import examitemaddsel from '../Exam/examitem/examitemaddsel'
import exampaperhome from '../Exam/exampaper/exampaperhome'
import exampaperadd from '../Exam/exampaper/exampaperadd'
import examitempreview from '../Exam/examitem/examitempreview'
import login from '../views/Login'
import cloudmain from '../views/CloudHome'
import mineinfo from '../views/MineInfo'
import minenameset from '../views/MineNameSet'
import bankenew from '../views/BankeNew'
import bankehome from '../views/BankeHome'
import zuoyedetailedit from '../views/ZuoyeDetailEdit'
import zuoyenew from '../views/ZuoyeNew'
import zuoyeresult from '../views/ZuoyeResult'
//成员平均分
import F2chart from '../views/components/f2chart'
//大屏
import BigLogin from '../views/bankehudong/big/index'
//签到
import Sign from '../views/bankehudong/sign/teacherSignInfo'
//评测记录
import PingCe from '../views/bankehudong/pingce/index'
//评测
import PingCeing from '../views/bankehudong/pingceing/index'
//弹幕
import Danmu from '../views/bankehudong/danmu/index'
//分组管理
import Group from '../views/bankeMember/group/index'
//板书
import Banshu from '../views/bankehudong/banshu/index'
//加入班课
import Join from '../views/bankehome/join'
//收藏
import Collection from '../views/my/collection'
//学校绑定
import BindSchool from '../views/my/bindSchool'
//学校绑定列表
import BindSchoolList from '../views/my/bindSchool/bindend-list'
//MP3
import Audio from '../common/audio'
//个人学情
import MyXueQing from '../views/my/MyXueQing/xueqing'
//微信 登陆 完成页面
import WechatLogin from '../views/wechatLogin'
import nativecode from '../nativecode'

Vue.use(Router)

// export function createRouter() {
let routers = new Router({
    // mode: 'history',
    routes: [
        { path: '/bar', component: Page2, },
        { path: '/', name: 'cloudmain', component: cloudmain },
        { path: '*', name: 'cloudmain', component: cloudmain },
        { path: '/navother', component: NavOther },
        { path: '/navedit', component: NavEdit },
        { path: '/examitemhome', component: examitemhome },
        { path: '/examitemaddsel', component: examitemaddsel },
        { path: '/exampaperhome', component: exampaperhome },
        { path: '/exampaperadd', component: exampaperadd },
        { path: '/examitempreview', component: examitempreview },
        { path: '/login', component: login },
        { path: '/mineinfo', component: mineinfo },
        { path: '/minenameset', component: minenameset },
        { path: '/bankenew', component: bankenew },
        { path: "/bankehome/:id", component: bankehome, props: true },
        { path: '/zuoyedetailedit', component: zuoyedetailedit },
        { path: '/zuoyenew/:bankeid', component: zuoyenew, props: true },
        { path: '/zuoyeresult/:zuoyeid', component: zuoyeresult, props: true },
        { path: '/AverageScore', name: 'AverageScore', component: F2chart },
        { path: '/BigLogin', name: 'BigLogin', component: BigLogin },
        { path: '/Sign', name: 'Sign', component: Sign },
        { path: '/PingCe', name: 'PingCe', component: PingCe },
        { path: '/PingCeing', name: 'PingCeing', component: PingCeing },
        { path: '/urlpingce/:urlbankeid/:urlhack', component: PingCeing, props: true },
        { path: '/Group', name: 'Group', component: Group },
        { path: '/Banshu', name: 'Banshu', component: Banshu },
        { path: '/Collection', name: 'Collection', component: Collection },
        { path: '/Join', name: 'Join', component: Join },
        { path: '/bankejoin/:bankeid', name: 'Join', component: Join, props: true },
        { path: '/BindSchool', name: 'BindSchool', component: BindSchool },
        { path: '/BindSchoolList', name: 'BindSchoolList', component: BindSchoolList },
        { path: '/Audio', name: 'Audio', component: Audio },
        { path: '/MyXueQing', name: 'MyXueQing', component: MyXueQing },
        { path: '/Danmu', name: 'Danmu', component: Danmu },
        { path: '/WechatLogin/:str', name: 'WechatLogin', component: WechatLogin },



    ]
});
routers.beforeEach((to, from, next) => {
    // next();
    // return;
    function isneedloginpath(topath){
        if (topath.indexOf('/login')
        || topath.indexOf('/WechatLogin')
        ){
            return false;
        }
        return true;
    }
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
     //   to.path != '/login'
        isneedloginpath(to.path)
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