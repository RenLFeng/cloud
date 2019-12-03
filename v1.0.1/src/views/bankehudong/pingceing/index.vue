<template>
  <div class="pingceing-warp">
    <mt-header :title="isPingce?pingceType(pingceData.ptype):'评测'">
      <mt-button icon="back" slot="left" @click="Backs">{{$t('common.Back')}}</mt-button>
    </mt-header>
    <div class="main">
      <div class="no-pingce" v-if="!isPingce">
        <mt-button type="primary" @click="Refresh">刷新</mt-button>
      </div>
      <div class="pingce-ing" v-if="isPingce">
        <div class="subject">
          <img :src="pingceData.files" alt :onerror="defaultimg" />
        </div>
        <div class="footer">
          <p class="tit border-b">请点击选项作答</p>
          <Duoxuan
            @submitFn="onSubmit"
            :optdesc="pingceData.optdesc.opts"
            :type="pingceData.ptype"
            v-if="pingceData.ptype=='2' || pingceData.ptype=='3'"
          />
          <Judge
            @submitFn="onSubmit"
            :type="pingceData.ptype"
            v-if="pingceData.ptype=='1' || pingceData.ptype=='5' || pingceData.ptype=='6'"
          />
          <ZhuGuan v-if="pingceData.ptype=='4'" :pingceData="pingceData" @submitFn="onSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Duoxuan from "./duoxuan";
import Judge from "./judge";
import ZhuGuan from "./zhuguan";
import { Button, Indicator, Toast, Cell, MessageBox } from "mint-ui";
import { pingceType, parseURL } from "@/util";
export default {
  name: "PingCeing",
  components: {
    Duoxuan,
    Judge,
    ZhuGuan
  },
  data() {
    return {
      isPingce: false,
      bankeid: 0,
      pingceData: {
        // ptype: 6,
        // files:
        //   "/downloads/pingce/2019-11-30/d3e80fc710209188cf7e4306b1c81b5a.jpeg",
        optdesc: {}
      },

      tempAnswer: [],

      pingceType
    };
  },
  created() {
    const UrlParams = parseURL(window.location.href);
    let params = this.$route.params;
    if (UrlParams.id) {
      this.bankeid = UrlParams.id;
    } else {
      this.bankeid = params.bankeid;
    }
    this.querycur();
  },
  mounted() {},
  computed: {
    defaultimg() {
      var srcstr = 'this.src="';
      srcstr += require("@/assets/100x100.png");
      srcstr += '"';
      return srcstr;
    }
  },
  methods: {
    querycur() {
      this.$http
        .post("api/pingce/querycur", {
          bankeid: this.bankeid
        })
        .then(res => {
          if (res.data.code == "0") {
            this.pingceData = res.data.data;
            if (this.pingceData) {
              this.isPingce = true;
            }
            console.log("res", res);
            this.pingceData.optdesc = JSON.parse(this.pingceData.optdesc);
            console.log("this.pingceData", this.pingceData);
          } else {
            Toast("连接错误");
          }
        })
        .catch(err => {
          Toast("异常");
        });
    },
    //提交答案
    onSubmit(Answer) {
      if (
        this.pingceData.ptype == "1" ||
        this.pingceData.ptype == "2" ||
        this.pingceData.ptype == "3"
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
            this.tempAnswer = [];
          } else {
            this.tempAnswer = [];
            Toast("");
          }
        })
        .catch(err => {
          this.tempAnswer = [];
          Toast("异常");
        });
    },
    Refresh() {
      this.querycur();
    },
    Backs() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang='less'>
.pingceing-warp {
  background: #fff;
  .main {
    .pingce-ing {
      .subject {
        background: #f0f0f0;
        padding: 60px 0;
        img {
          width: 100%;
          height: 200px;
        }
      }
      .footer {
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
