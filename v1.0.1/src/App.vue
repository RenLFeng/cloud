<template>
  <div id="app">
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
    show: {
      get: function() {
        return this.$store.state.show;
      },
      set: function(newValue) {
        console.log(newValue);
        this.$store.commit("SET_SHOW", newValue);
      }
    },
    images: {
      get: function() {
        return this.$store.state.images;
      },
      set: function(newValue) {
        console.log(newValue);
        this.$store.commit("SET_IMAGES", newValue);
      }
    },
    tempLocalfiles: {
      get: function() {
        return this.$store.state.previewLoadFile;
      },
      set: function(newValue) {
        console.log(newValue);
        this.$store.commit("SET_PREVIEWLOADFILE", newValue);
      }
    },
    index: {
      get: function() {
        return this.$store.state.index;
      },
      set: function(newValue) {
        console.log(newValue);
        this.$store.commit("SET_INDEX", newValue);
      }
    },
    username() {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username;
    }
  },
  data() {
    return {
      transitionName: "slide-forward",
      map: {}
    };
  },
  created: function() {

      nativecode.initfirst();

    let clientWidth = window.innerWidth;
    if (!clientWidth) return;
    if (clientWidth >= 640) {
      document.documentElement.style.fontSize = "2.5rem";
    }
    // console.log("routerview page created, cur path:"+this.$router.path);
    //! 请求登录信息
    var url = "/api/api/uservalidate";
    console.log("user validate ret, cur path:" + this.$route.path);
    //! cjy: 考虑到微信可能在不同界面单独加载， 这里检测仅指定path才去query， 减少频率
     // if (this.$route.path == '/')  //! cjy: 服务器实现缓存
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
                      nativecode.jsLogin(1, res.data.data);
                  } else {
                      //!  未登录， 强制跳转登录
                      this.$store.commit("setLoginUser", {});
                      this.$store.commit("setRouterForward", true);
                      this.$router.push("/login");

                      nativecode.jsLogin(0, {});

                  }
              })
              .catch(() => {
                  //! 其他异常
              });
      }

  },
  watch: {
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
        this.$store.commit("SET_ISPREVIEW", true);
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
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