<template>
  <div class="student-sign-info-list">
    <div class="tit">
      <p>签到开始时间:&nbsp;{{startTime}}&nbsp;{{Data.time}}</p>
      <p class="clearfix">
        <span class="colord fl" @click="setALL()" v-if="isTeacher">一键设置签到</span>
        <span class="colord fr" @click="More()">查看全部</span>
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
        <a class="colord">{{studentSignNb}}&nbsp;</a>
        /&nbsp;{{list.length-studentSignNb}}
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
    />
  </div>
</template>

<script>
import { ActionSheet } from "vant";
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import StudentSignInfoList from "../components/BankeMemberSimple";
import { Whatweek, formateTime } from "../../util";
const setALL = [
  { name: "设为已签到" },
  { name: "设为迟到" },
  { name: "设为超时" },
  { name: "设为未签到", subname: "" }
];
const More = [
  { name: "查看全部" },
  { name: "查看未签到" },
  { name: "查看超时" },
  { name: "查看迟到" },
  { name: "查看已签到" }
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
      list: [],
      showActionSheet: false,
      actions: [],
      styleobj: {},
      studentSignNb: 0
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
    //更改单个学生签到状态
    setSignState(v){
      if(!this.isTeacher) return;
      this.$http.post('/api/sign/changestate',{
        userid:v.userid,
        signid:v.signid,
        state:1
      }).then(res=>{
        console.log('ds',res);
        if(res.data.code=='0'){
          v.state=1;
        }
      }).catch(err => {

      })
        console.log(v);

    },
      //批量修改签到状态
    setAllSignState(v){
      this.$http.post('/api/sign/batchstate',{
        signid:v.signid,
        state:1
      }).then(res=>{
        console.log('ds',res);
        if(res.data.code=='0'){
          v.state=1;
        }
      }).catch(err => {

      })
        console.log(v);

    },
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
                if (item.state) {
                  this.studentSignNb++;
                }
              }
              this.list = Data.signmembers;
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
              this.$emit('calssStatefn',res.data.data.state)
            } else {
            }
            Indicator.close();
          })
          .catch(() => {
            Indicator.close();
          });
      });
    },
    setALL() {
      this.actions = setALL;
      this.showActionSheet = true;
      this.styleobj = {
        height: (this.actions.length + 1) * 48 + "px"
      };
    },
    More() {
      this.actions = More;
      this.showActionSheet = true;

      this.styleobj = {
        height: (this.actions.length + 1) * 48 + "px"
      };
    },

    onSelect() {
      this.showActionSheet = false;
    },
    onCancel() {
      this.showActionSheet = false;
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
