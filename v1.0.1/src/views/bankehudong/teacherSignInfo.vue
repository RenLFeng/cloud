<template>
  <div class="teacher-sign-main">
    <div v-if="isTeacher">
      <div class="icon-tit tc" @click="teacherSignClass()">
        <i class="iconfont iconqiandao2" :class="signStateIconColor"></i>
        <p class="fontsmall" :class="signStateTextColor">{{signStateText}}</p>
      </div>
      <p style="padding:5px;margin:5px;" class>签到历史记录，左滑可删除。</p>
      <List
        @showStudentSignInfo="onShowStudentSignInfo"
        v-for="(v,index) in teacherSignHistory"
        :key="index"
        :item="v"
      />
    </div>
    <!-- 学生 -->
    <div v-else>
      <div class="sign-main">
        <div class="no-class">
          <i class="iconfont iconjihuaweikaiqi"></i>
          <span>教师未开启签到</span>
        </div>
      </div>
      <mt-button class="button-auto-96 btn">签到历史记录</mt-button>
    </div>

    <mt-popup
      v-model="popupStudentSignInfo"
      position="right"
      class="mint-popup"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header title="签到中">
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <studentSignInfo :Data="StudentSignData" />
    </mt-popup>
  </div>
</template>

<script>
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import { ActionSheet } from "vant";
import List from "../../common/list";
import studentSignInfo from "./studentSignInfo";
export default {
  name: "",
  props: {
    bankeid: {
      default: 0
    }
  },
  components: {
    List,
    studentSignInfo
  },
  data() {
    return {
      signState: "",
      signStateIconColor: "colory",
      signStateTextColor: "",
      signAllData: {},
      signData: {},

      teacherSignHistory: [],

      popupStudentSignInfo: false,
      StudentSignData: {}
    };
  },
  computed: {
    signStateText() {
      if (this.signState == "0") {
        this.signStateIconColor = "colord";
        this.signStateTextColor = "colord";
        return "正在签到...";
      } else if (this.signState == "1") {
        this.signStateIconColor = "colory";
        this.signStateTextColor = "";
        return "开始签到...";
      } else {
        return "开始签到";
        this.signStateIconColor = "colory";
        this.signStateTextColor = "";
      }
    },
    isTeacher() {
      return this.$store.getters.isteacher;
    }
  },
  mounted() {
    this.signquery();
    this.signquerymember();
  },
  methods: {
    //查询老师当前签到状态
    signquery() {
      Indicator.open(this.$t("Indicator.Loading"));
      let url, data;
      if (this.isTeacher) {
        url = "/api/sign/signquery"; //老师
      } else {
        url = "/api/sign/signqueryself"; //学生
      }
      this.$http
        .post(url, { bankeid: this.bankeid })
        .then(res => {
          if (res.data.code == 0) {
            console.log(res);
            this.signAllData = res.data.data;
            if (res.data.data) {
              this.signData = res.data.data.sign;
              this.signState = this.signData.state;
            }
          } else {
          }
          Indicator.close();
        })
        .catch(() => {
          Indicator.close();
        });
    },
    //教师上课  OR 教师下课
    teacherSignClass() {
      let url = "";
      let obj = {};
      let stateText = "";
      if (this.signState != "0") {
        url = "/api/sign/signadd";
        obj = {
          bankeid: this.bankeid
        };
        stateText = this.$t("confirm.BeginsClass");
      } else if (this.signState == "0") {
        url = "/api/sign/signupdate";
        obj = {
          id: this.signData.id,
          state: 1
        };
        stateText = this.$t("confirm.ClassOver");
      }
      MessageBox.confirm("", {
        title: this.$t("confirm.Tips"),
        message: `${stateText}`,
        confirmButtonText: this.$t("confirm.Ok"),
        cancelButtonText: this.$t("confirm.Cancel"),
        showCancelButton: true
      }).then(res => {
        Indicator.open(this.$t("Indicator.Loading"));
        this.$http
          .post(url, obj)
          .then(res => {
            if (res.data.code == 0) {
              console.log("教师打卡,", res);
              if (this.signState == "0") {
                //下课
                this.signState = res.data.data.state;
              } else {
                //重新上课
                this.signState = 0;
              }
              this.signData.state = this.signState;
            } else {
            }
            Indicator.close();
          })
          .catch(() => {
            Indicator.close();
          });
      });
    },
    //教师打卡历史
    signquerymember() {
      Indicator.open(this.$t("Indicator.Loading"));
      this.$http
        .post("/api/sign/signqueryhistory", {
          bankeid: this.bankeid,
          pagesize: 10,
          page: 0,
          order: "desc"
        })
        .then(res => {
          if (res.data.code == 0) {
            console.log("教师打卡历史", res);
            if (res.data.data.count) {
              this.teacherSignHistory = res.data.data.data;
              for (let v of this.teacherSignHistory) {
                let splitTime = v.starttime.split(" ");
                v.date = splitTime[0];
                v.time = splitTime[1];
              }
            }
          } else {
          }
          // this.popuQuerymember = true;
          Indicator.close();
        })
        .catch(() => {
          // this.popuQuerymember = true;
          Indicator.close();
        });
    },
    goBacks() {
      if (this.popupStudentSignInfo) {
        this.popupStudentSignInfo = false;
      }
    },
    onShowStudentSignInfo(v) {
      this.StudentSignData = v;
      this.popupStudentSignInfo = true;
    }
  }
};
</script>

<style lang='less'>
.teacher-sign-main {
  .icon-tit {
    background: #fff;
    padding: 15px 0;
    i {
      font-size: 50px;
    }
    p {
      margin-top: 10px;
    }
  }
  .sign-main {
    position: fixed;
    width: 100%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
        text-align: center;
    .no-class {
      position: relative;
      i {
        font-size: 50px;
      }
      span {
        // position: absolute;
        // left: 50%;
        // top: 50%;
        // transform: translate(-50%, -50%);
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translate(-50%, 0);
    background: none;
    border: 1px solid #0089ff;
    border-radius: 20px;
  }
}
</style>
