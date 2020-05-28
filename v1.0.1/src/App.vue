<template>
  <div id="app">
    <div class="bannertop" v-if="showloginfail" @click="uservalidate">连接失败，点击重连</div>
    <!-- <div class="bannertop" v-if="showtest">{{testtext}}</div> -->
    <transition :name="transitionName">
      <router-view class="Router" :class="{'exsoftios':exsoftios,'miniprogram':miniprogram}"></router-view>
    </transition>
    <preview
      :pshow="show"
      :Pimages="images"
      :PtempLocalfiles="tempLocalfiles"
      :pindex="index"
      @toggleClick="onToggleClick"
    ></preview>
    <mt-popup v-model="popupAudio" position="right" class="popup-right info-popup" :modal="false">
      <Audio :AudioInfo="audiofileinfo" @Backs="popupAudio=false" v-if="popupAudio" />
    </mt-popup>
    <!--
      <div class="dp-hd-wrap"  v-if="hudong" @click="hudongFn">多屏互动</div>
    -->
    <float-icons padding="10 10 60 10" class="icons-warp" v-if="haswifiroom && isCloudmain">
      <div class="float-icon-item" @click="gotowifiroom()">
        <span>
          多屏
          <br />互动
        </span>
      </div>
    </float-icons>
  </div>
</template>

<script>
import nativecode from "./nativecode";
import preview from "./common/preview";
import "./styles/common.less";
import "./styles/style.css";
import Audio from "@/common/audio";
import FloatIcons from "@/components/s-icons";

