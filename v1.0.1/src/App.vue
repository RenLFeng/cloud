<template>
  <div id="app">
    <div class="bannertop" v-if="showloginfail" @click="uservalidate">连接失败，点击重连</div>
    <!--<div class="bannertop" v-if="showtest">{{testtext}}</div>-->
    <transition :name="transitionName">
      <router-view class="Router"></router-view>
    </transition>
    <preview
      :pshow="show"
      :Pimages="images"
      :PtempLocalfiles="tempLocalfiles"
      :pindex="index"
      @toggleClick="onToggleClick"
    ></preview>
  </div>
</template>

<script>
import nativecode from "./nativecode";
import preview from "./common/preview";
import "./styles/common.less";
import "./styles/style.css";
export default {
  name: "Home",
  components: {
    preview
  },
  computed: {
      showloginfail(){
          let curpath = this.$route.path;
          if (curpath == '/login'){
              return false;
          }
          if (this.websockstate == 'reject'){
              return true;
          }
          return false;
      },
    show: {
      get: function() {
        return this.$store.state.Preview.show;
      },
      set: function(newValue) {
        console.log(newValue);
        this.$store.commit("SET_PREVIEW", {}, newValue);
      }
    },

    images: {
      get: function() {
        return this.$store.state.Preview.images;
      },
      set: function(newValue) {
        console.log(newValue);
        this.$store.commit("SET_PREVIEW", {}, newValue);
      }
    },
    tempLocalfiles: {
      get: function() {
        return this.$store.state.Preview.previewLoadFile;
      },
      set: function(newValue) {
        console.log(newValue);
        this.$store.commit("SET_PREVIEW", {}, newValue);
      }
    },
    index: {
      get: function() {
        return this.$store.state.Preview.index;
      },
      set: function(newValue) {
        console.log(newValue);
        this.$store.commit("SET_PREVIEW", {}, newValue);
      }
    },
    username() {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username;
    }
    ,localuser(){
        return this.$store.state.loginuser;
      }
  },

  data() {
    return {
      transitionName: "slide-forward",
        testtext:navigator.userAgent,
        showtest:false,
      map: {},


        //! cjy: websocket 相关
        websock:null,
        websockstate:'',  //! 登陆状态：  connecting logining  logined  reject
        websockcount:0,  //! 计数
        websockinterval:null
    };
  },
    destroyed: function() {
       clearInterval(this.websockinterval);
       this.websockinterval = null;
        console.log('app.vue destroyed');
        
    },
  created: function() {

      console.log('app.vue created');

      this.websockinterval = setInterval(()=>{
          this.wsontimeout()
      }, 5000);

    nativecode.initfirst();

    let clientWidth = window.innerWidth;
    if (!clientWidth) return;
    if (clientWidth >= 640) {
      document.documentElement.style.fontSize = "2.5rem";
    }
    // console.log("routerview page created, cur path:"+this.$router.path);
    //! 请求登录信息
    this.uservalidate();
  },
  
  watch: {
      localuser(lnew, old) {
          console.log('localuser watch!!');
           if (lnew.id != old.id)
          {
              console.log('user changed!!!');
              this.wssetstate('');
              if (lnew.id && lnew.cookie){
                  this.wsinit();
              }
          }
      },
    $route(to, from) {
      //console.log('route');
      //   console.log(to);
      //console.log(from);
      if (
        //to.meta && to.meta.newtab
        this.$store.state.routerforward
      ) {
        this.transitionName = "slide-forward";
        this.$store.commit("setRouterForward", false);
      } else {
        this.transitionName = "slide-back";
      }

      //to.path = '/';
      // if (!this.map[to.path]) {
      //     this.map[to.path] = +new Date() + 1;
      // }
      // if (!this.map[from.path]) {
      //     this.map[from.path] = +new Date();
      // }
      //
      // if (this.map[to.path] > this.map[from.path]) {
      //     this.transitionName = 'slide-forward';
      // } else {
      //     this.transitionName = 'slide-back'
      // }
    }
  },
  methods: {
    onToggleClick(data) {
      if (!data) {
        this.show = data;
        this.images = [];
        this.tempLocalfiles = [];
        this.index = 0;
        this.$store.commit("SET_PREVIEW",{}, true);
      }
    },
      uservalidate(){
          var url = "/api/api/uservalidate";
          console.log("user validate ret, cur path:" + this.$route.path);
          //! cjy: 考虑到微信可能在不同界面单独加载， 这里检测仅指定path才去query， 减少频率
          if (this.$route.path != '/login')  //! cjy: 服务器实现缓存
          {
              this.$http
                  .post(url)
                  .then(res => {
                      //  console.log(document.cookie);
                      if (res.data.code == 0) {
                          this.$store.commit("setLoginUser", res.data.data);
                          // cjy: 大屏端，如果已登录， 应当自动跳转主页
                          if (this.$route.path == "/login") {
                              this.$store.commit("setRouterForward", true);
                              this.$router.push("/");
                          }
                          if (this.websockstate == 'reject'){
                              this.wsinit();  //! 重新连接
                          }
                          nativecode.jsLogin(1, res.data.data);

                      } else {
                          //!  未登录， 强制跳转登录
                          if (this.$route.path != '/login'){
                              this.$store.commit("setLoginUser", {});
                              this.$store.commit("setRouterForward", true);
                              this.$router.push("/login");
                          }

                          nativecode.jsLogin(0, {});
                      }
                  })
                  .catch(() => {
                      //! 其他异常
                  });
          }
      },
    goBack() {
      this.$back();
    }

    ,wsgeturl(){
          let proto = "wss";
          // console.log(location.protocol);
          let port = Number(location.port);
          if (port == 0){
              port = 443;
          }
          if (location.protocol == "http:"){
              proto = "ws";
              if (port == 0){
                  port = 80;
              }
          }
          let hostname = location.hostname;
          if (process.env.NODE_ENV !== 'production'){
              hostname = '192.168.40.104';
              port = 9982;
          }


          let serverpath = proto + '://' + hostname + ':'+(port+1) + '/ws';
          return serverpath;
      }
    ,wsinit(){
        //console.log('wsinit');

          this.wssetstate('');

          //! 某些平台，不使用wss连接
          if (
              // nativecode.platform == '' ||
              nativecode.platform == 'exsoftdaping'){
              if (this.websockcount == 0){
                  console.log('not wsinit, return');
              }
              this.websockcount++;
              return;
          }

        try{
            let url = this.wsgeturl();
            console.log('wsinit:'+url);
            this.websock = new WebSocket(url);
            this.websock.onopen = this.wsonopen;
            this.websock.onerror = this.wsonerror;
            this.websock.onmessage = this.wsonmessage;
            this.websock.onclose = this.wsonclose;
            this.wssetstate('connecting');
        }catch(e){

        }
      }
      ,wsonerror(){
        if (this.websockstate != 'reject'){
            this.wssetstate('');
        }
      }
      ,wsonclose(){
          if (this.websockstate != 'reject'){
              this.wssetstate('');
          }
      }
      ,wssetstate(strstate){
        console.log('wssetstate:'+strstate);
        this.websockstate = strstate;
        this.websockcount = 0;
        if (strstate == 'reject' || strstate == ''){
            let olss = this.websock;
            if (olss){
                olss.onopen = null;
                olss.onerror = null;
                olss.onmessage = null;
                olss.onclose = null;
                olss.close();
            }
            this.websock = null;

        }
      }
      ,wsontimeout(){
        if (this.websockstate == ''){
            if (this.localuser.cookie){
                this.wsinit();
            }
        }
        else {
            this.websockcount++;
            if (this.websockcount >= 2){
                if (this.websockstate == 'connecting' || this.websockstate == 'logining'){
                    this.wssetstate(''); //! 超时， 主动断开
                }
            }
        }

      }
      ,wsonmessage(e){
        try{
            let cmdobj = JSON.parse(e.data);
            console.log('wsonmessage:' + e.data);
            if (cmdobj.cmd == 'loginresult'){
                if (cmdobj.code == 0){
                    this.wssetstate('logined');
                }
                else{
                    this.wssetstate('reject');
                }
            }
            else if (cmdobj.cmd == 'kickout'){
                this.wssetstate('reject');
            }
            else if (cmdobj.cmd == 'pingcestart'){
                //! 随意使用一个时间参数，用户
                let uri = '/urlpingce/' +  cmdobj.bankeid + '/' + new Date().getTime();
               // uri += '&time=' + new Date().getTime();
               //  this.$store.commit("setRouterForward", true);
               // this.$router.push(uri);
               // return ;
                 let curpath = this.$route.path;
                 console.log(curpath);
                 let navigate = ()=>{
                     this.$store.commit("setRouterForward", true);
                     this.$router.push({
                         name: "PingCeing",
                         params: {
                             bankeid: cmdobj.bankeid,
                             dataobj:cmdobj.data
                         }
                     });
                 }
                if (curpath == '/PingCeing'){
                     this.$back()
                    setTimeout(()=>{
                        navigate()
                    }, 100);
                }
                else{
                    navigate();
                }

            }
        }catch(e){

        }
      }
      ,wsonopen(){
        this.wssetstate('logining');
        let logindata = {
            cmd:'login',
            data:{
                cookie:this.localuser.cookie
            }
        };
        this.websock.send(JSON.stringify(logindata));
      }
  }
};
</script>

