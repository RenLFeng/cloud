<template>
  <div class="big-main" v-if="isLoad">
    <mt-header :title="mytitle">
      <mt-button icon="back" slot="left" @click="Backs">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div v-if="showselect">
      <div v-if="!hasselect">
        <div v-for="(item,selindex) in curbankes" :key="selindex">
          <BankeSimple :classitem="item" :end="true" @click.native="onbankeclick(item)"></BankeSimple>
        </div>
      </div>
      <div v-else>
        <Login :bankeItem="selectbanke" :ecode="ecode" @login="onLogin" />
      </div>


    </div>
    <div v-else>
    <div v-if="isLogin" class="isLogin">
      <div class="tc no-class empty">
        <i class="iconfont icondapingmu fontmaintitle"></i>
        <p class style="color:#000">已登录到大屏</p>
        <div class style="color:#000">
          <p>{{userInfo.mac}}</p>
          <p>{{userInfo.name}}</p>
        </div>
        <p>下课后请及时退出大屏登录</p>
        <div class="button-worp">
          <mt-button class="button-auto-96" @click="sinOut">退出大屏</mt-button>
        </div>
      </div>
    </div>
    <div v-else>
      <Login :bankeid="bankeid" @login="onLogin" />
    </div>
    </div>
  </div>
</template>

<script>
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import Login from "./login";

import BankeEnd from "@/views/my/bankeEnd";

import { parseURL } from "@/util";

import BankeSimple from "@/views/components/BankeSimple"

export default {
  name: "BigLogin",
  components: {
    Login,
      BankeSimple
  },
  data() {
    return {
      isLoad: false,
      userInfo: {},
      isLogin: false,
      bankeid: 0,
        ecode:0,
        showselect:false,
        hasselect:false,
        curbankes:[],
        selectbanke:{},
        selfsel:false,
    };
  },
  mounted() {
      const UrlParams = parseURL(window.location.href);
      if (UrlParams.ecode) {
          this.ecode = UrlParams.ecode;
          this.showselect = true;
          this.selfsel = true;
      }
    let params = this.$route.params;
    if (params.bankeid) {
      this.bankeid = params.bankeid;
    }
    if (!this.showselect){
        this.dapingquery();
    }
    else{
        this.isLoad = true;

        this.initbanke();
    }

  },
    computed:{
      mytitle(){
          if (this.showselect){
              if (!this.hasselect){
                  return '大屏登录-选择班课';
              }
              if (!this.isLogin){
                  return '登录确认';
              }
          }
          if (this.isLogin){
              return '已登录';
          }
          {
              return '大屏登录'
          }

      },
    },
  methods: {
      onbankeclick(bankeitem){
        this.selectbanke = bankeitem;
        this.hasselect = true;
      },
      initbanke() {
          var url = "/api/api/bankequery";
          this.$http
              .post(url)
              .then(res => {
                  if (res.data.code == 0) {
                      let arr = [];
                      for (let v of res.data.data) {
                          if (v.ismaster){
                              arr.push(v);
                          }

                      }
                      this.curbankes = arr;
                  }

              })
              .catch(res => {
                  console.log(res);
                  Toast('异常');
              });
      },
    dapingquery() {
      Indicator.open("加载中...");
      this.$http
        .post("api/banke/dapingquery", {})
        .then(res => {
          if (res.data.code == "0" && res.data.data) {
            this.isLogin = true;
            this.userInfo = res.data.data.daping;
            console.log("大屏查询", res);
          }
          this.isLoad = true;
          Indicator.close();
        })
        .catch(err => {
          this.isLoad = true;
          Toast("异常");
          Indicator.close();
        });
    },
    sinOut() {
      MessageBox.confirm("您确定要退出大屏吗？")
        .then(res => {
          Indicator.open("加载中...");
          this.$http
            .post("api/banke/dapinglogout", {})
            .then(res => {
              if (res.data.code == "0") {
                Toast("退出成功");
                if (this.selfsel){
                    //! 直接返回主页； 当前非在某一班课中
                    this.$router.push("/");
                }
                else{
                    this.isLogin = false;
                }

                console.log("退出", res);

              } else {
                Toast("退出失败");
              }
              Indicator.close();
            })
            .catch(err => {
              Toast("异常");
              Indicator.close();
            });
        })
        .catch(() => {});
    },
    onLogin(v) {
      this.isLogin = true;
      this.userInfo = v;
      this.showselect = false;
    },
    Backs() {
          if (this.showselect){
              if (!this.isLogin && this.hasselect){
                  this.hasselect = false;
                  return;
              }
              //! 这里小程序跳转可能有问题，强制跳转 主页
              this.$router.push("/");
              return;
          }

          if (this.selfsel){
              //! 直接扫码大屏登录的。
              this.$router.push("/");
              return;
          }

      this.$back();
    }
  }
};
</script>

<style lang='less'>
.big-main {
  .isLogin {
    height: 100vh;
    min-height: 100vh;
    p {
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
