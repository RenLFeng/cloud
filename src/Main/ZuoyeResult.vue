<template>
  <div>
    <mt-header :title="titledesc">
      <mt-button icon="back" slot="left" @click="goback">返回</mt-button>

      <mt-button slot="right" v-if="pagemode=='submit'" @click="popupSubmit=true">提交作业</mt-button>
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
            <span class="zuoyescore">作业分值 100分</span>&nbsp;|&nbsp;
            <span>{{statedesc}}</span>
          </div>
          <div class="zuoyesubtitle">{{zuoyetimedesc}}</div>
        </div>
        <div>
             <mt-cell title="作业详情" is-link @click.native="popupZDetail=true">{{zuoyeitem.detaildesc}}</mt-cell>
        </div>
     

        <div @click="syudentsMark">
          <mt-cell title="本次作业所有人得分" is-link v-if="pagemode=='result'"></mt-cell>
        </div>
        <div @click="showZYinfo">
          <mt-cell title="信息" is-link v-if="pagemode=='result'">{{submitnumdesc}}</mt-cell>
        </div>

        <div class="devide zashowbtnpart">
          <div v-if="pagemode=='submit'">
            <div class="zashowbtn zashowbtnactive">我的提交</div>
          </div>
          <div v-if="pagemode=='result'">
            <div @click="selectPF(1)" :class="zashowbtnactive?'zashowbtnactive zashowbtn':'zashowbtn' ">全部({{submitnum}})</div>
            <div @click="selectPF(0)" :class="!zashowbtnactive?'zashowbtnactive zashowbtn':'zashowbtn' ">未评分({{uncommentnum}})</div>
          </div>
        </div>

        <div v-for="(ritem,selindex) in results" v-bind:key="selindex">
          <div v-if="showitem(ritem)">
            <ZuoyeAnswerItem
              :resultitem="ritem"
              @commentClicked="onCommentClick"
              @scoreClicked="onScoreClick"
            ></ZuoyeAnswerItem>
            <div class="devide"></div>
          </div>
        </div>
        <div v-if="showemptydesc" class="tc" style="margin-top:50px;">
          <div v-if="pagemode=='submit'">
            <div style="margin-bottom:10px;">尚未提交</div>
            <div>
              点击
              <span class="link" @click="popupSubmit=true">提交作业</span>来提交
            </div>
          </div>
          <div v-else>{{emptydesc}}</div>
        </div>
      </mt-loadmore>
    </div>

    <mt-popup v-model="popupSubmit" position="right" class="mint-popup-3" :modal="false">
      <mt-header title class="作业提交">
        <mt-button slot="right" @click="onbtnsubmit" :disabled="submitdisabled">提交</mt-button>

        <mt-button slot="left" @click="popupSubmit = false">关闭</mt-button>
      </mt-header>

      <zuoyedetailedit :zdetail="zdetailsubmit"></zuoyedetailedit>
    </mt-popup>

    <mt-popup v-model="popupZDetail" position="right" class="mint-popup-3" :modal="false">
      <mt-header title>
        <mt-button slot="left" icon="back" @click="popupZDetail = false">返回</mt-button>
      </mt-header>

      <zuoyedetailedit :zdetail="zdetail" :readonly="zreadonly"></zuoyedetailedit>
    </mt-popup>
 <!-- 评论 -->
    <mt-popup v-model="popupZuoyePL" position="right" class="mint-popup-3" :modal="false">
      <mt-header title="作业结果列表   评论区">
        <mt-button slot="left" icon="back" @click="goBacks">返回</mt-button>
      </mt-header>
      <Discuss :itemInfo="studentInfo" :teacher="commentQueryInfo"></Discuss>
    </mt-popup>
    <!-- 评分 -->
    <mt-popup v-model="popupZuoyePF" position="bottom" class="pf-container-popup">
      <div class="pf-container">
        <p class="tit border-bottom-e5 text-center">
          <span class="close-mode float-l" @click="goBacks">取消</span>
          给{{studentName}}&nbsp;{{mark}}评分
          <span
            class="close-mode float-r"
            @click="submiMark"
          >评分</span>
        </p>
        <p class="mark-input border-bottom-e5">
          <input class="text-center" type="number" v-model="mark" @change="changeMark" />总体评分（10分）
        </p>
        <ul class="clearIt">
          <li
            class="float-l text-center"
            v-for="i in 10"
            :key="i"
            @click="seleMarkFn(i)"
          >{{i>9?'满分':i}}</li>
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
        <mt-button slot="left" icon="back" @click="goBacks">返回</mt-button>
      </mt-header>
      <zouYeInfo :itemInfo="zuoyeitem"></zouYeInfo>
    </mt-popup>
    <!-- 所有人得分 -->
    <mt-popup
      v-model="popuPzouyeAllMark"
      position="right"
      class="mint-popup-3"
      :modal="false"
      style="background:#f0f0f0"
    >
      <mt-header title="作业结果列表  本次作业所有人得分">
        <mt-button slot="left" icon="back" @click="goBacks">返回</mt-button>
      </mt-header>
      <studentsMark :itemInfo="zuoyeitem"></studentsMark>
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
      commentQueryInfo: [],
      studentInfo: {},
      isLimitHeight: true,
      popupSubmit: false,
      popupZDetail: false,
      popupZuoyePL: false,
      popupZuoyePF: false,
      popuPzouyeInfo: false,
      popuPzouyeAllMark: false,
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
      zdetail: {
        ztext: "",
        localfiles: []
      },
      zdetailsubmit: {
        ztext: "",
        localfiles: []
      },
      results: [],
      showfilter: "all",
      pagemode: "result", //! 页面模式； 复用多种页面模式：result:所有结果列表  submit:学生答题列表
      submitok: false,
      zashowbtnactive:true
    };
  },
  computed: {
    submitdisabled() {
      if (this.zdetailsubmit.ztext) {
        return false;
      }
      return true;
    },
    titledesc() {
      if (this.pagemode == "submit") {
        return "作业详细";
      }
      return "作业结果列表";
    },
    statedesc() {
      if (this.zuoyeitem.state == 100) {
        return "进行中";
      }
      return "已结束";
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
        return "尚无未评分";
      }

      return "尚无提交";
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
        return "不限制提交时间";
      }
      var tdesc = commontools.timeToHummanRead(this.zuoyeitem.submittime);
      var tallowpass = "允许超时提交";
      if (!this.zuoyeitem.allowpasstime) {
        tallowpass = "不允许超时提交";
      }
      var tfmt = "%s 前提交 | %s";
      return commontools.sprintf(tfmt, tdesc, tallowpass);
    },
    submitnumdesc() {
      if (!this.results.length) {
        return "无学员参与";
      }
      var ni = this.unsubmitnum;
      if (ni == 0) {
        return "已全部提交";
      }
      var tfmt = "%i 人未提交";
      return commontools.sprintf(tfmt, ni);
    }
  },
  methods: {
    loadTop() {
      this.loadAll();
    },
    loadBottom() {},
    goBacks() {
      if (this.popupZuoyePL) this.popupZuoyePL = false;
      if (this.popupZuoyePF) this.popupZuoyePF = false;
      if (this.popuPzouyeInfo) this.popuPzouyeInfo = false;
      if (this.popuPzouyeAllMark) this.popuPzouyeAllMark = false;
    },
    onCommentClick(ritem) {
      console.log("作业 item", ritem);
      this.commentQuery(ritem);
    },
    commentQuery(item) {
      this.$http
        .post("/api/comment/query?taboutid="+item.info.id+"&tabout=0", {})
        .then(res => {
          console.log("查询成功", res);
          let serveData = res.data.data;
          for (let i = 0; i < serveData.length; i++) {
            if (serveData[i].lastreplydata == "") {
              serveData[i].lastreplydata = [];
            } else {
              serveData[i].lastreplydata = JSON.parse(
                serveData[i].lastreplydata
              );
            }
          }
          this.studentInfo = item.info;
          this.popupZuoyePL = item.state;
          this.commentQueryInfo = serveData;
        })
        .catch(() => {
          console.log("查询失败");
        });
    },
    onScoreClick(ritem) {
      this.popupZuoyePF = ritem.state;
      this.studentName = ritem.info.username;
    },
    seleMarkFn(val) {
      this.mark = val;
    },
    submiMark() {
      alert(this.mark);
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
      Indicator.open("加载中");
      this.$http
        .post(url)
        .then(res => {
          Indicator.close();
          this.$refs.loadmore.onTopLoaded();
          if (res.data.code == 0) {
            //! ok
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
      Indicator.open("提交中");
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
      console.log("zuoyeitemzuoyeitem", this.zuoyeitem);
      this.popuPzouyeInfo = true;
    },
    syudentsMark() {
      this.popuPzouyeAllMark = true;
    },
    selectPF(active){
      this.zashowbtnactive=active;
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
    studentsMark
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
      height: 5rem;
      input {
        width: 20%;
        border: 1px solid #0089ff;
        border-radius: 5px;
        margin-right: 1.25rem;
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
.noheaderscroll .mint-cell:last-child{
  background: none;
}
.noheaderscroll .mint-cell:last-child{
  background: none;
}
</style>