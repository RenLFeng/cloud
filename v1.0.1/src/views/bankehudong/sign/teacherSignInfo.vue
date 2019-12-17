<template>
  <div class="teacher-sign-main">
    <mt-header title="上课签到">
      <mt-button icon="back" slot="left" @click="Back">{{$t('common.Back')}}</mt-button>
      <mt-button slot="right">签到设置</mt-button>
    </mt-header>
    <div v-if="isTeacher || global">
      <div class="icon-tit tc" @click="teacherSignClass()">
        <i class="iconfont iconqiandao2" :class="signStateIconColor"></i>
        <p class="fontsmall" :class="signStateTextColor">{{signStateText}}</p>
      </div>
      <div v-if="teacherSignHistory.length">
        <p style="padding:5px;margin:5px;" class>签到历史记录</p>
        <List
          @showStudentSignInfo="onShowStudentSignInfo"
          v-for="(v,index) in teacherSignHistory"
          :key="index"
          :item="v"
          :classSignId="classSignId"
        />
      </div>
      <Empty v-else />
    </div>
    <!-- 学生 -->
    <mt-loadmore :top-method="loadTop" ref="loadmore" :auto-fill="autofill">
      <div v-if="!isTeacher && !global" class="student-main">
        <div class="sign-main">
          <div class="btn-item sign-in" v-if="studentSignClassInfo && this.studentSignState == '0'">
            <div class="content-warp" @click="signdo()">
              <span>{{studentSignStateText}}</span>
              <span class="fontsmall">{{studentSignClassInfo.starttime}}</span>
            </div>
          </div>
          <div
            class="btn-item sign-end"
            v-else-if="studentSignClassInfo && this.studentSignState == '1'"
          >
            <i class="iconfont iconok- colord"></i>
            <div>
              <span>{{studentSignStateText}}</span>
              <span class="fontsmall">{{studentSignClassInfo.starttime}}</span>
            </div>
          </div>
          <div class="no-class btn-item" v-else>
            <i class="iconfont iconjihuaweikaiqi"></i>
            <span>{{studentSignStateText}}</span>
          </div>
        </div>

        <mt-button class="button-auto-96 btn" @click="studentSee">签到历史记录</mt-button>
      </div>
    </mt-loadmore>
    <mt-popup
      v-model="popupStudentSignInfo"
      position="right"
      class="mint-popup"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header :title="studentSignHaderText">
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <studentSignInfo
        :Data="classSignItem"
        :bankeid="bankeid"
        :signData="signData"
        @calssStatefn="oncalssStatefn"
        :SginState="SginState"
      />
    </mt-popup>
  </div>
</template>

