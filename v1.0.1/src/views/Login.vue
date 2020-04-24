<template>
  <div class="tc loginbg">
    <div class="fontmaintitle maintitle">
      <div class="bg-pic-wrap">
        <img src="/assets/login_b.png" alt class="login-bg" />
        <img src="/assets/login_logo.png" alt class="login-icon position-c" />
      </div>
      <div class="fontlarge loginpart scrollingtouch">
        <div class="tit-wrap">
          <span :class="state?'act':''" @click="selectFn(1)">密码登录</span>
          <span :class="!state?'act':''" @click="selectFn(0)">用户注册</span>
        </div>
        <div class="login-box">
          <div class="loginline">
            <img src="/assets/phone_icon.svg" alt class="position-l" />
            <input
              v-model="account"
              :placeholder="state?'输入账户名':'请设置账户名'"
              autocomplete="off"
              class="logininput fontnormal"
              @keyup.enter="dologin"
              @blur="$setInputScroll"
            />
          </div>
          <div class="loginline">
            <img src="/assets/pwd_icon.svg" alt class="position-l" />
            <input
              v-model="password"
              :placeholder="state?'输入密码':'请设置密码'"
              type="password"
              autocomplete="off"
              class="logininput fontnormal"
              @keyup.enter="dologin"
              @blur="$setInputScroll"
            />
          </div>
        </div>
        <button
          class="loginbtn fontnormal"
          :class="isSbmit?'colord':'colora'"
          @click="dologin"
        >{{state?'登录':'注册'}}</button>
        <button
          v-if="hasnativewxlogin"
          class="loginbtn weixinLogin fontnormal"
          @click="weixinNativeLogin"
        >微信登录</button>
        <button
          v-if="superAdmin"
          class="loginbtn weixinLogin fontnormal"
          @click="weixinLogin"
        >微信扫码登录</button>
      </div>
    </div>
    <mt-popup
      v-model="popupWeiXxinLogin"
      position="right"
      class="mint-popup-3 wechat-wrap"
      :modal="false"
      style
    >
      <mt-header title class>
        <mt-button slot="left" @click="Backs">取消</mt-button>
      </mt-header>
      <!-- <div id="weixinLogin"></div> -->
      <wxlogin
        v-if="popupWeiXxinLogin"
        :appid="wxlogin.appid"
        :scope="wxlogin.scope"
        :redirect_uri="encodeURIComponent(wxlogin.redirect_uri)"
        :href="wxlogin.href"
      ></wxlogin>
      <p style="font-size:18px;color:#000">请使用微信扫一扫完成登录</p>
    </mt-popup>
  </div>
</template>


<script>
import { Indicator, Toast, MessageBox, Button } from "mint-ui";
// import { setServers } from 'dns';
// import { setInterval } from 'timers';


