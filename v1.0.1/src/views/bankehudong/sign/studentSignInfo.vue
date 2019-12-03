<template>
  <div class="student-sign-info-list">
    <div class="tit">
      <p>签到开始时间:&nbsp;{{startTime}}&nbsp;{{Data.time}}</p>
      <p class="clearfix">
        <span class="colord fl" @click="confign()" v-if="isTeacher">一键设置签到</span>
        <span class="colord fr" @click="More()">{{seeText}}</span>
      </p>
    </div>
    <p class="tr" style="padding:5px">{{list.length}}人</p>
    <StudentSignInfoList
      :memberuser="v"
      scoreText="签到"
      v-for="(v,index) in list"
      :key="index"
      :sign="1"
      @click.native="setSignState(v)"
    />
    <div class="footer" v-if="isTeacher">
      <p class="fontlarge tc top" style="border-bottom:1px solid #f0f0f0">
        <a class="colord">{{signNumber.sign}}&nbsp;</a>
        /&nbsp;{{signNumber.nosign}}
      </p>
      <p class="clearfix tc fontsmall">
        <span class="fl" style="border-right:1px solid #f0f0f0">放弃</span>
        <span class="fr" @click="teacherSignClass()">结束</span>
      </p>
    </div>
    <van-action-sheet
      :style="styleobj"
      v-model="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      @cancel="onCancel"
      @select="onSelect"
      class="ActionSheet"
      :close-on-click-overlay="false"
    />
  </div>
</template>

<script>
import { ActionSheet } from "vant";
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import StudentSignInfoList from "../../components/BankeMemberSimple";
import { Whatweek, formateTime } from "@/util";
const setALL = [
  { name: "设为已签到", id: 1 },
  { name: "设为迟到", id: 2 },
  { name: "设为超时", id: 3 },
  { name: "设为未签到", id: 0 }
];
const More = [
  { name: "查看全部", id: 100 },
  { name: "查看未签到", id: 0 },
  { name: "查看超时", id: 3 },
  { name: "查看迟到", id: 2 },
  { name: "查看已签到", id: 1 }
];
export default {
  name: "",
  props: {
    signData: {
      default() {
        return {};
      }
    },
    Data: {
      default() {
        return {};
      }
    },
    bankeid: {
      default: 0
    }
  },
  watch: {
    Data: function(newValue, oldValue) {
      this.onSignquerymemberFn(newValue);
    }
  },
  components: {
    StudentSignInfoList,
    [ActionSheet.name]: ActionSheet
  },
  data() {
    return {
      allList: [],
      list: [],
      showActionSheet: false,
      actions: [],
      styleobj: {},

      studentInfo: {},

      isSign: true,
      isStudent: true,

      signNumber: {
        sign: 0,
        nosign: 0
      },
      seeText:'查看全部',
    };
  },
  computed: {
    isTeacher() {
      return this.$store.getters.isteacher;
    },
    startTime() {
      return formateTime(this.Data.date, "2");
    }
  },
  mounted() {},
  methods: {
    //学生打卡记录
    onSignquerymemberFn(item) {
      //   Indicator.open(this.$t("Indicator.Loading"));
      this.$http
        .post("/api/sign/signquerymember", {
          id: item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data && res.data.data.signmembers.length) {
              let Data = res.data.data;
              for (let item of Data.signmembers) {
                for (let v of Data.users) {
                  if (item.userid == v.id) {
                    item.name = v.name;
                    item.avatar = v.avatar;
                  }
                }
              }
              this.allList = Data.signmembers;
              this.list = Data.signmembers;
              this.countSign(this.list);
              console.log("学生打卡记录", this.list);
            }
          } else {
          }
          //   Indicator.close();
        })
        .catch(() => {
          //   Indicator.close();
        });
    },
    countSign(data) {
      this.signNumber.sign = 0;
      this.signNumber.nosign = 0;
      for (let v of data) {
        if (v.state != "0") {
          this.signNumber.sign++;
        } else {
          this.signNumber.nosign++;
        }
      }
    },
    //教师下课
    teacherSignClass() {
      let url = "";
      let obj = {};
      let stateText = "";
      url = "/api/sign/signupdate";
      obj = {
        id: this.signData.id,
        state: 1
      };
      stateText = this.$t("confirm.ClassOver");
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
              console.log("教师下课,", res);
              this.$emit("calssStatefn", res.data.data.state);
            } else {
            }
            Indicator.close();
          })
          .catch(() => {
            Indicator.close();
          });
      });
    },
    //一键设置
    confign() {
      this.isStudent = false;
      this.actions = setALL;
      this.styleFn();
    },
    //查看类型
    More() {
      this.isSign = false;
      this.actions = More;
      this.styleFn();
    },
    //签到状态下拉选项
    onSelect(item) {
      //设置签到状态
      if (this.isSign) {
        if (this.isStudent) {
          this.studentChangestate(item.id);
        } else {
          this.setAllSignState(item.id);
        }
      } else {
        //查看签到类型
        this.seeSginType(item.id);
        this.seeText=item.name
        let list = [];
        switch (item.id) {
          case 0:
            break;
        }
        for (let v of this.list) {
        }
        this.isSign = true;
      }
      this.showActionSheet = false;
    },
    // van-action 取消btn
    onCancel() {
      this.isSign = true;
      this.isStudent = true;
      this.showActionSheet = false;
    },
    //更改单个学生签到状态
    setSignState(v) {
      if (!this.isTeacher) return;
      this.studentInfo = v;
      this.actions = setALL;
      this.styleFn();
    },
    studentChangestate(state) {
      this.$http
        .post("/api/sign/changestate", {
          userid: this.studentInfo.userid,
          signid: this.studentInfo.signid,
          state: state
        })
        .then(res => {
          console.log("ds", res);
          if (res.data.code == "0") {
            this.studentInfo.state = state;
            this.countSign(this.allList);
          }
        })
        .catch(err => {});
    },
    //批量修改签到状态
    setAllSignState(state) {
      this.$http
        .post("/api/sign/batchstate", {
          signid: this.Data.id,
          state: state
        })
        .then(res => {
          console.log("ds", res);
          if (res.data.code == "0") {
            for (let v of this.list) {
              v.state = state;
            }
            this.countSign(this.allList);
            this.isStudent = true;
          }
        })
        .catch(err => {});
    },
    //查看签到类型
    seeSginType(state) {
      let list = [];
      list = this.allList.filter(item => item.state == state);
      if (state == "100") {
        this.list = this.allList;
      } else {
        this.list = list;
      }
    },
    styleFn() {
      this.styleobj = {
        height: (this.actions.length + 1) * 48 + "px"
      };
      this.showActionSheet = true;
    }
  }
};
</script>

<style lang='less'>
.student-sign-info-list {
  .tit {
    background: #fff;
    padding: 10px;
    p {
      padding: 10px 0;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    background: #fff;
    width: 100%;
    p {
      padding: 10px;
      span {
        width: 50%;
      }
    }
  }
  .ActionSheet {
    border-radius: 15px;
    bottom: 20px;
    left: 2%;
    width: 96%;
    background: none;
    button {
      display: block;
      width: 100%;
      padding: 13px 0;
      border: none;
      border-bottom: 1px solid #999;
      color: #007aff;
      &:nth-last-child(2) {
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
      }
    }
    .van-action-sheet__cancel {
      position: absolute;
      bottom: 0;
      background: #fff;
      //   left: 2%;
      //   width: 96%;
      border-radius: 15px;
    }
  }
}
</style>
<style>
