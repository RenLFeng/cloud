import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import nativecode from '../nativecode'
// 主页
const Page2 = () => import("@/App");
// 
const NavOther = () => import("@/NavOther");
// 
const NavEdit = () => import("@/NavEdit");
// 题库;
const examitemhome = () => import("@/Exam/examitem/examitemhome");
// 试卷选择题
const examitemaddsel = () => import("@/Exam/examitem/examitemaddsel");
// 试卷
const exampaperhome = () => import("@/Exam/exampaper/exampaperhome");
// 编辑试卷
const exampaperadd = () => import("@/Exam/exampaper/exampaperadd");
//题目预览
const examitempreview = () => import("@/Exam/examitem/examitempreview");
//登录
const login = () => import("@/views/Login");
//班课列表页
const cloudmain = () => import("@/views/CloudHome");
//设置个人信息
const mineinfo = () => import("@/views/MineInfo");
//设置昵称
const minenameset = () => import("@/views/MineNameSet");
//新建班课
const bankenew = () => import("@/views/BankeNew");
//当前班课页面
const bankehome = () => import("@/views/BankeHome");
//作业提交编辑
const zuoyedetailedit = () => import("@/views/ZuoyeDetailEdit");
//新建作业
const zuoyenew = () => import("@/views/ZuoyeNew");
//作业结果列表
const zuoyeresult = () => import("@/views/ZuoyeResult");
//成员平均分
const F2chart = () => import("@/views/components/f2chart");
//大屏
const BigLogin = () => import("@/views/bankehudong/big/index");
//签到
// const Sign = () => import("@/views/bankehudong/sign/teacherSignInfo");
//评测记录
const PingCe = () => import("@/views/bankehudong/pingce/index");
//评测
const PingCeing = () => import("@/views/bankehudong/pingceing/index");
//弹幕
const Danmu = () => import("@/views/bankehudong/danmu/index");
//分组管理
const Group = () => import("@/views/bankeMember/group/index");
//板书
const Banshu = () => import("@/views/bankehudong/banshu/index");
//加入班课
const Join = () => import("@/views/bankehome/join");
//收藏
const Collection = () => import("@/views/my/collection");
//结束班课
const EndClass = () => import("@/views/my/bankeEnd");
//学校绑定
const BindSchool = () => import("@/views/my/bindSchool");
//学校绑定列表
const BindSchoolList = () => import("@/views/my/bindSchool/bindend-list");
//MP3
const Audio = () => import("@/common/audio");
//个人学情
const MyXueQing = () => import("@/views/my/MyXueQing/xueqing");
//edinfo引导页
const SetEdinfo = () => import("@/views/my/settedinfo");
//微信 登陆 完成页面
const WechatLogin = () => import("@/views/wechatLogin");
//课程主页
const CourseHome = () => import("@/views/bankehome/coursehome");
//课程主页
const CouresNew = () => import("@/views/couresNew");
Vue.use(Router)
let routers = new Router({
    // mode: 'history',
    routes: [{
            path: '/bar',
            component: Page2,
        },
        {
            path: '/',
            name: 'cloudmain',
            component: cloudmain,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '*',
            name: 'cloudmain',
            component: cloudmain,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/navother',
            component: NavOther
        },
        {
            path: '/navedit',
            component: NavEdit
        },
        {
            path: '/examitemhome',
            component: examitemhome
        },
        {
            path: '/examitemaddsel',
            component: examitemaddsel
        },
        {
            path: '/exampaperhome',
            component: exampaperhome
        },
        {
            path: '/exampaperadd',
            component: exampaperadd
        },
        {
            path: '/examitempreview',
            component: examitempreview
        },
        {
            path: '/login',
            component: login
        },
        {
            path: '/mineinfo',
            component: mineinfo
        },
        {
            path: '/minenameset',
            component: minenameset
        },
        {
            path: '/bankenew',
            component: bankenew
        },
        {
            path: "/bankehome/:id",
            component: bankehome,
            props: true,

        },
        {
            path: '/zuoyedetailedit',
            component: zuoyedetailedit
        },
        {
            path: '/zuoyenew/:bankeid',
            component: zuoyenew,
            props: true
        },
        {
            path: '/zuoyeresult/:zuoyeid',
            component: zuoyeresult,
            props: true
        },
        {
            path: '/AverageScore',
            name: 'AverageScore',
            component: F2chart
        },
        {
            path: '/BigLogin',
            name: 'BigLogin',
            component: BigLogin
        },
        // {
        //     path: '/Sign',
        //     name: 'Sign',
        //     component: Sign
        // },
        {
            path: '/PingCe',
            name: 'PingCe',
            component: PingCe
        },
        {
            path: '/PingCeing',
            name: 'PingCeing',
            component: PingCeing
        },
        {
            path: '/urlpingce/:urlbankeid/:urlhack',
            component: PingCeing,
            props: true
        },
        {
            path: '/Group',
            name: 'Group',
            component: Group
        },
        {
            path: '/Banshu',
            name: 'Banshu',
            component: Banshu
        },
        {
            path: '/Collection',
            name: 'Collection',
            component: Collection
        },
        {
            path: '/EndClass',
            name: 'EndClass',
            component: EndClass
        },
        {
            path: '/Join',
            name: 'Join',
            component: Join
        },
        {
            path: '/bankejoin/:bankeid',
            name: 'Join',
            component: Join,
            props: true
        },
        {
            path: '/coursehome/:courseid',
            name: 'coursehome',
            component: CourseHome,
            props: true
        },
        {
            path: '/BindSchool',
            name: 'BindSchool',
            component: BindSchool
        },
        {
            path: '/BindSchoolList',
            name: 'BindSchoolList',
            component: BindSchoolList
        },
        {
            path: '/Audio',
            name: 'Audio',
            component: Audio
        },
        {
            path: '/MyXueQing',
            name: 'MyXueQing',
            component: MyXueQing
        },
        {
            path: '/SetEdinfo',
            name: 'SetEdinfo',
            component: SetEdinfo
        },
        {
            path: '/Danmu',
            name: 'Danmu',
            component: Danmu
        },
        {
            path: '/WechatLogin/:str',
            name: 'WechatLogin',
            component: WechatLogin
        },
        {
            path: '/CouresNew',
            name: 'CouresNew',
            component: CouresNew
        },



    ]
});
routers.beforeEach((to, from, next) => {
    // next();
    // return;

    if (process.env.NODE_ENV !== "production") {
        console.log('router, topath:' + to.path);
    }

    function isneedloginpath(topath) {
        if (topath.indexOf('/login') ||
            topath.indexOf('/WechatLogin')
        ) {
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