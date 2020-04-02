<template>
  <div class="new-zuoye-wrap">
    <mt-header :title="pageTitle">
      <mt-button slot="left" @click="$back">取消</mt-button>

      <mt-button slot="right" :disabled="savedisable" @click="doSave">{{savebtntext}}</mt-button>
    </mt-header>

    <div class="main">
      <div class="zuoye-info-wrap">
        <mt-field label placeholder="请输入作业标题" v-model="zuoyeitem.name"></mt-field>
        <zuoyedetailedit :zdetail="zdetail"></zuoyedetailedit>
      </div>
      <!-- <mt-cell title="作业详情" is-link @click.native="onZDetail">{{zdetaildesc}}</mt-cell> -->
      <div class="devide"></div>
      <mt-cell title="设置最晚提交时间">
        <mt-switch v-model="hassubmittime"></mt-switch>
      </mt-cell>
      <mt-cell v-if="hassubmittime" title="最晚提交时间" @click.native="onTimePicker">{{submittimedesc}}</mt-cell>
      <mt-cell v-if="hassubmittime" title="允许超时提交作业">
        <mt-switch v-model="allowpasstime"></mt-switch>
      </mt-cell>
      <p
        class="tips font-xxs"
        v-if="hassubmittime"
      >开启允许超时提交作业后，“老师评分”和“指定助教/学生评分”类型的作业，系统将允许超时提交作业，但会标记为超时。</p>
      <mt-cell title="答案设置" is-link @click.native="onZAnaswer">{{zanswerdesc}}</mt-cell>
      <p class="tips font-xxs">学生可在互评中或作业结束后查看参考答案，你可以随时对参考答案进行编辑。</p>
    </div>

    <mt-datetime-picker
      ref="timepicker"
      type="datetime"
      :startDate="curdatetime"
      month-format="{value} 月"
      date-format="{value} 日"
      hourFormat="{value} 时"
      minuteFormat="{value} 分"
      v-model="pickervalue"
      @confirm="pickerconfirm"
    ></mt-datetime-picker>

    <mt-popup v-model="popupVisibleDetail" position="right" class="mint-popup-3" :modal="false">
      <mt-header title="作业详情">
        <mt-button slot="right" @click="popupVisibleDetail = false">确定</mt-button>
      </mt-header>

      <zuoyedetailedit :zdetail="zdetail"></zuoyedetailedit>
    </mt-popup>
    <mt-popup v-model="popupAnswer" position="right" class="mint-popup-3" :modal="false">
      <mt-header title="作业答案">
        <!-- <mt-button icon="back" slot="left" @click="goBack">返回</mt-button> -->
        <mt-button slot="right" @click="popupAnswer = false">确定</mt-button>
      </mt-header>
      <Answer :zanswer="zanswer" :states="false" />
    </mt-popup>
  </div>
</template>

<script>
import commontools from "../commontools";
import zuoyedetailedit from "./ZuoyeDetailEdit";
import Answer from "./banKeZuoye/answer";
import { Indicator, Toast, MessageBox } from "mint-ui";
import maintools from "./maintools";
import { formateTime } from "@/util.js";

