<template>
  <div class="hu-dong-container">
    <div class="el-worp">
      <div v-if="isTeacher" class="classState button-worp">
        <mt-button @click="signClass()" class type="primary">{{classState}}</mt-button>
      </div>

      <div v-else class="classState button-worp">
        <mt-button v-if="signqueryStudentData.state=='0'" class type="primary" @click="signdo">点击签到</mt-button>
        <mt-button v-else :plain="true" :disabled="true" class type="primary">{{studentClassState}}</mt-button>
      </div>
      <p>
        <mt-cell :title="pointOut"></mt-cell>
      </p>

      <div v-if="isTeacher">
        <p v-if="signClassState=='0'">
          <mt-cell :title="`上课时间:${sign.starttime}`" value></mt-cell>
        </p>
        <p v-if="signClassState=='1'">
          <mt-cell :title="`下课时间:${sign.endtime}`" value></mt-cell>
        </p>
      </div>
      <p v-if="signClassState =='2' && !isTeacher">
        <mt-cell :title="`签到时间:${signqueryStudentData.signtime}`" value></mt-cell>
      </p>

      <p class="button-worp" v-if="signClassState=='0' || signClassState=='2'">
        <mt-button class type="default" size="small" @click="signquerymember()">查看所有上课记录</mt-button>
      </p>
    </div>

    <mt-popup v-model="popuQuerymember" position="right" class="mint-popup" :modal="false">
      <mt-header title="所有上课记录">
        <mt-button icon="back" slot="left" @click="goBacks">返回</mt-button>
      </mt-header>
      <div v-for="(item,index) in signqueryhistoryData" :key="index">
        <allSignInfo @signquerymemberFn="onSignquerymemberFn" :item="item" :role="isTeacher" />
      </div>
    </mt-popup>
    <mt-popup v-model="popuSignquerymember" position="right" class="mint-popup" :modal="false">
      <mt-header title="所有学生上课记录">
        <mt-button icon="back" slot="left" @click="goBacks">返回</mt-button>
      </mt-header>
      <allSignStudent :item="studentSignInfo" :role="isTeacher" />
    </mt-popup>
  </div>
</template>