export default {
  name: "Home",
  components: {
    preview,
    Audio,
    "float-icons": FloatIcons
  },
  computed: {
    showloginfail() {
      let curpath = this.$route.path;
      if (curpath == "/login") {
        return false;
      }
      if (this.websockstate == "reject") {
        return true;
      }
      return false;
    },
    haswifiroom() {
      if (!this.$store.getters.hasloginuser) {
        return false;
      }
      return nativecode.haswifiroom();
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
    },
    localuser() {
      return this.$store.state.loginuser;
    },
    audiofileinfo() {
      return this.$store.state.audiofileinfo;
    },
    exsoftios() {
      if (nativecode.platform == "exsoftios") {
        return true;
      }
      return false;
    },
    miniprogram() {
      if (nativecode.platform == "miniprogram") {
        return true;
      }
      return false;
    }
  },

  data() {
    return {
      hudong: true,
      transitionName: "slide-forward",
      testtext: "showua:" + navigator.userAgent,
      showtest: true,
      map: {},
      popupAudio: false,
      myaudioinfo: {},

      //! cjy: websocket 相关
      websock: null,
      websockstate: "", //! 登陆状态：  connecting logining  logined  reject
      websockcount: 0, //! 计数
      websockinterval: null,

      isCloudmain: true
    };
  },
  destroyed: function() {
    clearInterval(this.websockinterval);
    this.websockinterval = null;
    console.log("app.vue destroyed");
  },
  created: function() {
    console.log("app.vue created");

    this.websockinterval = setInterval(() => {
      this.wsontimeout();
    }, 5000);

    nativecode.initfirst();

    let clientWidth = window.innerWidth;
    if (!clientWidth) return;
    if (clientWidth >= 540) {
      document.documentElement.style.fontSize = "40px";
    }
    // console.log("routerview page created, cur path:"+this.$router.path);
    //! 请求登录信息
    this.uservalidate();
  },

  watch: {
    audiofileinfo(lnew, lold) {
      //  if (lnew.filepath != lold.filepath)
      //  console.log(lnew);
      // console.log(lold);
      {
        this.myaudioinfo = lnew;
        if (!lnew.filepath) {
          this.popupAudio = false;
        } else {
          this.popupAudio = true;
        }
      }
    },
    localuser(lnew, old) {
      console.log("localuser watch!!");
      if (lnew.id != old.id) {
        console.log("user changed!!!");
        this.wssetstate("");
        if (lnew.id && lnew.cookie) {
          this.wsinit();
        }
      }
    },
    $route(to, from) {
      //console.log('route');
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
      if (to.name == "cloudmain") {
        this.isCloudmain = true;
      } else {
        this.isCloudmain = false;
      }
    }
  },
  methods: {
    hudongFn() {
      console.log("开始互动");
    },
    gotowifiroom() {
      let argobj = {
        page: "wifiroom"
      };
      nativecode.ncall("toNativePage", argobj);
    },
    onToggleClick(data) {
      if (!data) {
        this.tempLocalfiles = [];
        let obj = {
          isPreview: true,
          images: [],
          show: data,
          index: 0
        };
        this.$store.commit("SET_PREVIEW", obj, "");
      }
    },
    uservalidate() {
      var url = "/api/api/uservalidate";
      console.log("user validate ret, cur path:" + this.$route.path);
      //! cjy: 考虑到微信可能在不同界面单独加载， 这里检测仅指定path才去query， 减少频率
      if (this.$route.path != "/login") {
        //! cjy: 服务器实现缓存
        this.$http
          .post(url)
          .then(res => {
            //  console.log(document.cookie);
            console.log("user validate ret");
            if (res.data.code == 0) {
              this.$store.commit("setLoginUser", res.data.data);
              // cjy: 大屏端，如果已登录， 应当自动跳转主页
              if (this.$route.path == "/login") {
                this.$store.commit("setRouterForward", true);
                this.$router.push("/");
              }
              if (this.websockstate == "reject") {
                this.wsinit(); //! 重新连接
              }
              nativecode.jsLogin(1, res.data.data);
            } else {
              console.log(res);
              //!  未登录， 强制跳转登录
              if (this.$route.path != "/login") {
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
    },

    wsgeturl() {
      let proto = "wss";
      // console.log(location.protocol);
      let port = Number(location.port);
      if (port == 0) {
        port = 443;
      }
      if (location.protocol == "http:") {
        proto = "ws";
        if (port == 0) {
          port = 80;
        }
      }
      let hostname = location.hostname;
      if (process.env.NODE_ENV !== "production") {
        hostname = "www2.exsoft.com.cn";
        port = 9982;
        proto = "wss";
      }

      let serverpath = proto + "://" + hostname + ":" + (port + 1) + "/ws";
      return serverpath;
    },
    wsinit() {
      //console.log('wsinit');

      this.wssetstate("");

      //! 某些平台，不使用wss连接
      if (
        // nativecode.platform == '' ||
        nativecode.platform == "exsoftdaping"
      ) {
        if (this.websockcount == 0) {
          console.log("not wsinit, return");
        }
        this.websockcount++;
        return;
      }

      try {
        let url = this.wsgeturl();
        console.log("wsinit:" + url);
        this.websock = new WebSocket(url);
        this.websock.onopen = this.wsonopen;
        this.websock.onerror = this.wsonerror;
        this.websock.onmessage = this.wsonmessage;
        this.websock.onclose = this.wsonclose;
        this.wssetstate("connecting");
      } catch (e) {}
    },
    wsonerror() {
      if (this.websockstate != "reject") {
        this.wssetstate("");
      }
    },
    wsonclose() {
      if (this.websockstate != "reject") {
        this.wssetstate("");
      }
    },
    wssetstate(strstate) {
      console.log("wssetstate:" + strstate);
      this.websockstate = strstate;
      this.websockcount = 0;
      if (strstate == "reject" || strstate == "") {
        let olss = this.websock;
        if (olss) {
          olss.onopen = null;
          olss.onerror = null;
          olss.onmessage = null;
          olss.onclose = null;

          let cmdobj = {};
          cmdobj.cmd = "offline"; //! 推送一个离线的cmd
          this.$store.commit("setWebCmd", cmdobj);

          olss.close();
        }
        this.websock = null;
      }
    },
    wsontimeout() {
      if (this.websockstate == "") {
        if (this.localuser.cookie) {
          this.wsinit();
        }
      } else {
        this.websockcount++;
        if (this.websockcount >= 2) {
          if (
            this.websockstate == "connecting" ||
            this.websockstate == "logining"
          ) {
            this.wssetstate(""); //! 超时， 主动断开
          }
        }
      }
    },
    cmdpingcestart(cmdobj) {
      //! 随意使用一个时间参数，用户
      let uri = "/urlpingce/" + cmdobj.bankeid + "/" + new Date().getTime();
      // uri += '&time=' + new Date().getTime();
      //  this.$store.commit("setRouterForward", true);
      // this.$router.push(uri);
      // return ;
      let curpath = this.$route.path;
      console.log(curpath);
      let navigate = () => {
        this.$store.commit("setRouterForward", true);
        this.$router.push({
          name: "PingCeing",
          params: {
            bankeid: cmdobj.bankeid,
            dataobj: cmdobj.data
          }
        });
      };
      if (curpath == "/PingCeing") {
        this.$back();
        setTimeout(() => {
          navigate();
        }, 300);
      } else {
        navigate();
      }
    },
    wsonmessage(e) {
      try {
        let cmdobj = JSON.parse(e.data);
        console.log("wsonmessage:接收消息" + e.data);
        let cmddealed = true;
        if (cmdobj.cmd == "loginresult") {
          if (cmdobj.code == 0) {
            this.wssetstate("logined");
          } else {
            this.wssetstate("reject");
          }
        } else if (cmdobj.cmd == "kickout") {
          this.wssetstate("reject");
        } else if (cmdobj.cmd == "pingcestart") {
          this.cmdpingcestart(cmdobj);
        } else {
          cmddealed = false;
        }
        if (!cmddealed) {
          this.$store.commit("setWebCmd", cmdobj);
        }
      } catch (e) {}
    },
    wsonopen() {
      this.wssetstate("logining");
      let role = "";
      if (nativecode.platform == "miniprogram") {
        //! 小程序支持与其他端同时打开
        role = "weixin";
      } else if (
        nativecode.platform == "" ||
        nativecode.platform == "exsoftwindows"
      ) {
        role = "pc";
      }
      let logindata = {
        cmd: "login",
        data: {
          cookie: this.localuser.cookie,
          role: role
        }
      };
      this.websock.send(JSON.stringify(logindata));
    }
  }
};
</script>

<style >
@import "./assets/iconfont/iconfont.css";
@import "styles/style.css";
.Router {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f0f0;
  font-size: 14px;
  overflow: hidden;
}
.Router.miniprogram {
  height: 100vh;
  min-height: 100vh;
}
.Router.exsoftios {
  /* height: 97vh;
  min-height: 97vh; */
}
.bannertop {
  z-index: 9999;
  position: absolute;
  background-color: orange;
  width: 100%;
  height: 30px;
  font-size: 14px;
  top: 50px;
  text-align: center;
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
.iconfont-big {
  display: block;
  padding-bottom: 7px;
  font-size: 48px !important;
}
</style>
<style lang="less" scoped>
.dp-hd-wrap {
  position: fixed;
  bottom: 100px;
  right: 10px;
  z-index: 99999999999;
  width: 100px;
  height: 100px;
  background: rgba(0, 137, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  text-align: center;
  line-height: 100px;
  font-size: 20px;
}

.icons-warp {
  border-radius: 25px;
  .float-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 50px;
    height: 50px;
    img {
      width: 25px;
      height: 25px;
      margin-bottom: 3px;
    }
    span {
      font-size: 16px;
      color: #666666;
      font-weight: bold;
    }
  }
}
</style>