export default {
  name: "ZuoyeNew",
  data() {
    return {
      popupAnswer: false,
      popupVisibleDetail: false,
      zuoyeitem: {
        name: this.defaultzuoyename(),
        state: 0,
        hassubmittime: 0,
        allowpasstime: 1,
        submittime: "",
        detaildesc: "",
        answerdesc: ""
      },
      zdetail: {
        ztext: "",
        localfiles: []
      },
      zanswer: {
        //! 答案
        ztext: "",
        localfiles: []
      },
      curdatetime: new Date(),
      isEditMode: false, //! 是否编辑模式
      pickervalue: ""
    };
  },
  props: {
    bankeid: {
      default() {
        return 0;
      }
    }
  },
  computed: {
    curbanke() {
      return this.$store.state.curbanke;
    },
    zdetaildesc() {
      if (this.zuoyeitem.detaildesc) {
        return this.zuoyeitem.detaildesc;
      }
      return "未填写";
    },
    pageTitle() {
      if (this.isEditMode) {
        return "作业编辑";
      }
      return "创建作业";
    },
    savebtntext() {
      if (this.isEditMode) {
        return "保存";
      }
      return "创建";
    },
    zanswerdesc() {
      if (this.zuoyeitem.answerdesc) {
        return this.zuoyeitem.answerdesc;
      }
      return "未设置";
    },
    submittimedesc() {
      if (!this.zuoyeitem.hassubmittime) {
        return "";
      }
      return commontools.timeToHummanRead(this.zuoyeitem.submittime);
    },
    savedisable() {
      if (this.zuoyeitem.name) {
        return false;
      }
      return true;
    },
    submittime: {
      get() {
        return commontools.timeTimedateToJsDate(this.zuoyeitem.submittime);
      },
      set(val) {
        this.zuoyeitem.submittime = commontools.timeJsDateToTimedate(val);
      }
    },
    hassubmittime: {
      get() {
        if (this.zuoyeitem.hassubmittime) {
          return true;
        }
        return false;
      },
      set(val) {
        if (val) {
          this.zuoyeitem.hassubmittime = 1;
          this.$refs.timepicker.open();
        } else {
          this.zuoyeitem.hassubmittime = 0;
          this.zuoyeitem.submittime = "";
        }
      }
    },
    allowpasstime: {
      get() {
        if (this.zuoyeitem.allowpasstime) {
          return true;
        }
        return false;
      },
      set(val) {
        if (val) {
          this.zuoyeitem.allowpasstime = 1;
        } else {
          this.zuoyeitem.allowpasstime = 0;
        }
      }
    }
  },
  watch: {
    popupVisibleDetail() {
      if (!this.popupVisibleDetail) {
        this.zuoyeitem.detaildesc = commontools.maxLength(this.zdetail.ztext);
      }
    },
    popupAnswer() {
      if (!this.popupAnswer) {
        this.zuoyeitem.answerdesc = commontools.maxLength(this.zanswer.ztext);
      }
    }
  },
  methods: {
    onZDetail() {
      this.popupVisibleDetail = true;
    },
    onZAnaswer() {
      this.popupAnswer = true;
    },
    pickerconfirm() {
      this.zuoyeitem.submittime = commontools.timeJsDateToTimedate(
        this.pickervalue
      );
    },
    AnswerSubmit() {},
    defaultzuoyename() {
      //! cjy: no default zname, confused?
      // return '';

      var t = new Date();
      var szfmt = "新作业 %02i%02i%02i %02i%02i";
      var nyear = t.getFullYear() % 100;
      return commontools.sprintf(
        szfmt,
        nyear,
        t.getMonth() + 1,
        t.getDate(),
        t.getHours(),
        t.getMinutes()
      );
    },
    doSave() {
      if (this.zuoyeitem.state != 0) {
        this.doSaveUpload();
        return;
      }
      MessageBox({
        message: "是否现在开始作业？",
        showCancelButton: true,
        confirmButtonText: "立即开始",
        cancelButtonText: "暂不开始"
      })
        .then(res2 => {
          if (res2 == "confirm") {
            this.zuoyeitem.state = 100;
          }
          this.doSaveUpload();
        })
        .catch(() => {
          this.doSaveUpload();
        });
      // var ttip = "已完成创建？";
      // if (this.isEditMode) {
      //   ttip = "已完成编辑？";
      // }
      // MessageBox({
      //   message: ttip,
      //   showCancelButton: true
      // }).then(res => {
      //   //  console.log(res);
      //   if (res == "confirm") {
      //     MessageBox({
      //       message: "是否现在开始作业？",
      //       showCancelButton: true,
      //       confirmButtonText: "立即开始",
      //       cancelButtonText: "暂不开始"
      //     })
      //       .then(res2 => {
      //         if (res2 == "confirm") {
      //           this.zuoyeitem.state = 100;
      //         }
      //         this.doSaveUpload();
      //       })
      //       .catch(() => {
      //         this.doSaveUpload();
      //       });
      //   }
      // });
    },
    doSaveUpload() {
      //! serverData
      var url = "/api/api/bankezuoyeadd?bankeid=" + this.bankeid;

      Indicator.open(
        this.isEditMode
          ? this.$t("Indicator.Saving")
          : this.$t("Indicator.Set_up")
      );

      var zitem = {};
      zitem = this.zuoyeitem;
      this.$http
        .post(url, {
          zdetail: {
            ztext: this.zdetail.ztext,
            files: maintools.filelistFromLocalfiles(this.zdetail.localfiles)
          },
          zanswer: {
            ztext: this.zanswer.ztext,
            files: maintools.filelistFromLocalfiles(this.zanswer.localfiles)
          },
          zuoye: zitem
        })
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            Toast(this.isEditMode ? "保存成功" : "创建成功");
            this.$router.back();
            // this.mimiMessage();
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(() => {
          Indicator.close();
          Toast("异常");
        });
    },
    //  发送作业消息
    mimiMessage() {
      let date = formateTime(new Date(), "-");
      this.$http
        .post("/api/weixin/pushnotify", {
          templateid: "yEWdaUgS7luynNFryYXXwZUqEKqqXcglt7gD70Aue7s",
          topage: '/#/zuoyeresult/' + this.zuoyeitem.id,
          data: {
            thing3: "今天作业已经发布",
            name5: this.curbanke.name,
            date7: date
          },
          sendto: {
            type: "banke",
            bankeid: this.curbanke.id
          }
        })
        .then(res => {})
        .catch(() => {});
    },
    onTimePicker() {
      //  var testdate = new Date(this.zuoyeitem.submittime);
      // if (testdate){
      // console.log(testdate.getFullYear());
      //  console.log(testdate.getDate());
      //   console.log(testdate.getMonth());
      //  console.log(testdate.getHours());
      //}

      if (!this.zuoyeitem.hassubmittime) {
        return;
      }

      this.curdatetime = new Date();
      this.pickervalue = commontools.timeTimedateToJsDate(
        this.zuoyeitem.submittime
      );
      this.$refs.timepicker.open();
    },
    assignZDetail(to, from) {
      to.ztext = from.ztext;
      to.localfiles = maintools.localfilesFromFilelist(from.files);
    },
    goBack() {
      if (this.popupAnswer) {
        this.popupAnswer = false;
      }
    }
  },
  components: {
    zuoyedetailedit,
    Answer
  },
  created() {
    // console.log(this.bankeid);

    var dd = this.$store.getters.getBankeData("zuoyelist", this.bankeid);
    // console.log(dd);
    if (dd && dd.editingZuoye) {
      this.zuoyeitem = dd.editingZuoye;

      this.isEditMode = true;

      //! 拉取zdetail 和zanswer 信息
      Indicator.open(this.$t("Indicator.Loading"));
      this.$http
        .post("/api/api/bankezuoyedetail", { zuoyeid: this.zuoyeitem.id })
        .then(res => {
          Indicator.close();
          // alert(0)
          if (res.data.code == 0) {
            this.zuoyeitem = res.data.data["zuoye"];
            var jz = res.data.data["zdetail"];
            this.assignZDetail(this.zdetail, jz);
            if (res.data.data["zanswer"]) {
              this.assignZDetail(this.zanswer, res.data.data["zanswer"]);
              // this.zanswer.localfiles = maintools.localfilesFromFilelist(this.zanswer.files);
            }
          }
        })
        .catch(() => {
          Indicator.close();
        });
    }
  },
  destroyed() {
    this.$store.commit("setBankeData", {
      modulename: "zuoyelist",
      bankeid: this.bankeid,
      fn: fobj => {
        fobj.editingZuoye = null; //! 清空当前编辑的作业
      }
    });
  }
};
</script>

<style scoped>
.mint-popup-3 {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.mint-cell {
  padding-right: 10px;
}
.mint-cell-value {
  margin-right: 15px;
}
.mint-cell-value {
  color: #33a0ff;
}
</style>
<style lang="less">
.new-zuoye-wrap {
  .main {
    margin-top: 10px;
    .zuoye-info-wrap {
      background: #fff;
      .mint-field {
        padding: 10px;
      }
      .container {
        padding: 10px;
      }
      .attachdesc {
        border-bottom: none;
        padding: 5px;
      }
      textarea {
        height: 112px;
        max-height: 112px;
        padding: 0;
      }
      .imgblock {
        width: 60px;
        height: 60px;
        border: 1px dashed #aaaaaa;
      }
      .bottommargin {
        height: 0;
      }
    }
    .mint-switch-input:checked + .mint-switch-core {
      border-color: #4cd964;
      background-color: #4cd964;
    }
    .tips {
      color: #939393;
      padding: 10px;
    }
  }
}
</style>