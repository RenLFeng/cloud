<template>
  <div class="hu-dong-container">
    <ul class="list-main">
      <li class="fontlarge" @click="teacherFn()">
        <span>上课签到</span>
        <i class="iconfont iconqiandao2 eicotrigger fr" style="color:#E46100"></i>
      </li>
      <li class="fontlarge">
        <span>评测记录</span>
        <i class="iconfont icontongji eicotrigger fr" style="color:#38ADA9"></i>
      </li>
      <li class="fontlarge">
        <span>大屏登录</span>
        <i class="iconfont icondapingmu eicotrigger fr" style="color:#0055FF"></i>
      </li>
    </ul>
    <mt-popup
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
    </mt-popup>
  </div>
</template>
<script>
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import allSignInfo from "./allSignInfo";
import allSignStudent from "./allSignrymember";
import TeacherSignInfo from "./teacherSignInfo";
export default {
  name: "",
  props: {
    bankeid: {
      default: 0
    }
  },
  components: {
    allSignInfo,
    allSignStudent,
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
    }
  },
  created() {
    // this.signquery();
  },
  methods: {
    //老师签到
    teacherFn() {
      this.popupTeacherSignInfo = true;
      this.$store.commit("SET_FOOTER_BAR_STATE", false);
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
