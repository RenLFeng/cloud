<template>
  <div class="hu-dong-container">
    <ul class="list-main">
      <!-- cjy: 使用悬浮窗
      <li class="fontlarge dp" @click="gotowifiroom" v-if="haswifiroom">
        <span>多屏互动</span>
        <i
                class="iconfont icondapingmu eicotrigger bigfont fr"
                style="color:#0055FF"
        ></i>
      </li>
      -->
      <li class="fontlarge dp" @click="BigLogin" v-if="isTeacher">
        <span>大屏登录</span>
        <i
                class="iconfont icondapingmu eicotrigger bigfont fr"
                :class="eventmsgs.hdTips.bigLogin?'reddot-Tips':''"
                style="color:#0055FF"
        ></i>
      </li>
      <li class="fontlarge" @click="onwxsign()" v-if="haswxsign">
        <span>签到</span>
        <i
          class="iconfont iconqiandao2 eicotrigger bigfont fr"
          :class="eventmsgs.hdTips.sign?'reddot-Tips2':''"
          style="color:#E46100"
        ></i>
      </li>
      <!-- <li class="fontlarge" @click="teacherFn()" v-if="showstuc">
        <span>上课签到</span>
        <i
          class="iconfont iconqiandao2 eicotrigger bigfont fr"
          :class="eventmsgs.hdTips.sign?'reddot-Tips2':''"
          style="color:#E46100"
        ></i>
      </li> -->
      <li class="fontlarge" @click="gopingce" v-if="showpingce">
        <span>评测</span>
        <i
          class="iconfont icontongji eicotrigger bigfont fr"
          :class="eventmsgs.hdTips.pingce?'reddot-Tips2':''"
          style="color:#38ADA9"
        ></i>
      </li>
      <li class="fontlarge" @click="pingce">
        <span>评测记录</span>
        <i class="iconfont icontongji eicotrigger bigfont fr" style="color:#38ADA9"></i>
      </li>

      <li class="fontlarge bs" @click="Banshu">
        <span>课堂板书</span>
        <i
          class="iconfont iconwritin-blackboard eicotrigger bigfont fr"
          :class="eventmsgs.hdTips.banshu?'reddot-Tips':''"
          style="color:#38AD5A"
        ></i>
      </li>
        <li class="fontlarge bs" @click="Danmu">
        <span>弹幕互动</span>
        <i
          class="iconfont icondanmu eicotrigger bigfont fr"
          style="color:#F04545"
        ></i>
      </li>
    </ul>
  </div>
</template>
<script>
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import TeacherSignInfo from "./sign/teacherSignInfo";

import nativecode from "../../nativecode";

export default {
  name: "",
  props: {
    bankeid: {
      default: 0
    },
     bnakeuserid: {
      default: 0
    },
    eventmsgs: {
      default() {
        return {};
      }
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
      return this.$store.getters.caneditbanke;
    },
      haswifiroom(){
          return nativecode.haswifiroom();
      },
      hassign(){
        return nativecode.hassign();
      },
    haswxsign() {
      if (nativecode.platform == "miniprogram") {
        return true;
      }
      return false;
    }
    ,showstuc(){
        if (nativecode.platform == 'exsoftdaping'){
            return false;
        }
        return true;
      }
      ,showpingce(){
        if (!this.isTeacher){
            return this.showstuc;
        }
        return false;
      }
  },
  created() {
  },
  methods: {
    //签到
    onwxsign() {
      if(this.haswxsign){
          let curbanke = this.$store.state.curbanke;
        nativecode.navigateToSign(this.bankeid,this.isTeacher, curbanke);
      }else{
        // this.teacherFn();
          Toast('请在小程序中查看签到');
      }
    },
    teacherFn() {
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "Sign",
        params: { bankeid: this.bankeid }
      });
    },
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
      gotowifiroom(){
          let curbanke = this.$store.state.curbanke;
          let argobj={
              page:'wifiroom',
              bankeid:this.bankeid,
              bankename:curbanke.name,
              isTeacher:this.isTeacher
          }
          nativecode.ncall('toNativePage', argobj);
      },
     //弹幕
    Danmu() {
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "Danmu",
        params: { bankeid: this.bankeid,userid:this.bnakeuserid }
      });
    },
    //板书
    Banshu() {
      this.$store.commit("setRouterForward", true);
      this.$router.push({
        name: "Banshu",
        params: { bankeid: this.bankeid }
      });
      //! cjy: 板书手动删除
      this.$http
        .post("/api/eventmsgs/clear", {
          eventtype: 100,
          bankeid: this.bankeid
        })
        .then(res => {})
        .catch(res => {});
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
    height:80vh;
    min-height:80vh;
    padding-bottom: 30px;
    overflow: scroll;
    li {
      position: relative;
      height: 80px;
      background: #fff;
      padding: 20px;
      margin-bottom: 10px;
      line-height: 40px;
      border-radius: 10px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.07);
      i {
        position: absolute;
        right: 15px;
      }
      &.dp {
        i {
          font-size: 39px;
        }
      }
      &.bs {
        i {
          font-size: 50px;
        }
      }
    }
  }
}
</style>
