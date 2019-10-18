<template>
  <div class="hu-dong-container" v-if="isOpen">
    <mt-loadmore :top-method="loadTop" ref="loadmore" :auto-fill="autofill">
      <div class="el-worp">
        <div v-if="isTeacher" class="classState button-worp">
          <mt-button @click="signClass()" class type="primary">{{classState}}</mt-button>
        </div>

        <div v-else class="classState button-worp">
          <mt-button
            v-if="signqueryStudentData.state=='0'"
            class
            type="primary"
            @click="signdo"
          >{{$t('common.Click')+' '+$t('common.Sign')}}</mt-button>
          <mt-button
            v-else
            :plain="true"
            :disabled="true"
            class
            type="primary"
          >{{studentClassState}}</mt-button>
        </div>
        <p v-if="isTeacher">
          <mt-cell :title="pointOut"></mt-cell>
        </p>
        <p v-else>
          <mt-cell :title="pointOutStudent"></mt-cell>
        </p>

        <div v-if="isTeacher">
          <p v-if="signClassState=='0'">
            <mt-cell :title="`${$t('bankehHudong.Start_class_time')+':'+sign.starttime}`" value></mt-cell>
          </p>
          <p v-if="signClassState=='1'">
            <mt-cell :title="`${$t('bankehHudong.End_class_time')+':'+sign.endtime}`" value></mt-cell>
          </p>
        </div>
        <p v-if="signClassState =='1' && !isTeacher">
          <mt-cell
            :title="`${$t('bankehHudong.Sign_time')+':'+signqueryStudentData.signtime}`"
            value
          ></mt-cell>
        </p>

        <p class="button-worp">
          <mt-button
            class
            type="default"
            size="small"
            @click="signquerymember()"
          >{{$t('bankehHudong.see_all_class_history')}}</mt-button>
        </p>
      </div>
    </mt-loadmore>

    <mt-popup v-model="popuQuerymember" position="right" class="mint-popup" :modal="false">
      <mt-header :title="$t('bankehHudong.All_class_records')">
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <div v-if="signqueryhistoryData.length">
        <div v-for="(item,index) in signqueryhistoryData" :key="index">
          <allSignInfo @signquerymemberFn="onSignquerymemberFn" :item="item" :role="isTeacher" />
        </div>
      </div>
      <p v-else class="text-center">{{$t('bankehHudong.No_class_record')}}</p>
    </mt-popup>
    <mt-popup v-model="popuSignquerymember" position="right" class="mint-popup" :modal="false">
      <mt-header :title="$t('bankehHudong.All_students_records')">
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
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
      studentSignInfo: [],
      autofill: true,
      isOpen: false
    };
  },
  computed: {
    classState() {
      if (Object.keys(this.sign).length) {
        return !this.sign.state
          ? this.$t("bankehHudong.ClassOver")
          : this.$t("bankehHudong.ClassOverEd");
      } else {
        return this.$t("bankehHudong.BeginsClass");
      }
    },
    pointOut() {
      switch (this.signClassState) {
        case "":
          return this.$t("bankehHudong.BeginsClass");
        case 0:
          return this.$t("bankehHudong.Currently_started");
        case 1:
          return this.$t("bankehHudong.Class_is_now_over");
      }
    },
    pointOutStudent() {
      switch (this.signClassState) {
        case "":
          return this.$t("bankehHudong.No_classes_currently_open");
        case 0:
          return this.$t("bankehHudong.Currently_started");
        case 1:
          return this.$t("bankehHudong.SignSuccessfully");
        case 2:
          return this.$t("bankehHudong.LateInfo");
        case 3:
          return this.$t("bankehHudong.SignTimeOver");
      }
    },
    studentClassState() {
      switch (this.signClassState) {
        case "":
          return this.$t("bankehHudong.No_classes_at_present");
        case 1:
          return this.$t("bankehHudong.CheckIn");
        case 2:
          return this.$t("bankehHudong.Late");
        case 3:
          return this.$t("bankehHudong.Overtime");
      }
    },
    isTeacher() {
      return this.$store.getters.isteacher;
    }
  },
  created() {
    this.signquery();
    // alert()
  },
  methods: {
    loadTop() {
      this.signquery();
    },
    signquery() {
      Indicator.open(this.$t("Indicator.Loading"));
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
                if (res.data.data && res.data.data.signdata.length) {
                  this.signqueryStudentData = res.data.data.signdata[0];
                  this.signClassState = this.signqueryStudentData.state;
                } else {
                  this.signqueryStudentData = {};
                  this.signClassState = "";
                }
              }
            }
          } else {
          }
          this.isOpen = true;
          this.$refs.loadmore.onTopLoaded();
          Indicator.close();
        })
        .catch(() => {
          this.isOpen = true;
          this.$refs.loadmore.onTopLoaded();
          Indicator.close();
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
            console.log(res);
            if (res.data.data.count) {
              this.signqueryhistoryData = res.data.data.data;
            }
          } else {
          }
          this.popuQuerymember = true;
          Indicator.close();
        })
        .catch(() => {
          this.popuQuerymember = true;
          Indicator.close();
        });
    },
    //学生打卡记录
    onSignquerymemberFn(data) {
      Indicator.open(this.$t("Indicator.Loading"));
      this.$http
        .post("/api/sign/signquerymember", {
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
          this.popuSignquerymember = true;
          Indicator.close();
        })
        .catch(() => {
          this.popuSignquerymember = true;
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
        stateText = this.$t("confirm.BeginsClass");
      } else if (this.signClassState == "0") {
        url = "/api/sign/signupdate";
        obj = {
          id: this.sign.id,
          state: 1
        };
        stateText = this.$t("confirm.ClassOver");
      } else if (this.signClassState == "1") {
        // MessageBox.alert(`当前已下课`);
        // return;
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
              if (this.signClassState == "" && this.signClassState != "0") {
                this.signqueryData = res.data.data;
                this.sign = this.signqueryData.sign;
                this.signClassState = this.sign.state;
              } else if (this.signClassState == "0") {
                this.signqueryData = {};
                this.sign = {};
                this.signClassState = "";
                // this.signqueryData = res.data.data;
                // this.sign = this.signqueryData;
                // this.signClassState = this.sign.state;
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
      MessageBox.confirm("", {
        title: this.$t("confirm.Tips"),
        message: this.$t('confirm.SignOver'),
        confirmButtonText: this.$t("confirm.Ok"),
        cancelButtonText: this.$t("confirm.Cancel"),
        showCancelButton: true
      }).then(res => {
        this.$http
          .post("/api/sign/signdo", {
            signid: this.signqueryStudentData.signid
          })
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
