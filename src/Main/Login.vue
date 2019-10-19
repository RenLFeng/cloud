<template>
  <div class="tc loginbg">
    <div class="fontmaintitle maintitle">
      <!-- 云平台Cloud -->
    </div>
    <div class="fontlarge loginpart">
      <p class="login-tit">
        <span :class="state==1?'act':''" @click="selectFn(1)">密码登录</span>
        <!-- <span :class="state==0?'act':''" @click="selectFn(0)">快速注册</span> -->
      </p>
      <div class="login-box" v-if="state">
        <div class="loginline">
          <img src="../assets/phone_icon.svg" alt />
          <input
            v-model="account"
            placeholder="输入账户名"
            autocomplete="off"
            class="logininput fontnormal"
          />
        </div>
        <div class="loginline">
          <img src="../assets/pwd_icon.svg" alt />
          <input
            v-model="password"
            placeholder="输入密码"
            type="password"
            autocomplete="off"
            class="logininput fontnormal"
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

      <button  class="loginbtn fontnormal" @click="dologin"   @keyup.enter.native="dologin">{{state?'登录':'下一步'}}</button>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Button } from "mint-ui";
// import { setServers } from 'dns';
// import { setInterval } from 'timers';

export default {
  name: "Login",
  data() {
    return {
      password: "",
      account: "",
      phone: "",
      phoneCode: "",
      state: 1,
      codeTime: 0,
      Times: null
    };
  },
  methods: {
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
      Indicator.open(this.$t('Indicator.Logon'));
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
    }
  }
};
</script>
<style  scoped>
.loginbg {
  background: linear-gradient(
    to bottom right,
    #74bfff,
    #0089ff
  ); /* 标准的语法 */
}
.maintitle {
  color: white;
  top: 15%;
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
  line-height: 50px;
  position: relative;
}
.loginline img {
  position: absolute;
  left: -10px;
  top: 0;
  transform: translate(50%, 85%);
}
.loginbtn {
  background-color: #0089ff;
  border: none;
  border-radius: 29px;
  padding: 15px 0;
  margin: 0;
  color: white;
  width: 100%;
  margin: 30px auto;
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
  .maintitle {
    width: 100%;
    height: 100vh;
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