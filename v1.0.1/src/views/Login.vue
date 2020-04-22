<template>
  <div class="tc loginbg">
    <div class="fontmaintitle maintitle">
      <div class="bg-pic-wrap">
        <img src="/assets/login_b.png" alt class="login-bg" />
        <img src="/assets/login_logo.png" alt class="login-icon position-c" />
      </div>
      <div class="fontlarge loginpart">
        <div class="login-box" v-if="state">
          <div class="loginline">
            <img src="/assets/phone_icon.svg" alt class="position-l" />
            <input
              v-model="account"
              placeholder="输入账户名"
              autocomplete="off"
              class="logininput fontnormal"
              @keyup.enter="dologin"
            />
          </div>
          <div class="loginline">
            <img src="/assets/pwd_icon.svg" alt class="position-l" />
            <input
              v-model="password"
              placeholder="输入密码"
              type="password"
              autocomplete="off"
              class="logininput fontnormal"
              @keyup.enter="dologin"
            />
          </div>
        </div>
        <button
          class="loginbtn fontnormal"
          :class="isSbmit?'colord':'colora'"
          @click="dologin"
        >{{state?'登录':'下一步'}}</button>
        <button
          v-if="hasnativewxlogin"
          class="loginbtn weixinLogin fontnormal"
          @click="weixinNativeLogin"
        >微信登录</button>
        <button class="loginbtn weixinLogin fontnormal" @click="weixinLogin">微信扫码登录</button>
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
      }
    };
  },
  computed: {
    isSbmit() {
      if (this.account && this.password) {
        return true;
      } else {
        return false;
      }
    },
    hasnativewxlogin() {
      if (
        nativecode.platform == "exsoftandroid" ||
        nativecode.platform == "exsoftios"
      ) {
        return true;
      }
      return false;
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
    },
    dologin: function() {
      if (this.state) {
        this.login();
      } else {
      }
    },
    login() {
      if (!this.isSbmit) {
        Toast("请填写详细信息");
        return;
      }
      Indicator.open(this.$t("Indicator.Logon"));
      var url = "/api/api/login";
      var othis = this;
      this.$http
        .post(url, {
          account: this.account,
          password: this.password
        })
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            //console.log('login ok');
            this.$store.commit("setLoginUser", res.data.data);
            this.$store.commit("setRouterForward", true);
            this.$router.push("/");
            nativecode.jsLogin(1, res.data.data);
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(res => {
          // console.log(res);
          Indicator.close();
          Toast("异常");
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
    }
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
}
.login-bg {
  height: 286px;
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
</style>