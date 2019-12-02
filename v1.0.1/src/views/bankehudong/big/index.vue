<template>
  <div class="big-main">
    <mt-header :title="isLogin?'登录中...':'大屏登录'">
      <mt-button icon="back" slot="left" @click="Backs">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div v-if="isLogin">
      <p>{{userInfo.mac}}</p>
      <p>{{userInfo.name}}</p>
      <mt-button @click="sinOut">退出</mt-button>
    </div>
    <div v-else>
      <Login :bankeid="bankeid" @login="onLogin" />
    </div>
  </div>
</template>

<script>
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import Login from "./login";
export default {
  name: "BigLogin",
  components: {
    Login
  },
  data() {
    return {
      userInfo: {},
      isLogin: false,
      bankeid: 0
    };
  },
  mounted() {
    let params = this.$route.params;
    if (params.bankeid) {
      this.bankeid = params.bankeid;
    }
    this.dapingquery();
  },
  methods: {
    dapingquery() {
      this.$http
        .post("api/banke/dapingquery", {})
        .then(res => {
          if (res.data.code == "0" && res.data.data) {
            this.isLogin = true;
            this.userInfo = res.data.data.daping;
            console.log("大屏查询", res);
          }
        })
        .catch(err => {});
    },
    sinOut() {
      MessageBox.confirm("您确定要退出吗？")
        .then(res => {
          this.$http
            .post("api/banke/dapinglogout", {})
            .then(res => {
              if (res.data.code == "0") {
                this.isLogin = false;
                console.log("退出", res);
              }
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    onLogin(v) {
      this.isLogin = true;
      this.userInfo = v;
    },
    Backs() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'></style>