<script>
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import allSignInfo from "./allSignInfo";
import allSignStudent from "./allSignrymember";
export default {
  name: "",
  props: {
    bankeid: {
      default: 0
    }
  },
  components: {
    allSignInfo,
    allSignStudent
  },
  data() {
    return {
      signClassState: "",
      signqueryData: {},
      signqueryStudentData: {
        state: "",
        signtime: ""
      },
      sign: {},
      popuQuerymember: false,
      popuSignquerymember: false,
      page: 0,
      signqueryhistoryData: [],
      studentSignInfo: []
    };
  },
  computed: {
    classState() {
      if (Object.keys(this.sign).length) {
        return !this.sign.state ? "下课" : "已下课";
      } else {
        return "上课";
      }
    },
    pointOut() {
      switch (this.signClassState) {
        case "":
          return "当前未开课";
        case 0:
        case 2:
          return "当前已开课";
        case 1:
          return "当前已下课";
      }
    },
    studentClassState() {
      if (this.signqueryStudentData.state) {
        if (this.signqueryStudentData.state == "2") {
          return "已签到";
        }
      } else {
        return "当前无课";
      }
    },
    isTeacher() {
      return this.$store.getters.isteacher;
    }
  },
  created() {
    this.signquery();
  },
  methods: {
    //教师打卡查询   OR  学生签到查询
    signquery() {
      let url, data;
      if (this.isTeacher) {
        url = "/api/sign/signquery";
        data = { bankeid: this.bankeid };
      } else {
        url = "/api/sign/signqueryself";
        data = { bankeid: this.bankeid };
      }
      this.$http
        .post(url, data)
        .then(res => {
          if (res.data.code == 0) {
            console.log(res);
            if (res.data.data) {
              if (this.isTeacher) {
                this.signqueryData = res.data.data;
                this.sign = this.signqueryData.sign;
                this.signClassState = this.sign.state;
                console.log("教师打卡查询", this.signqueryData);
              } else {
                if (res.data.data.length) {
                  this.signqueryStudentData = res.data.data[0];
                  this.signClassState = this.signqueryStudentData.state;
                }
              }
            }
          } else {
          }
        })
        .catch(() => {});
    },
    //教师打卡历史
    signquerymember() {
      this.popuQuerymember = true;
      Indicator.open();
      this.$http
        .post("api/sign/signqueryhistory", {
          bankeid: this.bankeid,
          pagesize: 10,
          page: 0,
          order: "desc"
        })
        .then(res => {
          if (res.data.code == 0) {
            console.log(res);
            if (res.data.data.count) {
              this.signqueryhistoryData = res.data.data.data;
            }
          } else {
          }
          Indicator.close();
        })
        .catch(() => {
          Indicator.close();
        });
    },
    //学生打卡记录
    onSignquerymemberFn(data) {
      this.popuSignquerymember = true;
      Indicator.open();
      this.$http
        .post("api/sign/signquerymember", {
          id: data.id
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data && res.data.data.signmembers.length) {
              let Data = res.data.data;
              for (let item of Data.signmembers) {
                for (let v of Data.users) {
                  if (item.userid == v.id) {
                    item.studentName = v.name;
                  }
                }
              }
              this.studentSignInfo = Data.signmembers;
              console.log("学生打卡记录", this.studentSignInfo);
            }
          } else {
          }
          Indicator.close();
        })
        .catch(() => {
          Indicator.close();
        });
    },
    goBacks() {
      if (this.popuQuerymember && !this.popuSignquerymember) {
        this.popuQuerymember = false;
      }
      if (this.popuSignquerymember) {
        this.popuSignquerymember = false;
      }
    },
    //教师上课  OR 教师下课
    signClass() {
      let url = "";
      let obj = {};
      let stateText = "";
      if (this.signClassState == "" && this.signClassState != "0") {
        url = "/api/sign/signadd";
        obj = {
          bankeid: this.bankeid
        };
        stateText = "上课";
      } else if (this.signClassState == "0") {
        url = "api/sign/signupdate";
        obj = {
          id: this.sign.id,
          state: 1
        };
        stateText = "下课";
      } else if (this.signClassState == "1") {
        MessageBox.alert(`当前已下课`);
        return;
      }
      MessageBox.confirm(`您确认要${stateText}吗`).then(res => {
        Indicator.open();
        this.$http
          .post(url, obj)
          .then(res => {
            if (res.data.code == 0) {
              console.log("教师打卡,", res);
              if (this.signClassState == "" && this.signClassState != "0") {
                this.signqueryData = res.data.data;
                this.sign = this.signqueryData.sign;
                this.signClassState = this.sign.state;
              } else if (this.signClassState == "0") {
                this.signqueryData = res.data.data;
                this.sign = this.signqueryData;
                this.signClassState = this.sign.state;
              }
            } else {
            }
            Indicator.close();
          })
          .catch(() => {
            Indicator.close();
          });
      });
    },
    //学生签到
    signdo() {
      MessageBox.confirm(`您确定要签到吗`).then(res => {
        this.$http
          .post("api/sign/signdo", { signid: this.signqueryStudentData.signid })
          .then(res => {
            if (res.data.code == 0) {
              console.log(res);
              this.signqueryStudentData = res.data.data;
              this.signClassState = this.signqueryStudentData.state;
            } else {
            }
            Indicator.close();
          })
          .catch(() => {
            Indicator.close();
          });
      });
    }
  }
};
</script>

<style lang='less'>
.hu-dong-container {
  .mint-cell:last-child {
    text-align: center;
  }
  .mint-cell:first-child .mint-cell-wrapper {
    background-image: none;
  }
  padding: 10px;
  .classState {
    margin-bottom: 10px;
    button {
      width: 50%;
      height: 50px;
    }
  }
}
</style>
