<template>
  <div class="biggp-group-wrap" ref="doch" v-if="isLoad">
    <div class="fixed-header">
      <HeaderNav :navInfo="navInfo" />
    </div>
    <div class="main">
      <div class="member-wrap" v-if="isOpenSign">
        <div class="MemberList">
          <MemberList :members="signMemberList" />
          <p class="outer" v-if="[].length">旁听学生 6</p>
          <MemberList :members="[]" />
        </div>
      </div>
    </div>
    <div class="qrcode-info-wrap" v-if="isOpenSign && base64">
      <div class="code-wrap">
        <img class="qrcode-img" :src="base64" alt />
        <!-- <canvas id="canvas"></canvas> -->
        <!-- <p class="join clearfix">
          <mt-switch v-model="isJoin"></mt-switch>
          <span>允许旁听学生扫码加入</span>
        </p>-->
        <p class="tips">请使用微信扫码签到</p>
      </div>
    </div>
    <div class="scroll-wrap" v-if="isShow">
      <i class="iconfont fontmaintitle iconicon-" :class="!toT?'opacity':''" @click="onScrollFn(0)"></i>
      <i
        class="iconfont fontmaintitle iconicon--copy"
        :class="!toB?'opacity':''"
        @click="onScrollFn(1)"
      ></i>
    </div>
    <p class="open-sign-wrap" v-if="!isOpenSign">
      <a class="open-sign-btn" @click="openSign">
        <span class="text position-c colorf">开启签到</span>
      </a>
    </p>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox, Switch } from "mint-ui";
import { parseURL } from "@/util";
import HeaderNav from "./headerNav";
import MemberList from "./memberList";
import Qrcode from "qrcode";
export default {
  props: {},
  data() {
    return {
      navInfo: {
        letTitle: "学生名单",
        bankeName: "",
        signTotal: 0,
        total: 0
      },
      tempList: [],
      signMemberList: [],
      isJoin: true,

      deviseH: 0,
      DOCH: 0,
      currentY: 0,
      isScroll: false,
      toB: true,
      toT: false,
      isShow: false,

      isOpenSign: false,
      bankeid: "",
      signdata: {},
      base64: "",
      timer: null,
      isLoad: false
    };
  },
  computed: {},
  created() {
    //http://192.168.0.237:8080/daping.html?bankeid=1040
    const UrlParams = parseURL(window.location.href);
    let id = UrlParams.bankeid;
    if (id.includes("#")) {
      id = id.split("#/")[0];
    }
    this.bankeid = id;
    this.signquery();
  },
  mounted() {
    this.deviseH = window.innerHeight || document.documentElement.clientHeight;
    this.deviseH = this.deviseH - 370;
  },
  watch: {},
  methods: {
    //查询是否开启签到
    signquery() {
      Indicator.open("加载中");
      this.$http
        .post("/api/sign/signqueryself", { bankeid: this.bankeid })
        .then(res => {
          if (res.data.code == 0) {
            console.log("resresres", res);
            if (res.data.data && res.data.data.signdata) {
              this.signdata = res.data.data.signdata;
              this.navInfo.bankeName = this.signdata.bankename;
              this.Signquerymember(this.signdata.id);
              // let timer = setInterval(() => {
              //   this.Signquerymember(this.signdata.id);
              // }, 1000);
              // this.timer = timer;
              this.getSignCode();
            } else {
            }
          } else {
            Toast("未开启签到");
            Indicator.close();
            this.isLoad = true;
          }
        })
        .catch(() => {
          this.isLoad = true;
          Indicator.close();
        });
    },
    //学生签到状态
    Signquerymember(id) {
      this.$http
        .post("/api/sign/signquerymember", {
          id: id
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data && res.data.data.signmembers.length) {
              this.init();
              let isSign = [];
              let noSign = [];
              let Data = res.data.data;
              for (let item of Data.signmembers) {
                for (let v of Data.users) {
                  if (item.userid == v.id) {
                    item.name = v.name;
                    item.avatar = v.avatar;
                    item.isShowPopver = false;
                  }
                }
                this.navInfo.total++;
                if (item.state) {
                  this.navInfo.signTotal++;
                  isSign.push(item);
                } else {
                  noSign.push(item);
                }
              }
              this.tempList = [...isSign, ...noSign];
              this.signMemberList = [...isSign, ...noSign];
              console.log("学生打卡记录", this.signMemberList);
              this.$nextTick(() => {
                this.DOCH = this.$refs.doch.offsetHeight;
                if (this.DOCH - this.deviseH >= 370) {
                  this.isShow = true;
                }
              });
            }
            this.isOpenSign = true;
          } else {
          }
          Indicator.close();
          this.isLoad = true;
        })
        .catch(() => {
          Indicator.close();
          this.isLoad = true;
        });
    },
    getSignCode() {
      //! cjy: 由客户端生成scene场景， 方便后续维护
      let scene = "sign;id=" + this.signdata.id;
      this.$http
        .post(
          //"/api/weixin/qrcodesign",
          "/api/weixin/appqrcode",
          {
            //bankeid: this.bankeid
            scene: scene
          }
        )
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data) {
              this.base64 = "data:image/png;base64," + res.data.data;
            }
          }
        })
        .catch(() => {});
    },

    useqrcode() {
      let canvas = document.getElementById("canvas");
      Qrcode.toDataURL(
        canvas,
        "https://www2.exsoft.com.cn/dapingscan/getsign/666/1000",
        {
          width: 479,
          height: 479,
          margin: 2
        },
        function(error, url) {
          //如果提供了canvasElement，则在此绘制二维码
          if (error) console.error(error);
          // console.log("Qrcode success canvas2!", url);
        }
      );
    },
    openSign() {
      Indicator.open("加载中...");
      this.$http
        .post("/api/sign/signadd", {
          bankeid: this.bankeid,
          info: ""
        })
        .then(res => {
          if (res.data.code == 0) {
            console.log("教师打卡上课,", res);
            let signData = res.data.data.sign;
            this.Signquerymember(signData.id);
          } else {
            Toast("签到失败");
          }
          Indicator.close();
        })
        .catch(() => {
          Toast("出错了...");
          Indicator.close();
        });
    },
    scrollAnimation(currentY, targetY) {
      // 获取当前位置方法
      // const currentY = document.documentElement.scrollTop || document.body.scrollTop
      // 计算需要移动的距离
      let needScrollTop = targetY - currentY;
      let _currentY = currentY;
      console.log(needScrollTop);
      setTimeout(() => {
        // 一次调用滑动帧数，每次调用会不一样
        const dist = Math.ceil(needScrollTop / 20);
        _currentY += dist;
        window.scrollTo(_currentY, currentY);
        // 如果移动幅度小于二十个像素，直接移动，否则递归调用，实现动画效果
        if (needScrollTop > 20 || needScrollTop < -20) {
          this.scrollAnimation(_currentY, targetY);
        } else {
          window.scrollTo(_currentY, targetY);
          this.isScroll = false;
          let deviseH =
            window.innerHeight || document.documentElement.clientHeight;
          let currentY =
            document.documentElement.scrollTop || document.body.scrollTop;
          // alert(currentY);
          // alert(currentY + deviseH);
          // alert(this.DOCH);
          if (!currentY) {
            this.toT = false;
            this.toB = true;
          } else {
            this.toT = true;
            if (currentY + deviseH >= this.DOCH) {
              this.toB = false;
            } else {
              this.toB = true;
            }
          }
        }
      }, 1);
    },
    onScrollFn(type) {
      if (this.isScroll) return;
      this.isScroll = true;
      let currentY =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (type) {
        this.scrollAnimation(currentY, this.deviseH + currentY);
      } else {
        this.scrollAnimation(currentY, currentY - this.deviseH);
      }
    },
    init() {
      this.navInfo.total = 0;

      this.navInfo.signTotal = 0;
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  components: {
    HeaderNav,
    MemberList,
    Qrcode
  }
};
</script>

