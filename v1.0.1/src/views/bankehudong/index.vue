<template>
  <div class="hu-dong-container">
    <ul class="list-main">
      <li class="fontlarge" @click="teacherFn()">
        <span>上课签到</span>
        <i
          class="iconfont iconqiandao2 eicotrigger bigfont fr"
          :class="eventmsgs.hdTips.sign?'reddot-Tips2':''"
          style="color:#E46100"
        ></i>
      </li>
      <li class="fontlarge" @click="gopingce" v-if="!isTeacher">
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
      <li class="fontlarge dp" @click="BigLogin" v-if="isTeacher">
        <span>大屏登录</span>
        <i
          class="iconfont icondapingmu eicotrigger bigfont fr"
          :class="eventmsgs.hdTips.bigLogin?'reddot-Tips':''"
          style="color:#0055FF"
        ></i>
      </li>
      <li class="fontlarge bs" @click="Banshu">
        <span>课堂板书</span>
        <i
          class="iconfont iconwritin-blackboard eicotrigger bigfont fr"
          :class="eventmsgs.hdTips.banshu?'reddot-Tips':''"
          style="color:#38AD5A"
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
    haswxsign() {
      if (nativecode.platform == "miniprogram") {
        return true;
      }
      return false;
    }
  },
  created() {
    console.log("ffsd", this.eventmsgs);
    // alert(0)
    // this.eventmsgsOnbanke();
  },
  methods: {
    //老师签到
    onwxsign() {
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
      //! cjy: 板书手动删除
        this.$http
            .post("/api/eventmsgs/clear", {
                eventtype: 100,
                bankeid: this.bankeid
            })
            .then(res =>{

            }).catch(res=>{

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
