<template>
  <div>
    <mt-header :title="titledesc">
      <mt-button icon="back" slot="left" @click="goback">{{$t('common.Back')}}</mt-button>
      <mt-button
        slot="right"
        v-if="pagemode=='submit'"
        @click="popupSubmit=true"
      >{{$t('bankeTask.Submit_job')}}</mt-button>
    </mt-header>

    <div class="noheadercontainer noheaderscroll">
      <mt-loadmore
        :top-method="loadTop"
        @top-status-change="handleTopChange"
        ref="loadmore"
        class="zyloadmore"
        :auto-fill="autofill"
      >
        <div class="titlecontainer">
          <div class="zuoyetitle">{{zuoyeitem.name}}</div>
          <div class="zuoyesubtitle">
            <span class="zuoyescore">{{$t('bankeTask.Assignment_score')}} 100{{$t('common.min')}}</span>&nbsp;|&nbsp;
            <span>{{statedesc}}</span>
          </div>
          <div class="zuoyesubtitle">{{zuoyetimedesc}}</div>
        </div>
        <div>
          <mt-cell
            :title="$t('bankeTask.Job_details')"
            is-link
            @click.native="popupZDetail=true"
          >{{zuoyeitem.detaildesc}}</mt-cell>
        </div>

        <div @click="syudentsMark">
          <mt-cell
            :title="$t('bankeTask.Score_of_the_operation_owner')"
            is-link
            v-if="pagemode=='result'"
          ></mt-cell>
        </div>
        <div @click="showZYinfo">
          <mt-cell :title="$t('common.Info')" is-link v-if="pagemode=='result'">{{submitnumdesc}}</mt-cell>
        </div>
        <mt-cell
          :title="$t('bankeTask.Answer')"
          is-link
          v-if="pagemode=='result'"
          @click.native="popupAnswer=true"
        >{{answerdesc}}</mt-cell>

        <div class="devide zashowbtnpart">
          <div v-if="pagemode=='submit'">
            <div class="zashowbtn zashowbtnactive">{{$t('bankeTask.My_submission')}}</div>
          </div>
          <div v-if="pagemode=='result'">
            <div
              @click="selectPF(1)"
              :class="zashowbtnactive?'zashowbtnactive zashowbtn':'zashowbtn' "
            >{{$t('common.Whole')}}({{submitnum}})</div>
            <div
              @click="selectPF(0)"
              :class="!zashowbtnactive?'zashowbtnactive zashowbtn':'zashowbtn' "
            >{{$t('bankeTask.No_score')}}({{uncommentnum}})</div>
          </div>
        </div>

        <div v-for="(ritem,selindex) in results" v-bind:key="selindex">
          <div v-if="showitem(ritem)">
            <ZuoyeAnswerItem
              :resultitem="ritem"
              @commentClicked="onCommentClick"
              @scoreClicked="onScoreClick"
              @seeAllSubmit="onSeeAllSubmit"
            ></ZuoyeAnswerItem>
            <div class="devide"></div>
          </div>
        </div>
        <div v-if="showemptydesc" class="tc" style="margin-top:50px;">
          <div v-if="pagemode=='submit'">
            <div style="margin-bottom:10px;">{{$t('bankeTask.Not_yet')}}</div>
            <div>
              {{$t('common.Click')}}
              <span
                class="link"
                @click="popupSubmit=true"
              >{{$t('bankeTask.Submit_job')}}</span>
              {{$t('bankeTask.To_submit')}}
            </div>
          </div>
          <div v-else>{{emptydesc}}</div>
        </div>
      </mt-loadmore>
    </div>

    <mt-popup v-model="popupSubmit" position="right" class="mint-popup-3" :modal="false">
      <mt-header :title="$t('bankeTask.Submit_job')">
        <mt-button
          slot="right"
          @click="onbtnsubmit"
          :disabled="submitdisabled"
        >{{$t('common.Submit')}}</mt-button>

        <mt-button slot="left" @click="popupSubmit = false">{{$t('common.Close')}}</mt-button>
      </mt-header>

      <zuoyedetailedit :zdetail="zdetailsubmit"></zuoyedetailedit>
    </mt-popup>

    <mt-popup v-model="popupZDetail" position="right" class="mint-popup-3" :modal="false">
      <mt-header title>
        <mt-button slot="left" icon="back" @click="popupZDetail = false">{{$t('common.Back')}}</mt-button>
      </mt-header>

      <zuoyedetailedit :zdetail="zdetail" :readonly="zreadonly"></zuoyedetailedit>
    </mt-popup>
    <!-- 评论 -->
    <mt-popup v-model="popupZuoyePL" position="right" class="mint-popup-3" :modal="false">
      <mt-header :title="$t('bankeTask.Job_Results')+' '+$t('bankeTask.Comment_area')">
        <mt-button slot="left" icon="back" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <Discuss :itemInfo="studentInfo" :popupZuoyePL="popupZuoyePL"></Discuss>
    </mt-popup>
    <!-- 评分 -->
    <mt-popup v-model="popupZuoyePF" position="bottom" class="pf-container-popup">
      <div class="pf-container">
        <p class="tit border-bottom-e5 text-center">
          <span class="close-mode float-l" @click="goBacks">{{$t('confirm.Cancel')}}</span>
          {{$t('bankeTask.To')}}&nbsp;{{studentName}}&nbsp;{{mark}} {{$t('bankeTask.Score')}}
          <span
            class="close-mode float-r"
            @click="submiMark"
          >{{$t('bankeTask.Score')}}</span>
        </p>
        <p class="mark-input border-bottom-e5">
          <input class="text-center" type="number" v-model.lazy="mark" v-on:change="changeMark()" />
          {{$t('bankeTask.Overall_score')}}(100)
        </p>
        <ul class="clearIt">
          <li class="float-l text-center" v-for="i in markArr" :key="i" @click="seleMarkFn(i)">
            {{i}}
            <!-- {{i>90?$t('bankeTask.Full_marks'):i}} -->
          </li>
        </ul>
      </div>
    </mt-popup>
    <!-- 作业信息 -->
    <mt-popup
      v-model="popuPzouyeInfo"
      position="right"
      class="mint-popup-3"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header :title="zuoyeitem.name">
        <mt-button slot="left" icon="back" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <zouYeInfo :itemInfo="zuoyeitem" :allZuoyeitem="allInitData"></zouYeInfo>
    </mt-popup>
    <!-- 所有人得分 -->
    <mt-popup
      v-model="popuPzouyeAllMark"
      position="right"
      class="mint-popup-3"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header
        :title="$t('bankeTask.Job_Results')+' '+$t('bankeTask.Score_of_the_operation_owner')"
      >
        <mt-button slot="left" icon="back" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <studentsMark :itemInfo="zuoyeitem" :allZuoyeitem="allInitData"></studentsMark>
    </mt-popup>
    <!-- 答案 -->
    <mt-popup v-model="popupAnswer" position="right" class="mint-popup-3" :modal="false">
      <mt-header :title="$t('bankeTask.Task_Answer')">
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <Answer :zuoyeitem="zuoyeitem" :states="true" />
    </mt-popup>
    <!-- 所有提交 -->
    <mt-popup
      v-model="popupAllsubmit"
      position="right"
      class="mint-popup-3"
      :modal="false"
      :style="Preview?{overflow: 'scroll'}:''"
    >
      <mt-header :title="$t('bankeTask.All_submitted')">
        <mt-button icon="back" slot="left" @click="goBacks">{{$t('common.Back')}}</mt-button>
      </mt-header>
      <div v-for="(ritem,selindex) in popupAllsubmitItem" v-bind:key="selindex">
        <div v-if="showitem(ritem)">
          <ZuoyeAnswerItem
            :resultitem="ritem"
            @commentClicked="onCommentClick"
            @scoreClicked="onScoreClick"
          ></ZuoyeAnswerItem>
          <div class="devide"></div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import Discuss from "./components/discuss";