<style lang="less">
.biggp-group-wrap {
  padding: 0 5vw;
  margin-bottom: 60px;
  .main {
    .member-wrap {
      display: flex;
      justify-content: space-between;
      margin-top: 127px;
      .MemberList {
        width: 75%;
        min-width: 75%;
        max-width: 75%;
        padding-right: 20px;
        border-right: 1px dashed rgba(112, 112, 112, 1);
        .outer {
          margin: 25px 0;
          border-bottom: 1px dashed rgba(112, 112, 112, 1);
          font-size: 24px;
          padding-bottom: 10px;
          color: #7a7a7a;
          margin-right: 69px;
        }
      }
    }
  }
  .qrcode-info-wrap {
    position: fixed;
    right: 100px;
    top: 50%;
    display: flex;
    justify-content: flex-end;
    transform: translate(0, -50%);
    z-index: 12;
    .code-wrap {
      .qrcode-img {
        width: 15vw;
      }
      #canvas {
      }
      p {
        font-size: 24px;
      }
      .join {
        display: flex;
        align-items: center;
        padding: 0 25px;
        span {
          margin-left: 10px;
        }
      }
      .tips {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 66px;
        color: #000;
        font-weight: bold;
        background: rgba(236, 236, 236, 1);
        margin-top: 30px;
        padding: 0 30px;
      }
    }
  }
  .fixed-header {
    position: fixed;
    left: 50%;
    top: 0;
    width: 90vw;
    margin: 0 auto;
    z-index: 9;
    background: #fff;
    transform: translate(-50%, 0);
  }
  .scroll-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 70%;
    z-index: 11;
    background: #fff;
    text-align: center;
    .iconfont {
      font-size: 60px;
      margin: 0 15px;
      &.opacity {
        opacity: 0.3;
      }
    }
  }
  .open-sign-wrap {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%;-50%);
    .open-sign-btn {
      position: relative;
      display: block;
      width: 247px;
      height: 247px;
      background: linear-gradient(
        180deg,
        rgba(153, 205, 250, 1) 0%,
        rgba(0, 130, 241, 1) 100%
      );
      box-shadow: 0px 6px 6px rgba(0, 137, 255, 0.36);
      border-radius: 50%;
      opacity: 1;
      .text {
        font-size: 30px;
      }
    }
  }
}
</style>
