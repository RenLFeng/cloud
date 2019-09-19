import Vue from 'vue'

import Vuex from 'vuex'

import test from './modules/test'
import exam from './modules/exam'
import banke from './modules/banke'


import cookie from 'js-cookie'



Vue.use(Vuex)



const debug = process.env.NODE_ENV !== 'production'


const state = {
    routerforward:false,

    homeselected:'',   //! 主页的当前选择tab
    bhomeselected:'',   //! 班级页的当前选择

    bankecachedata:{},

    loginuser:(()=>{
        return cookie.getJSON('user');
    })(),  //! 当前登录用户
    usercookiereaded:false,
    bankeZhiYuanLinkItem:[],
}

const getters =
    {
        getBankeData:(state)=>(modulename, bankeid)=>{
            var bdata = state.bankecachedata;
            if (bdata[modulename] && bdata[modulename][bankeid]){
                return bdata[modulename][bankeid];
            }
            return null;
        },
        curuser:(state, getters)=>{
            var lm = state.loginuser;

            return lm;
        },
        islogin: (state, getters)=>{
            var lm = getters.curuser;
            if (!lm || !lm.id){
                return false;
            }
            return true;
        },
        isteacher:(state, getters)=>{
            if (state.loginuser.role && state.loginuser.role >= 10){
                return true;
            }
            return false;
        }

    }

const mutations =
    {
        setBankeData(state, bobj){
          //  console.log(bobj);
            var modulename = bobj.modulename;
            var bankeid = bobj.bankeid;
            var fn = bobj.fn;
            //console.log(modulename);
            //console.log(bankeid);
            //console.log(fn);
            var bd = getters.getBankeData(state)( modulename, bankeid);
          //  console.log(bd);
            if (!bd){
                var bdata = state.bankecachedata;
                if (!bdata[modulename]){
                    bdata[modulename] = {};
                }
                if (!bdata[modulename][bankeid]){
                    bdata[modulename][bankeid] = {};
                }
                bd = getters.getBankeData(state)( modulename, bankeid);
            }
            if (bd){
                fn(bd);
            }
            //console.log(state.bankecachedata);
        },
        setRouterForward(state, bforward){
            state.routerforward =bforward;
        }

        ,setLoginUser(state, user){
            state.loginuser = user;
            state.usercookiereaded = true;
            cookie.set('user', user);
        }
        ,setUserAvatar(state, avatar){
            if (state.loginuser){
                state.loginuser.avatar = avatar;
                cookie.set('user', state.loginuser);
            }
        }

        ,setHomeSelected(state, strsel){
            state.homeselected = strsel;
        }
        ,setBHomeSelected(state, strsel){
            state.bhomeselected = strsel;
        },
        SET_BANKEZHIYUANLINKITEM(state,item){
            if(item){
                state.bankeZhiYuanLinkItem=[...item,...state.bankeZhiYuanLinkItem]
            }else{
                state.bankeZhiYuanLinkItem=[]
            }
           
        }
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
