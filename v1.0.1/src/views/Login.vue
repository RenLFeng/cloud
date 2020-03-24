<template>
  <div class="tc loginbg">
    <div class="fontmaintitle maintitle">
      <!-- 云平台Cloud -->
    </div>
    <div class="fontlarge loginpart">
      <div class="login-box" v-if="state">
        <div class="loginline">
          <img src="../assets/phone_icon.svg" alt  class="position-l"/>
          <input
            v-model="account"
            placeholder="输入账户名"
            autocomplete="off"
            class="logininput fontnormal"
            @keyup.enter="dologin"
          />
        </div>
        <div class="loginline">
          <img src="../assets/pwd_icon.svg" alt class="position-l"/>
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
      <div class="reg-box" v-if="!state">
        <div class="loginline">
          <img src="../assets/phone_icon.svg" alt />
          <input
            v-model="phone"
            placeholder="输入手机号"
            autocomplete="off"
            class="logininput fontnormal"
          />
        </div>
        <div class="loginline">
          <input
            v-model="phoneCode"
            placeholder="输入验证码"
            autocomplete="off"
            class="logininput fontnormal phone-code"
          />
          <mt-button
            type="primary"
            size="small"
            class="get-code"
            @click="getCodeTimeEnd"
          >{{codeTime>0?codeTime+"秒后重新获取":'获取验证码'}}</mt-button>
        </div>
      </div>
      <!-- <p class="login-tit">
        <span :class="state==1?'act':''" @click="selectFn(1)">密码登录</span>
        <span :class="state==0?'act':''" @click="weixinLogin">微信登陆</span>
      </p>-->
      <button
        class="loginbtn fontnormal"
        :class="isSbmit?'colord':'colora'"
        @click="dologin"
      >{{state?'登录':'下一步'}}</button>
      <button class="loginbtn weixinLogin fontnormal" @click="weixinLogin">微信登陆</button>
    </div>
    <mt-popup
      v-model="popupWeiXxinLogin"
      position="right"
      class="mint-popup-3"
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
      ></wxlogin>
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
        redirect_uri: "https://www2.exsoft.com.cn/wechat/callback.do"
      }
    };
  },
  computed:{
    isSbmit(){
      if(this.account && this.password){
        return true;
      }else{
        return false;
      }
    },
  },
  mounted() {},
  methods: {
    weixinLogin() {
      this.popupWeiXxinLogin = true;
      // this.setWxerwma();
    },
    setWxerwma() {
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js";
      s.id = "wechat";
      const wxElement = document.body.appendChild(s);
      wxElement.onload = function() {
        let obj = new WxLogin({
          id: "weixinLogin", // 需要显示的容器id
          appid: "wx40632058fe27bbb6", // 公众号appid wx*******
          scope: "snsapi_login", // 网页默认即可
          redirect_uri: encodeURIComponent("https://www2.exsoft.com.cn/"), // 授权成功后回调的url
          state: Math.ceil(Math.random() * 1000), // 可设置为简单的随机数加session用来校验
          style: "black", // 提供"black"、"white"可选。二维码的样式
          href: "" // 外部css文件url，需要https
        });
      };
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
      if(!this.isSbmit) {
        Toast('请填写详细信息');
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
  top: 15vh;
  left: 0;
  position: absolute;
}
.loginpart {
  position: absolute;
  top: 35%;
  height: 65%;
  left: 0;
  width: 100%;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  /* padding-top:100px; */
}
.logininput {
  border: none;
  border-bottom: 1px solid #d3d3d3;
  width: 100%;
  padding: 5px;
  margin: 20px auto;
  padding-left: 30px;
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
.loginbtn.weixinLogin{
  background: #2EA34C;
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
</style>
<style lang="less">
.loginbg {
    background: url(../assets/login_b.png) no-repeat 50% 0;
    background-size: contain;
  .maintitle {
    width: 100%;
    height: 85vh;
    background: url(../assets/login_logo.png) no-repeat 50% 0;
    background-size: 5rem;
  }
  .loginpart {
    padding: 20px;
    .login-tit {
      text-align: left;
      // padding-bottom: 3.125rem;
      span {
        color: #939393;
        display: inline-block;
        width: 33%;
        // font-size: 1rem;
      }
      span.act {
        color: #0089ff;
        // font-size: 1.125rem;
      }
    }
  }
}
</style>