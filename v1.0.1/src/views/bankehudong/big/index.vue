<template>
  <div class="big-main">
    <mt-header :title="isLogin?'登录中...':'大屏登录'">
      <mt-button icon="back" slot="left" @click="Backs">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div v-if="isLogin" class="isLogin">
      <div class="tc no-class empty">
        <i class="iconfont icondapingmu fontmaintitle"></i>
        <p class="" style="color:#000">已登录到大屏</p>
        <div class="" style="color:#000">
          <p>{{userInfo.mac}}</p>
          <p>{{userInfo.name}}</p>
        </div>
        <p>下课后请及时退出大屏登录</p>
        <div class="button-worp">
          <mt-button class="button-auto-96" @click="sinOut">退出</mt-button>
        </div>
      </div>
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

<style lang='less'>
.big-main {
  .isLogin {
    height: 100vh;
    min-height: 100vh;
    p{
      margin: 5px 0;
    }
    .button-worp {
      margin-top: 30px;
      button {
        background: #0089ff;
        color: #fff;
      }
    }
  }
}
</style>
