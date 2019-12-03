import Vue from 'vue'

import Vuex from 'vuex'

import test from './modules/test'
import exam from './modules/exam'
import banke from './modules/banke'


import cookie from 'js-cookie'





Vue.use(Vuex)



const debug = process.env.NODE_ENV !== 'production'


const state = {
    routerforward: false,

    homeselected: '', //! 主页的当前选择tab
    bhomeselected: '', //! 班级页的当前选择

    bankecachedata: {},

    loginuser: {}, //! 当前登录用户
    usercookiereaded: false,
    bankeZhiYuanLinkItem: [],
    lang: localStorage.getItem('lang') || 'zh',
    isWX:(() => {
        return window.__wxjs_environment === 'miniprogram';
    })(),

    isPreview: true,//是否开启了预览
    previewLoadFile:[],//预览文件
    images: [],//预览图片
    show: false,//是否显示预览组件
    index:0,//预览图片当前的索引


    footerBarState:true,

}

const getters = {
    getBankeData: (state) => (modulename, bankeid) => {
        var bdata = state.bankecachedata;
        if (bdata[modulename] && bdata[modulename][bankeid]) {
            return bdata[modulename][bankeid];
        }
        return null;
    },
    curuser: (state, getters) => {
        var lm = state.loginuser;

        return lm;
    },
    islogin: (state, getters) => {
        var lm = getters.curuser;
        if (!lm || !lm.id) {

            let szcookie = cookie.get('EXSOFTSSID');
            if (szcookie && szcookie.length > 10){
                return true;
            }

            return false;
        }
        return true;
    },
    isteacher: (state, getters) => {
        if (state.loginuser.role && state.loginuser.role >= 10) {
            return true;
        }
        return false;
    }

}

const mutations = {
    setBankeData(state, bobj) {
        //  console.log(bobj);
        var modulename = bobj.modulename;
        var bankeid = bobj.bankeid;
        var fn = bobj.fn;
        //console.log(modulename);
        //console.log(bankeid);
        //console.log(fn);
        var bd = getters.getBankeData(state)(modulename, bankeid);
        //  console.log(bd);
        if (!bd) {
            var bdata = state.bankecachedata;
            if (!bdata[modulename]) {
                bdata[modulename] = {};
            }
            if (!bdata[modulename][bankeid]) {
                bdata[modulename][bankeid] = {};
            }
            bd = getters.getBankeData(state)(modulename, bankeid);
        }
        if (bd) {
            fn(bd);
        }
        //console.log(state.bankecachedata);
    },
    setRouterForward(state, bforward) {
        state.routerforward = bforward;
    }

    ,
    setLoginUser(state, user) {
        state.loginuser = user;
        state.usercookiereaded = true;
        //！ cjy: ios 的localcookie 如果不设置 expires，则wkwebview的cookie不会被持久化(sessiononly 为true)
        //!  cjy: 不再使用cookie保存user信息; cookie 会随请求一并提交 ---- 保存简短信息
        // cookie.set('user', {
        //     id: user.id,
        //     account: user.account,
        //     name: user.name,
        //     role: user.role
        // }, {
        //     expires: 360
        // });
    },
    setUserAvatar(state, avatar) {
        if (state.loginuser) {
            state.loginuser.avatar = avatar;
            // cookie.set('user', state.loginuser, {expires:360});
        }
    }

    ,
    setHomeSelected(state, strsel) {
        state.homeselected = strsel;
    },
    setBHomeSelected(state, strsel) {
        state.bhomeselected = strsel;
    },
    SET_BANKEZHIYUANLINKITEM(state, item) {
        if (item) {
            state.bankeZhiYuanLinkItem = item.concat(state.bankeZhiYuanLinkItem);
        } else {
            state.bankeZhiYuanLinkItem = []
        }
    },
    DELECT_BANKEZHIYUANLINKITEM(state, id) {
        for (let i = 0; i < state.bankeZhiYuanLinkItem.length; i++) {
            if (state.bankeZhiYuanLinkItem[i].id == id) {
                state.bankeZhiYuanLinkItem.splice(i, 1);
            }
        }
    },
    SET_LANG(state, lang) {
        state.lang = lang;
    },
    SET_ISPREVIEW(state, v) {
        state.isPreview = v;
    },
    SET_SHOW(state, v) {
        state.show = v
    },
    SET_IMAGES(state, v) {
        state.images = v
    },
    SET_PREVIEWLOADFILE(state, v) {
        state.previewLoadFile = v
    },
    SET_INDEX(state, v) {
        state.index = v
    },
    SET_FOOTER_BAR_STATE(state, v) {
        state.footerBarState = v
    },
}


export default new Vuex.Store({

    modules: {
        test,
        exam,
        banke,
    },

    strict: debug,

    plugins: debug ? [] : [],

    state,
    getters,
    mutations

})