import ZuoyeAnswerItem from "./components/ZuoyeAnswerItem";
import { Indicator, Toast, MessageBox } from "mint-ui";

import zuoyedetailedit from "./ZuoyeDetailEdit";

import maintools from "./maintools";
import commontools from "../commontools";
import TextEllipsis from "./components/TextEllipsis";
import FileAttachList from "./components/FileAttachList";
import dispic from "../assets/dis.jpg";
import zouYeInfo from "./banKeZuoye/info";
import studentsMark from "./banKeZuoye/studentsMark";
import Answer from "./banKeZuoye/answer";
export default {
  name: "ZuoyeResult",
  props: {
    zuoyeid: {
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      studentInfo: {},
      ScoreItemInfo: {},
      isLimitHeight: true,
      popupSubmit: false,
      popupZDetail: false,
      popupZuoyePL: false,
      popupZuoyePF: false,
      popuPzouyeInfo: false,
      popuPzouyeAllMark: false,
      popupAnswer: false,
      popupAllsubmit: false,
      popupAllsubmitItem: {},
      mark: "",
      studentName: "",
      zreadonly: true,
      topStatus: "",
      bottomStatus: "",
      autofill: true,
      zuoyeitem: {
        name: "",
        state: 10,
        allowpasstime: 0,
        hassubmittime: 0,
        detaildesc: "",
        submittime: ""
      },
      allZuoyeitem: [],
      allInitData: [],
      zdetail: {
        ztext: "",
        localfiles: []
      },
      zdetailsubmit: {
        ztext: "",
        localfiles: []
      },
      results: [],
      resultsTemp: [],
      noPingFengStudentInfo: [],
      showfilter: "all",
      pagemode: "result", //! 页面模式； 复用多种页面模式：result:所有结果列表  submit:学生答题列表
      submitok: false,
      zashowbtnactive: true,
      markArr: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      loadingState:false
    };
  },
  computed: {
    Preview(){
      return this.$store.state.isPreview;
    },
    answerdesc() {
      return this.zuoyeitem.answerdesc
        ? this.zuoyeitem.answerdesc
        : this.$t("bankeTask.No_answer_set");
    },
    submitdisabled() {
      if (this.zdetailsubmit.ztext || this.zdetailsubmit.localfiles.length) {
        return false;
      }
      return true;
    },
    titledesc() {
      if (this.pagemode == "submit") {
        return this.$t("bankeTask.Job_details");
      }
      return this.$t("bankeTask.Job_Results");
    },
    statedesc() {
      if (this.zuoyeitem.state == 100) {
        return this.$t("bankeTask.Have_in_hand");
      }
      return this.$t("bankeTask.Has_ended");
    },
    unsubmitnum() {
      var ni = 0;
      for (var i = 0; i < this.results.length; i++) {
        if (!this.results[i].submitnum) {
          ni++;
        }
      }
      return ni;
    },
    showemptydesc() {
      if (this.showfilter == "score") {
        if (this.uncommentnum == 0) {
          return true;
        }
      }

      for (var i = 0; i < this.results.length; i++) {
        if (this.results[i].submitnum) {
          return false;
        }
      }
      return true;
    },
    emptydesc() {
      if (this.showfilter == "score") {
        return this.$t("bankeTask.No_score_yet");
      }

      return this.$t("bankeTask.No_submission");
    },
    submitnum() {
      var ni = 0;
      for (var i = 0; i < this.results.length; i++) {
        if (this.results[i].submitnum) {
          ni++;
        }
      }
      return ni;
    },
    uncommentnum() {
      var ni = 0;
      for (var i = 0; i < this.results.length; i++) {
        if (this.results[i].score < 0 && this.results[i].submitnum) {
          ni++;
        }
      }
      return ni;
    },
    zuoyetimedesc() {
      if (!this.zuoyeitem.hassubmittime) {
        return this.$t("bankeTask.Unlimited_submission_time");
      }
      var tdesc = commontools.timeToHummanRead(this.zuoyeitem.submittime);
      var tallowpass = this.$t("bankeTask.Allow_timeout_submission");
      if (!this.zuoyeitem.allowpasstime) {
        tallowpass = this.$t("bankeTask.Timeout_submission_not_allowed");
      }
      var tfmt =
        "%s " + this.$t("common.Front") + this.$t("common.Submit") + " | %s";
      return commontools.sprintf(tfmt, tdesc, tallowpass);
    },
    submitnumdesc() {
      if (!this.results.length) {
        return this.$t("bankeTask.No_participants");
      }
      var ni = this.unsubmitnum;
      if (ni == 0) {
        return this.$t("bankeTask.All_submitteds");
      }
      var tfmt =
        "%i " + this.$t("common.Person") + this.$t("bankeTask.Not_submitted");
      return commontools.sprintf(tfmt, ni);
    }
  },
  methods: {
    loadTop() {
      this.loadAll();
    },
    loadBottom() {},
    goBacks() {
      if (this.popupAllsubmit && !this.popupZuoyePL)
        this.popupAllsubmit = false;
      if (this.popupZuoyePL) {
        this.popupZuoyePL = false;
        this.loadAll();
      }
      if (this.popupZuoyePF) {
        this.popupZuoyePF = false;
        this.mark = "";
      }
      if (this.popuPzouyeInfo) this.popuPzouyeInfo = false;
      if (this.popuPzouyeAllMark) this.popuPzouyeAllMark = false;
      if (this.popupAnswer) this.popupAnswer = false;
    },
    onCommentClick(ritem) {
      this.studentInfo = ritem.info;
      this.popupZuoyePL = ritem.state;
      console.log("作业 info", ritem);
    },
    onScoreClick(ritem) {
      let isteacher = this.$store.getters.isteacher;
      this.ScoreItemInfo = ritem.info;
      console.log("作业 info", ritem);
      if (!isteacher) {
        if (ritem.info.score > "0") {
          MessageBox("已经评过分啦~~");
        } else {
          MessageBox("等待老师评分哦 ~");
        }
      } else {
         this.popupZuoyePF = ritem.state;
          this.studentName = ritem.info.username;
        // if (ritem.info.score > "0") {
        //   MessageBox("不能重复评分~~");
        // } else {
        //   this.popupZuoyePF = ritem.state;
        //   this.studentName = ritem.info.username;
        // }
      }
    },
    onSeeAllSubmit(item) {
      // console.log( item);
      if (item) {
        this.popupAllsubmit = true;
        var url =
          "/api/api/zuoyeresultquery?zuoyeid=" +
          this.zuoyeid +
          "&userid=" +
          item.userid;
        Indicator.open(this.$t("Indicator.Loading"));
        this.$http
          .post(url)
          .then(res => {
            Indicator.close();
            // this.$refs.loadmore.onTopLoaded();
            if (res.data.code == 0) {
              this.popupAllsubmitItem = res.data.data.results;
              for (var i = 0; i < this.popupAllsubmitItem.length; i++) {
                this.popupAllsubmitItem[
                  i
                ].localfiles = maintools.localfilesFromFilelist(
                  this.popupAllsubmitItem[i].files
                );
              }
            } else {
              Toast(res.data.msg);
            }
          })
          .catch(() => {
            Indicator.close();
            // this.$refs.loadmore.onTopLoaded();
          });
      }
    },
    seleMarkFn(val) {
      this.mark = val;
    },
    submiMark() {
      if (this.mark == "") return;
      this.$http
        .get(
          "/api/Azuoye/setScore?submitid=" +
            this.ScoreItemInfo.submitid +
            "&score=" +
            this.mark,
          {}
        )
        .then(res => {
          this.popupZuoyePF = false;
          this.loadAll();
          this.mark = "";
          console.log("评分成功", res);
        })
        .catch(() => {
          this.popupZuoyePF = false;
          this.mark = "";
          console.log("评分失败");
        });
    },
    changeMark() {},
    goback() {
      if (this.pagemode == "submit") {
        var btip = false;
        if (!this.zuoyeitem.submitnum) {
          btip = true;
        } else {
          if (
            this.zdetailsubmit.ztext.length ||
            this.zdetailsubmit.localfiles.length
          ) {
            btip = true;
          }
        }
        if (btip) {
          MessageBox.confirm("退出作业提交？").then(() => {
            this.$router.go(-1);
          });
          return;
        }
      }
      this.$router.go(-1);
    },
    showitem(ritem) {
      if (!ritem.submitnum) {
        return false;
      }

      if (this.showfilter == "score") {
        if (ritem.score < 0) {
          return false;
        }
      }

      return true;
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadAll() {
      var url = "/api/api/zuoyeresultquery?zuoyeid=" + this.zuoyeid;
      Indicator.open(this.$t("Indicator.Loading"));
      this.$http
        .post(url)
        .then(res => {
          Indicator.close();
          this.$refs.loadmore.onTopLoaded();
          if (res.data.code == 0) {
            //! ok
            this.allZuoyeitem = res.data.data.results;
            this.onHttpData(res.data.data);
            //  console.log(this.results);
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(() => {
          Indicator.close();
          this.$refs.loadmore.onTopLoaded();
        });
    },
    onHttpData(data) {
      this.zuoyeitem = data["zuoye"];
      this.allZuoyeitem = data.results;
      for (let item of this.allZuoyeitem) {
        if (item.score < 0) {
          this.noPingFengStudentInfo.push(item);
        }
      }
      if (this.zuoyeitem.state == 100 && !this.$store.getters.isteacher) {
        //! 提交模式
        this.pagemode = "submit";
      }

      this.zdetail.ztext = data["zdetail"].ztext;
      this.zdetail.localfiles = maintools.localfilesFromFilelist(
        data["zdetail"].files
      );
      var dresults = data["results"];
      for (var i = 0; i < dresults.length; i++) {
        dresults[i].localfiles = maintools.localfilesFromFilelist(
          dresults[i].files
        );
      }
      this.results = dresults;
    },
    onbtnsubmit() {
      MessageBox.confirm("现在提交作业？").then(() => {
        this.dosubmit();
      });
    },
    dosubmit() {
      Indicator.open(this.$t("Indicator.Committing"));
      var url = "/api/api/zuoyesubmit?zuoyeid=" + this.zuoyeid;
      this.$http
        .post(url, {
          zdetail: {
            ztext: this.zdetailsubmit.ztext,
            files: maintools.filelistFromLocalfiles(
              this.zdetailsubmit.localfiles
            )
          }
        })
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            Toast("提交成功");
            var oneitem = res.data.data;
            oneitem.localfiles = maintools.localfilesFromFilelist(
              oneitem.files
            );
            this.results.splice(0, 0, oneitem);
            //! 清空本地的提交信息
            this.popupSubmit = false;
            this.zdetailsubmit.ztext = "";
            this.zdetailsubmit.localfiles.length = 0;
          } else {
            //! Toast 不可见
            MessageBox(res.data.msg);
          }
        })
        .catch(() => {
          Indicator.close();
          Toast("异常");
        });
    },
    showZYinfo() {
      this.allInitData = this.allZuoyeitem;
      this.popuPzouyeInfo = true;
    },
    syudentsMark() {
      this.allInitData = this.allZuoyeitem;
      this.popuPzouyeAllMark = true;
    },
    selectPF(active) {
      this.zashowbtnactive = active;
      if (!active) {
        this.resultsTemp = this.results;
        this.results = this.noPingFengStudentInfo;
      } else {
        this.results = this.resultsTemp;
      }
    }
  },
  created() {
    var dd = this.$store.getters.getBankeData("zuoyeresult", this.zuoyeid);
    if (dd && dd.resultdata) {
      this.onHttpData(dd.resultdata);
    } else {
      this.loadAll();
    }
  },
  components: {
    ZuoyeAnswerItem,
    zuoyedetailedit,
    Discuss,
    zouYeInfo,
    studentsMark,
    Answer,
  }
};
</script>
<style lang="less">
.pf-container-popup {
  width: 100%;
  height: auto;
  .pf-container {
    p {
      padding: 20px;
      color: #000;
    }
    .close-mode {
      color: #0089ff;
    }
    .mark-input {
      height: 75px;
      input {
        width: 20%;
        border: 1px solid #0089ff;
        border-radius: 5px;
        margin-right: 15px;
        height: 100%;
      }
    }
    ul {
      padding: 20px;
      li {
        background: #e5e5e5;
        border-radius: 15%;
        padding: 8px 0px;
        width: 16%;
        margin-bottom: 15px;
        margin-left: 2%;
        margin-right: 2%;
      }
    }
  }
}
</style>
<style scoped>
.mint-popup-3 {
  width: 100%;
  height: 100%;
  background-color: white;
}
.popuphalf {
  height: 50%;
}

.zashowbtn {
  font-size: 18px;
  color: #0089ff;

  display: inline-block;
  text-align: center;

  padding: 5px;
  margin-top: 6px;
  margin-right: 10px;
}
.zashowbtnpart {
  height: 44px;
  padding: 0px 10px;
}
.zashowbtnactive {
  border: 1px solid #0089ff;
  border-radius: 10px;
}

.zuoyetitle {
  font-size: 20px;
  color: black;
}
.zuoyesubtitle {
  margin-top: 5px;
  font-size: 16px;
  color: #a9a9a9;
}

.zuoyescore {
  color: #ff8800;
}

.titlecontainer {
  padding: 10px 20px;

  background-color: #e7e7e7;
}

.detailcontainer {
  padding: 10px;
  background-color: white;
  font-size: 16px;
}
.detailheader {
  border-bottom: 1px solid #a9a9a9;
}

.submitheader {
  background-color: green;
}
.noheaderscroll .mint-cell:last-child {
  background: none;
}
.noheaderscroll .mint-cell:last-child {
  background: none;
}
</style>