<style >
@import "./fon/iconfont.css";
@import "styles/style.css";
.Router {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  background-color: #f0f0f0;
  font-size: 14px;
  /* overflow: hidden; */
}

.bannertop{
  z-index:9999;
  position:absolute;
  background-color:orange;
  width:100%;
  height:30px;
  font-size:14px;
  top:50px;
  text-align:center
}

.noheadercontainer-bg {
  background: #f1f1f1;
}
.slide-forward-enter {
  transform: translate(100%);
}
.slide-forward-enter-active {
  transition: all 0.2s ease-in-out;
}
.slide-forward-leave-active {
  transform: translate(-100%);
  transition: all 0.2s ease-in-out;
}

.slide-back-enter {
  transform: translate(-100%);
}
.slide-back-enter-active {
  transition: all 0.2s ease-in-out;
}
.slide-back-leave-active {
  transform: translate(100%);
  transition: all 0.2s ease-in-out;
}

.color9 {
  color: #999;
}
.border-bottom {
  border-bottom: 1px solid #f0f0f0;
}
.border-top {
  border-top: 1px solid #f0f0f0;
}
.border-c-bottom {
  border-bottom: 1px solid #ccc;
}
.border-c-top {
  border-top: 1px solid #ccc;
}
.border-bottom-e5 {
  border-bottom: 1px solid #dcdbdb;
}
.border-e5-bottom {
  border-bottom: 1px solid #dcdbdb;
}
.text-center {
  text-align: center;
}
.float-l {
  float: left;
}
.float-r {
  float: right;
}
.clearIt:after {
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
.my-color {
  color: #0089ff;
}
.popup-right {
  width: 100%;
  height: 100%;
  background: #fff;
}
.submit-fixed {
  position: fixed;
  width: 100%;
  bottom: 10px;
  left: 0;
}
.botton-96 {
  border: 1px solid #26a2ff !important;
  width: 96%;
  margin: 0 2%;
  color: #26a2ff !important;
}
.iconfont-big {
  display: block;
  padding-bottom: 7px;
  font-size: 60px !important;
}
.no-more {
  text-align: center;
  color: #999;
  padding: 10px 0 20px 0;
}
</style>