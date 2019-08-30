<template>
  <div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->

    <transition :name="transitionName">
      <router-view class="Router"></router-view>
    </transition>
  </div>
</template>

<script>
// import rem from './rem/rem.js'
export default {
  name: "Home",
  computed: {
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
    console.log("routerview page created");
    //! 请求登录信息
    var url = "/api/api/uservalidate";
    this.$http
      .post(url)
      .then(res => {
        if (res.data.code == 0) {
          this.$store.commit("setLoginUser", res.data.data);
        } else {
          //!  未登录， 强制跳转登录
          this.$store.commit("setLoginUser", {});
          this.$store.commit("setRouterForward", true);
          this.$router.push("/login");
        }
      })
      .catch(() => {
        //! 其他异常
      });
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
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
};
</script>

<style >
@import "styles/style.css";
@import "./fon/iconfont.css";

.Router {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  background-color: white;
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
.border-bottom-e5 {
  border-bottom: 1px solid #e5e5e5;
}
.clearIt:after {
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
</style>