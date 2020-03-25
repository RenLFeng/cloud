<template>
  <div class="wechat-wrap">
    <div class="mian">
      <div class="position-c">
        <h1>{{desc}}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { parseURL } from "@/util";
import { Indicator, Toast, MessageBox, Button } from "mint-ui";

import nativecode from "@/nativecode";

export default {
  name: "WechatLogin",
  props: {},
  data() {
    return {
        desc:'登录中...',
      code: ''
    };
  },
  computed: {},
  created() {
    const UrlParams = parseURL(window.location.href);
    if (UrlParams.code) {
      this.code = UrlParams.code;
    }
    this.wechatLogin();
  },
  mounted() {},
  watch: {},
  methods: {
    wechatLogin() {
      Indicator.open("登录中...");
      this.$http
        .post("/api/weixin/webupdateuser", {
          code:this.code
        })
        .then(res => {
            Indicator.close();
          if (res.data.code == 0) {
             //this.$router.push("/");
              this.$store.commit("setLoginUser", res.data.data);
              this.$store.commit("setRouterForward", true);
              this.$router.push("/");
              nativecode.jsLogin(1, res.data.data);
          } else {
            Toast("登陆失败");
            this.$router.push("/login");
          }

        })
        .catch(res => {
          Toast("登陆失败");
          this.$router.push("/login");
          Indicator.close();
        });
    }
  },
  components: {}
};
</script>

<style scoped lang="less">
.wechat-wrap {
  width: 100%;
  height: 100vh;
  background: #fff;
  .main {
    position: relative;
  }
}
</style>