<script>
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import { ActionSheet } from "vant";
import List from "@/common/list";
import studentSignInfo from "./studentSignInfo";
import Empty from "@/common/empty";
export default {
  name: "",
  props: {},
  components: {
    List,
    studentSignInfo,
    Empty
  },
  data() {
    return {
      bankeid: 0,
      global: false,
      classSignId: 0,
      signState: "",
      signStateIconColor: "colory",
      signStateTextColor: "",
      signAllData: {},
      signData: {},

      teacherSignHistory: [],

      popupStudentSignInfo: false,
      classSignItem: {},

      studentSignClassInfo: {},
      studentSignState: "",

      autofill: true
    };
  },
  computed: {
    SginState() {
      if (this.classSignItem.id == this.classSignId) {
        return true;
      } else {
        return false;
      }
    },
    studentSignHaderText() {
      if (this.classSignItem.id == this.classSignId) {
        return "签到中...";
      } else {
        return "签到结果";
      }
    },
    signStateText() {
      if (this.signState == "0" || this.studentSignState == "1") {
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
    studentSignStateText() {
      if (this.studentSignClassInfo && this.studentSignState == "0") {
        return "点击签到 ";
      } else if (this.studentSignClassInfo && this.studentSignState == "1") {
        return "已签到";
      } else {
        return "教师未开启签到";
      }
    },
    isTeacher() {
      return this.$store.getters.caneditbanke;
    }
  },
  mounted() {
    let params = this.$route.params;
    if (params.bankeid) {
      this.bankeid = params.bankeid;
    }
    this.signquery();
    this.signquerymember();
  },
  methods: {
    loadTop() {
      this.signquery();
    },
    oncalssStatefn(v) {
      this.signState = v;
      this.classSignId = 0;
    },
    studentSee() {
      this.global = true;
      // this.$emit("global", true);
    },
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
            console.log("resresres", res);
            if (this.isTeacher) {
              this.signAllData = res.data.data;
              if (res.data.data) {
                this.signData = res.data.data.sign;
                this.signState = this.signData.state;
                this.classSignId = this.signData.id;
              }
            } else {
              if (res.data.data && res.data.data.signinfo.length) {
                this.studentSignClassInfo = res.data.data.signinfo[0];
                this.studentSignClassInfo.starttime = res.data.data.signdata.starttime.split(
                  " "
                )[1];
                this.studentSignState = this.studentSignClassInfo.state;
                console.log("lkns", this.studentSignClassInfo);
                this.classSignId = this.studentSignClassInfo.signid;
              } else {
                Toast('暂无签到')
                this.studentSignClassInfo = {};
                this.studentSignState = "";
              }

              // alert(this.studentSignState)
            }
          } else {
             Toast('出错了')
          }
          this.$refs.loadmore.onTopLoaded();
          Indicator.close();
        })
        .catch(() => {
          
          Indicator.close();
        });
    },
    //教师上课
    teacherSignClass() {
      if (this.signState == "0" || !this.isTeacher) return;
      let url = "";
      let obj = {};
      let stateText = "";
      url = "/api/sign/signadd";
      obj = {
        bankeid: this.bankeid
      };
      stateText = this.$t("confirm.BeginsClass");
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
              console.log("教师打卡上课,", res);
              // this.signState = res.data.data.sign.state;
              this.signState = 0;
              let signData = res.data.data.sign;
              this.signData = signData;
              let splitTime = signData.starttime.split(" ");
              signData.date = splitTime[0];
              signData.time = splitTime[1];
              this.classSignId = signData.id;
              this.teacherSignHistory.unshift(signData);
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
    //学生签到
    signdo() {
      MessageBox.confirm("", {
        title: this.$t("confirm.Tips"),
        message: this.$t("confirm.SignOver"),
        confirmButtonText: this.$t("confirm.Ok"),
        cancelButtonText: this.$t("confirm.Cancel"),
        showCancelButton: true
      }).then(res => {
        this.$http
          .post("/api/sign/signdo", {
            signid: this.studentSignClassInfo.signid
          })
          .then(res => {
            if (res.data.code == 0) {
              console.log(res);
              this.studentSignClassInfo = res.data.data;
              this.studentSignState = this.studentSignClassInfo.state;
            } else {
            }
            Indicator.close();
          })
          .catch(() => {
            Indicator.close();
          });
      });
    },
    goBacks() {
      if (this.popupStudentSignInfo) {
        this.popupStudentSignInfo = false;
      }
    },
    Back() {
      this.$router.go(-1);
    },
    onShowStudentSignInfo(v) {
      this.classSignItem = v;
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
    .sign-in {
      position: relative;
      width: 247px;
      height: 247px;
      margin: 0 auto;
      background: linear-gradient(
        180deg,
        rgba(153, 205, 250, 1) 0%,
        rgba(0, 130, 241, 1) 100%
      );
      box-shadow: 0px 6px 6px rgba(0, 137, 255, 0.36);
      border-radius: 50%;
      opacity: 1;
      color: #fff;
      // line-height: 247px;
      span {
        display: block;
        &:nth-child(1) {
          font-size: 30px;
          margin-bottom: 10px;
        }
        &:nth-child(2) {
        }
      }
    }
    .sign-end {
      height: 54px;
      i {
        position: absolute;
        width: 50%;
        left: 0;
        text-align: right;
        padding-right: 20px;
      }

      div {
        position: absolute;
        width: 50%;
        text-align: left;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        span {
          display: block;
        }
      }
    }
    .no-class {
      height: 54px;
      i {
        position: absolute;
        width: 50%;
        left: 0;
        text-align: right;
        padding-right: 20px;
      }
      span {
        position: absolute;
        width: 50%;
        text-align: left;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
    .no-class,
    .btn-item {
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
  .student-main {
    height: 90vh;
    min-height: 90vh;
  }
}
</style>
