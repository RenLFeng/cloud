<template>
  <div class="pingceing-warp">
    <mt-header v-if="hasnavbar" :title="pagetitle">
      <mt-button icon="back" slot="left" @click="onBack">{{$t('common.Back')}}</mt-button>
    </mt-header>

    <div class="main">
      <mt-loadmore :top-method="loadTop" ref="loadmore" :auto-fill="autofill">
        <div class="no-pingce" v-if="!isPingce">
          <div class="tc no-class empty">
            <i class="iconfont icontongji fontmaintitle"></i>
            <p>
              请下拉本页面
              <span class="colord" @click="Refresh">刷新</span> 题目
            </p>
          </div>
          <!-- <mt-button type="primary" @click="Refresh">刷新</mt-button> -->
        </div>
      </mt-loadmore>
      <div class="pingce-ing" v-if="isPingce">
        <div class="subject" v-if="pingceData.ptype!='10'">
          <img
            :src="pingceimg"
            alt
            :onerror="defaultimg"
            @click="viewimg"
            class="position-c object-fit-img"
          />
        </div>
        <div class="footer">
          <p class="tit border-b" v-if="pingceData.ptype!='10'">请点击选项作答</p>
          <Duoxuan
            @submitFn="onSubmit"
            :optdesc="pingceData.optdesc.opts"
            :type="pingceData.ptype"
            :submited="submited"
            v-if="pingceData.ptype=='2' || pingceData.ptype=='3'"
          />
          <Judge
            @submitFn="onSubmit"
            :type="pingceData.ptype"
            :submited="submited"
            v-if="pingceData.ptype=='1' || pingceData.ptype=='5' || pingceData.ptype=='6'"
          />
          <ZhuGuan
            v-if="pingceData.ptype=='4'"
            :submited="submited"
            :pingceData="pingceData"
            @submitFn="onSubmit"
            ref="zhuguan"
          />
          <Vote
            v-if="pingceData.ptype=='10'"
            :submited="submited"
            :pingceData="pingceData"
            @submitFn="onSubmit"
            @pvoteSelect="onPvoteSelect"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Duoxuan from "./duoxuan";
