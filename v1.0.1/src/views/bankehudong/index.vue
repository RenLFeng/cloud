<template>
  <div class="hu-dong-container">
    <ul class="list-main">
      <li v-show="haswxsign" class="fontlarge" @click="onwxsign()">
        <span>微信签到</span>
        <i class="iconfont iconqiandao2 eicotrigger fr" style="color:#E46100"></i>
      </li>
      <li class="fontlarge" @click="teacherFn()">
        <span>上课签到</span>
        <i class="iconfont iconqiandao2 eicotrigger fr" style="color:#E46100"></i>
      </li>
      <li class="fontlarge" @click="gopingce" v-if="!isTeacher">
        <span>评测</span>
        <i class="iconfont icontongji eicotrigger fr" style="color:#38ADA9"></i>
      </li>
      <li class="fontlarge" @click="pingce">
        <span>评测记录</span>
        <i class="iconfont icontongji eicotrigger fr" style="color:#38ADA9"></i>
      </li>
      <li class="fontlarge" @click="BigLogin" v-if="isTeacher">
        <span>大屏登录</span>
        <i class="iconfont icondapingmu eicotrigger fr" style="color:#0055FF"></i>
      </li>
      <li class="fontlarge" @click="Banshu">
        <span>课堂板书</span>
        <i class="iconfont iconwritin-blackboard eicotrigger fr" style="color:#38AD5A"></i>
      </li>
    </ul>
    <!-- <mt-popup
      v-model="popupTeacherSignInfo"
      position="right"
      class="mint-popup"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header title="上课签到">
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <TeacherSignInfo :bankeid="bankeid" :role="isTeacher" :global="global" @global="onglobal" />
    </mt-popup>-->
  </div>
</template>
<script>
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import TeacherSignInfo from "./sign/teacherSignInfo";

import nativecode from '../../nativecode'

export default {
  name: "",
  props: {
    bankeid: {
      default: 0
    }
  },
  components: {
    TeacherSignInfo
  },
  data() {
    return {
      global: false,
      popupTeacherSignInfo: false
    };
  },
  computed: {
    isTeacher() {
      return this.$store.getters.isteacher;
    },
      haswxsign(){
        if (nativecode.platform == 'miniprogram'){
            return true;
        }
        return false;
      }
  },
  created() {
    // this.signquery();
  },
  methods: {
    //老师签到
      onwxsign(){
          //let ppath = '/Sign?bankeid' + this.bankeid;
          nativecode.navigateToSign(this.bankeid);
      },
     teacherFn() {
     this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "Sign",
        params: { bankeid: this.bankeid }
      });
    },
    // teacherFn() {
    //   this.popupTeacherSignInfo = true;
    //   this.$store.commit("SET_FOOTER_BAR_STATE", false);
    // },
    //评测
    gopingce() {
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "PingCeing",
        params: { bankeid: this.bankeid }
      });
    },
    //评测记录
    pingce() {
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "PingCe",
        params: { bankeid: this.bankeid }
      });
    },
    //大屏登录
    BigLogin() {
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "BigLogin",
        params: { bankeid: this.bankeid }
      });
    },
    //板书
    Banshu() {
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "Banshu",
        params: { bankeid: this.bankeid }
      });
    },
    onglobal(v) {
      this.global = v;
    },
    goBacks() {
      if (this.popupTeacherSignInfo) {
        this.popupTeacherSignInfo = false;
      }
      if (this.isTeacher) {
        this.global = true;
      } else {
        this.global = false;
      }
      this.$store.commit("SET_FOOTER_BAR_STATE", true);
    }
  }
};
</script>

<style lang='less'>
.hu-dong-container {
  .list-main {
    width: 95%;
    margin: 10px auto;
    li {
      height: 80px;
      background: #fff;
      padding: 20px;
      margin-bottom: 10px;
      line-height: 40px;
      border-radius: 10px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.07);
      i {
        font-size: 30px !important;
      }
    }
  }
}
</style>