import nativecode from "@/nativecode";
import wxlogin from "vue-wxlogin";
export default {
  name: "Login",
  data() {
    return {
      // isSbmit:false,
      password: "",
      account: "",
      phone: "",
      phoneCode: "",
      state: 1,
      codeTime: 0,
      Times: null,
      popupWeiXxinLogin: false,
      wxlogin: {
        appid: "wx40632058fe27bbb6",
        scope: "snsapi_login",
        redirect_uri: "https://www2.exsoft.com.cn/#/WechatLogin/callback.do",
        href:
          "data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge2Rpc3BsYXk6IG5vbmU7fQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9Ci5pbXBvd2VyQm94IC5zdGF0dXMge3RleHQtYWxpZ246IGNlbnRlcjt9Ci5pbXBvd2VyQm94IC5xcmNvZGV7cG9zaXRpb246IGZpeGVkO2xlZnQ6IDUwJTt0b3A6IDUwJTt0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTt9"
      },
      tips: ""
    };
  },
  computed: {
    isSbmit() {
      if (this.account && this.password) {
        return true;
      } else {
        if (!this.account) {
          if (this.state) {
            this.tips = "请填写账号";
          } else {
            this.tips = "请设置账号";
          }
          return;
        }
        if (!this.password) {
          if (this.state) {
            this.tips = "请填写密码";
          } else {
            this.tips = "请设置密码";
          }
        }
      }
      return false;
    },
    hasnativewxlogin() {
      if (
        nativecode.platform == "exsoftandroid" ||
        (nativecode.platform == "exsoftios" && this.superAdmin)
      ) {
        return true;
      }
      return false;
    },
    superAdmin() {
      if (this.account == "exsoftwe") {
        return true;
      }
    }
  },
  mounted() {},
  methods: {
    weixinLogin() {
      this.popupWeiXxinLogin = true;
    },
    weixinNativeLogin() {
      //! 微信原生登录
      nativecode.ncall("reqWeixinLogin", {});
    },
    selectFn(state) {
      this.state = state;
      if (!state) {
        this.account = "";
        this.password = "";
      }
    },
    dologin: function() {
      this.login();
    },
    login() {
      if (!this.isSbmit) {
        Toast(this.tips);
        return;
      }
      let tips = "登录中...";
      var url = "/api/api/login";
      if (!this.state) {
        url = "/api/api/newaccount";
        tips = "正全力注册...";
      }
      Indicator.open(tips);
      var othis = this;
      this.$http
        .post(url, {
          account: this.account,
          password: this.password
        })
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            if (this.state) {
              this.$store.commit("setLoginUser", res.data.data);
              this.$store.commit("setRouterForward", true);
              this.$router.push("/");
              nativecode.jsLogin(1, res.data.data);
            } else {
              this.state = 1;
              this.login();
            }
          } else {
            Toast("账户和密码不正确");
          }
        })
        .catch(res => {
          // console.log(res);
          Indicator.close();
          Toast("服务出错了");
        });
    },
    regFn() {},
    getCodeFn() {},
    getCodeTimeEnd() {
      if (this.codeTime > 0) return;
      this.codeTime = 60;
      this.Times = setInterval(() => {
        this.codeTime = this.codeTime - 1;

        if (this.codeTime <= 0) {
          clearInterval(this.Times);
        }
      }, 1000);
    },
    Backs() {
      this.popupWeiXxinLogin = false;
      // let child = document.getElementById("wechat");
      // child.parentNode.removeChild(child);
    },
  },
  components: {
    wxlogin
  }
};
</script>
<style  scoped>
.loginbg {
}
.maintitle {
  color: white;
  left: 0;
}
.loginpart {
  position: absolute;
  height: calc(100vh - 238px);
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: white;
  border-top-left-radius: 0.53333rem;
  border-top-right-radius: 0.53333rem;
  overflow: auto;
}
.logininput {
  border: none;
  border-bottom: 1px solid #d3d3d3;
  width: 100%;
  padding: 5px;
  margin: 20px auto;
  padding-left: 30px;
  color: #000;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #939393;
  font-size: 16px;
}
.phone-code {
  width: 62%;
}
.loginline {
  /* line-height: 50px; */
  position: relative;
}
.loginline img {
  left: 0;
}
.loginbtn {
  background: none;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 15px 0;
  width: 100%;
  margin: 10px auto;
}
.loginbtn.weixinLogin {
  background: #2ea34c;
  color: #fff;
}
.get-code {
  background: none;
  border: 1px solid #0089ff;
  border-radius: 20px;
  color: #0089ff;
  display: inline-block;
  width: 38%;
  font-size: 14px;
}
.mint-button--small {
  padding: 0;
}
.bg-pic-wrap {
  position: relative;
  height: 286px;
  min-height: 286px;
}
.login-bg {
  height: 100%;
  width: 100%;
  max-width: 750px;
}
.login-icon {
  width: 213px;
  height: 63px;
  transform: translate(-50%, -78%);
}
</style>
<style lang="less">
.loginbg {
  .maintitle {
    width: 100%;
    height: 100%;
    background-size: 5rem;
    position: relative;
  }
  .loginpart {
    padding: 20px;
    .login-tit {
      text-align: left;
      span {
        color: #939393;
        display: inline-block;
        width: 33%;
      }
      span.act {
        color: #0089ff;
      }
    }
  }
}
.tit-wrap {
  display: flex;
  color: #999;
  justify-content: space-around;
  span {
    &.act {
      color: #0089ff;
    }
  }
}
</style>