import Judge from "./judge";
import ZhuGuan from "./zhuguan";
import Vote from "./vote/vote";
import {  Indicator, Toast, MessageBox } from "mint-ui";
import { pingceType, parseURL } from "@/util";
import nativecode from "@/nativecode";
export default {
  name: "PingCeing",
  components: {
    Duoxuan,
    Judge,
    ZhuGuan,
    Vote,
    MessageBox
  },
  props: {
    urlbankeid: {
      default() {
        return 0;
      }
    },
    urlhack: {
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      isPingce: false,
      bankeid: 0,
      pingceData: {
        // ptype: 4,
        // files:
        //   "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        optdesc: {}

        // timelimit: 600,
        // createtime: "2019-12-17 10:48:45"
      },

      //! 是否为参数导入； 参数导入的以参数为准，不再http拉取
      isArgLoad: false,
      submited: false, //! 是否已提交

      tempAnswer: [],

      pingceType,
      autofill: true
    };
  },
  created() {
    const UrlParams = parseURL(window.location.href);
    let params = this.$route.params;
    console.log(params);
    let doquery = true;
    if (UrlParams.id) {
      this.bankeid = UrlParams.id;
    } else if (UrlParams.args) {
      let szarg = decodeURIComponent(UrlParams.args);
      try {
        let objarg = JSON.parse(szarg);
        // console.log()
        this.bankeid = objarg.bankeid;
        doquery = false;
        this.isArgLoad = true;

        this.onpingcedata(objarg.data);
      } catch (e) {
        Toast("解析错误");
      }
    } else {
      this.bankeid = params.bankeid;
      if (params.dataobj) {
        this.isArgLoad = true;
        doquery = false;
        this.onpingcedata(params.dataobj);
      }
    }
    if (this.urlbankeid) {
      this.bankeid = this.urlbankeid;
    }

    //! cjy: 通知已进入评测页面
    nativecode.ncall("jsEnterPingce", {
      bankeid: this.bankeid
    });

    if (doquery) {
      this.querycur();
    }
  },
  mounted() {},
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      console.log("pingceing , route changed");
    },
    webcmd(lnew, lold) {
      if (lnew.cmd == "offline") {
        //! 离线
        if (this.isArgLoad) {
          this.Backs();
        }
      } else if (lnew.cmd == "pingcestop") {
        console.log(lnew);
        if (lnew.bankeid == this.bankeid) {
          //! 评测被结束； tudo ： 自动提交？
          this.Backs();
        }
      }
    }
  },
  computed: {
    webcmd() {
      return this.$store.state.webcmd;
    },
    pagetitle() {
      return this.isPingce ? pingceType(this.pingceData.ptype) : "评测";
    },
    pingceimg() {
      if (this.pingceData.editimgurl) {
        return this.pingceData.editimgurl;
      }
      return this.pingceData.filessnap;
    },
    hasnavbar() {
      return true;
    },
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += "/assets/100x100.png";
      srcstr += '"';
      return srcstr;
    }
  },
  methods: {
    loadTop() {
      this.Refresh();
    },
    viewimg() {
      if (this.pingceData.ptype == 4) {
        // Toast('主观题， 请调用题目编辑');
        this.$refs.zhuguan.draw();
        return;
      }
      nativecode.previewImage(this, this.pingceData.files);
    },
    onpingcedata(rdata) {
      let rd = rdata;
      rd.filessnap = rd.files + "_snap.jpg";
      rd.editimgurl = ""; //! 占位， 主观题使用
      this.pingceData = rd;
      if (this.pingceData) {
        this.isPingce = true;
      }
      if (
        this.pingceData.optdesc &&
        typeof this.pingceData.optdesc == "string"
      ) {
        this.pingceData.optdesc = JSON.parse(this.pingceData.optdesc);
      }
      if (this.pingceData.info && typeof this.pingceData.info == "string") {
        this.pingceData.info = JSON.parse(this.pingceData.info);
        for (let i = 0; i < this.pingceData.info.opts.length; i++) {
          this.pingceData.info.opts[i] = JSON.parse(
            this.pingceData.info.opts[i]
          );
        }
      }
      console.log("this.pingceData", this.pingceData);

      if (this.isArgLoad) {
        // document.title = this.pagetitle;
      }
    },
    querycur() {
      this.$http
        .post("api/pingce/querycur", {
          bankeid: this.bankeid
        })
        .then(res => {
          if (res.data.code == "0") {
            console.log("res", res.data.data);
            this.onpingcedata(res.data.data);
          } else {
            //！ 测试数据
            // let rdata = {
            //   answerdesc: "",
            //   classid: 1001,
            //   createtime: "2020-01-07 16:59:28",
            //   editimgurl: "",
            //   files: null,
            //   filessnap: "null_snap.jpg",
            //   id: 1034,
            //   info: {
            //     opts: [
            //       {
            //         file:
            //           "/downloads/pingce/20200107/477a000a99fb4c4104540194521eb575.jpg",
            //         name: "执你之手"
            //       },
            //       {
            //         file:
            //           "/downloads/pingce/20200107/eefd6ce94ae309cbbb8d42dd273d5601.jpg",
            //         name: "student3"
            //       }
            //     ]
            //   },
            //   joinnum: 0,
            //   optdesc: "",
            //   ptype: 10,
            //   score: 10,
            //   timelimit: 0,
            //   totalnum: 0,
            //   userid: 1001
            // };
            // this.onpingcedata(rdata);

            //！ cjy: 测试主观题
            // let rdata = {
            //     "answerdesc" : "",
            //     "classid" : 1000,
            //     "createtime" : "2020-01-16 09:23:51",
            //     "files" :  "/downloads/pingce/20200107/477a000a99fb4c4104540194521eb575.jpg",
            //     "id" : 1143,
            //     "info" : null,
            //     "joinnum" : 0,
            //     "optdesc" : "{\n  \"opts\" : []\n}",
            //     "ptype" : 3,
            //     "score" : 10,
            //     "timelimit" : 0,
            //     "totalnum" : 5,
            //     "userid" : 1001
            // };
            // this.onpingcedata(rdata);

            Toast("当前没有评测");
          }
          this.$refs.loadmore.onTopLoaded();
        })
        .catch(err => {
          console.log(err);
          Toast("异常");
        });
    },
    //提交答案
    onSubmit(Answer) {
      if (
        this.pingceData.ptype == "1" ||
        this.pingceData.ptype == "2" ||
        this.pingceData.ptype == "3" ||
        this.pingceData.ptype == "10"
      ) {
        this.tempAnswer = Answer.sort();
      }
      let answers = {
        file: this.pingceData.ptype == "4" ? Answer : "",
        opts: this.tempAnswer || [],
        textarea: this.pingceData.ptype == "5" ? Answer : ""
      };
      let submitobj = {
        bankeid: this.bankeid,
        submitdata: {
          pingceid: this.pingceData.id,
          answerdesc: JSON.stringify(answers)
        }
      };
      //   this.tempAnswer = [];
      console.log("submitobj", submitobj);
      this.$http
        .post("api/pingce/submit", submitobj)
        .then(res => {
          if (res.data.code == "0") {
            console.log("res", res);
            Toast("提交成功");
            this.tempAnswer = [];
            //this.isPingce = false;
            //! cjy: 提交答案后， 仍停留在原界面
            this.submited = true;
          } else {
            this.tempAnswer = [];
            Toast("提交失败:" + res.data.msg);
          }
        })
        .catch(err => {
          this.tempAnswer = [];
          Toast("服务异常");
        });
    },
    onPvoteSelect(v) {
      // this.pingceData.info.opts.push(v);
    },
    Refresh() {
      this.querycur();
    },
    Backs() {
      this.$back();
    },
    onBack() {
      if (this.isPingce) {
        if (!this.submited) {
          MessageBox.confirm("你未提交,确定要离开吗？")
            .then(action => {
              this.$back();
            })
            .catch(() => {});
          return;
        }
      }
      this.$back();
    }
  }
};
</script>

<style lang='less'>
.pingceing-warp {
  background: #fff;
  .main {
    .no-pingce {
      height: 90vh;
      min-height: 90vh;
    }
    .pingce-ing {
      .subject {
        position: relative;
        width: 100%;
        height: 35vh;
        padding: 60px 0;
        &::before {
        }
        img {
          display: block;
          width: 80%;
          max-width: 100%;
          height: 100%;
        }
      }
      .footer {
        // height: 65vh;
        position: relative;
        .tit {
          padding: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
