<template>
  <div class="wechat-wrap">
    <div class="mian">
      <div class="position-c">
        <h1>{{code}}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { parseURL } from "@/util";
import { Indicator, Toast, MessageBox, Button } from "mint-ui";
export default {
  name: "WechatLogin",
  props: {},
  data() {
    return {
      code: 32326
    };
  },
  computed: {},
  created() {
    const UrlParams = parseURL(window.location.href);
    if (UrlParams.code) {
      this.code = UrlParams.code;
    }
   // this.wechatLogin();
  },
  mounted() {},
  watch: {},
  methods: {
    wechatLogin() {
      Indicator.open("登录中...");
      this.$http
        .post("/api/banshu/query", {
          bankeid: 1040,
          page: 0,
          pagesize: 10
        })
        .then(res => {
          if (res.data.code == 0) {
            // this.$router.push("/");
          } else {
            Toast("登陆失败");
            this.$router.push("/login");
          }
          Indicator.close();
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
