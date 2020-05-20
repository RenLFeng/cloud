<template>
  <div class="zy-fabu-wrap">
    <mt-header title="发布设置" class="mint-header-f">
      <mt-button slot="left" @click="calce">取消</mt-button>

      <mt-button slot="right" :disabled="isSubmit" @click="publish">开始</mt-button>
    </mt-header>
    <div class="main overflow-scroll main-f">
      <p class="top-tit font16">
        发放对象
        <span class @click="selfn()">全选</span>
      </p>
      <ul class="select-wrap">
        <li class v-for="(v, i) in allBankes" :key="i">
          <i class="iconfont" :class="v.act?'iconok-':''" @click="selfn(v)"></i>
          {{v.name}}
        </li>
      </ul>
      <div class="set-time-wrap">
        <div class="set-time">
          <mt-cell title="设置最晚提交时间">
            <mt-switch v-model="hassubmittime"></mt-switch>
          </mt-cell>
          <mt-cell
            v-if="hassubmittime"
            title="最晚提交时间"
            @click.native="onTimePicker"
          >{{submittimedesc}}</mt-cell>
          <mt-cell title="允许超时提交作业" v-if="hassubmittime">
            <mt-switch v-model="allowpasstime"></mt-switch>
          </mt-cell>
        </div>
        <p
          class="tips font-xxs"
          v-if="allowpasstime"
        >开启允许超时提交作业后，“老师评分”和“指定助教/学生评分”类型的作业，系统将允许超时提交作业，但会标记为超时。</p>
      </div>
      <div>
        <mt-cell title="允许学生查看他人作业及评分">
          <mt-switch v-model="seeOter"></mt-switch>
        </mt-cell>
        <p class="tips font-xxs">
          设置作业结束后，是否允许学生查看他人作业及评分；
          班课-我的-学生访问权限设置 为 全部允许 或 作业权限开启时，该选项有效。
        </p>
      </div>
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
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Switch, DatetimePicker } from "mint-ui";
import maintools from "../maintools";
import commontools from "@/commontools";
export default {
  props: {
    curzuoye: {
      default() {
        return {};
      }
    },
    bankeid: {
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      hassubmittime: true,
      allowpasstime: true,
      allBankes: [],
      curdatetime: new Date(),
      pickervalue: "",
      submittime: commontools.timeJsDateToTimedate(new Date()),
      seeOter: true,
      pagesize: 1000,
      page: 0
    };
  },
  computed: {
    isSubmit() {
      for (let v of this.allBankes) {
        if (v.act) {
          return false;
        }
      }
      return true;
    },
    submittimedesc() {
      return commontools.timeToHummanRead(
        this.submittime.replace(/-/g, "/"),
        1
      );
    },
    upDatetime() {
      if (this.hassubmittime) {
        return this.submittime;
      }
      return "";
    },
    upallowpasstime() {
      if (this.allowpasstime) {
        return 1;
      }
      return 0;
    }
  },
  created() {},
  mounted() {
    this.bankequery();
  },
  watch: {},
  methods: {
    selfn(v) {
      if (v) {
        v.act = !v.act;
      } else {
        for (let v of this.allBankes) {
          v.act = true;
        }
      }
    },
    publish() {
      Indicator.open("发布中...");
      let bankeids = [];
      let bankeitems = [];
      for (let v of this.allBankes) {
        if (v.act) {
          bankeids.push(v.id);
          bankeitems.push({
            courseid: v.courseid,
            id: v.id,
            name: v.name
          });
        }
      }
      let updateinfo = {
        publishdesc: {
          bankeitems: bankeitems
        },
        submittime: this.upDatetime,
        hassubmittime: this.upDatetime ? 1 : 0,
        allowpasstime: this.upallowpasstime
      };
      updateinfo.publishdesc = JSON.stringify(updateinfo.publishdesc);

      var url = "/api/api/zuoyepublish";
      Indicator.open("发布中...");
      this.$http
        .post(url, {
          zuoyeid: this.curzuoye.id,
          publishtobanke: bankeids,
          updateinfo: updateinfo
        })
        .then(res => {
          if (res.data.code == 0) {
            Toast("发布成功");
            this.$emit("calce", "success");
          } else {
            Toast(res.data.msg);
          }
          Indicator.close();
        })
        .catch(() => {
          Indicator.close();
          Toast("连接服务失败");
        });
    },
    calce() {
      this.$emit("calce", true);
    },
    onTimePicker() {
      this.$refs.timepicker.open();
    },
    pickerconfirm() {
      this.submittime = commontools.timeJsDateToTimedate(this.pickervalue);
    },
    bankequery() {
      Indicator.open("查询班级中...");
      this.$http
        .post("/api/banke/bankequery", {
          where: {
            courseid: this.curzuoye.ownerid
          },
          page: {
            pagesize: this.pagesize,
            page: this.page
          }
        })
        .then(res => {
          if (res.data.code == "0") {
            if (res.data.data.length >= this.pagesize) {
              //   this.loading = false;
              this.page++;
            } else {
              if (this.page) {
                // this.listLoadend = true;
              }
              //   this.loading = true;
              //   this.allLoaded = true;
            }
            let loadData = res.data.data;
            loadData = res.data.data.filter(item => {
              return item.states > 0;
            });
            for (let i = 0; i < loadData.length; i++) {
              let v = loadData[i];
              if (i == 0) {
                v.act = true;
              } else {
                v.act = false;
              }
            }
            this.allBankes = [...loadData, ...this.allBankes];
            console.log("kngk ", this.allBankes);
          }
          Indicator.close();
        })
        .catch(err => {
          Indicator.close();
        });
    }
  },
  destroyed() {},
  components: {
    [Switch.name]: Switch,
    [DatetimePicker.name]: DatetimePicker
  }
};
</script>

<style scoped lang="less">
.zy-fabu-wrap {
  .main {
    .top-tit {
      width: 100%;
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0 10px;
      color: #939393;
      padding-bottom: 5px;
      span {
        color: #0089ff;
      }
    }
    .select-wrap {
      padding: 10px;
      background: #fff;
      li {
        display: flex;
        width: 100%;
        height: 53px;
        border-bottom: 1px solid #f0f0f0;
        align-items: center;
        .iconfont {
          width: 22px;
          height: 22px;
          border: 1px solid #ccc;
          border-radius: 22px;
          margin-right: 10px;
          font-size: 25px;
          color: #ff8900;
          &.iconok- {
            border: none;
          }
        }
      }
    }
    .set-time-wrap {
    }
    .tips {
      padding: 10px;
      color: #939393;
    }
  }
}
</style>
